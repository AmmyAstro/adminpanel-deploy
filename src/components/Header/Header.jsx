// components/Header.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PiChatTeardropTextFill } from "react-icons/pi";
import { IoNotifications } from "react-icons/io5";
export default function Header() {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isNotifMenuOpen, setNotifMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-1 bg-[#2f1254] shadow-md">

      <div className="flex items-center gap-2">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src="/admin-img/adlogo.png" alt="logo" width={140} height={140} />

          </div>
        </Link>
      </div>


      <div className="flex items-center gap-2 border rounded-full px-3 py-2 w-100 shadow-lg bg-gray-100">

        <input
          type="search"
          placeholder="Enter something to search..."
          className="bg-transparent outline-none flex-1 text-sm placeholder:text-gray-400  text-gray-800"
        />
        <Image src="/admin-img/search.png" alt="search" width={18} height={18} />
      </div>


      <div className="flex items-center gap-6">

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2"
          >
            <div className="text-right text-white">
              <h4 className="text-sm font-semibold">USER</h4>
              <span className="text-xs ">Admin</span>
            </div>
            <Image
              src="/admin-img/man.png"
              alt="Admin"
              width={35}
              height={35}
              className="rounded-full"
            />
          </button>
          {isUserMenuOpen && (
            <div className="absolute text-black right-0 mt-2 w-40 bg-white border rounded-lg shadow-md">
              <Link
                href="#"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile
              </Link>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 relative rounded-full bg-[#ffffff1d] px-3 py-2 border-1 border-[#ffffff36]">
          <button onClick={() => setNotifMenuOpen(!isNotifMenuOpen)}>
            <PiChatTeardropTextFill className="text-2xl text-white" />
          </button>
          <button>
            <IoNotifications className="text-2xl text-white" />
          </button>


          {isNotifMenuOpen && (
            <div className="absolute right-0 top-8 w-48 bg-white border rounded-lg shadow-md">
              <p className="px-4 py-2 text-sm text-gray-600">No new messages</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
