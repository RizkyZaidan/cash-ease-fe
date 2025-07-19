import React, { useEffect, useState } from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  IconButton,
  Typography,
  Button,
  Avatar,
  Menu,
} from "@material-tailwind/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { isEmpty } from "../utility";
import { Icon } from "@iconify/react";
import { useAuthStore } from "@/lib/auth-store";
interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

const navItems = [
  { label: "Wallet", path: "/wallet" },
  { label: "Laporan", path: "/report" },
];

function NavItem({ children, href }: NavItemProps) {
  return (
    <li>
      <a href={href}>
        <Typography variant="small" className="font-medium">
          {children}
        </Typography>
      </a>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { token, isAuthReady } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  // Handle window resize for mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpen = () => {
    setOpen((cur) => !cur);
  };

  const handleNavClick = (path: string) => {
    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}${path}`);
  };

  useEffect(() => {
    if (!isAuthReady) return;
    setIsLoggedIn(!isEmpty(token));
  }, [pathname, token, router, isAuthReady]);

  return (
    <MTNavbar className="fixed top-0 z-50 border-0 shadow-md">
      <div className="w-full flex items-center justify-between px-4 sm:px-6 md:px-8">
        {/* Logo */}
        <div className="relative h-4 max-h-4 w-28 max-w-28 sm:h-8 xl:h-12 sm:max-h-8 xl:max-h-12 sm:w-32 xl:w-48 sm:max-w-32 xl:max-w-48">
          <Image
            src={"/images/cash-ease-logo.png"}
            layout="fill"
            objectFit="contain"
            alt="Cash Ease Logo"
          />
        </div>

        {/* Navigation Items (hidden on smaller screens) */}
        <ul className="hidden items-center gap-6 lg:flex text-gray-dark">
          <nav className="flex space-x-8 lg:p-4 md:p-1 bg-white border-none rounded-none">
            {navItems
              .map((item) => (
                isLoggedIn ?
                  <div
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className="md:flex md:flex-col md:justify-center cursor-pointer"
                  >
                    <Typography
                      variant="small"
                      className={`w-full sm:text-xxxs lg:text-xs xl:text-sm !leading-6 ${item.path === pathname
                        ? "text-primary font-medium border-b-2 border-primary"
                        : "text-gray-light hover:text-primary"
                        }`}
                    >
                      {item.label}
                    </Typography>
                  </div> : ""
              ))}
          </nav>
        </ul>
      </div>
    </MTNavbar>
  );
}

export default Navbar;
