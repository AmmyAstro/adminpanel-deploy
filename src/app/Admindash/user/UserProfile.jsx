"use client";

import { FaWallet, FaCoins, FaComments, FaPhone } from "react-icons/fa";

import { useMemo, useState } from "react";
import {
  GET_CALL_RECORDING,
  GET_USER_CALL_HISTORY,
  GET_USER_PROFILE,
  GET_USER_REVIEWS,
  GET_USERS_CHAT_HISTORY,
  MANAGE_USER_WALLET,
} from "@/app/graphQL/astroHiring";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import dayjs from "dayjs";
import { FaUser } from "react-icons/fa6";
import CustomToggle from "@/components/Custom/CustomToggle";
import DataTable from "@/components/utils/DataTable";
import Link from "next/link";
import SessionMessagesModal from "./SessionModal";
import CustomButton from "@/components/Custom/CustomButtom";
import { MdCancel } from "react-icons/md";
import CustomInput from "@/components/Custom/CustomInput";
import toast from "react-hot-toast";
import SessionRemedyModal from "./SessionRemedyModal";
import WalletTab from "./WalletTab";
import RechargeTab from "./RechargeTab";
import ReviewTab from "./ReviewTab";
import Pagination from "../Pagination";

export default function UserProfile({ userId }) {
  console.log("USER ID =", userId);
  const [openModal, setOpenModal] = useState(false);
  const [openPopup, setOpenPopUp] = useState(false);
  const [price, setPrice] = useState("");
  const [remarks, setRemarks] = useState("");
  const [openRemedyModal, setOpenRemedyModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const LIMIT = 50;

  const [chatPage, setChatPage] = useState(1);
  const [callPage, setCallPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const openWallet = () => {
    setOpenPopUp(true);
  };
  const client = useApolloClient();

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: {
      userId,
    },
    fetchPolicy: "cache-first",
  });
  const [tab, setTab] = useState("Wallet");
  const [manageUserWallet, { loading: manageWalletLoading }] = useMutation(
    MANAGE_USER_WALLET,
    {
      refetchQueries: [
        {
          query: GET_USER_PROFILE,
          variables: {
            userId,
          },
        },
      ],
      awaitRefetchQueries: true,
    },
  );
  const Manageprice = async (action) => {
    const amt = Number(price);

    if (!amt || amt <= 0) {
      return toast.error("Please enter valid amount");
    }

    try {
      await manageUserWallet({
        variables: {
          userId,
          amount: amt,
          remarks,
          type: action === "add" ? "CREDIT" : "DEBIT",
        },
      });

      toast.success(
        action === "add"
          ? "Wallet credited successfully"
          : "Wallet debited successfully",
      );

      setPrice("");
      setRemarks("");
      setOpenPopUp(false);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const { data: chatData, loading: chatLoading  } = useQuery(GET_USERS_CHAT_HISTORY, {
    variables: {
      searchInput: {
        userId,
        page: chatPage,
        limit: LIMIT,
      },
    },
    fetchPolicy: "cache-and-network",
  });
  const { data: callData,  loading: callLoading } = useQuery(GET_USER_CALL_HISTORY, {
    variables: {
      searchInput: {
        userId,
        page: callPage,
        limit: LIMIT,
      },
    },
    fetchPolicy: "cache-and-network",
  });
  const calls = callData?.getUserCallHistory?.data || [];
  const handleDownloadRecording = async (sessionId) => {
    try {
      const { data } = await client.query({
        query: GET_CALL_RECORDING,
        variables: {
          sessionId,
        },
        fetchPolicy: "cache-and-network",
      });

      const recording = data?.getCallRecording;

      if (!recording?.fileUrl) {
        alert("Recording not found");
        return;
      }

      const link = document.createElement("a");
      link.href = recording.fileUrl;
      link.download = recording.fileName || "call-recording.webm";
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Unable to download recording");
    }
  };
  const chats = chatData?.getUsersChatHistory?.data || [];
  const historyColumns = useMemo(
    () => [
      {
        header: "Session ID",
        render: (row) => row.sessionId?.slice(0, 8),
      },
      {
        header: "Astrologer",
        render: (row) => (
          <div>
            <Link
              href={`/Admindash/astrologer/astroprofile/${row.astrologerId}`}
              className="font-semibold text-violet-600"
            >
              {row.astrologerName}
            </Link>
            <p className="text-xs text-gray-500">
              {row.astrologerId?.slice(0, 8)}
            </p>
          </div>
        ),
      },
      {
        header: "Rate / Min",
        render: (row) => `₹${row.ratePerMin || 0}`,
      },
      {
        header: "Coins Deducted",
        render: (row) => row.coinsDeducted ?? "-",
      },
      {
        header: "Coins Earned",
        render: (row) => row.coinsEarned ?? "-",
      },
      {
        header: "Commission",
        render: (row) => row.commission ?? "-",
      },
      {
        header: "Duration",
        render: (row) => {
          const sec = Number(row.durationSec || 0);

          if (sec < 60) return `${sec} sec`;

          const min = Math.floor(sec / 60);
          const remSec = sec % 60;

          return `${min}.${String(remSec).padStart(2, "0")} min`;
        },
      },
      {
        header: "Status",
        render: (row) => {
          const status = row.status || "";

          const statusStyles = {
            REQUESTED: "bg-orange-100 text-orange-700",
            ACCEPTED: "bg-blue-100 text-blue-700",
            ONGOING: "bg-purple-100 text-purple-700",
            COMPLETED: "bg-green-100 text-green-700",
            CANCELLED: "bg-red-100 text-red-700",
            FAILED: "bg-gray-200 text-gray-700",
          };

          const formattedStatus = status
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <div className="flex flex-col">
              <span
                className={`px-1 py- rounded-full text-xs font-medium ${
                  statusStyles[status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {formattedStatus}
              </span>

              {(status === "CANCELLED" || status === "REJECTED") && row.by && (
                <span className="text-[10px]  text-red-500 font-medium">
                  {row.by}
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: "Date",
        render: (row) => dayjs(row.createdAt).format("DD MMM YYYY hh:mm A"),
      },
      {
        header: "Actions",
        render: (row) => (
          <div className="flex items-center justify-center gap-2">
            {tab === "Chats" ? (
              <button
                title="View Chat"
                onClick={() => {
                  setSelectedSession(row.sessionId);
                  setOpenModal(true);
                }}
                className="flex cursor-pointer hover:scale-104 items-center justify-center text-blue-600 hover:text-blue-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height={20}
                  width={20}
                  viewBox="0 0 640 640"
                >
                  {" "}
                  <path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z" />{" "}
                </svg>
              </button>
            ) : (
              <button
                title="Call Details"
                onClick={() => handleDownloadRecording(row.sessionId)}
                className="flex cursor-pointer hover:scale-104 items-center justify-center text-orange-600 hover:text-orange-800"
              >
                <svg height={20} width={20} viewBox="0 0 640 640">
                  <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z" />
                </svg>
              </button>
            )}

                   {row.hasRemedy && (
              <button
                title="View Remedy"
                onClick={() => {
                  setSelectedSession(row.sessionId);
                  setOpenRemedyModal(true);
                }}
                className="flex hover:scale-104 cursor-pointer items-center justify-center text-green-600 hover:text-green-800"
              >
                <svg height={20} width={20} viewBox="0 0 640 640">
                  <path d="M311.6 95C297.5 75.5 274.9 64 250.9 64C209.5 64 176 97.5 176 138.9L176 141.3C176 205.7 258 274.7 298.2 304.6C311.2 314.3 328.7 314.3 341.7 304.6C381.9 274.6 463.9 205.7 463.9 141.3L463.9 138.9C463.9 97.5 430.4 64 389 64C365 64 342.4 75.5 328.3 95L320 106.7L311.6 95zM141.3 405.5L98.7 448L64 448C46.3 448 32 462.3 32 480L32 544C32 561.7 46.3 576 64 576L384.5 576C413.5 576 441.8 566.7 465.2 549.5L591.8 456.2C609.6 443.1 613.4 418.1 600.3 400.3C587.2 382.5 562.2 378.7 544.4 391.8L424.6 480L312 480C298.7 480 288 469.3 288 456C288 442.7 298.7 432 312 432L384 432C401.7 432 416 417.7 416 400C416 382.3 401.7 368 384 368L231.8 368C197.9 368 165.3 381.5 141.3 405.5z" />
                </svg>
              </button>
            )}
          </div>
        ),
      },
    ],
    [tab, setSelectedSession, setOpenModal, setOpenRemedyModal],
  );

  const { data: reviewData } = useQuery(GET_USER_REVIEWS, {
    variables: {
      searchInput: {
        userId,
        page: reviewPage,
        limit: LIMIT,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const reviews = reviewData?.getUserReviews?.data || [];

  const user = data?.getUserProfile;
  if (loading) {
    return <div className="p-10">Loading User Profile...</div>;
  }

  if (error) {
    console.log(error);

    return <div className="p-10 text-red-500">{error.message}</div>;
  }

  const statCards = [
    {
      title: "Wallet",
      value: `₹${user?.stats?.walletBalance || 0}`,
    },
    {
      title: "Recharge",
      value: `₹${user?.stats?.totalRecharge || 0}`,
    },
    {
      title: "Calls",
      value: user?.stats?.totalCalls || 0,
    },
    {
      title: "Chats",
      value: user?.stats?.totalChats || 0,
    },
    {
      title: "Reviews",
      value: user?.stats?.totalReviews || 0,
    },
  ];

  const walletColumns = [
    {
      header: "Transaction ID",
      render: (row) => row.id?.slice(0, 8),
    },

    {
      header: "Type",
      render: (row) => (
        <span
          className={`px-3 py- rounded-full text-xs  ${
            row.type === "CREDIT"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.type}
        </span>
      ),
    },

    {
      header: "Coins",
      render: (row) => row.coins,
    },

    {
      header: "Amount",
      render: (row) => `₹ ${row.amount || 0}`,
    },

    {
      header: "Description",
      render: (row) => (
        <div className="max-w-[250px] truncate">{row.description || "-"}</div>
      ),
    },

    {
      header: "Date",
      render: (row) => dayjs(row.createdAt).format("DD MMM YYYY hh:mm A"),
    },
  ];

  const rechargeColumns = [
    {
      header: "Pack",
      render: (row) => row.rechargePack?.name || "-",
    },
    {
      header: "Amount",
      render: (row) => `₹${row.amount ?? 0}`,
    },
    {
      header: "Coins",
      render: (row) => row.coins,
    },
    {
      header: "Talktime",
      render: (row) => row.rechargePack?.talktime ?? "-",
    },
    {
      header: "Validity",
      render: (row) =>
        row.rechargePack?.validityDays
          ? `${row.rechargePack.validityDays} Days`
          : "-",
    },
    {
      header: "Date",
      render: (row) => dayjs(row.createdAt).format("DD MMM YYYY hh:mm A"),
    },
  ];
  const reviewColumns = [
    {
      header: "Review ID",
      render: (row) => row.reviewId.slice(0, 8),
    },
    {
      header: "Session ID",
      render: (row) => row.sessionId?.slice(0, 8) || "-",
    },

    {
      header: "Astrologer",
      render: (row) => (
        <div>
          <Link
            href={`/Admindash/astrologer/astroprofile/${row.astrologerId}`}
            className="font-semibold text-violet-600"
          >
            {row.displayName}
          </Link>
        </div>
      ),
    },
    {
      header: "Rating",
      render: (row) => `⭐ ${row.rating}`,
    },
    {
      header: "Comment",
      render: (row) => (
        <div className="max-w-[250px] truncate">{row.comment || "-"}</div>
      ),
    },
    {
      header: "Date",
      render: (row) => dayjs(row.createdAt).format("DD MMM YYYY hh:mm A"),
    },
    {
      header: "Action",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            title="View Chat"
            onClick={() => {
              setSelectedSession(row.sessionId);
              setOpenModal(true);
            }}
            className="flex cursor-pointer hover:scale-104 items-center justify-center text-blue-600 hover:text-blue-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height={20}
              width={20}
              viewBox="0 0 640 640"
            >
              {" "}
              <path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z" />{" "}
            </svg>
          </button>
        </div>
      ),
    },
  ];
  const maskMobile = (countryCode, mobile) => {
    if (!mobile) return "N/A";

    const last4 = mobile.slice(-4);

    return `${countryCode || ""} ${"*".repeat(
      Math.max(0, mobile.length - 4),
    )}${last4}`;
  };

  return (
    <div className="p- space-y-4">
      {/* Header */}

      <div className=" rounded-2xl flex items-center justify-between border border-gray-300 bg-purple-300 shadow-sm p-4">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center">
            <FaUser size={26} className="text-violet-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">{user?.name || "N/A"}</h1>

            <p className="text-gray-800 text-sm">#{user?.id}</p>

         
          </div>
        </div>
        <CustomButton
          className="px-3 bg-[#2f1254] rounded-full shadow-xl text-yellow-500 py-1"
          onClick={openWallet}
        >
          Manage Wallet
        </CustomButton>

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
                  className="  px-3 py-2 text-sm w-full"
                  onChange={(e) => setPrice(e.target.value)}
                />

                <textarea
                  className="px-3"
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Remarks w-full boredr border-gray-300 rounded-xl"
                ></textarea>
              </div>

              <div className="flex justify-center gap-3">
                <CustomButton
                  variant="green"
                  loading={manageWalletLoading}
                  onClick={() => Manageprice("add")}
                  className="px-3 py-1 "
                >
                  Add Gems
                </CustomButton>

                <CustomButton
                  variant="red"
                  loading={manageWalletLoading}
                  onClick={() => Manageprice("deduct")}
                  className="px-3 py-1 "
                >
                  Deduct Gems
                </CustomButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-5">
        <StatCard
          title="Wallet Balance"
          value={`₹${user?.stats?.walletBalance || 0}`}
          icon={<FaWallet />}
          color="border-green-200 bg-green-50 text-green-700"
        />

        <StatCard
          title="Total Recharge"
          value={`₹${user?.stats?.totalRecharge || 0}`}
          icon={<FaCoins />}
          color="border-yellow-200 bg-yellow-50 text-yellow-700"
        />

        <StatCard
          title="Total Chats"
          value={user?.stats?.totalChats || 0}
          icon={<FaComments />}
          color="border-blue-200 bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Total Calls"
          value={user?.stats?.totalCalls || 0}
          icon={<FaPhone />}
          color="border-purple-200 bg-purple-50 text-purple-700"
        />
      </div>
      {/* Details */}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-lg mb-4">Personal Information</h2>

          <div className="grid grid-cols-3 gap-5">
            <Info label="Name" value={user?.name} />

            <Info
              label="Mobile"
              value={maskMobile(user?.countryCode, user?.mobile)}
            />

            <Info label="Gender" value={user?.gender} />

            <Info label="Occupation" value={user?.occupation} />

            <Info
              label="Birth Date"
              value={
                user?.birthDate
                  ? dayjs(user.birthDate).format("DD MMM YYYY")
                  : "N/A"
              }
            />

            <Info label="Birth Time" value={user?.birthTime} />
          </div>
          <div className="bg-purple-200 rounded-2xl border-gray-300 mt-5 py-3 px-5">
            <h2 className="font-semibold text-lg mb-2">Account Summary</h2>

            <div className="space-y-1 grid grid-cols-3 gap-1">
              <Info
                label="Joined"
                value={
                  user?.createdAt
                    ? dayjs(user.createdAt).format("DD MMM YYYY")
                    : "N/A"
                }
              />

              <Info label="Source" value={`${user?.source || 0}`} />

              <Info
                label="Last Recharge"
                value={`₹${user?.stats?.lastRechargeAmount || 0}`}
              />

              <Info
                label="Last Recharge Date"
                value={
                  user?.stats?.lastRechargeDate
                    ? dayjs(user.stats.lastRechargeDate).format(
                        "DD MMM YYYY hh:mm A",
                      )
                    : "N/A"
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}

      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex gap-3 flex-wrap">
          {statCards.map((item) => (
            <button
              key={item.title}
              onClick={() => setTab(item.title)}
              className={`px-4 text-sm py-1 rounded-full ${
                tab === item.title ? "bg-violet-600 text-white" : "bg-gray-200"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "Wallet" && <WalletTab userId={userId} />}

          {tab === "Recharge" && <RechargeTab userId={userId} />}
             {tab === "Chats" && (
            <>
              {chatLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                <DataTable columns={historyColumns} data={chats} />
                <Pagination
  page={chatData?.getUsersChatHistory?.currentPage || chatPage}
  totalPages={chatData?.getUsersChatHistory?.totalPages || 1}
  onPrevious={() => setChatPage((p) => Math.max(1, p - 1))}
  onNext={() => setChatPage((p) => p + 1)}
/>
                      </>
              )}
            </>
          )}

          {tab === "Calls" && (
            <>
              {callLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                <DataTable columns={historyColumns} data={calls} />
                <Pagination
  page={callData?.getUserCallHistory?.currentPage || callPage}
  totalPages={callData?.getUserCallHistory?.totalPages || 1}
  onPrevious={() => setCallPage((p) => Math.max(1, p - 1))}
  onNext={() => setCallPage((p) => p + 1)}
/>
                      </>
              )}
            </>
          )}
          {tab === "Reviews" && (
            <ReviewTab
              userId={userId}
              setOpenModal={setOpenModal}
              setSelectedSession={setSelectedSession}
            />
          )}
        </div>
      </div>
      <SessionMessagesModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sessionId={selectedSession}
      />
      <SessionRemedyModal
        open={openRemedyModal}
        onClose={() => setOpenRemedyModal(false)}
        sessionId={selectedSession}
      />
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`rounded-2xl border p-3 shadow-sm ${color}`}>
      <div className="flex items-center justify-between">
        <p className="text-gray-500">{title}</p>

        {icon}
      </div>

      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-800">{label}</p>

      <p className=" text-sm mt-1">{value || "N/A"}</p>
    </div>
  );
}
