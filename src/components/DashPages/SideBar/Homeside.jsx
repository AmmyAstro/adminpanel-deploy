"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Homeside() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/internalpages/ncoupon", title: "Coupons", src: "/admin-img/badge-percent.png" },
    { href: "/internalpages/mwalletpac", title: "Add Packages", src: "/admin-img/boxo.png" },
    { href: "/internalpages/addgift", title: "Add Gifts", src: "/admin-img/gift.png" },
    { href: "/internalpages/mcms", title: "Manage CMS", src: "/admin-img/lead.png" },
    { href: "/internalpages/testi", title: "Testimonials", src: "/admin-img/testimonials.png" },
    { href: "/internalpages/blogs", title: "Meditation", src: "/admin-img/blog.png" },
  ];

  return (
    <aside
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={` bg-[#2c0a4d] text-yellow-400 flex flex-col py-6 rounded-r-xl transition-all duration-300 
        ${isOpen ? "w-20" : "w-20"} 
      `}
    >
      <div className="sidebar-floating flex flex-col items-center space-y-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            title={item.title}
            className="floating-item flex items-center w-full px-4 py-2 space-x-3 rounded-lg  hover:bg-[#ffffff1a] hover:text-white transition"
          >
            <Image
              src={item.src}
              alt={item.title}
              width={28}
              height={28}
              className="flex-shrink-0"
            />

             <span className="floating-tooltip">{item.title}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
