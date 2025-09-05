'use client';
import React, { useEffect, useState } from "react";
// import { localStorageHelper } from "../../src/helpers/localStorageHelper";
// import toast from "react-hot-toast";

const variantClasses = {
  purple:
    "bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 hover:bg-purple-600 text-white rounded-full px-8 py-2",
  green:
    "bg-green-500 hover:bg-green-700 text-white  rounded-full",
  gray: "bg-gray-400 hover:bg-gray-700 text-white  rounded-full",
    red: "bg-red-400 hover:bg-red-700 text-white  rounded-full",
  yellow:
    " text-xs justify-end items-end self-end bg-yellow-500 text-white md:px-4 md:py-2 px-2 py-1 rounded-full",

 
};
export default function CustomButton({
  type = "button",
  onClick,
  className = "",
  children,
  variant,
  ...props
}) {
  const [isMounted, setIsMounted] = useState(false);



  const loginpopup = () => {
    toast.error("Your Are Offline Please Connect to Login");
  };

  return isMounted ? (
    <button
      type={type}
      onClick={onClick} {...props}
      className={`cursor-pointer shadow ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  ) : (
    <button
      type={type} {...props}
      onClick={onClick}
      className={`cursor-pointer shadow ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
