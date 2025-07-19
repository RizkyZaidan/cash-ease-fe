"use client";
import Image from "next/image";
import { Typography } from "@material-tailwind/react";
import { Icon } from "@iconify/react/dist/iconify.js";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="relative bg-primary px-8 pt-12 min-h-[150px] overflow-hidden">
      <Image
        src="/images/Footer.png"
        alt="footer-banner"
        fill
        objectFit="cover"
        className="-z-10-2xl"
      />
      <div className="mx-auto relative z-10 px-[85px] mt-6">
        <div className="flex flex-row sm:flex-col md:flex-row lg:gap-2 justify-between md:justify-between">
          <div className="text-left">
            <Typography className="text-white text-center font-normal opacity-75 w-full sm:text-xxxs lg:text-xs xl:text-sm">
              <a href="" target="_blank" rel="noreferrer">
                Copyright
              </a>{" "}
              &copy; by{" "}
              <a href="" target="_blank" rel="noreferrer">
                {CURRENT_YEAR}
              </a>
              {" "}CashEase | All Rights Reserved
            </Typography>
          </div>
          <div className="flex flex-row gap-4">
            <Icon icon="brandico:facebook" width="24" height="24" className="text-white" />
            <Icon icon="entypo-social:twitter" width="24" height="24" className="text-white" />
            <Icon icon="ri:instagram-fill" width="24" height="24" className="text-white" />
            <Icon icon="mdi:youtube" width="24" height="24" className="text-white" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
