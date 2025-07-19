import { ToastifyContextValue } from "@/structures/interfaces";
import React from "react";

export const ToastifyContext = React.createContext<ToastifyContextValue | undefined>(undefined);