"use client";

import { PiListBulletsBold } from "react-icons/pi";
import { MdOutlineContactPage } from "react-icons/md";
import { AiFillPicture } from "react-icons/ai";
import { BsMenuButtonWideFill } from "react-icons/bs";

const iconMap = {
  dashboard: PiListBulletsBold,
  default: MdOutlineContactPage,
};

const sidebarConfig = {
  static: [
    {
      name: "Dashboard",
      href: "/Admindash",
      icon: "dashboard",
    },
  ],
};

export default sidebarConfig;
export { iconMap };