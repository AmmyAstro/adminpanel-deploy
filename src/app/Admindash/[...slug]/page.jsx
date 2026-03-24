"use client";

import { useParams } from "next/navigation";

import Razordash from "@/components/DashPages/Razor/Razordash";
import ManageCMS from "@/components/DashPages/SideBar/HomesidePage/manageCMS";
import BannerManager from "@/components/DashPages/SideBar/HomesidePage/bannermanager";
import Giftpage from "@/components/DashPages/SideBar/HomesidePage/giftPage";
import AddTestimonial from "@/components/DashPages/SideBar/HomesidePage/Testimonial/addTestimonial";
import CouponMain from "@/components/DashPages/SideBar/HomesidePage/couponMain";
// import PacakageMain from "@/components/DashPages/SideBar/HomesidePage/pacakageMain";
import BlogMain from "@/components/DashPages/SideBar/HomesidePage/blogMain";

import Staffmain from "@/components/DashPages/PrivilegeManager/Staffmain";

import AstrologerMain from "@/components/DashPages/Astrologer/Astrologermain";
import AddAstro from "@/components/DashPages/Astrologer/AddAstro";
import AstroList from "@/components/DashPages/Astrologer/astroList";
import AstroProfile from "@/app/astroprofile/[id]/page";

import TestimonialList from "@/components/DashPages/SideBar/HomesidePage/Testimonial/testimonialList";
import EditTestimonial from "../editTestimonial/[id]/page";

import CustomerMain from "@/components/DashPages/Customer/CustomerMain";
import CustomerList from "@/components/DashPages/Customer/customerList";
import CuustomerProfile from "@/app/customerprofile/[id]/page";

export default function AdminPanel() {
  const params = useParams();
  const path = (params.slug || []).map((p) => p.toLowerCase());

  if (!path || path.length === 0) {
    return <div>Invalid URL structure</div>;
  }

  /* ---------------------------
      LEVEL 1 ROUTES
  --------------------------- */

  const firstLevel = {
    razordash: <Razordash />,
    managecms: <ManageCMS />,
    giftpage: <Giftpage />,
    couponmain: <CouponMain />,
    blogmain: <BlogMain />,
    astromain: <AstrologerMain />,
    testimonialmain: <TestimonialList />,
    custommain: <CustomerMain />,
  };

  /* ---------------------------
      LEVEL 2 ROUTES
  --------------------------- */

  const secondLevel = {
    managecms: {
      banner: <BannerManager />,
    },



    astromain: {
      addastro: <AddAstro />,
      astrolist: <AstroList />,
    },

    testimonialmain: {
      addtesti: <AddTestimonial />,
      edittestimonial: <EditTestimonial />,
    },

    custommain: {
      customerlist: <CustomerList />,
    },
  };

  /* ---------------------------
      LEVEL 3 ROUTES
  --------------------------- */

  const thirdLevel = {
    astroprofile: <AstroProfile />,
    customerprofile: <CuustomerProfile />,
  };

  let Componentrender = null;

  /* ---------- LEVEL 1 ---------- */

  if (path.length === 1) {
    Componentrender = firstLevel[path[0]];
  }

  /* ---------- LEVEL 2 ---------- */

  else if (path.length === 2) {
    Componentrender = secondLevel[path[0]]?.[path[1]];
  }

  /* ---------- LEVEL 3 ---------- */

  else if (path.length === 3) {
    if (path[0] === "astromain" && path[1] === "astrolist") {
      Componentrender = thirdLevel[path[2]];
    }

    if (path[0] === "custommain" && path[1] === "customerlist") {
      Componentrender = thirdLevel[path[2]];
    }
  }

  /* ---------- LEVEL 4 (dynamic id) ---------- */

  else if (path.length === 4) {
    if (
      path[0] === "astromain" &&
      path[1] === "astrolist" &&
      path[2] === "astroprofile"
    ) {
      Componentrender = <AstroProfile id={path[3]} />;
    }

    if (
      path[0] === "custommain" &&
      path[1] === "customerlist" &&
      path[2] === "customerprofile"
    ) {
      Componentrender = <CuustomerProfile id={path[3]} />;
    }
  }

  return (
    <>
      {Componentrender ? (
        Componentrender
      ) : (
        <div className="text-center text-purple-600 font-semibold py-10">
          Page not found: <code>{path.join(" / ")}</code>
        </div>
      )}
    </>
  );
}