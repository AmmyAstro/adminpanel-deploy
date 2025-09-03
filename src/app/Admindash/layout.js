'use client';
import GiftSide from "@/components/DashPages/SideBar/giftSide";
import Homeside from "@/components/DashPages/SideBar/Homeside";
import ManageCMSside from "@/components/DashPages/SideBar/manageCMSside";
import RazorSidebar from "@/components/DashPages/SideBar/Razorside"; 
import Header from "@/components/Header/Header";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();


  const hideHomeside = [
    "/Admindash/razordash",
    "/Admindash/managecms",
    "/Admindash/giftpage",
  ];
  const showRazorRoutes = ["/Admindash/razordash"];
  const showCMSRoutes = ["/Admindash/managecms"];
  const showGiftRoutes = ["/Admindash/giftpage"];

 
  const showHomeside = !hideHomeside.some(route => pathname?.startsWith(route));
  const showRazorside = showRazorRoutes.some(route => pathname?.startsWith(route));
  const showManageCMSside = showCMSRoutes.some(route => pathname?.startsWith(route));
  const showGiftpage = showGiftRoutes.some(route => pathname?.startsWith(route));

  return (
    <>
      <Header />
      <div className="h-[87%] flex align-center gap-4">
        {showHomeside && <Homeside />}
        {showRazorside && <RazorSidebar />}
        {showManageCMSside && <ManageCMSside />}
        {showGiftpage && <GiftSide />}
        <main className="w-full pr-5">{children}</main>
      </div>
      <footer>My Footer</footer>
    </>
  );
}
