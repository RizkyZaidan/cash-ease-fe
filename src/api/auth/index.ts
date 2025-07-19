import { useAuthStore } from '@/lib/auth-store';
import axios from 'axios';

interface LoginBody {
    username: string;
    password: string;
}
const url = new URL(process.env.NEXT_PUBLIC_URL_API!).toString();
export async function authUser(body: LoginBody) {
    return axios.post(`${url}auth/login`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export async function logoutUser() {
    const token = useAuthStore.getState().token; // Retrieve token from Zustand store

    try {
        const response = await axios.post(`${url}auth/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // Clear authentication data from Zustand store after successful logout
        useAuthStore.getState().clearAuth();
        return response;
    } catch (error) {
        // Optionally clear the store on error as well, depending on your requirements
        useAuthStore.getState().clearAuth();
        throw error;
    }
}