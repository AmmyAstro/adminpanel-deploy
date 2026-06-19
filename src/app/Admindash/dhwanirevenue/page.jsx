"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";

import dayjs from "dayjs";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { GET_DASHBOARD_COUNTS } from "@/app/graphQL/privilageOperations";
import { GET_APPLICATIONS, GET_USER_CALL_HISTORY, GET_USERS_CHAT_HISTORY } from "@/app/graphQL/astroHiring";



const COLORS = ["#facc15", "#22c55e", "#ef4444", "#8b5cf6"];

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [filter, setFilter] = useState("MONTH");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  const { data: countData } = useQuery(GET_DASHBOARD_COUNTS);

  const { data: callData } = useQuery(GET_USER_CALL_HISTORY, {
    variables: {
      searchInput: {
        page: 1,
        limit: 1000,
      },
    },
  });

  const { data: chatData } = useQuery(GET_USERS_CHAT_HISTORY, {
    variables: {
      searchInput: {
        page: 1,
        limit: 1000,
      },
    },
  });

  const { data: appData } = useQuery(GET_APPLICATIONS);

  const stats = countData?.getDashboardCounts || {};

  const filterRecords = (records = []) => {
    const now = dayjs();

    return records.filter((item) => {
      const date = dayjs(item.createdAt);

      if (filter === "TODAY") {
        return date.isSame(now, "day");
      }

      if (filter === "WEEK") {
        return date.isAfter(dayjs().startOf("week"));
      }

      return date.isAfter(dayjs().startOf("month"));
    });
  };

  const callChartData = useMemo(() => {
    const filtered = filterRecords(callData?.getUserCallHistory?.data);

    const map = {};

    filtered.forEach((item) => {
      const key =
        filter === "TODAY"
          ? dayjs(item.createdAt).format("HH")
          : dayjs(item.createdAt).format("DD MMM");

      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([label, calls]) => ({
      label,
      calls,
    }));
  }, [callData?.getUserCallHistory?.data, filter]);

  const chatChartData = useMemo(() => {
    const filtered = filterRecords(chatData?.getUsersChatHistory?.data);

    const map = {};

    filtered.forEach((item) => {
      const key =
        filter === "TODAY"
          ? dayjs(item.createdAt).format("HH")
          : dayjs(item.createdAt).format("DD MMM");

      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([label, chats]) => ({
      label,
      chats,
    }));
  }, [chatData, filter]);

  const applicationPieData = useMemo(() => {
    const apps = appData?.getApplications || [];

    return [
      {
        name: "Pending",
        value: apps.filter((x) => x.approvalStatus === "PENDING").length,
      },
      {
        name: "Approved",
        value: apps.filter((x) => x.approvalStatus === "APPROVED").length,
      },
      {
        name: "Rejected",
        value: apps.filter((x) => x.approvalStatus === "REJECTED").length,
      },
    ];
  }, [appData]);

  const cards = [
    {
      title: "Astrologers",
      value: stats.totalAstrologers || 0,
    },
    {
      title: "Users",
      value: stats.totalUsers || 0,
    },
    {
      title: "Staff",
      value: stats.totalStaff || 0,
    },
    {
      title: "Calls",
      value: stats.totalCalls || 0,
    },
    {
      title: "Chats",
      value: stats.totalChats || 0,
    },
    {
      title: "Applications",
      value: stats.totalApplications || 0,
    },
  {
      title: "Revenue",
      value: `₹${
        stats.totalRevenue || 0
      }`,
    },
  ];

  return (
    <div className="p-6 bg-gray-300 shadow-3xl rounded-2xl min-h-screen text-white">
      <div className="bg-purple-700 rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold">
          Welcome,
          <span className="text-yellow-400 ml-2">{userName}</span>
          👋
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {cards.map((item) => (
          <div key={item.title} className="bg-purple-300 rounded-xl p-5 shadow">
            <p className="text-gray-900 text-xl font-semibold">{item.title}</p>

            <h2 className="text-3xl font-bold mt-2 text-[#2c0a4d]">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        {["TODAY", "WEEK", "MONTH"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg ${
              filter === type ? "bg-yellow-500 text-black" : "bg-[#2c0a4d]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className=" p-5 rounded-xl">
          <h2 className="font-semibold text-lg mb-4">Calls Analytics</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={callChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className=" p-5 rounded-xl">
          <h2 className="font-semibold text-lg mb-4">Chats Analytics</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chatChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="chats" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#2c0a4d] p-5 rounded-xl">
        <h2 className="font-semibold text-lg mb-4">Application Status</h2>

        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={applicationPieData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {applicationPieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
