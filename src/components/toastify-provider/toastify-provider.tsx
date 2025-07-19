// components/ToastifyProvider/ToastifyProvider.tsx
"use client";

import { TOASTIFY_ERROR, TOASTIFY_INFO, TOASTIFY_SUCCESS, TOASTIFY_WARNING } from "@/constants";
import { ToastifyOptions } from "@/structures/interfaces";
import { createContext, useContext, ReactNode, useCallback } from "react";
import { toast } from "react-toastify";

interface ToastifyContextType {
  showToast: (options: ToastifyOptions) => void;
}
const ToastifyContext = createContext<ToastifyContextType | undefined>(undefined);

export const ToastifyProvider = ({ children }: { children: ReactNode }) => {
  const showToast = useCallback(({ type, message, config }: ToastifyOptions) => {
    switch (type) {
      case TOASTIFY_SUCCESS:
        toast.success(message, config);
        break;
      case TOASTIFY_ERROR:
        toast.error(message, config);
        break;
      case TOASTIFY_INFO:
        toast.info(message, config);
        break;
      case TOASTIFY_WARNING:
        toast.warning(message, config);
        break;
      default:
        toast(message, config);
        break;
    }
  }, []);

  return (
    <ToastifyContext.Provider value={{ showToast }}>
      {children}
    </ToastifyContext.Provider>
  );
};

export const useToastify = () => {
  const context = useContext(ToastifyContext);
  if (context === undefined) {
    throw new Error("useToastify must be used within a ToastifyProvider");
  }
  return context;
};
