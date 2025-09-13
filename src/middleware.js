
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("accessToken")?.value; 
  const url = req.nextUrl.pathname;

  if (!token && url.startsWith("/Admindash")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: ["/Admindash/:path*"], 
};
