"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ClientSideLayout from "./CllientSideLayout";
import ProtectedRoute from "@/components/Custom/ProtectedRoute";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Optionally return a loader/skeleton here
    return null;
  }

  return (
    <>
      <ProtectedRoute>
        <Header />
        <ClientSideLayout>{children}</ClientSideLayout>
        <Footer />
        <Toaster position="top-center" reverseOrder={false} />
      </ProtectedRoute>
    </>
  );
}
