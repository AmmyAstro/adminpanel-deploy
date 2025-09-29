
"use client";

import { useState } from "react";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-4xl font-bold text-white">
          Your next video should go viral.
        </h1>
        <p className="text-gray-400 text-xl mt-2">
          Get started with Viewstats today.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex items-center bg-gray-900 rounded-full p-1 mb-10">
        <button
          onClick={() => setBilling("monthly")}
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            billing === "monthly"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling("annual")}
          className={`px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
            billing === "annual"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Annual <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Save 20%</span>
        </button>
      </div>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Pro */}
        <div className="bg-red-600 rounded-2xl p-8 text-white flex flex-col justify-between shadow-lg">
          <div>
            <h2 className="text-2xl font-semibold">Pro</h2>
            <p className="text-3xl font-bold mt-4">
              ₹{billing === "monthly" ? "2,111.84" : "20,300.00"}
              <span className="text-lg font-medium">/mo</span>
            </p>
            <p className="mt-4 text-sm text-white/90">
              Our Youtube analytics suite. Perfect for creators of all sizes looking to grow their channel
            </p>
          </div>
        </div>

        {/* Business */}
        <div className="bg-gray-900 rounded-2xl p-8 text-white flex flex-col justify-between shadow-lg">
          <div>
            <h2 className="text-2xl font-semibold">Business</h2>
            <p className="text-3xl font-bold mt-4">
              ${billing === "monthly" ? "249" : "2,390"}
              <span className="text-lg font-medium">/mo</span>
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Our most powerful plan now with unlimited credits. Great for teams and agencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
