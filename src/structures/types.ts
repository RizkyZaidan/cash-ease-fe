import { TOASTIFY_ERROR, TOASTIFY_INFO, TOASTIFY_SUCCESS, TOASTIFY_WARNING } from "@/constants";
import { Option } from "./interfaces";

export type ToastifyType = typeof TOASTIFY_SUCCESS | typeof TOASTIFY_ERROR | typeof TOASTIFY_INFO | typeof TOASTIFY_WARNING;

export type AutocompleteProps = {
    label?: string | null;
    placeholder: string;
    value: Option| null;
    options: Option[];
    isRequired?: boolean;
    onChange: (value: Option) => void;
    onInputChange?: (value: string) => void; // Optional callback for typed input value changes
    endAdornmentAction?: () => void; // Optional callback for typed input value changes
    endAdornment?: React.ReactNode; // Optional custom endAdornment (e.g., custom icon)
    isDropdown?: boolean; // Optional flag to enable dropdown-only behavior (no typing)
};
