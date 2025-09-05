"use client";
import sidebarConfig from "@/components/utils/sidebarConfig";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBarMain({ type }) {
  const menuItems = sidebarConfig[type] || [];
  const pathname = usePathname();

  return (
    <aside className="fixed px-3 top-[3.5rem] bottom-[2.5rem] left-0 w-20 md:w-48 bg-[#2c0a4d] flex flex-col py-6 space-y-4">
      <Link
        className={`sidebar-logo flex justify-evenly items-center px-4 py-2 rounded-xl mb-6 transition
             ${ pathname === "/Admindash"
            ? "bg-yellow-600 text-black scale-105"
            : "bg-yellow-500 text-black"
        }
        `}
        href="/Admindash"
      >
        <span className="text-base font-semibold">Dashboard</span>
        <Image
          src="/admin-img/dash.png"
          alt="dashboard image"
          height={20}
          width={20}
        />
      </Link>

      {menuItems.map((item, index) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center md:justify-start justify-center gap-3 px-2 md:px-4 py-2  transition ${
              isActive
                ? "bg-yellow-500 rounded-full text-black scale-105"
                : "hover:bg-[#ffffff14] hover:scale-105 hover:text-white"
            }`}
          >
            <span
              className={`text-xl ${
                isActive ? "text-black" : "text-yellow-400"
              }`}
            >
              {item.img}
            </span>
            <span
              className={`hidden md:inline text-[13px] ${
                isActive ? "text-black font-semibold" : "text-white"
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
