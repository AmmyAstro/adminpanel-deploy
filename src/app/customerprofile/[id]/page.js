"use client";

import Skenton from "@/app/common/Skenton";
import { formatDate } from "@/app/helper/helper";
import { mainurl } from "@/app/redux/config";
import { RequestAstrologerDetail } from "@/app/redux/slices/astrologer/AstrologerDetail";

import CustomButton from "@/components/Custom/CustomButtom";
import CustomDropdown from "@/components/Custom/CustomDropdown";
import CustomInput from "@/components/Custom/CustomInput";
import CustomToggle from "@/components/Custom/CustomToggle";
import CustomProfiledata from "@/components/Data/CustomProfileData";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import { MdCancel } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";

export default function CustomerProfile() {
    const [activeTab, setActiveTab] = useState("call");
    const [openPopup, setOpenPopUp] = useState(false);
    const dispatch = useDispatch();
    const params = useParams();



    const docs = [
        { id: 1, name: "Pancard", status: "Uploded" },
        { id: 2, name: "Aadhar", status: "Uploded" },
        { id: 3, name: "Passbook / Cheque", status: "Upload" },
    ];

    const review = [
        { id: 1, name: "Call", rate: "4.21", num: "106" },
        { id: 2, name: "Chat", rate: "4.50", num: "156" },
        { id: 3, name: "Video", rate: "3.10", num: "200" },
    ];

    const stats = [
        {
            id: 1,
            img: "/admin-img/earnings.png",
            // amount: customer_stats?.balance_amount || 0,
            label: "Availble Balance",
            prefix: "₹ ",
        },
        {
            id: 2,
            img: "/admin-img/investment.png",
            // amount: customer_stats?.total_calls || 0,
            label: "Total Call",
            prefix: " ",
        },
        {
            id: 3,
            img: "/admin-img/reward.png",
            // amount: customer_stats?.total_chats || 0,
            label: "Total Chat",
            prefix: "",
        },
        {
            id: 4,
            img: "/admin-img/reward.png",
            // amount: customer_stats?.total_chats || 0,
            label: "Last Recaharge",
            prefix: "₹",
        },

    ];

    return (
        <div className="min-h-screen ">
            <div className="shadow-md rounded-xl p-3 bg-purple-200 mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-purple-900">
                    Astrologer Profile
                </h2>
                <CustomButton
                    variant={"gray"}
                    className="px-3 py-1"
                // onClick={openWallet}
                >
                    Manage Wallet
                </CustomButton>
            </div>

            {openPopup && (
                <div className="fixed inset-0 bg-[#00000062] bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold mb-4 text-purple-700">
                                Manage Wallet
                            </h3>
                            <button
                                onClick={() => setOpenPopUp(false)}
                                className=" text-lg justify-start self-start text-gray-500 hover:text-gray-700 "
                            >
                                <MdCancel />
                            </button>
                        </div>
                        <div className="flex flex-col gap-3 mb-5">
                            <CustomInput
                                type="text"
                                placeholder="Enter Amount"
                                className="  px-3 py-2 text-sm "
                            />
                            <CustomInput
                                type="text"
                                placeholder="Transaction ID / Notes"
                                className=" px-3 py-2 text-sm "
                            />
                        </div>

                        <div className="flex justify-center gap-3">
                            <CustomButton
                                variant={"green"}
                                className="  text-white   py-2 px-5 text-sm font-semibold"
                                onClick={() => alert("Add Money clicked")}
                            >
                                Add Gems
                            </CustomButton>
                            <CustomButton
                                variant={"red"}
                                className="  text-whitepx-4 py-2 px-5 text-sm font-semibold"
                                onClick={() => alert("Withdraw clicked")}
                            >
                                Deduct Gems
                            </CustomButton>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-8 gap-4">
                <div className="col-span-3 bg-white rounded-lg p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center bg-purple-200 p-2 rounded-full shadow px-4">
                        <h5 className="text-sm font-bold">User Details</h5>
                        <CustomButton
                            variant={"black"}
                            className="text-sm px-3 py-1 text-black"
                        >
                            Edit
                        </CustomButton>
                    </div>

                    <div className="flex w-full flex-col py-2 px-4">
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex flex-col items-center justify-center ml-5 gap-1">
                                <span className="font-bold text-gray-800">
                                    {/* {customerProfile?.full_name || ""} */}
                                    user name
                                </span>
                                <small className="font-semibold text-gray-600">
                                    {/* Customer ID :000-{customerProfile?.id} */}
                                    user id
                                </small>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2  py-3">
                            <div className="flex justify-between items-center  border-b border-gray-200 ">
                                <div className="font-semibold text-sm">Email:</div>
                                <div className="text-sm">
                                    {/* {customerProfile?.full_name}@gmail.com */}
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200">
                                <div className="font-semibold text-sm">Mobile:</div>
                                {/* <div className="text-sm">{customerProfile?.mobile2}</div> */}
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200">
                                <div className="font-semibold text-sm">Gender:</div>
                                {/* <div className="text-sm">{customerProfile?.gender}</div> */}
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200">
                                <div className="font-semibold text-sm">Address:</div>
                                <div className="text-sm">
                                    {/* {customerProfile?.address || ""},{customerProfile?.city || ""}
                                    ,{customerProfile?.state || ""} */}
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200">
                                <div className="font-semibold text-sm">GST No:</div>
                                {/* <div className="text-sm">{customerProfile?.gst_no}</div> */}
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200">
                                <div className="font-semibold text-sm">ZipCode:</div>
                                {/* <div className="text-sm">{customerProfile?.zipcode}</div> */}
                            </div>
                            <div className="flex justify-between items-center ">
                                <div className="font-semibold text-sm  ">Joined From:</div>
                                <div className="text-sm">
                                    {/* {formatDate(customerProfile?.created_at)} */}
                                </div>
                            </div>
                        </div>
                        {/* <hr className="text-gray-300" /> */}


                    </div>
                </div>

                <div className="col-span-5 bg-white rounded-lg p-4 flex flex-col gap-5">
                    <div className="flex items-center flex-col gap-10 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                            {stats.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col items-center justify-center bg-purple-200  shadow-2xl rounded-xl p-2 hover:shadow-lg transition"
                                >
                                    <Image
                                        src={item.img}
                                        alt={item.label}
                                        width={40}
                                        height={40}
                                        className="mb-1"
                                    />
                                    <p className="text-xl font-bold text-gray-800">
                                        {item.prefix}
                                        <span className="rupee">{item.amount}</span>
                                    </p>
                                    <span className="text-gray-500 text-xs font-semibold">{item.label}</span>
                                </div>
                            ))}

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                            <div className="flex  items-center justify-between px-8 gap-3 bg-purple-200  shadow-2xl rounded-xl p-2 hover:shadow-lg transition">
                                <span className="text-gray-500 text-xs font-semibold">PO Again</span>
                                <CustomToggle
                                    checked
                                    id="chat"
                                // onChange={(val)}
                                />

                            </div>

                            <div onClick={""} className="flex cursor-pointer  items-center justify-between px-8 py-3 bg-purple-200  shadow-2xl rounded-xl p-2 hover:shadow-lg transition">
                                <span className="text-gray-500 text-xs font-semibold">Call Customer</span>
                                <Image
                                    src="/admin-img/cal.gif"
                                    alt="Customer Call"
                                    width={40}
                                    height={40}
                                    className="mb-1 rounded-full"
                                />

                            </div>

                        </div>

                    </div>




                </div>
            </div>


            <div className="flex w-full  mt-6">
                <div className="p-4 rounded-2xl flex flex-col gap-3 shadow-xl   bg-white w-full">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <h2 className="font-semibold text-sm text-center ">
                            Astrologer Activities
                        </h2>
                        <div className="flex items-center justify-between gap-2">
                            <CustomButton variant={"black"} className="text-xs px-4 py-2">
                                {" "}
                                Export{" "}
                            </CustomButton>
                            <CustomInput
                                placeholder="Search here...."
                                className="px-2 py-1 placeholder:text-xs"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 justify-start">
                        {CustomProfiledata.map((tab) => (
                            <button
                                type="button"
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-1 text-xs font-medium rounded-full transition ${activeTab === tab.id
                                    ? "bg-purple-400 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-1 shadow rounded-lg ">
                        {CustomProfiledata.map(
                            (tab) =>
                                activeTab === tab.id && (
                                    <table key={tab.id} className="w-full text-sm">
                                        <tbody className="space-y-2">
                                            {tab.fields.map((field, idx) => (
                                                <tr key={idx} className="mb-2">
                                                    <td className="py-2 pr-4">{field}</td>
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
    );
}
