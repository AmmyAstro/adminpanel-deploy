"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.replace("/login"); 
    } else {

      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
}
