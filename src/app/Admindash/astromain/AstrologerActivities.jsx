"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import {
  GET_ASTROLOGER_CALL_HISTORY,
  GET_ASTROLOGER_CHAT_HISTORY,
  GET_ASTROLOGER_DASHBOARD_STATS,
} from "@/app/graphQL/astroHiring";

const GET_ASTROLOGER_EARNINGS = gql`
  query GetAstrologerEarnings($searchInput: AstrologerEarningSearchInput!) {
    getAstrologerEarnings(searchInput: $searchInput) {
      totalCount

      data {
        astrologerId
        astrologerName
        email
        contactNo

        balanceCoins
        totalEarned
        totalWithdrawn

        createdAt
      }
    }
  }
`;

export default function AstrologerActivities({ astrologerId }) {
  const [activeTab, setActiveTab] = useState("earnings");

  const [search, setSearch] = useState("");

  const { data: statsData } = useQuery(
  GET_ASTROLOGER_DASHBOARD_STATS,
  {
    variables: { astrologerId },
    skip: !astrologerId,
  }
);

const stats =
  statsData?.getAstrologerDashboardStats;
  const { data: chatData } = useQuery(GET_ASTROLOGER_CHAT_HISTORY, {
    variables: {
      astrologerId,
      page: 1,
      limit: 10,
    },

    skip: !astrologerId || activeTab !== "chat",
  });
  const { data: callData } = useQuery(GET_ASTROLOGER_CALL_HISTORY, {
    variables: {
      astrologerId,
      page: 1,
      limit: 10,
    },

    skip: !astrologerId || activeTab !== "call",
  });

  const chats = chatData?.getAstrologerChatHistory?.data || [];

  const calls = callData?.getAstrologerCallHistory?.data || [];

//   const earnings = data?.getAstrologerEarnings?.data || [];

  return (
    <div className="p-4 rounded-2xl flex flex-col gap-3 shadow-xl bg-white w-full">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="font-semibold text-sm">Astrologer Activities</h2>

        <div className="flex gap-2">
          <CustomButton variant={"black"} className="text-xs px-4 py-2">
            Export
          </CustomButton>

          <CustomInput
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-1 placeholder:text-xs"
          />
        </div>
      </div>

      {/* Tabs */}

      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab("earnings")}
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === "earnings"
              ? "bg-purple-500 text-white"
              : "bg-gray-100"
          }`}
        >
          Earnings
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === "chat" ? "bg-purple-500 text-white" : "bg-gray-100"
          }`}
        >
          Chat History
        </button>

        <button
          onClick={() => setActiveTab("call")}
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === "call" ? "bg-purple-500 text-white" : "bg-gray-100"
          }`}
        >
          Call History
        </button>
      </div>

      {/* Earnings */}

      {activeTab === "earnings" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-100 p-4 rounded-xl">
            <p className="text-xs">Wallet Balance</p>

            <h3 className="text-xl font-bold">₹ {stats?.walletBalance || 0}</h3>
          </div>

          <div className="bg-green-100 p-4 rounded-xl">
            <p className="text-xs">Total Earned</p>

            <h3 className="text-xl font-bold">₹ {stats?.totalEarned || 0}</h3>
          </div>

          <div className="bg-red-100 p-4 rounded-xl">
            <p className="text-xs">Withdrawn</p>

            <h3 className="text-xl font-bold">
              ₹ {stats?.totalWithdrawn || 0}
            </h3>
          </div>

          <div className="bg-blue-100 p-4 rounded-xl">
            <p className="text-xs">Total Chats</p>

            <h3 className="text-xl font-bold">{stats?.totalChats || 0}</h3>
          </div>

          <div className="bg-yellow-100 p-4 rounded-xl">
            <p className="text-xs">Total Calls</p>

            <h3 className="text-xl font-bold">{stats?.totalCalls || 0}</h3>
          </div>

          <div className="bg-pink-100 p-4 rounded-xl">
            <p className="text-xs">Rating</p>

            <h3 className="text-xl font-bold">{stats?.averageRating || 0}</h3>
          </div>
        </div>
      )}

      {/* Chat */}

      {activeTab === "chat" && (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>User</th>
              <th>Duration</th>
              <th>Rate</th>
              <th>Earned</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {chats.map((chat) => (
              <tr key={chat.sessionId}>
                <td>{chat.userName}</td>

                <td>{Math.floor(chat.durationSec / 60)} min</td>

                <td>₹ {chat.ratePerMin}</td>

                <td>₹ {chat.coinsEarned}</td>

                <td>{chat.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Call */}

      {activeTab === "call" && (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>User</th>
              <th>Duration</th>
              <th>Rate</th>
              <th>Earned</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {calls.map((call) => (
              <tr key={call.sessionId}>
                <td>{call.userName}</td>

                <td>{Math.floor(call.durationSec / 60)} min</td>

                <td>₹ {call.ratePerMin}</td>

                <td>₹ {call.coinsEarned}</td>

                <td>{call.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
