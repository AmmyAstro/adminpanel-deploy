
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Pricing() {
    const [billing, setBilling] = useState("monthly");

    return (
        <div className="bg-[#2f125492] z-index-999999 flex flex-col items-center rounded-2xl gap-6  justify-center px-6 py-8">
            <Link href="/">
                <div className="flex items-center gap-2">
                    <Image src="/admin-img/adlogo.png" alt="logo" width={140} height={140} />

                </div>
            </Link>
            <div className="text-center max-w-2xl mb-10">
                <h1 className="text-4xl font-bold text-white">
                    Don’t sleep on this!
                </h1>
                <p className="text-gray-400 text-xl mt-2">
                    Get +40% off when you go Pro—monthly or yearly!
                </p>
            </div>

            <div className="flex items-center bg-gray-900 rounded-full p-1 mb-10">
                <button
                    onClick={() => setBilling("monthly")}
                    className={`px-4 py-2 rounded-full text-base font-medium ${billing === "monthly"
                            ? "bg-gray-600 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setBilling("annual")}
                    className={`px-4 py-2 rounded-full text-base font-medium flex items-center gap-1 ${billing === "annual"
                            ? "bg-gray-600 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    Annual <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Save 20%</span>
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
                <Link href={"#"} className="bg-red-600 rounded-2xl p-8 text-white flex flex-col justify-between shadow-lg">
                    <div>
                        <h2 className="text-2xl font-semibold">Pro</h2>
                        <p className="text-3xl font-bold mt-4">
                            ₹{billing === "monthly" ? "2,111.84" : "20,300.00"}
                            <span className="text-lg font-medium">/mon</span>
                        </p>
                        <p className="mt-4 text-sm text-white/90">
                            Pro Recharge just got sweeter—extra 40% off on all plans.
                        </p>
                    </div>
                </Link>

                <Link href={"#"} className="bg-gray-500 rounded-2xl p-8 text-white flex flex-col justify-between shadow-lg">
                    <div>
                        <h2 className="text-2xl font-semibold">Business</h2>
                        <p className="text-3xl font-bold mt-4">
                            ₹{billing === "monthly" ? "249" : "2,390"}
                            <span className="text-lg font-medium">/mon</span>
                        </p>
                        <p className="mt-4 text-sm text-gray-100">
                            Level up your Pro Recharge! Grab an extra 40% off
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
