"use client";

import SideBarMain from "@/components/DashPages/SideBar/sideBarMain";


export default function PrivilegeLayout({ children }) {
  return (
    <div className="flex">

    
      <SideBarMain section="privilege" />

   
      <div className="flex-1 p-4">
        {children}
      </div>

    </div>
  );
}