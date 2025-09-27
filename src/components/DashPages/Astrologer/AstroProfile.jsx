import CustomButton from "@/components/Custom/CustomButtom";
import CustomToggle from "@/components/Custom/CustomToggle";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import AstroProfiledata from "@/components/Data/AstroProifledata";
import CustomInput from "@/components/Custom/CustomInput";
import { MdCancel } from "react-icons/md";

export default function AstroProfile() {
    const [activeTab, setActiveTab] = useState("call");
    const [openPopup, setOpenPopUp] = useState(false)
    const openWallet = openPopup => {
        setOpenPopUp(true);
    }
    const [availability, setAvailability] = useState({
        call: false,
        chat: false,
        promo: false,
    });

    const docs = [
        { id: 1, name: "Pancard", status: "Uploded" },
        { id: 2, name: "Aadhar", status: "Uploded" },
        { id: 3, name: "Passbook / Cheque", status: "Upload" },
    ];
    const charge = [
        { id: 1, name: "Call", price: "20" },
        { id: 2, name: "Chat", price: "30" },
        { id: 3, name: "Video", price: "50" },
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
            amount: "65,000",
            label: "Total Revenue",
            prefix: "₹ ",
        },
        {
            id: 2,
            img: "/admin-img/investment.png",
            amount: "5,000",
            label: "Total Earnings",
            prefix: "₹ ",
        },
        {
            id: 3,
            img: "/admin-img/reward.png",
            amount: "165",
            label: "Reviews",
            prefix: "",
        },
    ];

    return (
        <div className="min-h-screen ">
            <div className="shadow-md rounded-xl p-3 bg-purple-200 mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-purple-900">
                    Astrologer Profile
                </h2>
                <CustomButton variant={"gray"} className="px-3 py-1" onClick={openWallet}>Manage Wallet</CustomButton>
            </div>
            {openPopup && (
                <div className="fixed inset-0 bg-[#00000062] bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg">

                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold mb-4 text-purple-700">Manage Wallet</h3>
                            <button
                                onClick={() => setOpenPopUp(false)}
                                className=" text-lg justify-start self-start text-gray-500 hover:text-gray-700 ">
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
                            <CustomButton variant={"green"}
                                className="  text-white   py-2 px-5 text-sm font-semibold"
                                onClick={() => alert("Add Money clicked")}>
                                Add Gems
                            </CustomButton>
                            <CustomButton variant={"red"}
                                className="  text-whitepx-4 py-2 px-5 text-sm font-semibold"
                                onClick={() => alert("Withdraw clicked")}>
                                Deduct Gems
                            </CustomButton>
                        </div>

                    </div>
                </div>
            )}


            <div className="grid grid-cols-8 gap-4">
                <div className="col-span-3 bg-white rounded-lg p-4 flex flex-col gap-2">

                    <div className="flex justify-between items-center bg-purple-200 p-2 rounded-full shadow px-4">
                        <h5 className="text-sm font-bold">Astrologers Details</h5>
                        <CustomButton variant={"black"} className="text-sm px-3 py-1 text-black" onClick={() => xy()}>Edit</CustomButton>
                    </div>


                    <div className="flex w-full flex-col py-2 px-4">

                        <div className="flex items-center gap-4">
                            <div className="">
                                <Image
                                    src="/admin-img/user2.png"
                                    alt="Avatar"
                                    width={60}
                                    height={60}
                                    className="rounded-full"
                                />
                            </div>

                            <div className="flex flex-col ml-5 gap-1">
                                <span className="font-bold text-gray-800">Test</span>
                                <small className="font-semibold text-gray-600">
                                    Astrologer ID : 20627
                                </small>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2  py-3">
                            <div className="flex justify-between items-center">
                                <div className="font-semibold text-sm">Name :</div>
                                <div className="text-sm">Tester 1</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="font-semibold text-sm">Email:</div>
                                <div className="text-sm">jain@dhwaniastro.com</div>
                            </div>  <div className="flex justify-between items-center">
                                <div className="font-semibold text-sm">Mobile:</div>
                                <div className="text-sm">9319490825</div>
                            </div>  <div className="flex justify-between items-center">
                                <div className="font-semibold text-sm">Address:</div>
                                <div className="text-sm">Lodhi Road, Lodhi Road</div>
                            </div>  <div className="flex justify-between items-center">
                                <div className="font-semibold text-sm  ">Joined From:</div>
                                <div className="text-sm">30 Apr,2024 01:02 pm</div>
                            </div>
                        </div>
                        <hr className="text-gray-300" />

                        <div className="flex flex-col gap-2 py-3">
                            <div className="flex items-center justify-between">
                                <h6 className="text-sm font-semibold">Online Availability:</h6>     
                                <div className="flex items-center gap-3">
                                <CustomButton
                                    variant={"black"}
                                    onClick={() => alert("Edit clicked")}
                                    className="px-2 py-[2px] text-[10px] transition"
                                >
                                    Edit
                                </CustomButton>

                            </div></div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">
                                    Call
                                </label>
                                <div className="flex items-center gap-5">
                                    <label className="text-sm font-semibold text-gray-700">
                                        ₹ 30
                                    </label>
                                    <CustomToggle
                                        id="chat"
                                        checked={availability.call}
                                        onChange={(val) => setAvailability({ ...availability, chat: val })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">
                                    Chat
                                </label>
                                <div className="flex items-center gap-5">
                                    <label className="text-sm font-semibold text-gray-700">
                                        ₹ 20
                                    </label>
                                    <CustomToggle
                                        id="chat"
                                        checked={availability.chat}
                                        onChange={(val) => setAvailability({ ...availability, chat: val })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">
                                    Video
                                </label>
                                <div className="flex items-center gap-5">
                                    <label className="text-sm font-semibold text-gray-700">
                                        ₹ 50
                                    </label>
                                    <CustomToggle
                                        id="chat"
                                        checked={availability.video}
                                        onChange={(val) => setAvailability({ ...availability, chat: val })}
                                    />
                                </div>
                            </div>


                            <div className="grid grid-cols-2 items-center gap-3">
                                <label className="text-sm font-medium text-gray-700">
                                    Promotional (Serve/Limit)
                                </label>

                                <div className="flex items-center justify-end gap-4">

                                    <div className="flex items-center gap-3">
                                        <CustomButton
                                            variant={"black"}
                                            onClick={() => alert("Edit clicked")}
                                            className="px-2 py-[2px] text-[10px] transition"
                                        >
                                            Edit
                                        </CustomButton>
                                        <span className="text-red-400 text-xs">0/10</span>

                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setAvailability({ ...availability, promo: !availability.promo })
                                        }
                                        className={`relative inline-flex h-5 w-11 items-center rounded-full transition cursor-pointer ${availability.promo ? "bg-green-500" : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${availability.promo ? "translate-x-6" : "translate-x-1"
                                                }`}
                                        />
                                    </button>

                                </div>
                            </div>

                        </div>

                        <hr className="text-gray-300" />

                        <div className="flex flex-col gap-2 py-3">
                            <h6 className="text-sm font-semibold ">Astrologer Documents:</h6>

                            <div className="space-y-3">
                                {docs.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex px-4 items-center gap-5 justify-between p-2 border border-gray-50  rounded-full shadow hover:bg-gray-50 transition"
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <h6 className="font-medium text-sm">{doc.name} :</h6>
                                            <span
                                                className={`text-sm ${doc.status === "Uploded"
                                                    ? "text-green-600 font-semibold"
                                                    : "text-red-500 font-medium"
                                                    }`}
                                            >
                                                {doc.status}
                                            </span>
                                        </div>

                                        <CustomButton variant={"black"} className="px-2 py-[2px] text-[10px]  transition">
                                            View
                                        </CustomButton>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="text-gray-300" />

                        <div className="flex flex-col gap-2 py-3">
                            <h6 className="text-sm font-semibold">Astrologer Charges :</h6>
                            <div className="space-y-3">
                                {charge.map((charge) => (
                                    <div
                                        key={charge.id}
                                        className="flex px-4 items-center gap-5 justify-between p-2 border border-gray-50  rounded-full shadow hover:bg-gray-50 transition"
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <h6 className="font-medium text-sm">{charge.name} :</h6>
                                            <span
                                                className={`text-sm`}>
                                                Rs. {charge.price}
                                            </span>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="text-gray-300" />

                        <div className="flex flex-col gap-2 py-3">
                            <h6 className="text-sm font-semibold">Astrologer Reviews :</h6>
                            <div className="space-y-3">
                                {review.map((item) => {
                                    const rateValue = parseFloat(item.rate);
                                    const color = rateValue < 3.5 ? "text-red-500" : "text-green-500";

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex px-4 items-center gap-3 justify-between p-2 border border-gray-50  rounded-full shadow hover:bg-gray-50 transition"
                                        >
                                            <span className="font-medium text-sm">{item.name}</span>
                                            <div className="flex text-sm items-center gap-2">

                                                <span className={`font-semibold ${color}`}>{item.rate}</span>
                                                <FaStar className={`${color}`} />
                                                <span className="text-gray-500 text-sm">({item.num})</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                </div>

                <div className="col-span-5 bg-white rounded-lg p-4 flex flex-col gap-5">

                    <div className="flex items-center gap-3 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
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
                                    <span className="text-gray-500 text-xs">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex w-full ">
                        <div className="p-4 rounded-2xl flex flex-col gap-3 shadow-xl   bg-white w-full">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                <h2 className="font-semibold text-sm text-center ">Astrologer Activities</h2>
                                <div className="flex items-center justify-between gap-2">
                                    <CustomButton variant={"black"} className="text-xs px-4 py-2"> Export </CustomButton>
                                    <CustomInput placeholder="Search here...." className="px-2 py-1 placeholder:text-xs" />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-start">
                                {AstroProfiledata.map((tab) => (
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
                                {AstroProfiledata.map(
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

                    <div className="flex w-full ">
                        <div className="p-4 rounded-2xl flex flex-col gap-3 shadow-xl   bg-white w-full">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                <h2 className="font-semibold text-sm text-center ">Manage Availability</h2>

                            </div>

                            <div className="flex items-center gap-6 ">
                                <div className="flex flex-col gap-1 items-start justify-start">
                                    <span className="text-xs font-semibold">LA</span>
                                    <CustomToggle
                                        id="call"
                                        checked={availability.call}
                                        onChange={(val) => setAvailability({ ...availability, call: val })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold">LA</span>
                                    <CustomToggle
                                        id="call"
                                        checked={availability.call}
                                        onChange={(val) => setAvailability({ ...availability, call: val })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold">LA</span>
                                    <CustomToggle
                                        id="call"
                                        checked={availability.call}
                                        onChange={(val) => setAvailability({ ...availability, call: val })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold">LA</span>
                                    <CustomToggle
                                        id="call"
                                        checked={availability.call}
                                        onChange={(val) => setAvailability({ ...availability, call: val })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold">LA</span>
                                    <CustomToggle
                                        id="call"
                                        checked={availability.call}
                                        onChange={(val) => setAvailability({ ...availability, call: val })}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold">LA</span>
                                    <CustomToggle
                                        id="call"
                                        checked={availability.call}
                                        onChange={(val) => setAvailability({ ...availability, call: val })}
                                    />
                                </div>
                            </div>



                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}