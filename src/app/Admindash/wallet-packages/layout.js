"use client";

import SideBarMain from "@/components/DashPages/SideBar/sideBarMain";


export default function HomesideLayout({ children }) {
  return (
    <div className="flex">

    
      <SideBarMain section="walletpackages" />

   
      <div className="flex-1 p-4">
        {children}
      </div>

    </div>
  );
}