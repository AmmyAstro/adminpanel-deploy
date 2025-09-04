"use client";

import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import { useState } from "react";
import { MdDelete, MdCancel } from "react-icons/md";
import { TbEdit } from "react-icons/tb";


export default function PacakageMain() {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full bg-[rgba(184,174,186,0.327)] p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Manage Wallet Packages</h3>
                    <CustomButton variant={"green"}
                        onClick={() => setOpen(true)}
                        className="">
                        Add Package
                    </CustomButton>
                </div>

                {open && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl flex flex-col gap-3 shadow-lg w-full max-w-lg p-6 relative">
                            <div className="flex items-center justify-between  font-semibold border-b py-3 bg-[#7a5ba3] rounded-full text-white px-4">
                                <h6 className="text-lg font-semibold">Add New Package</h6>
                                <button onClick={() => setOpen(false)}>
                                    <MdCancel className="text-2xl text-gray-100 hover:text-red-500" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Package Name
                                    </label>
                                    <CustomInput
                                        type="text"
                                        className=""
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Package Amount
                                    </label>
                                    <CustomInput
                                        type="text"
                                        className=""
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Talk Time Value
                                    </label>
                                    <CustomInput
                                        type="text"
                                        className=""
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Taxes Apply
                                    </label>
                                    <select className="w-full border border-gray-300 rounded-full p-2 outline-none">
                                        <option hidden>Select Tax</option>
                                        <option>18.00% | GST</option>
                                        <option>1.00% | GST</option>
                                        <option>3.00% | GST</option>
                                        <option>5.00% | GST</option>
                                        <option>12.00% | GST</option>
                                        <option>28.00% | GST</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Coupon Code
                                    </label>
                                    <CustomInput
                                        type="text"
                                        className=""
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Coupon Count
                                    </label>
                                    <CustomInput
                                        type="text"
                                        className=""
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Coupon Percentage
                                    </label>
                                    <CustomInput
                                        type="text"
                                        className=""
                                    />
                                </div>

                            </div>

                            <div className="flex justify-center">
                                <CustomButton variant={"green"} className=" transition">
                                    Save
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-10">
                    <h3 className="text-lg font-semibold mb-4">Wallets Package List</h3>
                    <div className="overflow-x-auto rounded-xl shadow">
                        <table className="w-full   rounded-xl text-sm text-left">
                            <thead className="bg-[#7a5ba3] rounded-full text-white">
                                <tr>
                                    <th className="p-3 border">#</th>
                                    <th className="p-3 border">Package Name</th>
                                    <th className="p-3 border">Package Amount</th>
                                    <th className="p-3 border">Talktime Value</th>
                                    <th className="p-3 border">Status</th>
                                    <th className="p-3 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-50">
                                    <td className="p-3 border">1</td>
                                    <td className="p-3 border">PromoOffer</td>
                                    <td className="p-3 border">50</td>
                                    <td className="p-3 border">100</td>
                                    <td className="p-3 border">
                                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                            Active
                                        </span>
                                    </td>
                                    <td className="p-3 border flex gap-3">
                                        <div className="flex gap-2">
                                            <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                                                <TbEdit className="text-blue-800" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setBanners((prev) => prev.filter((b) => b.id !== banner.id))
                                                }
                                                className="p-2 bg-red-400 text-white rounded-md hover:bg-red-500"
                                            >
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
