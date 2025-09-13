"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { token } = useSelector((state) => state.login);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const cookieToken = Cookies.get("accessToken");

    if (!cookieToken && !token) {
      router.push("/");  
    } else {
      setIsAuth(true);
    }
  }, [token, router]);

  if (!isAuth) {
    return null; 
  }

  return <>{children}</>;
}
