'use client';
import React from 'react';

export default function CustomInput({ label, type, error, ...props }) {
  return (
    <div className="mb-0 w-full">
      {label && (
        <label className="block text-black text-sm  mb-1">
          {label}
          {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        {...props}
        className={` text-gray-800 text-sm sm:text-sm px-2 py-1.5 border border-gray-300 placeholder:text-gray-300 bg-white rounded-full focus:outline-none focus:ring-0 ${error ? 'border-red-500' : ''}' : ''
          } ${props.className || ''}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
