"use client";

import { FaWallet, FaCoins, FaComments, FaPhone } from "react-icons/fa";

import { useState } from "react";
import {
  GET_USER_CALL_HISTORY,
  GET_USER_PROFILE,
  GET_USER_REVIEWS,
  GET_USER_WALLET_TRANSACTIONS,
  GET_USERS_CHAT_HISTORY,
  UPDATE_USER_STATUS,
} from "@/app/graphQL/astroHiring";
import { useMutation, useQuery } from "@apollo/client/react";
import dayjs from "dayjs";
import { FaUser } from "react-icons/fa6";
import CustomToggle from "@/components/Custom/CustomToggle";
import DataTable from "@/components/utils/DataTable";
import Link from "next/link";

export default function UserProfile({ userId }) {
  console.log("USER ID =", userId);

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: {
      userId,
    },
    fetchPolicy: "network-only",
  });
  const [tab, setTab] = useState("Wallet");

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
  }
);
  const userWallet = walletData?.getUserWalletTransactions?.data || [];
const rechargeHistory =
  rechargeData?.getUserWalletTransactions?.data || [];
    const calls = callData?.getUserCallHistory?.data || [];

  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS, {
    refetchQueries: [
      {
        query: GET_USER_PROFILE,
        variables: { userId },
      },
    ],
  });
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
  }
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
  const historyColumns = [
    {
      header: "Session ID",
      render: (row) => row.sessionId?.slice(0, 8),
    },
    {
      header: "Astrologer",
      render: (row) => (
        <div>
          <Link href={`/Admindash/astromain/astroprofile/${row.astrologerId}`} className="font-semibold text-violet-600">{row.astrologerName}</Link>
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
    render: (row) =>
      dayjs(row.createdAt).format("DD MMM YYYY hh:mm A"),
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
      <div className="max-w-[250px] truncate">
        {row.comment || "-"}
      </div>
    ),
  },
  {
    header: "Date",
    render: (row) =>
      dayjs(row.createdAt).format("DD MMM YYYY hh:mm A"),
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
        <div className="bg-white rounded-2xl border border-gray-300 p-4">
          <div className="flex gap-3 items-center justify-center py-2">
            {" "}
            <h2 className="font-semibold text-lg ">Account Status</h2>{" "}
            <div className="">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">User Status</p>
            </div>

            <CustomToggle
              checked={user?.isActive}
              onChange={async (value) => {
                try {
                  await updateUserStatus({
                    variables: {
                      userId: user.id,
                      isActive: value,
                    },
                  });
                } catch (err) {
                  console.error(err);
                }
              }}
            />
          </div>
        </div>
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

              <Info
                label="Wallet Balance"
                value={`₹${user?.stats?.walletBalance || 0}`}
              />

              <Info
                label="Total Recharge"
                value={`₹${user?.stats?.totalRecharge || 0}`}
              />

              <Info
                label="Recharge Count"
                value={user?.stats?.totalRechargeCount || 0}
              />

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
      <DataTable
        columns={rechargeColumns}
        data={rechargeHistory}
      />
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
