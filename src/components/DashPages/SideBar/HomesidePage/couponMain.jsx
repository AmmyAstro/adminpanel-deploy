"use client";
import { useState } from "react";
import Link from "next/link";
import { MdCancel } from "react-icons/md";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";

export default function CouponMain() {
    const [isCoupOpen, setCoupOpen] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted!");
    };
    return (
        <div className=" ml-0 bg-[#928f8f34] p-6">
            {isCoupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-lg flex flex-col gap-3 shadow-lg w-[60%] p-6">
                        <div className=" flex place-items-center font-semibold border-b py-5 bg-[#7a5ba3] rounded-full text-white px-4 itms-center justify-between">
                            <h3 className="text-lg font-semibold">Add New Coupon</h3>
                            <button onClick={() => setCoupOpen(false)}>
                                <MdCancel className="text-2xl text-gray-100 hover:text-red-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Coupon Code</label>
                                    <CustomInput
                                        type="text"
                                        name="couponCode"
                                        placeholder="Coupon Code"
                                        className="mt-1 block w-full  border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Coupon Description</label>
                                    <CustomInput
                                        type="text"
                                        name="couponDesc"
                                        placeholder="Coupon Description"
                                        className="mt-1 block w-full  border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Applicable On + Coupon Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Applicable On</label>
                                    <select
                                        name="applicableOn"
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                                    >
                                        <option>Select Coupon Applicable on</option>
                                        <option value="recharge">Recharge</option>
                                        <option value="product">Product</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Coupon Type</label>
                                    <select
                                        name="couponType"
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                                    >
                                        <option value="cashback">Cashback</option>
                                        <option value="flat">Flat Discount</option>
                                    </select>
                                </div>
                            </div>

                            {/* Discount + Max Discount */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Cashback / Flat Discount</label>
                                    <div className="flex items-center">
                                        <CustomInput
                                            type="text"
                                            name="discount"
                                            placeholder="Cashback/Flat Discount (%)"
                                            className="mt-1 block w-full  border border-gray-300 p-2 text-sm"
                                        />
                                        <span className="ml-2 text-sm">%</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Max Discount</label>
                                    <CustomInput
                                        type="text"
                                        name="maxDiscount"
                                        placeholder="Max Discount"
                                        className="mt-1 block w-full  border border-gray-300 p-2 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Redeem + Coupon Per User */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Redeem Limit Per User</label>
                                    <CustomInput
                                        type="text"
                                        name="redeemLimit"
                                        placeholder="Redeem Limit Per User"
                                        className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">No. of Coupon Per User Type</label>
                                    <div className="flex items-center">
                                        <CustomInput
                                            type="text"
                                            name="couponPerUser"
                                            placeholder="Coupon Validity"
                                            className="mt-1 block w-full  border border-gray-300 p-2 text-sm"
                                        />
                                        <span className="ml-2 text-sm">User</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Coupon Start Date</label>
                                    <CustomInput
                                        type="date"
                                        name="startDate"
                                        className="mt-1 block w-full  border border-gray-300 p-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Coupon End Date</label>
                                    <CustomInput
                                        type="date"
                                        name="endDate"
                                        className="mt-1 block w-full  border border-gray-300 p-2 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Visibility + Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Visibility</label>
                                    <select
                                        name="visibility"
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                                    >
                                        <option value="visible">Visible</option>
                                        <option value="hidden">Not Visible</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Status</label>
                                    <select
                                        name="status"
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-6 items-center justify-center mt-6">
                                <CustomButton variant={"green"}
                                    type="submit"
                                    className=""
                                >
                                    Submit
                                </CustomButton>
                                <CustomButton variant={"gray"}
                                    type="reset"
                                    className=""
                                >
                                    Reset
                                </CustomButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="bg-white shadow-md rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Manage Coupons</h3>
                    <CustomButton variant={"green"} href="/admindash/couponmain" onClick={() => setCoupOpen(true)} className="">

                        Add New Coupon

                    </CustomButton>
                </div>

                <hr className="mb-6" />

                <div className="couplist text-gray-600">
                    Coupon List Here
                </div>
            </div>
        </div>
    );
}
