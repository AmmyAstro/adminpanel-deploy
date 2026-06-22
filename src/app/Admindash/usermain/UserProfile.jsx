"use client";

import { FaUser, FaWallet, FaPhone, FaCalendar, FaCoins } from "react-icons/fa";

import { useState } from "react";
import { GET_USER_PROFILE, GET_USERS_CHAT_HISTORY } from "@/app/graphQL/astroHiring";
import { useQuery } from "@apollo/client/react";
import dayjs from "dayjs";

export default function UserProfile({ userId }) {
  console.log("USER ID =", userId);

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: {
      userId,
    },
    fetchPolicy: "network-only",
  });
    const [tab, setTab] = useState("wallet");

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
    skip: tab !== "Chats",
    fetchPolicy: "network-only",
  }
);
const chats = chatData?.getUsersChatHistory?.data || [];


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
    {
      title: "Following",
      value: user?.stats?.totalFollowing || 0,
    },
    {
      title: "Bookings",
      value: user?.stats?.totalBookings || 0,
    },
    {
      title: "Recharge Count",
      value: user?.stats?.totalRechargeCount || 0,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-violet-100 flex items-center justify-center">
            <FaUser size={30} className="text-violet-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">{user?.name || "N/A"}</h1>

            <p className="text-gray-500">#{user?.id}</p>

            <p className="text-sm text-gray-500">
              {user?.countryCode} {user?.mobile}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-5">
        <StatCard
          title="Wallet Balance"
          value={`₹${user?.stats?.walletBalance || 0}`}
          icon={<FaWallet />}
        />

        <StatCard
          title="Total Recharge"
          value={`₹${user?.stats?.totalRecharge || 0}`}
          icon={<FaCoins />}
        />

        <StatCard title="Total Chats" value={user?.stats?.totalChats || 0} />

        <StatCard title="Total Calls" value={user?.stats?.totalCalls || 0} />
      </div>

      {/* Details */}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-5">
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
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Account Summary</h2>

          <div className="space-y-4">
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
          {tab === "wallet" && <div>Wallet History Table</div>}

         {tab === "Chats" && (
  <div>
    {chatLoading ? (
      <p>Loading chats...</p>
    ) : (
      chats.map((chat) => (
        <div
          key={chat.sessionId}
          className="border rounded-lg p-3 mb-2"
        >
          <p>
            <strong>Astrologer:</strong> {chat.astrologerName}
          </p>

          <p>
            <strong>Status:</strong> {chat.status}
          </p>

          <p>
            <strong>Duration:</strong> {chat.durationSec}s
          </p>
        </div>
      ))
    )}
  </div>
)}

          {tab === "call" && <div>Call History Table</div>}

          {tab === "follow" && <div>Followed Astrologers</div>}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm">
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
