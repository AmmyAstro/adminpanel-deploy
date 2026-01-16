"use client"; // <-- make this a client component

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import store from "./redux/store";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <title>Admin-Panel | Online Jyotish Consultation by Dhwani Astro</title>
        {/* <link rel="icon" href="/favicon.png" /> */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
       <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
