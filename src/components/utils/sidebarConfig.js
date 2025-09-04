import { PiListBulletsBold } from "react-icons/pi";
import { MdOutlineContactPage } from "react-icons/md";
import { AiFillPicture } from "react-icons/ai";
import { BsMenuButtonWideFill } from "react-icons/bs";

const sidebarConfig = {
    //   homeSide: [
    //     { name: "Dashboard", href: "/admindash/home", img: <PiListBulletsBold /> },
    //   ],
    giftSide: [
        { name: "Gift List", href: "/admindash/pages", img: <PiListBulletsBold /> },
        { name: "Add Gift", href: "/admindash/create", img: <MdOutlineContactPage /> },
    ],
    cmsSide: [
        { name: "Page List", href: "/admindash/pages", img: <PiListBulletsBold /> },
        { name: "Create Pages", href: "/admindash/create", img: <MdOutlineContactPage /> },
        { name: "Menus", href: "/admindash/menus", img: <BsMenuButtonWideFill /> },
        { name: "Banners", href: "/Admindash/managecms/banner", img: <AiFillPicture /> },
    ],
    razorSide: [
        { name: "Razor Dashboard", href: "/admindash/razordash", img: <MdOutlineContactPage /> },
        { name: "Razor Settings", href: "/admindash/razordash", img: <MdOutlineContactPage /> },

    ],
    testimonialSide: [
        { name: "Testimonial List", href: "/admindash/pages", img: <PiListBulletsBold /> },
        { name: "Video Testimonial", href: "/admindash/create", img: <MdOutlineContactPage /> },
        { name: "Add Testimonial", href: "/admindash/create", img: <MdOutlineContactPage /> },
    ],
    couponSide: [
        { name: "Coupon List", href: "/admindash/pages", img: <PiListBulletsBold /> },
        { name: "Create Coupon", href: "/admindash/create", img: <MdOutlineContactPage /> },
        { name: "Edit Coupon", href: "/admindash/create", img: <MdOutlineContactPage /> },
    ],
    packageSide: [
        { name: "Package List", href: "/admindash/pages", img: <PiListBulletsBold /> },
        { name: "Create Package", href: "/admindash/create", img: <MdOutlineContactPage /> },
        { name: "Edit Package", href: "/admindash/create", img: <MdOutlineContactPage /> },
    ],
};

export default sidebarConfig;
