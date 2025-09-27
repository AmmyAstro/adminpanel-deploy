'use client';
import React, { useEffect, useState } from "react";


const variantClasses = {
  green: "bg-green-500 hover:bg-green-700 text-white  rounded-full transition",
  gray: "bg-gray-400 hover:bg-gray-700 text-white  rounded-full transition",
  black: "bg-black hover:bg-gray-700 text-white  rounded-full transition",
  red: "bg-red-400 hover:bg-red-700 text-white  rounded-full transition",
  yellow: "bg-yellow-500 hover:bg-yellow-600 rounded-full transition",
  main: "bg-[#2f1254] hover:bg-yellow-600 text-white rounded-full transition",


};
export default function CustomButton({ type = "button", onClick, className = "", children, variant, ...props }) {
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
