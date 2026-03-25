"use client";

import { usePathname } from "next/navigation";
import SideBarMain from "@/components/DashPages/SideBar/sideBarMain";
import Homeside from "@/components/DashPages/SideBar/Homeside";

export default function ClientSideLayout({ children }) {
  const pathname = usePathname();


  const isDashboardRoot = pathname === "/Admindash";

 
  const section = pathname.split("/")[2]; 
 

  return (
    <div className="flex gap-7 h-full bg-gray-100  pt-[3.5rem] pb-[2.5rem]">

     
      {isDashboardRoot && <Homeside />}

     
      {!isDashboardRoot && section && (
        <SideBarMain section={section} />
      )}

      <main className="flex-1 h-[calc(100vh-3.5rem-2.5rem)] overflow-y-auto bg-gray-100 px-2 pe-8 py-6">
        {children}
      </main>
    </div>
  );
}