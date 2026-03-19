"use client";

import { PiListBulletsBold } from "react-icons/pi";
import { MdOutlineContactPage } from "react-icons/md";
import { AiFillPicture } from "react-icons/ai";
import { BsMenuButtonWideFill } from "react-icons/bs";

const iconMap = {
  dashboard: PiListBulletsBold,
  list: PiListBulletsBold,
  page: MdOutlineContactPage,
  banner: AiFillPicture,
  menu: BsMenuButtonWideFill,
  default: MdOutlineContactPage,
};





const sidebarConfig = {
  static: [
    {
      name: "Dashboard",
      href: "/Admindash",
      icon: "dashboard",
    },
    // {
    //   name: "Modules",
    //   href: "/Admindash/privilegemain/modules", 
    //   icon: "default",
    // },
  ],

  sections: {
    cms: [
      { name: "Page List", href: "#", icon: "list" },
      { name: "Create Pages", href: "#", icon: "page" },
      { name: "Menus", href: "#", icon: "menu" },
      {
        name: "Banners",
        href: "/Admindash/managecms/banner",
        icon: "banner",
      },
    ],

    astrologer: [
      {
        name: "Astrologer List",
        href: "/Admindash/astromain/astrolist",
        icon: "list",
      },
      {
        name: "Add Astrologer",
        href: "/Admindash/astromain/addastro",
        icon: "page",
      },
    ],

    customer: [
      {
        name: "Customer List",
        href: "/Admindash/custommain/customerlist",
        icon: "list",
      },
    ],
  },

  dynamic: true,
};

export default sidebarConfig;
export { iconMap };
