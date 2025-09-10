"use client";

import { useParams } from "next/navigation";
import Razordash from "@/components/DashPages/Razor/Razordash";
import ManageCMS from "@/components/DashPages/SideBar/HomesidePage/manageCMS";
import BannerManager from "@/components/DashPages/SideBar/HomesidePage/bannermanager";
import Giftpage from "@/components/DashPages/SideBar/HomesidePage/giftPage";
import AddTestimonial from "@/components/DashPages/SideBar/HomesidePage/addTestimonial";
import CouponMain from "@/components/DashPages/SideBar/HomesidePage/couponMain";
import PacakageMain from "@/components/DashPages/SideBar/HomesidePage/pacakageMain";
import BlogMain from "@/components/DashPages/SideBar/HomesidePage/blogMain";
import PrivilegeMain from "@/components/DashPages/PrivilegeManager/PrivilegeMain";
import Staffmain from "@/components/DashPages/PrivilegeManager/Staffmain";
import AstrologerMain from "@/components/DashPages/Astrologer/Astrologermain";
import AddAstro from "@/components/DashPages/Astrologer/AddAstro";

export default function Kundlipage() {
  const params = useParams();
  const path = (params.slug || []).map((p) => p.toLowerCase());

  if (!path || path.length === 0) {
    return <div>Invalid URL structure</div>;
  }


  const admindash = {
    razordash: <Razordash />,
    managecms: <ManageCMS />,
    giftpage: <Giftpage />,
    addtesti: <AddTestimonial />,
    couponmain: <CouponMain />,
    pacakagemain: <PacakageMain />,
    blogmain: <BlogMain />,
    privilegemain: <PrivilegeMain />,
    astromain: <AstrologerMain />,

  };


  const secondLevel = {
    banner: <BannerManager />,
    staffmain: <Staffmain />,
    addastro: <AddAstro />,
  };

  let Componentrender = null;

  if (path.length === 1) {

    Componentrender = admindash[path[0]];
  } else if (path.length === 2) {

    if (path[0] === "managecms") {
      Componentrender = secondLevel[path[1]];
    }
    if (path[0] === "privilegemain") {
      Componentrender = secondLevel[path[1]];
    }
    if (path[0] === "astromain") {
      Componentrender = secondLevel[path[1]];
    }
  }

  return (
    <>
      {Componentrender ? (
        Componentrender
      ) : (
        <div className="text-center text-red-600 font-semibold py-10">
          Page not found: <code>{path.join(" / ")}</code>
        </div>
      )}
    </>
  );
}
