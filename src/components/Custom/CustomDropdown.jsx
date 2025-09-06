"use client";
import { useState } from "react";

export default function CustomDropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-purple-500"
      >
        {value || "Select option"}
        <span className="ml-2">▼</span>
      </button>

      {isOpen && (
        <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
          {options.map((opt, i) => (
            <li
              key={i}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
