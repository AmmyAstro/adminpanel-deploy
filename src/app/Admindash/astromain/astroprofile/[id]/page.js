"use client";

import AlertLoading from "@/app/common/AlertLoading";
import Skenton from "@/app/common/Skenton";
import {
  GET_ASTROLOGER_BY_ID,
  GET_ASTROLOGER_DASHBOARD_STATS,
  UPDATE_AVAILABILITY,
} from "@/app/graphQL/astroHiring";
import { formatDate } from "@/app/helper/helper";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import CustomToggle from "@/components/Custom/CustomToggle";
import { useMutation, useQuery } from "@apollo/client/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import AstrologerActivities from "../../AstrologerActivities";

export default function AstroProfile() {
  const [activeTab, setActiveTab] = useState("call");
  const [openPopup, setOpenPopUp] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const astrologerId = params?.id;

  const { data, loading, error } = useQuery(GET_ASTROLOGER_BY_ID, {
    variables: {
      id: astrologerId,
    },
    skip: !astrologerId,
  });

  const astrologerprofile = useMemo(() => {
    return data?.getAstrologerById;
  }, [data]);

  const address = astrologerprofile?.addresses?.[0];

  const callPricing = astrologerprofile?.pricing?.find(
    (item) => item.type === "CALL",
  );

  const chatPricing = astrologerprofile?.pricing?.find(
    (item) => item.type === "CHAT",
  );

  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useQuery(GET_ASTROLOGER_DASHBOARD_STATS, {
    variables: {
      astrologerId,
    },
    skip: !astrologerId,
  });
  const dashboardStats = statsData?.getAstrologerDashboardStats;
  useEffect(() => {
    console.log("Dashboard Stats", dashboardStats);
  }, [dashboardStats]);
  const [availability, setAvailability] = useState({
    call: false,
    chat: false,
    live: false,
    online: false,
    promotional: false,
  });

  const [updateAvailability, { loading: availabilityLoading }] =
    useMutation(UPDATE_AVAILABILITY);
  useEffect(() => {
    if (!astrologerprofile) return;

    setAvailability({
      call: astrologerprofile.isCallActive ?? false,

      chat: astrologerprofile.isChatActive ?? false,

      live: astrologerprofile.isLiveActive ?? false,

      online: astrologerprofile.isOnline ?? false,

      promotional: astrologerprofile.isPromotional ?? false,
    });
  }, [astrologerprofile]);

  const handleAvailabilityChange = async (field, value) => {
    try {
      setAvailability((prev) => ({
        ...prev,
        [field]: value,
      }));

      const variables = {
        astrologerId,
        ...(field === "chat" && {
          isChatActive: value,
        }),

        ...(field === "call" && {
          isCallActive: value,
        }),

        ...(field === "live" && {
          isLiveActive: value,
        }),
        ...(field === "promotional" && {
          isPromotional: value,
        }),
      };

      await updateAvailability({
        variables,
      });

      toast.success("Updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  if (error) {
    return (
      <div className="p-5 text-red-500">Failed to load astrologer profile</div>
    );
  }
  const docs = [
 
    {
      name: "Aadhaar",
      file: astrologerprofile?.kycDetail?.aadhaarImage,
    },
    {
      name: "PAN Card",
      file: astrologerprofile?.kycDetail?.panImage,
    },
    {
      name: "Passbook",
      file: astrologerprofile?.kycDetail?.passbookImage,
    },
  ];

  const review = [
    { id: 1, name: "Call", rate: "4.21", num: "106" },
    { id: 2, name: "Chat", rate: "4.50", num: "156" },
    { id: 3, name: "Video", rate: "3.10", num: "200" },
  ];

  const stats = [
    {
      id: 1,
      label: "Wallet Balance",
      amount: dashboardStats?.walletBalance || 0,
      prefix: "₹",
    },

    {
      id: 2,
      label: "Total Earnings",
      amount: dashboardStats?.totalEarned || 0,
      prefix: "₹",
    },

    {
      id: 3,
      label: "Total Calls",
      amount: dashboardStats?.totalCalls || 0,
      prefix: "",
    },

    {
      id: 4,
      label: "Total Chats",
      amount: dashboardStats?.totalChats || 0,
      prefix: "",
    },

    {
      id: 5,
      label: "Followers",
      amount: dashboardStats?.totalFollowers || 0,
      prefix: "",
    },

    {
      id: 6,
      label: "Rating",
      amount: dashboardStats?.averageRating || 0,
      prefix: "",
    },
  ];
  if (loading || statsLoading) {
    return <Skenton />;
  }
  return (
    <div className="min-h-screen ">
      <div className="shadow-md rounded-xl p-3 bg-purple-200 mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple-900">
          Astrologer Profile
        </h2>
        <CustomButton
          variant={"gray"}
          className="px-3 py-1"
          //   onClick={openWallet}
        >
          Manage Wallet
        </CustomButton>
      </div>
      {/* <AlertLoading show={accountloading} title="Please Wait..." /> */}
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
                onChange={(e) => setPrice(e.target.value)}
              />

              <textarea
                className="px-3"
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Remarks"
              ></textarea>
            </div>

            <div className="flex justify-center gap-3">
              <CustomButton
                variant={"green"}
                className="  text-white   py-2 px-5 text-sm font-semibold"
                onClick={() => Manageprice("add")}
              >
                Add Gems
              </CustomButton>
              <CustomButton
                variant={"red"}
                className="  text-whitepx-4 py-2 px-5 text-sm font-semibold"
                onClick={() => Manageprice("deduct")}
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
            <h5 className="text-sm font-bold">Astrologers Details</h5>
            <CustomButton
              variant={"black"}
              className="text-sm px-3 py-1 text-black"
            >
              Edit
            </CustomButton>
          </div>

          <div className="flex w-full flex-col py-2 px-4">
            <div className="flex items-center gap-4">
              <div className="">
                <Image
                  src={`https://dhwaniastro.com${astrologerprofile?.profilePic}`}
                  alt={astrologerprofile?.name}
                  width={150}
                  height={150}
                  className="rounded-full"
                />
              </div>

              <div className="flex flex-col ml-5 gap-1">
                <span className="font-bold text-gray-800">
                  {astrologerprofile?.displayName || astrologerprofile?.name}
                </span>
                <small className="font-semibold text-gray-600">
                  Astrologer ID : {astrologerprofile?.id}
                </small>
              </div>
            </div>

            <div className="flex flex-col gap-2  py-3">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm">Email:</div>
                <div className="text-sm">{astrologerprofile?.email}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm">Ranking:</div>
                <div className="text-sm">{astrologerprofile?.tags}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm">Mobile:</div>
                <div className="text-sm">{astrologerprofile?.contactNo}</div>
              </div>{" "}
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm">Address:</div>
                <div className="text-sm">
                  {address?.street},{address?.city},{address?.state},
                  {address?.country}
                </div>
              </div>{" "}
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm">Experience:</div>

                <div className="text-sm">
                  {astrologerprofile?.experience} Years
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm">Gender:</div>

                <div className="text-sm">{astrologerprofile?.gender}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm">Languages:</div>

                <div className="text-sm">{astrologerprofile?.languages}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm">Skills:</div>

                <div className="text-sm">{astrologerprofile?.skills}</div>
              </div>
              <div className="mt-4">
                <h6 className="font-semibold mb-2">About</h6>

                <p className="text-sm text-gray-600">
                  {astrologerprofile?.about}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm  ">Joined From:</div>
                <div className="text-sm">
                  {formatDate(astrologerprofile?.created_at)}
                </div>
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
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Call
                </label>
                <div className="flex items-center gap-5">
                  <label className="text-sm font-semibold text-gray-700">
                    ₹ {callPricing?.offerPrice || callPricing?.price || 0}
                  </label>
                  <CustomToggle
                    id="call"
                    checked={availability.call}
                    onChange={(val) => handleAvailabilityChange("call", val)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Chat
                </label>
                <div className="flex items-center gap-5">
                  <label className="text-sm font-semibold text-gray-700">
                    ₹ {chatPricing?.offerPrice || chatPricing?.price || 0}
                  </label>
                  <CustomToggle
                    id="chat"
                    checked={availability.chat}
                    onChange={(val) => handleAvailabilityChange("chat", val)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Live
                </label>

                <CustomToggle
                  id="live"
                  checked={availability.live}
                  onChange={(val) => handleAvailabilityChange("live", val)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Promotional
                </label>

                <CustomToggle
                  id="promotional"
                  checked={availability.promotional}
                  onChange={(val) =>
                    handleAvailabilityChange("promotional", val)
                  }
                />
              </div>
            </div>

            <hr className="text-gray-300" />

            <div className="flex flex-col gap-2 py-3">
              <h6 className="text-sm font-semibold ">Astrologer Documents:</h6>
            </div>

            <hr className="text-gray-300" />

            <div className="flex flex-col gap-2 py-3">
              <h6 className="text-sm font-semibold">Astrologer Reviews :</h6>
              <div className="space-y-3">
                {review.map((item) => {
                  const rateValue = parseFloat(item.rate);
                  const color =
                    rateValue < 3.5 ? "text-red-500" : "text-green-500";

                  return (
                    <div
                      key={item.id}
                      className="flex px-4 items-center gap-3 justify-between p-2 border border-gray-50  rounded-full shadow hover:bg-gray-50 transition"
                    >
                      <span className="font-medium text-sm">{item.name}</span>
                      <div className="flex text-sm items-center gap-2">
                        <span className={`font-semibold ${color}`}>
                          {item.rate}
                        </span>
                        <FaStar className={`${color}`} />
                        <span className="text-gray-500 text-sm">
                          ({item.num})
                        </span>
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
                  <p className="text-xl font-bold text-gray-800">
                    {item.prefix}
                    <span className="rupee">{item.amount}</span>
                  </p>
                  <span className="text-gray-500 text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <AstrologerActivities astrologerId={astrologerId} />

          {/* <div className="flex w-full ">
            <div className="p-4 rounded-2xl flex flex-col gap-3 shadow-xl   bg-white w-full">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h2 className="font-semibold text-sm text-center ">
                  Manage Availability
                </h2>
              </div>

              <div className="flex items-center gap-6 ">
                <div className="flex flex-col gap-1 items-start justify-start">
                  <span className="text-xs font-semibold">LA</span>
                  <CustomToggle
                    id="call"
                    onChange={(val) =>
                      setAvailability({ ...availability, call: val })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">LA</span>
                  <CustomToggle
                    id="call"
                    onChange={(val) =>
                      setAvailability({ ...availability, call: val })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">LA</span>
                  <CustomToggle
                    id="call"
                    onChange={(val) =>
                      setAvailability({ ...availability, call: val })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">LA</span>
                  <CustomToggle
                    id="call"
                    onChange={(val) =>
                      setAvailability({ ...availability, call: val })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">LA</span>
                  <CustomToggle
                    id="call"
                    onChange={(val) =>
                      setAvailability({ ...availability, call: val })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">LA</span>
                  <CustomToggle
                    id="call"
                    onChange={(val) =>
                      setAvailability({ ...availability, call: val })
                    }
                  />
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
