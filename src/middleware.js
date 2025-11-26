// middleware.js
import { NextResponse } from "next/server";
import Cookies from "js-cookie"; 

export function middleware(req) {
  const token = req.cookies.get("token"); 
  const url = req.nextUrl.pathname;

  if (!token && url.startsWith("/Admindash")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Admindash/:path*"],
};
