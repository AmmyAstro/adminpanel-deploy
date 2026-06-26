"use client";

import { useMemo, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

import CustomButton from "@/components/Custom/CustomButtom";
import CustomInput from "@/components/Custom/CustomInput";
import {
  GET_ASTROLOGER_CALL_HISTORY,
  GET_ASTROLOGER_CHAT_HISTORY,
  GET_ASTROLOGER_DASHBOARD_STATS,
  GET_ASTROLOGER_FOLLOWERS,
} from "@/app/graphQL/astroHiring";
import DataTable from "@/components/utils/DataTable";
import dayjs from "dayjs";
import SessionMessagesModal from "../usermain/SessionModal";
import Link from "next/link";

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
const [openModal, setOpenModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
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
  const { data: chatData, loading: chatLoading  } = useQuery(GET_ASTROLOGER_CHAT_HISTORY, {
    variables: {
      astrologerId,
      page: 1,
      limit: 10,
    },

    skip: !astrologerId || activeTab !== "chat",
  });
  const { data: callData, loading: callLoading  } = useQuery(GET_ASTROLOGER_CALL_HISTORY, {
    variables: {
      astrologerId,
      page: 1,
      limit: 10,
    },

    skip: !astrologerId || activeTab !== "call",
  });

  const chats = chatData?.getAstrologerChatHistory?.data || [];

  const calls = callData?.getAstrologerCallHistory?.data || [];

const historyColumns = [
  {
    header: "Session ID",
    render: (row) => row.sessionId?.slice(0, 8),
  },
  {
    header: "User",
    render: (row) => (
      <div>
        <p className="font-semibold text-violet-600">{row.userName}</p>
        <p className="text-xs text-gray-500">
          {row.userId?.slice(0, 8)}
        </p>
      </div>
    ),
  },
  {
    header: "Rate / Min",
    render: (row) => `₹${row.ratePerMin || 0}`,
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
      const rem = sec % 60;

      return `${min}.${String(rem).padStart(2, "0")} min`;
    },
  },
  {
    header: "Status",
    render: (row) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === "COMPLETED"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {row.status?.charAt(0)}
      </span>
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
];

const {
  data: followersData,
  loading: followersLoading,
} = useQuery(GET_ASTROLOGER_FOLLOWERS, {
  variables: {
    astrologerId,
    page: 1,
    limit: 50,
  },
  skip: !astrologerId || activeTab !== "followers",
});

const followers =
  followersData?.getAstrologerFollowers?.data || [];
  const followerColumns = useMemo(
  () => [
    {
      header: "User",
      render: (row) => (
        <div className="flex flex-col">
          <Link
            href={`/Admindash/usermain/userprofile/${row.user.id}`}
            className="font-semibold text-violet-600 hover:underline"
          >
            {row.user.name || "N/A"}
          </Link>

          <span className="text-xs text-gray-500">
            {row.user.id.slice(0, 8)}
          </span>
        </div>
      ),
    },

    {
      header: "Mobile",
      render: (row) => row.user.mobile || "-",
    },

    {
      header: "Followed On",
      render: (row) => (
        <div className="text-xs">
          {dayjs(row.createdAt).format("DD MMM YYYY")}
          <p className="text-gray-500">
            {dayjs(row.createdAt).format("hh:mm A")}
          </p>
        </div>
      ),
    },

    {
      header: "Action",
      render: (row) => (
        <Link
          href={`/Admindash/usermain/userprofile/${row.user.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs"
        >
          View User
        </Link>
      ),
    },
  ],
  []
);

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
          Insights
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
              <button
          onClick={() => setActiveTab("followers")}
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === "followers" ? "bg-purple-500 text-white" : "bg-gray-100"
          }`}
        >
          Followers
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
<h3 className="text-xl font-bold">
  {Number(stats?.averageRating || 0).toFixed(1)}
</h3>
          </div>
        </div>
      )}

      {/* Chat */}

 {activeTab === "chat" && (
  chatLoading ? (
    <p>Loading chat history...</p>
  ) : (
    <DataTable
      columns={historyColumns}
      data={chats}
    />
  )
)}

      {/* Call */}

  {activeTab === "call" && (
  callLoading ? (
    <p>Loading call history...</p>
  ) : (
    <DataTable
      columns={historyColumns}
      data={calls}
    />
  )
)}

 {activeTab === "followers" && (
  followersLoading ? (
    <p>Loading followers...</p>
  ) : (
    <DataTable
      columns={followerColumns}
      data={followers}
    />
  )
)}


 <SessionMessagesModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sessionId={selectedSession}
      />
    </div>
  );
}
