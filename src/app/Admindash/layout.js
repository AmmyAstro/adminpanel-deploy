'use client';
import Homeside from "@/components/DashPages/SideBar/Homeside";
import Razorside from "@/components/DashPages/SideBar/Razorside";
// import "./globals.css";
import Header from "@/components/Header/Header";
import { usePathname } from "next/navigation";



export default function AdminLayout({ children }) {

  const pathname = usePathname();

  const hideHomeside = [
    "/Admindash/razordash",

  ];
  const hideRazorside = [
    "/Admindash/",

  ];

  const showHomeside = !hideHomeside.some(route => pathname?.startsWith(route));
  const showRazorside = hideRazorside.some(route => pathname?.startsWith(route));
  return (

    <>
      <Header />
      <div className="flex align-center gap-4">
        {showHomeside && <Homeside />}
        {showRazorside && <Razorside />}
        <main>{children}</main>
      </div>
      <footer>My Footer</footer>

    </>
  );
}
