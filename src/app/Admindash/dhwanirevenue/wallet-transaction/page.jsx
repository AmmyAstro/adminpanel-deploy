"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";

import DataTable from "@/components/utils/DataTable";

const GET_ALL_WALLET_TRANSACTIONS = gql`
  query GetAllWalletTransactions(
    $page: Int
    $limit: Int
    $type: String
    $contactNo: String
    $amount: Float
    $filterType: String
    $source: String
    $startDate: String
    $endDate: String
  ) {
    getAllWalletTransactions(
      page: $page
      limit: $limit
      type: $type
      contactNo: $contactNo
      amount: $amount
      filterType: $filterType
      source: $source
      startDate: $startDate
      endDate: $endDate
    ) {
      totalCount

      data {
        id
        type
        coins
        amount
        description
        createdAt
        source

        userWallet {
          user {
            name
            mobile
          }
        }

        astrologerWallet {
          astrologer {
            displayName
            contactNo
          }
        }
      }
    }
  }
`;

export default function AllWalletTransactionsPage() {
  // SEARCH STATES
  const [searchPhone, setSearchPhone] =
    useState("");

  const [searchType, setSearchType] =
    useState("");

  const [searchAmount, setSearchAmount] =
    useState("");

  const [searchFilterType, setSearchFilterType] =
    useState("");

  const [searchSource, setSearchSource] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  // PAGINATION
  const [page, setPage] = useState(1);

  const limit = 10;

  // FINAL FILTERS
  const [filters, setFilters] = useState({
    contactNo: "",
    type: "",
    amount: "",
    filterType: "",
    source: "",
    startDate: "",
    endDate: "",
  });

  // DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);

      setFilters({
        contactNo: searchPhone,
        type: searchType,
        amount: searchAmount,
        filterType: searchFilterType,
        source: searchSource,
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
    searchSource,
    startDate,
    endDate,
  ]);

  // QUERY VARIABLES
  const queryVariables = {
    page,
    limit,
  };

  if (filters.contactNo) {
    queryVariables.contactNo =
      filters.contactNo;
  }

  if (filters.type) {
    queryVariables.type = filters.type;
  }

  if (filters.amount) {
    queryVariables.amount = Number(
      filters.amount
    );
  }

  if (filters.filterType) {
    queryVariables.filterType =
      filters.filterType;
  }

  if (filters.source) {
    queryVariables.source = filters.source;
  }

  if (
    filters.filterType === "CUSTOM" &&
    filters.startDate &&
    filters.endDate
  ) {
    queryVariables.startDate =
      filters.startDate;

    queryVariables.endDate =
      filters.endDate;
  }

  // API CALL
  const { data, loading, error } = useQuery(
    GET_ALL_WALLET_TRANSACTIONS,
    {
      variables: queryVariables,
      fetchPolicy: "network-only",
    }
  );

  const transactions =
    data?.getAllWalletTransactions?.data || [];

  const totalCount =
    data?.getAllWalletTransactions
      ?.totalCount || 0;

  const totalPages = Math.ceil(totalCount / limit);

  // TABLE COLUMNS
  const columns = useMemo(
    () => [
      {
        header: "Source",
        render: (row) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              row.source === "USER"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {row.source}
          </span>
        ),
      },

      {
        header: "User / Astrologer",
        render: (row) => {
          if (row.source === "USER") {
            return (
              <div>
                <p className="font-semibold">
                  {
                    row?.userWallet?.user
                      ?.name
                  }
                </p>

                <p className="text-xs text-gray-500">
                  {
                    row?.userWallet?.user
                      ?.mobile
                  }
                </p>
              </div>
            );
          }

          return (
            <div>
              <p className="font-semibold">
                {
                  row?.astrologerWallet
                    ?.astrologer?.displayName
                }
              </p>

              <p className="text-xs text-gray-500">
                {
                  row?.astrologerWallet
                    ?.astrologer
                    ?.contactNo
                }
              </p>
            </div>
          );
        },
      },

      {
        header: "Transaction ID",
     render: (row) => `${row.id?.slice(0,15)}`,
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
        accessor: "coins",
      },

      {
        header: "Amount",
        render: (row) => `₹ ${row.amount}`,
      },

      {
        header: "Description",
        render: (row) => (
          <div className="max-w-[250px] truncate">
            {row.description}
          </div>
        ),
      },

      {
        header: "Created At",
        render: (row) =>
          new Date(
            row.createdAt
          ).toLocaleString(),
      },
    ],
    []
  );

  if (error) {
    return (
      <p className="p-10 text-red-500">
        Error loading all wallet
        transactions
      </p>
    );
  }

  return (
    <div className="p-10 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">
          All Wallet Transactions
        </h1>

        <div className="bg-black text-white px-4 py-2 rounded-lg w-fit">
          Total Records : {totalCount}
        </div>
      </div>

      {/* SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 bg-white p-5 rounded-xl shadow border">
        {/* CONTACT */}
        <input
          type="text"
          placeholder="Search by contact no"
          value={searchPhone}
          onChange={(e) =>
            setSearchPhone(e.target.value)
          }
          className="border rounded-lg px-4 py-2 outline-none"
        />

        {/* TYPE */}
        <select
          value={searchType}
          onChange={(e) =>
            setSearchType(e.target.value)
          }
          className="border rounded-lg px-4 py-2 outline-none"
        >
          <option value="">
            All Types
          </option>

          <option value="CREDIT">
            CREDIT
          </option>

          <option value="DEBIT">
            DEBIT
          </option>
        </select>

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="Search by amount"
          value={searchAmount}
          onChange={(e) =>
            setSearchAmount(e.target.value)
          }
          className="border rounded-lg px-4 py-2 outline-none"
        />

        {/* SOURCE */}
        <select
          value={searchSource}
          onChange={(e) =>
            setSearchSource(e.target.value)
          }
          className="border rounded-lg px-4 py-2 outline-none"
        >
          <option value="">
            All Sources
          </option>

          <option value="USER">
            USER
          </option>

          <option value="ASTROLOGER">
            ASTROLOGER
          </option>
        </select>

        {/* DATE FILTER */}
        <select
          value={searchFilterType}
          onChange={(e) =>
            setSearchFilterType(
              e.target.value
            )
          }
          className="border rounded-lg px-4 py-2 outline-none"
        >
          <option value="">
            All Time
          </option>

          <option value="WEEK">
            Last Week
          </option>

          <option value="MONTH">
            Last Month
          </option>

          <option value="YEAR">
            Last Year
          </option>

          <option value="CUSTOM">
            Custom Date
          </option>
        </select>

        {/* START DATE */}
        {searchFilterType === "CUSTOM" && (
          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(
                e.target.value
              )
            }
            className="border rounded-lg px-4 py-2 outline-none"
          />
        )}

        {/* END DATE */}
        {searchFilterType === "CUSTOM" && (
          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(
                e.target.value
              )
            }
            className="border rounded-lg px-4 py-2 outline-none"
          />
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">
              Loading Transactions...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={transactions}
            />
          )}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between">
        <button
          disabled={page === 1}
          onClick={() =>
            setPage((prev) => prev - 1)
          }
          className={`px-4 py-2 rounded-lg ${
            page === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-black text-white"
          }`}
        >
          Previous
        </button>

        <div className="font-medium">
          Page {page} of{" "}
          {totalPages || 1}
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() =>
            setPage((prev) => prev + 1)
          }
          className={`px-4 py-2 rounded-lg ${
            page >= totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-black text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}