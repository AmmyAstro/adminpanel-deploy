"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";

import DataTable from "@/components/utils/DataTable";
import Link from "next/link";
import { GET_USER_WALLET_TRANSACTIONS } from "@/app/graphQL/astroHiring";



export default function WalletTransactionsPage() {
  // SEARCH STATES
  const [searchPhone, setSearchPhone] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const [searchFilterType, setSearchFilterType] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [filters, setFilters] = useState({
    mobile: "",
    type: "",
    amount: "",
    filterType: "",
    startDate: "",
    endDate: "",
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);

      setFilters({
        mobile: searchPhone,
        type: searchType,
        amount: searchAmount,
        filterType: searchFilterType,
        startDate,
        endDate,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchPhone,
    searchType,
    searchAmount,
    searchFilterType,
    startDate,
    endDate,
  ]);


  const queryVariables = {
    page,
    limit,
  };

  if (filters.mobile) {
    queryVariables.mobile = filters.mobile;
  }

  if (filters.type) {
    queryVariables.type = filters.type;
  }

  if (filters.amount) {
    queryVariables.amount = Number(filters.amount);
  }

  if (filters.filterType) {
    queryVariables.filterType = filters.filterType;
  }

  if (filters.filterType === "CUSTOM" && filters.startDate && filters.endDate) {
    queryVariables.startDate = filters.startDate;
    queryVariables.endDate = filters.endDate;
  }

  // API CALL
  const { data, loading, error } = useQuery(GET_USER_WALLET_TRANSACTIONS, {
    variables: queryVariables,
    fetchPolicy: "network-only",
  });

  const transactions = data?.getUserWalletTransactions?.data || [];

  const totalCount = data?.getUserWalletTransactions?.totalCount || 0;

  const totalPages = Math.ceil(totalCount / limit);

  const columns = useMemo(
    () => [
      {
        header: "User",
        render: (row) => (
          <div>
               <Link
                  href={`/Admindash/user/userprofile/${row?.userWallet?.user?.id}`}
                  className="font-semibold text-violet-600 hover:underline"
                >
                      {row?.userWallet?.user?.name || "N/A"}
                </Link>
          

            {/* <p className="text-xs text-gray-500">
              {row?.userWallet?.user?.mobile || "N/A"}
            </p> */}
          </div>
        ),
      },

      {
        header: " ID",
        render: (row) => (
          <div className="flex flex-col gap-1">  <span
            className={`px-2 py- rounded-full text-xs font-light ${
              row.type === "CREDIT"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
           Session ID : {row.sessionId?.slice(0,8)}
          </span>
            <span
            className={`px-2 py- rounded-full text-xs font-light ${
              row.type === "CREDIT"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
           Transaction ID : {row.id?.slice(0,8)}
          </span></div>
        
        ),
      },

      {
        header: "Type",
        render: (row) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font- ${
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
        accessor: "coins",
      },

      {
        header: "Amount",
        render: (row) => `₹ ${row.amount}`,
      },

      {
        header: "Description",
        render: (row) => (
          <div className="max-w-[250px] truncate">{row.description}</div>
        ),
      },

      {
        header: "Created At",
        render: (row) => new Date(row.createdAt).toLocaleString(),
      },
    ],
    [],
  );

  if (error) {
    return (
      <p className="p-10 text-red-500">Error loading wallet transactions</p>
    );
  }

  return (
    <div className="p-10 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">User Wallet Transactions</h1>

        <div className="bg-black text-white px-4 py-2 rounded-full w-fit">
          Total Records : {totalCount}
        </div>
      </div>

      {/* SEARCH */}
      <div className="grid  grid-cols-6 gap-4 bg-white p-5 rounded-full shadow border border-purple-200">
        {/* MOBILE */}
        <input
          type="text"
          placeholder="Search by mobile"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="border border-gray-300 rounded-full px-4 py-2 outline-none"
        />

        {/* TYPE */}
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border border-gray-300 rounded-full px-4 py-2 outline-none"
        >
          <option value="">All Types</option>
          <option value="CREDIT">CREDIT</option>
          <option value="DEBIT">DEBIT</option>
        </select>

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="Search by amount"
          value={searchAmount}
          onChange={(e) => setSearchAmount(e.target.value)}
          className="border border-gray-300 rounded-full px-4 py-2 outline-none"
        />

        <select
          value={searchFilterType}
          onChange={(e) => setSearchFilterType(e.target.value)}
          className="border border-gray-300 rounded-full px-4 py-2 outline-none"
        >
          <option value="">All Time</option>

          <option value="WEEK">Last Week</option>

          <option value="MONTH">Last Month</option>

          <option value="YEAR">Last Year</option>

          <option value="CUSTOM">Custom Date</option>
        </select>
        {searchFilterType === "CUSTOM" && (
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 outline-none"
          />
        )}
        {searchFilterType === "CUSTOM" && (
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 outline-none"
          />
        )}
      </div>


      <div className="overflow-x-auto">
        <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">Loading Transactions...</div>
          ) : (
            <DataTable columns={columns} data={transactions} />
          )}
        </div>
      </div>


      <div className="flex items-center justify-center gap-4 mt-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={`px-4 py-2 rounded-lg ${
            page === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-black text-white"
          }`}
        >
                        <svg width={20} height={20} viewBox="0 0 640 640"><path d="M105.4 297.4C92.9 309.9 92.9 330.2 105.4 342.7L265.4 502.7C277.9 515.2 298.2 515.2 310.7 502.7C323.2 490.2 323.2 469.9 310.7 457.4L173.3 320L310.6 182.6C323.1 170.1 323.1 149.8 310.6 137.3C298.1 124.8 277.8 124.8 265.3 137.3L105.3 297.3zM457.4 137.4L297.4 297.4C284.9 309.9 284.9 330.2 297.4 342.7L457.4 502.7C469.9 515.2 490.2 515.2 502.7 502.7C515.2 490.2 515.2 469.9 502.7 457.4L365.3 320L502.6 182.6C515.1 170.1 515.1 149.8 502.6 137.3C490.1 124.8 469.8 124.8 457.3 137.3z"/></svg>

        </button>

        <div className="font-medium">
          Page {page} of {totalPages || 1}
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className={`px-4 py-2 rounded-lg ${
            page >= totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-black text-white"
          }`}
        >
              <svg width={20} height={20} viewBox="0 0 640 640"><path d="M535.1 342.6C547.6 330.1 547.6 309.8 535.1 297.3L375.1 137.3C362.6 124.8 342.3 124.8 329.8 137.3C317.3 149.8 317.3 170.1 329.8 182.6L467.2 320L329.9 457.4C317.4 469.9 317.4 490.2 329.9 502.7C342.4 515.2 362.7 515.2 375.2 502.7L535.2 342.7zM183.1 502.6L343.1 342.6C355.6 330.1 355.6 309.8 343.1 297.3L183.1 137.3C170.6 124.8 150.3 124.8 137.8 137.3C125.3 149.8 125.3 170.1 137.8 182.6L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7z"/></svg>

        </button>
      </div>
    </div>
  );
}
