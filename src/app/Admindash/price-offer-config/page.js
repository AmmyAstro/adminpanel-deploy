"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

/* ---------------- QUERY ---------------- */

const GET_ANALYTICS = gql`
  query {
    getOfferAnalytics {
      totalUsers
      firstUsed
      secondUsed
    }
  }
`;

export default function Page() {
  const { data, loading } = useQuery(GET_ANALYTICS);

  if (loading) return <p className="p-6">Loading analytics...</p>;

  const stats = data?.getOfferAnalytics;

  const firstPercent = stats?.totalUsers
    ? ((stats.firstUsed / stats.totalUsers) * 100).toFixed(1)
    : 0;

  const secondPercent = stats?.totalUsers
    ? ((stats.secondUsed / stats.totalUsers) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-xl font-semibold">Offer Analytics</h1>

      <div className="grid md:grid-cols-3 gap-4">

        <StatCard title="Total Users" value={stats?.totalUsers} />

        <StatCard
          title="First Offer Used"
          value={stats?.firstUsed}
          extra={`${firstPercent}%`}
        />

        <StatCard
          title="Second Offer Used"
          value={stats?.secondUsed}
          extra={`${secondPercent}%`}
        />

      </div>

     
      <div className="border border-gray-300  rounded-2xl p-5">
        <h2 className="mb-4 font-medium">Usage Comparison</h2>

        <Bar label="First Offer" percent={firstPercent} color="bg-purple-500" />
        <Bar label="Second Offer" percent={secondPercent} color="bg-green-500" />
      </div>

    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value, extra }) {
  return (
    <div className="p-4 border border-gray-300  rounded-2xl shadow-xl">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-xl font-semibold">{value ?? 0}</h2>
      {extra && <p className="text-xs text-green-600">{extra}</p>}
    </div>
  );
}

function Bar({ label, percent, color }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded">
        <div
          className={`h-3 rounded ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}