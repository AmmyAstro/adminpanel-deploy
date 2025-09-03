"use client";

import { PiListBulletsBold } from "react-icons/pi";
import { MdOutlineContactPage } from "react-icons/md";
export default function GiftSide() {
  const menuItems = [
    { name: "Gift List", href: "/admindash/pages", img: <PiListBulletsBold /> },
    { name: "Add Gift", href: "/admindash/create", img: <MdOutlineContactPage /> },
   
  ];

  return (
    <aside className="h-screen w-20 md:w-48 bg-[#2c0a4d]   flex flex-col py-6 space-y-4">
      {menuItems.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="flex items-center md:justify-start justify-center gap-3 px-2 md:px-4 py-2 rounded-lg hover:bg-[#ffffff14] hover:scale-104 hover:text-white transition"
        >
        
          <span className="text-xl text-yellow-400">{item.img}</span>

        
          <span className="hidden md:inline text-sm text-white">{item.name}</span>
        </a>
      ))}
    </aside>
  );
}
