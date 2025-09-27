"use client";
import { useState } from "react";
import Image from "next/image";
import CustomDropdown from "@/components/Custom/CustomDropdown";
import CustomInput from "@/components/Custom/CustomInput";
import CSC from "@/components/Custom/CSC";
import CustomButton from "@/components/Custom/CustomButtom";
import AstroProCharge from "../../Data/AstroProCharge";

export default function AddAstro() {

    const [activeTab, setActiveTab] = useState("call");

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

    const selectFields = [
        {
            label: "Specialisation / Expertise",
            name: "expertise",
            placeholder: "Select Expertise",
            options: ["English", "Hindi", "Tarot", "Numerology"],
        },
        {
            label: "Language Known",
            name: "language",
            placeholder: "Select Language",
            options: ["English", "Hindi", "Spanish", "French"],
        },
        {
            label: "Problems Handled",
            name: "problems",
            placeholder: "Select Problems",
            options: ["Love", "Career", "Health", "Finance"],
        },
        {
            label: "Astrologer Status",
            name: "status",
            placeholder: "Select Status",
            options: ["Available", "Busy", "Offline"],
        },

    ];

    return (
        <div className="min-h-screen ">
            <div className="shadow-md rounded-xl p-3 bg-purple-200 mb-6 flex items-center justify-between">
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
                className="bg-white shadow-lg rounded-2xl p-5 space-y-6">
                <h2 className=" mb-2 text-base font-semibold text-purple-500">
                    Basic Astrologer Details :
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Astrologer Full Name
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                            <CustomInput
                                type="text"
                                name="astroname"
                                value={formData.astroname}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className="w-full outline-none border-0 border-none bg-transparent"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Display Name
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                            <CustomInput
                                type="text"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                placeholder="Enter Display name"
                                className="w-full outline-none border-0 border-none bg-transparent"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Display Name (Hindi)
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                            <CustomInput
                                type="text"
                                name="ahname"
                                value={formData.ahname}
                                onChange={handleChange}
                                placeholder="Enter Display name in hindi"
                                className="w-full outline-none border-0 border-none bg-transparent"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Phone Number
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                            <CustomInput
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="w-full outline-none border-0 border-none bg-transparent"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Email Address
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                            <CustomInput
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                className="w-full outline-none border-0 border-none bg-transparent"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500    mb-1">
                            Years of Experience
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                            <CustomInput
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="e.g. 5"
                                className="w-full outline-none border-0 border-none bg-transparent"
                                required
                            />
                        </div>
                    </div>
                    <CSC className="col-span-full" />
                    <div>
                        <label className="block text-sm font-medium text-gray-500    mb-1">
                            Password
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                            <CustomInput
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="Passsword"
                                className="w-full outline-none border-0 border-none bg-transparent"
                                required
                            />
                        </div>
                    </div>
                </div>


                <div className="bg-white shadow-lg rounded-2xl p-5 space-y-6">
                    <h2 className=" mb-2 text-base font-semibold text-purple-500">
                        About Astrologer :
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                About Me (in English)
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-2xl px-2 p-1">
                                <img src="/admin-img/userte.png" alt="user" className="input-img-side rounded-full" />
                                <textarea
                                    name="aboutMe"
                                    value={formData.aboutMe}
                                    onChange={handleChange}
                                    placeholder="Enter about me in english"
                                    className="w-full outline-none border-0  px-2 py-1 bg-transparent placeholder:text-sm placeholder:text-gray-200"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                About Me (in Hindi)
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-2xl px-2 p-1">
                                <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                                <textarea
                                    name="aboutMeHindi"
                                    value={formData.aboutMeHindi}
                                    onChange={handleChange}
                                    placeholder="Enter about me in hindi"
                                    className="w-full outline-none border-0  bg-transparent placeholder:text-sm placeholder:text-gray-200"
                                    required
                                />
                            </div>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-3">
                            {selectFields.map((field, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">
                                        {field.label}
                                    </label>
                                    <select
                                        name={field.name}
                                        className="w-full border rounded-full border-gray-400 p-2 "
                                    >
                                        <option value="" hidden className="text-gray-200">
                                            {field.placeholder}
                                        </option>
                                        {field.options.map((opt, i) => (
                                            <option key={i} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex w-full ">
                            <div className="p-4 rounded-xl flex flex-col gap-2 border border-gray-400  bg-white w-full">
                                <h2 className="font-semibold text-sm text-center ">Astrologer Charges</h2>
                                <div className="flex gap-3 justify-center">
                                    {AstroProCharge.map((tab) => (
                                        <button
                                            type="button"
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-1 text-sm font-medium rounded-full transition ${activeTab === tab.id
                                                ? "bg-purple-400 text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>


                                <div className="p-4 shadow rounded-lg bg-purple-100">
                                    {AstroProCharge.map(
                                        (tab) =>
                                            activeTab === tab.id && (
                                                <table key={tab.id} className="w-full text-sm">
                                                    <tbody className="space-y-2">
                                                        {tab.fields.map((field, idx) => (
                                                            <tr key={idx} className="mb-2">
                                                                <td className="py-2 pr-4">{field.label} :</td>
                                                                <td>
                                                                    {field.prefix}
                                                                    <input
                                                                        type="text"
                                                                        name={field.name}
                                                                        defaultValue="0"
                                                                        maxLength="3"
                                                                        max={field.max}
                                                                        className="border rounded-md px-2 py-1 w-20 ml-1 text-center"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>



                </div>

                <div className="bg-white shadow-lg rounded-2xl p-5 space-y-6">
                    <h2 className=" mb-2 text-base font-semibold text-purple-500">
                        Astrologer Bank Details :
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Account Holder Name
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                                <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                                <CustomInput
                                    type="text"
                                    name="astroname"
                                    value={formData.astroname}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    className="w-full outline-none border-0 border-none bg-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Account No :
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                                <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                                <CustomInput
                                    type="text"
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    placeholder="Enter Display name"
                                    className="w-full outline-none border-0 border-none bg-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Bank Name
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                                <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                                <CustomInput
                                    type="text"
                                    name="ahname"
                                    value={formData.ahname}
                                    onChange={handleChange}
                                    placeholder="Enter Display name in hindi"
                                    className="w-full outline-none border-0 border-none bg-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                IFSC Code
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                                <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                                <CustomInput
                                    type="text"
                                    name="ahname"
                                    value={formData.ahname}
                                    onChange={handleChange}
                                    placeholder="Enter Display name in hindi"
                                    className="w-full outline-none border-0 border-none bg-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                PAN Card Number
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                                <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                                <CustomInput
                                    type="text"
                                    name="ahname"
                                    value={formData.ahname}
                                    onChange={handleChange}
                                    placeholder="Enter Display name in hindi"
                                    className="w-full outline-none border-0 border-none bg-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Branch Name
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                                <img src="/admin-img/userte.png" alt="user" className="input-img-side" />
                                <CustomInput
                                    type="text"
                                    name="ahname"
                                    value={formData.ahname}
                                    onChange={handleChange}
                                    placeholder="Enter Display name in hindi"
                                    className="w-full outline-none border-0 border-none bg-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <div className="w-full col-span-3 p-4 bg-white rounded-xl shadow-sm border border-gray-50">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Images <sup className="text-red-500">*</sup>
                                </label>

                                <div className="mt-3 flex gap-6">

                                    <div className="flex-shrink-0 bg-[#2f1254] rounded-2xl items-center justify-center flex p-1 ">
                                        <img
                                            src="/admin-img/userte.png"
                                            alt="Preview"
                                            className=" object-contain rounded-md  input-img-side"
                                        />
                                    </div>


                                    <div className="flex flex-wrap gap-4 items-center justify-center">
                                        {[
                                            { label: "Profile Image", name: "profile" },
                                            { label: "Aadhar Image", name: "aadhar" },
                                            { label: "PanCard Image", name: "pan" },
                                            { label: "Passbook Image", name: "passbook" },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <label className="w-[10rem] text-sm font-medium text-gray-600">
                                                    {item.label} <b>:</b>
                                                </label>
                                                <input
                                                    required
                                                    type="file"
                                                    name={item.name}
                                                    accept=".pdf, .docx, .xlsx, .jpg, .jpeg, .png"
                                                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-1 file:px-3 
                                                                        file:rounded-full file:border-0 
                                                                        file:text-sm file:font-medium 
                                                                        file:bg-purple-50 file:text-purple-700 
                                                                        hover:file:bg-purple-100"
                                                />
                                            </div>
                                        ))}


                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-red-400 mt-2">
                                ***Note: Maximum upload limit <b>1 MB</b>.
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex place-content-center gap-4 pt-4">
                    <CustomButton variant={"green"}
                        type="submit"
                        className="px-5 py-2 transition">
                        Save Astrologer
                    </CustomButton>
                    <CustomButton variant={"gray"}
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
                        className=" px-6 py-2  transition" >
                        Reset
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
