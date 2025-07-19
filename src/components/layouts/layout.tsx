// @component/layout.tsx
"use client";

import React, { ReactNode, useEffect } from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { ToastifyProvider } from "@/components/toastify-provider/toastify-provider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Headers from "./headers";
import Navbar from "./navbar";
import AnimatedLayout from "./animated-layout";
import Footer from "./footer";

export function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <Headers />
      <Navbar />
      <ThemeProvider value={{}}>
        <ToastifyProvider>
          <AnimatedLayout>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">{children}</main>
            </div>
          </AnimatedLayout>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="z-[1000]"
          />
          <Footer />
        </ToastifyProvider>
      </ThemeProvider>
    </>
  );
}

export default Layout;
