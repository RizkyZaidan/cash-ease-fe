import { CustomToastConfig } from "@/structures/interfaces";
import { Icon } from "@iconify/react";

export const OPTION_MENU = "app_menu";
export const OPTION_BANK = "app_bank_option";
export const OPTION_REPORT_MENU = "app_report_menu";
export const OPTION_TRANSCTION = "app_transaction_option";

export const SET_TOASTIFY_DATA = "set_toastify_data";
export const TOASTIFY_SUCCESS = "success";
export const TOASTIFY_ERROR = "error";
export const TOASTIFY_INFO = "info";
export const TOASTIFY_WARNING = "warning";

export const toastConfig: CustomToastConfig = {
    position: "bottom-center", // Position remains the same
    hideProgressBar: true, // Keep progress bar hidden
    closeButton: (props) => {
        return (
            <Icon icon="mdi:close" className="text-gray-light absolute top-[50%] right-2 text-lg ml-4" />
        );
    },
    className: "min-w-[24rem] !w-[24rem] rounded-[15px] text-black text-sm shadow-lg p-4 m-4",
    bodyClassName: "text-xl font-normal",
    progressClassName: "bg-blue-500",
    style: {
        width: "24rem !important", // Override the CSS variable explicitly
        minWidth: "24rem !important",
    },
};


export const numberRegex = /^\d{1,3}(?:\.\d{3})*$/;