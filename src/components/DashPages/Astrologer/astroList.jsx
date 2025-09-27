"use client";

import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import CustomToggle from "@/components/Custom/CustomToggle";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
export default function AstroList() {
    const data = [
        { id: 1, username: "Ammy", mobile: 897897646546, skills: "Tarot, Numerology, Palmistry, Kundli,Palmistry", activity: "2025-09-25", foreign: "***", status: "On" },
        { id: 2, username: "Rahul", mobile: 897897646546, skills: "Tarot, Numerology, Palmistry, Kundli,Palmistry", activity: "2025-09-20", foreign: "**", status: "Off" },
        { id: 3, username: "Priya", mobile: 897897646546, skills: "Tarot, Numerology, Palmistry, Kundli,Palmistry", activity: "2025-09-15", foreign: "****", status: "On" },
    ];

    return (
        <div className="min-h-screen ">
            <div className="shadow-md rounded-xl p-3 bg-purple-200 mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-purple-900">
                    Astrologer List
                </h2>
                <div className="flex items-center justify-between gap-3 text-xs">
                    <CustomButton variant={"main"} className="px-3 py-1 rounded-xl font-semibold">Copy</CustomButton>
                    <CustomButton variant={"main"} className="px-3 py-1 rounded-xl font-semibold">Excel</CustomButton>
                    <CustomButton variant={"main"} className="px-3 py-1 rounded-xl font-semibold">PDF</CustomButton>
                    <CustomInput className="px-3 py-1" placeholder="search here..." />
                </div>
            </div>
            <ul className="grid grid-cols-8 place-self-center items-center justify-center place-center self-center font-bold bg-purple-200 rounded-md p-2 text-sm text-purple-900">
                <li>S.No</li>
                <li>Name</li>
                <li>Mobile</li>
                <li>Skills</li>
                <li>Activity</li>
                <li>Foreign</li>
                <li>Status</li>
                <li>Action</li>
            </ul>

            {data.map((row, index) => (
                <ul
                    key={row.id}
                    className="grid grid-cols-8 border-b border-gray-200 text-sm text-gray-700 p-2 hover:bg-gray-50">
                    <li>{index + 1}</li>
                    <li>     <div className="flex items-center gap-2">
                        <Image src={"/admin-img/user2.png"} alt="altro image" width={50} height={50} className="rounded-full w-8 h-8" />
                        <div className="flex flex-col gap-1">
                            <span className="text-sm">Astrologer</span>
                            <small>ID: <i>68445445</i></small>
                        </div>
                    </div></li>
                    <li>{row.mobile}</li>
                    <li className="line-clamp-2  text-ellipsis ">{row.skills}</li>
                    <li>{row.activity}</li>
                    <li>
                        <div className="flex flex-col gap-1">
                            <span className="px-2 py-1 text-xs bg-red-400 w-fit text-white rounded-full">Inactive</span>
                            <span className="px-2 py-1 text-xs bg-green-400 w-fit text-white rounded-full">Active</span>
                        </div>
                    </li>
                    <li>     
                        <CustomToggle
                        id="chat"
                    // onChange={(val)}
                    /></li>
                    <li>   <div className="flex items-center justify-center gap-3 text-xs">
                        <CustomButton variant={"yellow"} className="px-2 py-2 text-white rounded-lg font-semibold"><FaEdit /></CustomButton>
                        <CustomButton variant={"red"} className="px-2 py-2 rounded-lg font-semibold"><MdDeleteForever /></CustomButton>
                    </div></li>
                </ul>
            ))}
        </div>
    );
}
