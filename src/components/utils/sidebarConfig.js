'use client';
import { PiListBulletsBold } from "react-icons/pi";
import { MdOutlineContactPage } from "react-icons/md";
import { AiFillPicture } from "react-icons/ai";
import { BsMenuButtonWideFill } from "react-icons/bs";

const sidebarConfig = {
    //   homeSide: [
    //     { name: "Dashboard", href: "/admindash/home", img: <PiListBulletsBold /> },
    //   ],
    giftSide: [
        { name: "Gift List", href: "#", img: <PiListBulletsBold /> },
        { name: "Add Gift", href: "#", img: <MdOutlineContactPage /> },
    ],
    cmsSide: [
        { name: "Page List", href: "#", img: <PiListBulletsBold /> },
        { name: "Create Pages", href: "#", img: <MdOutlineContactPage /> },
        { name: "Menus", href: "#", img: <BsMenuButtonWideFill /> },
        { name: "Banners", href: "/Admindash/managecms/banner", img: <AiFillPicture /> },
    ],
    razorSide: [
        { name: "Razor Dashboard", href: "#", img: <MdOutlineContactPage /> },
        { name: "Razor Settings", href: "#", img: <MdOutlineContactPage /> },

    ],
    testimonialSide: [
        // { name: "Testimonial List", href: "/Admindash", img: <PiListBulletsBold /> },
        { name: "Video Testimonial", href: "#", img: <MdOutlineContactPage /> },
        { name: "Add Testimonial", href: "/Admindash/testimonialmain/addtesti", img: <MdOutlineContactPage /> },
    ],
    couponSide: [
        { name: "Coupon List", href: "#", img: <PiListBulletsBold /> },
        { name: "Create Coupon", href: "#", img: <MdOutlineContactPage /> },
        { name: "Edit Coupon", href: "#", img: <MdOutlineContactPage /> },
    ],
    packageSide: [
        { name: "Package List", href: "#", img: <PiListBulletsBold /> },
        { name: "Create Package", href: "#", img: <MdOutlineContactPage /> },
        { name: "Edit Package", href: "#", img: <MdOutlineContactPage /> },
    ],
    blogSide: [
        { name: "Blog List", href: "#", img: <PiListBulletsBold /> },
        { name: "Create Blog", href: "#", img: <MdOutlineContactPage /> },
        { name: "Edit Blog", href: "#", img: <MdOutlineContactPage /> },
    ],
    previlegeSide: [
        { name: "Previlege Manager", href: "#", img: <PiListBulletsBold /> },
        { name: "Staff Manager", href: "/Admindash/privilegemain/staffmain", img: <MdOutlineContactPage /> },
    ],
    astrologerSide: [
        { name: "Astrologer List", href: "#", img: <PiListBulletsBold /> },
        { name: "New Astrologer List", href: "#", img: <MdOutlineContactPage /> },
        { name: "Add Astrologer", href: "/Admindash/astromain/addastro", img: <MdOutlineContactPage /> },
        { name: "Astrologer Profile", href: "/Admindash/astromain/astroprofile", img: <MdOutlineContactPage /> },
        { name: "Astrologer Revenue", href: "#", img: <MdOutlineContactPage /> },
        { name: "Astrologer Reviews", href: "#", img: <MdOutlineContactPage /> },
        { name: "Online History", href: "#", img: <MdOutlineContactPage /> },
        { name: "Offline History", href: "#", img: <MdOutlineContactPage /> },
        { name: "Call Logs", href: "#", img: <MdOutlineContactPage /> },
        { name: "Chat Logs", href: "#", img: <MdOutlineContactPage /> },
    ],
};

export default sidebarConfig;
