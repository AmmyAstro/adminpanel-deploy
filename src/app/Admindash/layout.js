"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ClientSideLayout from "./CllientSideLayout";

import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }) {


  return (
    <>
   
        <Header />
        <ClientSideLayout>{children}</ClientSideLayout>
        <Footer />
        <Toaster position="top-center" reverseOrder={false} />
      
    </>
  );
}
