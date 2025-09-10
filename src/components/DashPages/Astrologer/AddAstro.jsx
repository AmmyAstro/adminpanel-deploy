"use client";
import { useState } from "react";
import Image from "next/image";
import CustomDropdown from "@/components/Custom/CustomDropdown";
import CustomInput from "@/components/Custom/CustomInput";
import CSC from "@/components/Custom/CSC";

export default function AddAstro() {
    const [formData, setFormData] = useState({
        astroname: "",
        email: "",
        phone: "",
        role: "",
        experience: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        // yaha API call karega (axios/fetch)
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="bg-white shadow-md rounded-xl p-6 mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-purple-900">
                    Add New Astrologer
                </h2>
                <Image
                    src="/admin-img/wired-flat-21-avatar.gif"
                    alt="astrologer"
                    width={50}
                    height={50}
                    className="rounded-full"
                />
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-2xl p-8 space-y-6" >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Astrologer Full Name
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-xl px-2 p-1">
                            <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                            <CustomInput
                                type="text"
                                name="astroname"
                                value={formData.astroname}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className="w-full outline-none border-0 border-none bg-transparent"
                                required />
                        </div>

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Display Name
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-xl px-2 p-1">
                            <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                            <CustomInput
                                type="text"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                placeholder="Enter Display name"
                                className="w-full outline-none border-0 border-none bg-transparent"
                                required />
                        </div>

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Display Name (Hindi)
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-xl px-2 p-1">
                            <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                            <CustomInput
                                type="text"
                                name="ahname"
                                value={formData.ahname}
                                onChange={handleChange}
                                placeholder="Enter Display name in hindi"
                                className="w-full outline-none border-0 border-none bg-transparent"
                                required />
                        </div>

                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Phone Number
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-xl px-2 p-1">
                            <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                            <CustomInput
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="w-full outline-none border-0 border-none bg-transparent"
                                required />
                        </div>

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Email Address
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-xl px-2 p-1">
                            <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                            <CustomInput
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                className="w-full outline-none border-0 border-none bg-transparent"
                                required />
                        </div>

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500    mb-1">
                            Years of Experience
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-xl px-2 p-1">
                            <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                            <CustomInput
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="e.g. 5"
                                className="w-full outline-none border-0 border-none bg-transparent"
                                required />
                        </div>

                    </div>
                </div>

                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Select Country</label>
                        <CustomDropdown
                            options={[
                                "Analyst",
                                "Developer",
                                "SEO",
                                "Designer",
                                "Writer",
                                "Creator",
                            ]}
                            value={formData.role}
                            onChange={(value) =>
                                setFormData((prev) => ({ ...prev, role: value }))} />
                    </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Select State</label>
                        <CustomDropdown
                            options={[
                                "Analyst",
                                "Developer",
                                "SEO",
                                "Designer",
                                "Writer",
                                "Creator",
                            ]}
                            value={formData.role}
                            onChange={(value) =>
                                setFormData((prev) => ({ ...prev, role: value }))} />
                    </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Select City</label>
                        <CustomDropdown
                            options={[
                                "Analyst",
                                "Developer",
                                "SEO",
                                "Designer",
                                "Writer",
                                "Creator",
                            ]}
                            value={formData.role}
                            onChange={(value) =>
                                setFormData((prev) => ({ ...prev, role: value }))} />
                    </div>
                </div> */}
                <CSC/>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition">
                        Save Astrologer
                    </button>
                    <button
                        type="reset"
                        onClick={() =>
                            setFormData({
                                name: "",
                                email: "",
                                phone: "",
                                role: "",
                                experience: "",
                            })
                        }
                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg shadow hover:bg-gray-300 transition" >
                        Reset
                    </button>
                </div>
            </form >
        </div >
    );
}
