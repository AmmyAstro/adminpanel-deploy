"use client";

import { sendpackageRequest } from "@/app/redux/slices/packageSlice";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdDelete, MdCancel } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { useDispatch } from "react-redux";

export default function PacakageMain() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        package_name: "",
        package_amount: "",
        talk_time_value: "",
        tax_apply: "Select Tax",
        coupon_code: "",
        coupon_count: "",
        coupon_percentage: "",

    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const packageSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            package_amount: parseFloat(form.package_amount || 0),
            talk_time_value: parseFloat(form.talk_time_value || 0),
            coupon_count: parseInt(form.coupon_count || 0),
            coupon_percentage: parseInt(form.coupon_percentage || 0),

        };

        // if (editCoupon) {
        //     dispatch(updateCouponRequest({ id: editCoupon.id, data: payload }));
        //     toast.success("Coupon updated successfully!");
        // }
        //  else {
        dispatch(sendpackageRequest(payload));
        toast.success("Package created successfully!");
        // }

        // handleCloseModal();
    };

    return (
        <div className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Manage Wallet Packages</h3>
                    <CustomButton variant={"green"}
                        onClick={() => setOpen(true)}
                        className="px-3 py-1">
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
                                        name="package_name"
                                        required
                                        value={form.package_name}
                                        onChange={handleChange}
                                        placeholder="Package Name" className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Package Amount
                                    </label>
                                    <CustomInput
                                        type="number"
                                        name="package_amount"
                                        required
                                        value={form.package_amount}
                                        onChange={handleChange}
                                        placeholder="Package Amount" className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Talk Time Value
                                    </label>
                                    <CustomInput
                                        type="number"
                                        name="talk_time_value"
                                        required
                                        value={form.talk_time_value}
                                        onChange={handleChange}
                                        placeholder="Talk Time Value" className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Taxes Apply</label>
                                    <select
                                        name="tax_apply"
                                        required
                                        value={form.tax_apply}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm">
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
                                        name="coupon_code"
                                        required
                                        value={form.coupon_code}
                                        onChange={handleChange}
                                        placeholder="Coupon Code" className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Coupon Count
                                    </label>
                                    <CustomInput
                                        type="number"
                                        name="coupon_count"
                                        required
                                        value={form.coupon_count}
                                        onChange={handleChange}
                                        placeholder="Coupon Count" className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Coupon Percentage
                                    </label>
                                    <CustomInput
                                        type="number"
                                        name="coupon_percentage"
                                        required
                                        value={form.coupon_percentage}
                                        onChange={handleChange}
                                        placeholder="Coupon Percentage" className="mt-1 block w-full border border-gray-300 p-2 text-sm"
                                    />
                                </div>

                            </div>

                            <div className="flex justify-center">
                                <CustomButton variant={"green"} type="submit" onClick={packageSubmit} className="px-3 py-1">
                                    Submit
                                </CustomButton>
                            </div>
                        </div>
                    </div>

                )}

                <div className="mt-10">
                    <h3 className="text-lg font-semibold mb-4">Wallets Package List</h3>
                    <div className="overflow-x-auto rounded-xl shadow">
                        <div className="w-full rounded-xl  overflow-hidden">
                            {/* Header row */}
                            <div className="grid grid-cols-6 gap-2 font-semibold text-sm rounded-2xl border-b bg-purple-300 p-2 text-gray-600">
                                <div>S.No</div>
                                <div>Package Name</div>
                                <div>Package Amount</div>
                                <div>Talktime Value</div>
                                <div>Status</div>
                                <div>Action</div>
                            </div>

                            {/* Dynamic rows */}
                            {/* {packages.map((pkg, index) => (
                                <div
                                    key={pkg.id}
                                    className="grid grid-cols-6 items-center text-sm text-gray-700 border-b hover:bg-gray-50 p-3"
                                >
                                    <div>{index + 1}</div>
                                    <div>{pkg.name}</div>
                                    <div>₹{pkg.amount}</div>
                                    <div>{pkg.talktime}</div>

                                    <div className="flex items-center gap-2">
                                        <CustomToggle
                                            checked={pkg.status === "active"}
                                            onChange={(val) => handleToggle(pkg.id, val)}
                                        />
                                        <span
                                            className={`text-xs font-medium px-2 py-1 rounded-full ${pkg.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {pkg.status === "active" ? "Active" : "Inactive"}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                                            <TbEdit className="text-blue-800" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            className="p-2 bg-red-400 text-white rounded-md hover:bg-red-500"
                                        >
                                            <MdDelete />
                                        </button>
                                    </div>
                                </div>
                            ))} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
