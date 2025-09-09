"use client";
import { usePathname } from "next/navigation";
import SideBarMain from "@/components/DashPages/SideBar/sideBarMain";
import Homeside from "@/components/DashPages/SideBar/Homeside";

export default function ClientSideLayout({ children }) {
    const pathname = usePathname();
    const isDashboardRoot = pathname === "/Admindash";

    const hideHomeside = [
        "/Admindash/razordash",
        "/Admindash/managecms",
        "/Admindash/giftpage",
        "/Admindash/addtesti",
        "/Admindash/couponmain",
        "/Admindash/pacakagemain",
        "/Admindash/blogmain",
        "/Admindash/privilegemain",
        "/Admindash/astromain",
    ];
    const showRazorRoutes = ["/Admindash/razordash"];
    const showCMSRoutes = ["/Admindash/managecms"];
    const showGiftRoutes = ["/Admindash/giftpage"];
    const showTestimonialRoutes = ["/Admindash/addtesti"];
    const showCouponRoutes = ["/Admindash/couponmain"];
    const showPackageRoutes = ["/Admindash/pacakagemain"];
    const showBlogRoutes = ["/Admindash/blogmain"];
    const showPrivilegeRoutes = ["/Admindash/privilegemain"];
    const showAstrologerRoutes = ["/Admindash/astromain"];

    const showHomeside = !hideHomeside.some(route => pathname?.startsWith(route));
    const showRazorside = showRazorRoutes.some(route => pathname?.startsWith(route));
    const showManageCMSside = showCMSRoutes.some(route => pathname?.startsWith(route));
    const showGiftpage = showGiftRoutes.some(route => pathname?.startsWith(route));
    const showTestimonial = showTestimonialRoutes.some(route => pathname?.startsWith(route));
    const showCoupon = showCouponRoutes.some(route => pathname?.startsWith(route));
    const showPackage = showPackageRoutes.some(route => pathname?.startsWith(route));
    const showBlog = showBlogRoutes.some(route => pathname?.startsWith(route));
    const showPrevilege = showPrivilegeRoutes.some(route => pathname?.startsWith(route));
    const showAstrologer = showAstrologerRoutes.some(route => pathname?.startsWith(route));

    return (

        <div className=" flex pt-[3.5rem] pb-[2.5rem]">
            {showHomeside && <Homeside />}
            {showRazorside && <SideBarMain type="razorSide" />}
            {showManageCMSside && <SideBarMain type="cmsSide" />}
            {showGiftpage && <SideBarMain type="giftSide" />}
            {showTestimonial && <SideBarMain type="testimonialSide" />}
            {showCoupon && <SideBarMain type="couponSide" />}
            {showPackage && <SideBarMain type="packageSide" />}
            {showBlog && <SideBarMain type="blogSide" />}
            {showPrevilege && <SideBarMain type="previlegeSide" />}
            {showAstrologer && <SideBarMain type="astrologerSide" />}
            <main className={`${isDashboardRoot ? "ml-0" : "ml-20 md:ml-48"} flex-1 h-[calc(100vh-3.5rem-2.5rem)] mt-0 mb-0 overflow-y-auto p-5`}>{children}</main>
        </div>

    );  
}
