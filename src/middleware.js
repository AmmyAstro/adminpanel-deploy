import { NextResponse } from "next/server";

export function middleware(req) {

  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token && req.nextUrl.pathname.startsWith("/Admindash")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}