"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import dayjs from "dayjs";


import { GET_USER_WALLET_TRANSACTIONS } from "@/app/graphQL/astroHiring";
import Pagination from "../Pagination";
import DataTable from "@/components/utils/DataTable";

const LIMIT = 50;

export default function WalletTab({ userId }) {
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery(GET_USER_WALLET_TRANSACTIONS, {
    variables: {
      userId,
      page,
      limit: LIMIT,
    },
    fetchPolicy: "cache-first",
  });

  const walletData = data?.getUserWalletTransactions;

  const transactions = walletData?.data || [];

  const columns = useMemo(
    () => [
      {
        header: "Transaction ID",
        render: (row) => row.id?.slice(0, 8),
      },

      {
        header: "Type",
        render: (row) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium
            ${
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
        render: (row) => `₹${row.amount || 0}`,
      },

      {
        header: "Description",
        render: (row) => (
          <div className="max-w-[260px] truncate">
            {row.description || "-"}
          </div>
        ),
      },

      {
        header: "Date",
        render: (row) =>
          dayjs(row.createdAt).format("DD MMM YYYY hh:mm A"),
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="py-10 text-center">
        Loading wallet history...
      </div>
    );
  }

  return (
    <>
      <DataTable columns={columns} data={transactions} />

      <Pagination
        page={walletData?.currentPage || page}
        totalPages={walletData?.totalPages || 1}
        onPrevious={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </>
  );
}