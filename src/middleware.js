import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  console.log("MIDDLEWARE RUNNING");
  console.log("PATH:", req.nextUrl.pathname);
  console.log("TOKEN:", token);

  if (!token && req.nextUrl.pathname.startsWith("/Admindash")) {
    console.log("Redirecting because no token");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}