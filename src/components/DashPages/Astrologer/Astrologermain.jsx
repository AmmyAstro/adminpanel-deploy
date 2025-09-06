"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function AstrologerMain() {
    const [revenue] = useState(1800.56);

    // ✅ Stats Data
    const stats = [
        { count: 54, label: "Enquiry", href: "/internalpages/custenquiry", img: "/admin-img/arrow.png" },
        { count: 38, label: "Categories", href: "/Dshop/dcate", img: "/admin-img/category.png" },
        { count: 650, label: "Products", href: "/Dshop/dprolist", img: "/admin-img/box-open.png" },
        { count: 380, label: "Customer Reviews", href: "/Dshop/dcustrev", img: "/admin-img/feedback-review.png" },
    ];

    // ✅ Overview Cards
    const overview = [
        { title: "Total Orders", value: "121", href: "/Dshop/dorderlist", img: "/admin-img/cart.gif" },
        { title: "Total Revenue", value: "₹ 120000", href: "#", img: "/admin-img/chart.gif" },
        { title: "Astrologers", value: "570", href: "/astrolist", img: "/admin-img/wired-flat-21-avatar.gif" },
        { title: "Customers", value: "177K", href: "/Customer/custview", img: "/admin-img/wired-flat-955-demand.gif" },
    ];

    // ✅ Chart Data
    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Revenue",
                data: [20, 40, 50, 80, 60, 100],
                borderColor: "rgb(99, 102, 241)",
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <div className="w-full bg-gray-100 p-6 rounded-lg">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-[#7a5ba3] p-4 rounded-lg mb-6">
                <span className="text-xl font-semibold text-white">
                    Welcome to Astrologer Dashboard
                </span>
                <div className="text-lg font-medium text-white">
                    Total Revenue: <span className="font-bold">₹ {revenue.toFixed(2)}</span>
                </div>
            </div>

            {/* Statistical Data */}
            <div className="bg-purple-100 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold mb-4">Statistical Data</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((item, idx) => (
                        <Link key={idx} href={item.href}>
                            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow hover:scale-105 transition">
                                <Image src={item.img} alt={item.label} width={40} height={40} />
                                <div>
                                    <span className="text-xl font-bold">{item.count}</span>
                                    <p className="text-gray-600">{item.label}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {overview.map((item, idx) => (
                    <Link key={idx} href={item.href}>
                        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl hover:scale-105 transition">
                            <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                            <span className="text-2xl font-bold text-purple-700 mb-2">{item.value}</span>
                            <Image src={item.img} alt={item.title} width={70} height={70} />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Revenue Graph */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Revenue</h4>
                <div className="flex justify-between mb-4">
                    <div>
                        <h3 className="font-semibold">This Month</h3>
                        <p className="text-indigo-600 font-bold">₹ 80K</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Last Month</h3>
                        <p className="text-indigo-600 font-bold">₹ 50K</p>
                    </div>
                </div>
                {/* <Line data={chartData} options={chartOptions} /> */}
            </div>
        </div>
    );
}
