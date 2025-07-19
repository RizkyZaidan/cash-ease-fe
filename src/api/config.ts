"use client"; // Ensure this is a client-side component

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { isEmpty } from "@/components/utility";
import { useAuthStore } from "@/lib/auth-store";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_URL_API}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request interceptor for auth
instance.interceptors.request.use(
  function(config) {
    if (typeof window !== 'undefined') { // Fixed typo: Check if running in browser
      const token = useAuthStore.getState().token; // Retrieve token from Zustand store
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          // Safe check for 'exp' claim
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken && decodedToken.exp && decodedToken.exp < currentTime) {
            // Clear Zustand store on token expiration
            useAuthStore.getState().clearAuth();
            useAuthStore.getState().setSessionExpired(true);
            if (typeof window !== 'undefined') {
              // Redirect to login page
              window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}`;
            }
          } else {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error decoding JWT token:", error);
        }
      }
    }
    return config;
  },
  function(error) {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor for better error handling
instance.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response) {
      console.error("API Error:", error.response.data);
      console.error("Status Code:", error.response.status);
      if (error.response.status === 401 && !isEmpty(useAuthStore.getState().token)) {
        // Clear Zustand store on 401 Unauthorized with existing token
        useAuthStore.getState().clearAuth();
        useAuthStore.getState().setSessionExpired(true); // Set flag in store
        if (typeof window !== 'undefined') {
          // Redirect to login page
          window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}`;
        }
      } else if (error.response.status === 401 && isEmpty(useAuthStore.getState().token)) {
        useAuthStore.getState().setIsUnauthorize(true); // Set flag in store
        if (typeof window !== 'undefined') {
          window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}`;
        }
      }
    } else {
      console.error("Request error:", error.message);
    }
    return Promise.reject(error);
  }
);


export default instance;
