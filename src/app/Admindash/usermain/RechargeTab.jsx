"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import dayjs from "dayjs";



import { GET_USER_WALLET_TRANSACTIONS } from "@/app/graphQL/astroHiring";
import Pagination from "../Pagination";
import DataTable from "@/components/utils/DataTable";

const LIMIT = 50;

export default function RechargeTab({ userId }) {
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery(GET_USER_WALLET_TRANSACTIONS, {
    variables: {
      userId,
      page,
      limit: LIMIT,
      onlyRecharge: true,
    },
    fetchPolicy: "cache-first",
  });

  const rechargeData = data?.getUserWalletTransactions;

  const history = rechargeData?.data || [];

  const columns = useMemo(
    () => [
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
    ],
    []
  );

  if (loading) {
    return (
      <div className="py-10 text-center">
        Loading recharge history...
      </div>
    );
  }

  return (
    <>
      <DataTable columns={columns} data={history} />

      <Pagination
        page={rechargeData?.currentPage || page}
        totalPages={rechargeData?.totalPages || 1}
        onPrevious={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </>
  );
}