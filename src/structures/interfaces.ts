import { ReactNode } from "react";
import { CloseButtonProps, ToastOptions, ToastPosition } from "react-toastify";
import { ToastifyType } from "./types";

export interface CompressionOptions {
    includeDataUri: boolean;
    targetSizeKB: number;
    maxWidth: number;
    maxHeight: number;
}

export interface ClientCompressionResult {
    compressedBase64: string;
    compressedBlob: Blob;
    originalSizeKB: number;
    compressedSizeKB: number;
}

export interface CustomToastConfig extends Omit<ToastOptions, 'closeButton'> {
    position: ToastPosition; // Use the ToastPosition type from react-toastify
    closeButton: (props: CloseButtonProps) => ReactNode; // Function that returns a ReactNode
    className: string; // CSS classes for the toast container
    bodyClassName: string; // CSS classes for the toast body
    progressClassName: string; // CSS classes for the progress bar
}

export interface ToastifyContextValue {
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
    autoClose: number;
    hideProgressBar: boolean;
    closeOnClick: boolean;
    pauseOnHover: boolean;
    draggable: boolean;
    theme: "light" | "dark" | "colored";
    transition: any; // Can be more specific if you know the exact type
    setToastifyData: (data: Partial<ToastifyContextValue>) => void;
    showToast: (params: { type: string; message: string; config?: any }) => void;
}

export interface ToastifyOptions {
    type: ToastifyType;
    message: string;
    config?: ToastOptions; // Optional toast options
}

export interface User {
    id?: string;
    full_name?: string;
    balance?: string;
    account_no?: string | null;
    account_type?: string | null;
}

export interface Option {
    id?: string | null;
    name?: string | null;
    label?: string | null;
    description?: string | null;
    image?: string | null;
}

export interface Balance {
    full_name?: string | null;
    date?: string | null;
    account_no?: string | null;
    account_type?: string | null;
    balance?: string | null;
}

export interface Transfer {
    nama_pengirim?: string | null;
    nama_penerima?: string | null;
    date?: string | null;
}

export interface TopUp {
    full_name?: string | null;
    date?: string | null;
    amount?: string | null;
}

export interface Pagination {
    total: number | null;
    page: number | null;
    lastPage: number | null;
}