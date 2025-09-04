



'use client';

import Header from "@/components/Header/Header";
import { usePathname } from "next/navigation";
import SideBarMain from "@/components/DashPages/SideBar/sideBarMain";
import Homeside from "@/components/DashPages/SideBar/Homeside";
import Footer from "@/components/Footer/Footer";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const hideHomeside = [
    "/Admindash/razordash",
    "/Admindash/managecms",
    "/Admindash/giftpage",
    "/Admindash/addtesti",
    "/Admindash/couponmain",
    "/Admindash/pacakagemain",
  ];
  const showRazorRoutes = ["/Admindash/razordash"];
  const showCMSRoutes = ["/Admindash/managecms"];
  const showGiftRoutes = ["/Admindash/giftpage"];
  const showTestimonialRoutes = ["/Admindash/addtesti"];
  const showCouponRoutes = ["/Admindash/couponmain"];
  const showPackageRoutes = ["/Admindash/pacakagemain"];

  const showHomeside = !hideHomeside.some(route => pathname?.startsWith(route));
  const showRazorside = showRazorRoutes.some(route => pathname?.startsWith(route));
  const showManageCMSside = showCMSRoutes.some(route => pathname?.startsWith(route));
  const showGiftpage = showGiftRoutes.some(route => pathname?.startsWith(route));
  const showTestimonial = showTestimonialRoutes.some(route => pathname?.startsWith(route));
  const showCoupon = showCouponRoutes.some(route => pathname?.startsWith(route));
  const showPackage = showPackageRoutes.some(route => pathname?.startsWith(route));

  return (
    <>
      <Header />
      <div className="h-[70%]  w-full flex align-center gap-4">
         {showHomeside && <Homeside />}
        {showRazorside && <SideBarMain type="razorSide" />}
        {showManageCMSside && <SideBarMain type="cmsSide" />}
        {showGiftpage && <SideBarMain type="giftSide" />}
        {showTestimonial && <SideBarMain type="testimonialSide" />}
        {showCoupon && <SideBarMain type="couponSide" />}
        {showPackage && <SideBarMain type="packageSide" />}
        <main className=" w-full pr-5">{children}</main>
      </div>
    <Footer/>
    </>
  );
}

