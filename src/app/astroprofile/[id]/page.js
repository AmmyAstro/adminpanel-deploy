'use client'

import AlertLoading from "@/app/common/AlertLoading";
import Skenton from "@/app/common/Skenton";
import { formatDate } from "@/app/helper/helper";
import { mainurl } from "@/app/redux/config";
import { resetCode, sendManagePriceRequest } from "@/app/redux/slices/astrologer/ActiveAccountSlice";
import { RequestAstrologerDetail } from "@/app/redux/slices/astrologer/AstrologerDetail";

import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import CustomToggle from "@/components/Custom/CustomToggle";
import AstroProfiledata from "@/components/Data/AstroProifledata";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";


export default function AstroProfile() {
    const [activeTab, setActiveTab] = useState("call");
    const [openPopup, setOpenPopUp] = useState(false)
    const dispatch = useDispatch();
    const params = useParams();
    const astro_id = params?.slug[3];





    const [price, setPrice] = useState("");
    const [remarks, setRemarks] = useState("");

    const { astrologerloading, astrologerdata } = useSelector((state) => state.astrologerdetail);
    const { accountloading, priceCode, updateprice } = useSelector((state) => state.astrologeractive);






    const update_price = useMemo(() => {
        return parseInt(updateprice?.balance || 0);
    }, [updateprice])






    useEffect(() => {
        dispatch(RequestAstrologerDetail({ astro_id }))

    }, [dispatch, astro_id])




    useEffect(() => {
        if (priceCode === 202) {
            dispatch(resetCode());
            toast.success("Astrologer Price Update Successfully!");

            setOpenPopUp(false);
        }
    }, [priceCode, dispatch])


    const astrologerprofile = useMemo(() => {
        return astrologerdata?.profile;
    }, [astrologerdata])



    const astro_stats = useMemo(() => {
        return astrologerdata?.stats;
    }, [astrologerdata])


    const openWallet = openPopup => {
        setOpenPopUp(true);
    }
    const [availability, setAvailability] = useState({
        call: astrologerprofile?.is_call_online,
        chat: astrologerprofile?.is_chat_online,

    });

    if (astrologerloading) {
        return <Skenton />;
    }


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
            amount: Math.ceil(Number(astrologerprofile?.balance_amount + update_price)) || 0,
            label: "Availble Balance",
            prefix: "₹ ",
        },
        {
            id: 2,
            img: "/admin-img/investment.png",
            amount: astro_stats?.total_calls || 0,
            label: "Total Call",
            prefix: "₹ ",
        },
        {
            id: 3,
            img: "/admin-img/reward.png",
            amount: astro_stats?.total_chats || 0,
            label: "Total Chat",
            prefix: "",
        },
    ];


    const Manageprice = (type) => {
        try {
            if (!price) {
                toast.error("Please Enter Price");
            } else if (!remarks) {
                toast.error("Please Enter Remarks");
            } else {
                dispatch(sendManagePriceRequest({
                    price: price,
                    remarks: remarks,
                    astro_id: astro_id,
                    status: type
                }))
            }

        } catch (error) {


        }

    }






    return (
        <div className="min-h-screen ">


            <div className="shadow-md rounded-xl p-3 bg-purple-200 mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-purple-900">
                    Astrologer Profile
                </h2>
                <CustomButton variant={"gray"} className="px-3 py-1" onClick={openWallet}>Manage Wallet</CustomButton>

            </div>
            <AlertLoading show={accountloading} title="Please Wait..." />
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
                                onChange={(e) => setPrice(e.target.value)}
                            />


                            <textarea

                                className="px-3"
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Remarks">

                            </textarea>
                        </div>

                        <div className="flex justify-center gap-3">
                            <CustomButton variant={"green"}
                                className="  text-white   py-2 px-5 text-sm font-semibold"
                                onClick={() => Manageprice("add")}>
                                Add Gems
                            </CustomButton>
                            <CustomButton variant={"red"}
                                className="  text-whitepx-4 py-2 px-5 text-sm font-semibold"
                                onClick={() => Manageprice("deduct")}>
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
                        <CustomButton variant={"black"} className="text-sm px-3 py-1 text-black" >Edit</CustomButton>
                    </div>


                    <div className="flex w-full flex-col py-2 px-4">

                        <div className="flex items-center gap-4">
                            <div className="">

                                <Image src={mainurl + 'ds-img/' + astrologerprofile?.profile_image}
                                    alt="Avatar"
                                    width={60}
                                    height={60}
                                    className="rounded-full"
                                />
                            </div>

                            <div className="flex flex-col ml-5 gap-1">
                                <span className="font-bold text-gray-800">{astrologerprofile?.full_name || ""}</span>
                                <small className="font-semibold text-gray-600">
                                    Astrologer ID :000-{astrologerprofile?.id}
                                </small>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2  py-3">
                            <div className="flex justify-between items-center">
                                <div className="font-semibold text-sm">Name :</div>
                                <div className="text-sm">{astrologerprofile?.full_name || ""}</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="font-semibold text-sm">Email:</div>
                                <div className="text-sm">{astrologerprofile?.full_name}@gmail.com</div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="font-semibold text-sm">Ranking:</div>
                                <div className="text-sm">{astrologerprofile?.astro_tag || "N/A"}</div>
                            </div>


                            <div className="flex justify-between items-center">
                                <div className="font-semibold text-sm">Mobile:</div>
                                <div className="text-sm">{astrologerprofile?.mobile2}</div>
                            </div>  <div className="flex justify-between items-center">
                                <div className="font-semibold text-sm">Address:</div>
                                <div className="text-sm">{astrologerprofile?.address || ""},
                                    {astrologerprofile?.city || ""},{astrologerprofile?.state || ""}</div>
                            </div>  <div className="flex justify-between items-center">
                                <div className="font-semibold text-sm  ">Joined From:</div>
                                <div className="text-sm">{formatDate(astrologerprofile?.created_at)}</div>
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
                                        ₹ {astrologerprofile?.disc_call_charge}
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
                                        ₹ {astrologerprofile?.disc_chat_charge}
                                    </label>
                                    <CustomToggle
                                        id="chat"
                                        checked={availability.chat}
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
                                        <span className="text-red-400 text-xs">{astro_stats?.promotional || 0}/10</span>

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
                                {AstroProfiledata?.map((tab) => (
                                    <button
                                        type="button"
                                        key={tab.id}
                                        data-astro-id={astro_id}
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


                            <div className="p-1 shadow rounded-lg ">
                                {AstroProfiledata.map(
                                    (tab) =>
                                        activeTab === tab.id && (
                                            <table key={tab.id} className="w-full text-sm">
                                                <tbody className="space-y-2">
                                                    {tab.fields.map((Comp, idx) => (
                                                        <Comp key={idx} astro_id={astro_id} />
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

                                        onChange={(val) => setAvailability({ ...availability, call: val })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold">LA</span>
                                    <CustomToggle
                                        id="call"

                                        onChange={(val) => setAvailability({ ...availability, call: val })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold">LA</span>
                                    <CustomToggle
                                        id="call"

                                        onChange={(val) => setAvailability({ ...availability, call: val })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold">LA</span>
                                    <CustomToggle
                                        id="call"

                                        onChange={(val) => setAvailability({ ...availability, call: val })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold">LA</span>
                                    <CustomToggle
                                        id="call"

                                        onChange={(val) => setAvailability({ ...availability, call: val })}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold">LA</span>
                                    <CustomToggle
                                        id="call"

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