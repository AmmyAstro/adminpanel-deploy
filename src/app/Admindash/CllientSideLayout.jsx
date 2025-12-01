"use client";

import { usePathname } from "next/navigation";
import SideBarMain from "@/components/DashPages/SideBar/sideBarMain";
import Homeside from "@/components/DashPages/SideBar/Homeside";

export default function ClientSideLayout({ children }) {
  const pathname = usePathname();

  const isDashboardRoot = pathname === "/Admindash";

  const sidebarConfig = [
    { match: "/Admindash/razordash", type: "razorSide" },
    { match: "/Admindash/managecms", type: "cmsSide" },
    { match: "/Admindash/giftpage", type: "giftSide" },
    { match: "/Admindash/testimonialmain", type: "testimonialSide" },
    { match: "/Admindash/couponmain", type: "couponSide" },
    { match: "/Admindash/pacakagemain", type: "packageSide" },
    { match: "/Admindash/blogmain", type: "blogSide" },
    { match: "/Admindash/privilegemain", type: "previlegeSide" },
    { match: "/Admindash/astromain", type: "astrologerSide" },
    { match: "/Admindash/editTestimonial", type: "testimonialSide" },
    { match: "/Admindash/customer", type: "customerSide" },
  ];

  const activeSidebar = sidebarConfig.find(item =>
    pathname.startsWith(item.match)
  );

  const showHomeside = !activeSidebar;

  return (
    <div className="flex pt-[3.5rem] pb-[2.5rem]">

      {showHomeside && <Homeside />}

      {activeSidebar && <SideBarMain type={activeSidebar.type} />}

      <main
        className={`${isDashboardRoot ? "ml-0" : "ml-20 md:ml-48"
          } flex-1 h-[calc(100vh-3.5rem-2.5rem)] mt-0 mb-0 overflow-y-auto bg-gray-100 py-6 px-8`}
      >
        {children}
      </main>
    </div>
  );
}
