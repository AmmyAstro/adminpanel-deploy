"use client";

import { FaWallet, FaCoins, FaComments, FaPhone } from "react-icons/fa";

import { useMemo, useState } from "react";
import {
  GET_USER_CALL_HISTORY,
  GET_USER_PROFILE,
  GET_USER_REVIEWS,
  GET_USER_WALLET_TRANSACTIONS,
  GET_USERS_CHAT_HISTORY,
  MANAGE_USER_WALLET,
} from "@/app/graphQL/astroHiring";
import { useMutation, useQuery } from "@apollo/client/react";
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

export default function UserProfile({ userId }) {
  console.log("USER ID =", userId);
  const [openModal, setOpenModal] = useState(false);
  const [openPopup, setOpenPopUp] = useState(false);
  const [price, setPrice] = useState("");
  const [remarks, setRemarks] = useState("");
  const openWallet = () => {
    setOpenPopUp(true);
  };
  const [selectedSession, setSelectedSession] = useState(null);
  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: {
      userId,
    },
    fetchPolicy: "network-only",
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
        {
          query: GET_USER_WALLET_TRANSACTIONS,
          variables: {
            userId,
            page: 1,
            limit: 50,
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
  const { data: chatData, loading: chatLoading } = useQuery(
    GET_USERS_CHAT_HISTORY,
    {
      variables: {
        searchInput: {
          userId,
          page: 1,
          limit: 50,
        },
      },
      fetchPolicy: "cache-first",
    },
  );
  const { data: callData, loading: callLoading } = useQuery(
    GET_USER_CALL_HISTORY,
    {
      variables: {
        searchInput: {
          userId,
          page: 1,
          limit: 50,
        },
      },
      fetchPolicy: "cache-first",
    },
  );
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
              href={`/Admindash/astromain/astroprofile/${row.astrologerId}`}
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
        render: (row) => row.status,
      },
      {
        header: "Date",
        render: (row) => dayjs(row.createdAt).format("DD MMM YYYY hh:mm A"),
      },
      {
        header: "Date",
        render: (row) => (
          <button
            onClick={() => {
              setSelectedSession(row.sessionId);
              setOpenModal(true);
            }}
            className="flex items-center justify-center place-self-center align-center text-blue-600 hover:text-blue-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height={20}
              width={20}
              viewBox="0 0 640 640"
            >
              <path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z" />
            </svg>
          </button>
        ),
      },
    ],
    [setSelectedSession, setOpenModal],
  );
  const { data: walletData, loading: walletLoading } = useQuery(
    GET_USER_WALLET_TRANSACTIONS,
    {
      variables: {
        userId,
        page: 1,
        limit: 50,
      },
      fetchPolicy: "cache-first",
    },
  );
  const { data: rechargeData, loading: rechargeLoading } = useQuery(
    GET_USER_WALLET_TRANSACTIONS,
    {
      variables: {
        userId,
        page: 1,
        limit: 50,
        onlyRecharge: true,
      },
      fetchPolicy: "cache-first",
    },
  );
  const userWallet = walletData?.getUserWalletTransactions?.data || [];
  const rechargeHistory = rechargeData?.getUserWalletTransactions?.data || [];
  const calls = callData?.getUserCallHistory?.data || [];

  const chats = chatData?.getUsersChatHistory?.data || [];

  const { data: reviewData, loading: reviewLoading } = useQuery(
    GET_USER_REVIEWS,
    {
      variables: {
        searchInput: {
          userId,
          page: 1,
          limit: 50,
        },
      },
      fetchPolicy: "cache-first",
    },
  );

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
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
      header: "Order ID",
      render: (row) => row.orderId || "-",
    },
    {
      header: "Astrologer",
      render: (row) => row.displayName || row.astrologerName,
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
        <button
          onClick={() => {
            // Open chat/session details
            console.log(row.sessionId);
          }}
          className="px-3 py-1 rounded bg-violet-600 text-white"
        >
          View Chat
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}

      <div className=" rounded-2xl flex items-center justify-between border border-gray-300 bg-purple-300 shadow-sm p-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-violet-100 flex items-center justify-center">
            <FaUser size={30} className="text-violet-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">{user?.name || "N/A"}</h1>

            <p className="text-gray-800">#{user?.id}</p>

            <p className="text-sm text-gray-700">
              {user?.countryCode} {user?.mobile}
            </p>
          </div>
        </div>
        <CustomButton
          variant={"gray"}
          className="px-3 py-1"
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
                  variant="green"
                  loading={manageWalletLoading}
                  onClick={() => Manageprice("add")}
                >
                  Add Gems
                </CustomButton>

                <CustomButton
                  variant="red"
                  loading={manageWalletLoading}
                  onClick={() => Manageprice("deduct")}
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
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-300 p-6">
          <h2 className="font-semibold text-lg mb-4">Personal Information</h2>

          <div className="grid grid-cols-3 gap-5">
            <Info label="Name" value={user?.name} />

            <Info
              label="Mobile"
              value={`${user?.countryCode || ""} ${user?.mobile || ""}`}
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
          <div className="bg-purple-200 rounded-2xl border-gray-300 mt-5 p-6">
            <h2 className="font-semibold text-lg mb-4">Account Summary</h2>

            <div className="space-y-4 grid grid-cols-3 gap-5">
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

      <div className="bg-white rounded-2xl border p-4">
        <div className="flex gap-3 flex-wrap">
          {statCards.map((item) => (
            <button
              key={item.title}
              onClick={() => setTab(item.title)}
              className={`px-4 py-2 rounded-xl ${
                tab === item.title ? "bg-violet-600 text-white" : "bg-gray-100"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "Wallet" && (
            <>
              {walletLoading ? (
                <p>Loading wallet history...</p>
              ) : (
                <DataTable columns={walletColumns} data={userWallet} />
              )}
            </>
          )}
          {tab === "Recharge" && (
            <>
              {rechargeLoading ? (
                <p>Loading recharge history...</p>
              ) : (
                <DataTable columns={rechargeColumns} data={rechargeHistory} />
              )}
            </>
          )}

          {tab === "Chats" && (
            <>
              {chatLoading ? (
                <p>Loading...</p>
              ) : (
                <DataTable columns={historyColumns} data={chats} />
              )}
            </>
          )}

          {tab === "Calls" && (
            <>
              {callLoading ? (
                <p>Loading...</p>
              ) : (
                <DataTable columns={historyColumns} data={calls} />
              )}
            </>
          )}
          {tab === "Reviews" && (
            <>
              {reviewLoading ? (
                <p>Loading reviews...</p>
              ) : (
                <DataTable columns={reviewColumns} data={reviews} />
              )}
            </>
          )}
        </div>
      </div>
      <SessionMessagesModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sessionId={selectedSession}
      />
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${color}`}>
      <div className="flex items-center justify-between">
        <p className="text-gray-500">{title}</p>

        {icon}
      </div>

      <h2 className="text-3xl font-bold mt-3">{value}</h2>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>

      <p className="font-semibold mt-1">{value || "N/A"}</p>
    </div>
  );
}
