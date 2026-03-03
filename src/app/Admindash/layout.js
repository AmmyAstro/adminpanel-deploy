"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ClientSideLayout from "./CllientSideLayout";

import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }) {
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
   
        <Header />
        <ClientSideLayout>{children}</ClientSideLayout>
        <Footer />
        <Toaster position="top-center" reverseOrder={false} />
      
    </>
  );
}
