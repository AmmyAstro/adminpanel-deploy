"use client";
import sidebarConfig from "@/components/utils/sidebarConfig";
import Image from "next/image";
export default function SideBarMain({ type }) {
    const menuItems = sidebarConfig[type] || [];

    return (
        <aside className="h-screen w-20 md:w-48 bg-[#2c0a4d] flex flex-col py-6 space-y-4">
            <a className="sidebar-logo flex justify-evenly items-center px-4 py-2 bg-yellow-500 text-black rounded-xl mb-6" href="/Admindash">
                <span className="text-base font-semibold"> Dashboard</span>
                <Image src="/admin-img/dash.png" alt="dashboard image " height={20} width={20} />
            </a>
            {menuItems.map((item, index) => (
                <a
                    key={index}
                    href={item.href}
                    className="flex items-center md:justify-start justify-center gap-3 px-2 md:px-4 py-2 rounded-lg hover:bg-[#ffffff14] hover:scale-105 hover:text-white transition"
                >
                    <span className="text-xl text-yellow-400">{item.img}</span>
                    <span className="hidden md:inline text-[13px] text-white">{item.name}</span>
                </a>
            ))}
        </aside>
    );
}
