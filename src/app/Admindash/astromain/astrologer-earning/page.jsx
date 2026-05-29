"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";

import DataTable from "@/components/utils/DataTable";

const GET_ASTROLOGER_EARNINGS = gql`
  query GetAstrologerEarnings(
    $searchInput: AstrologerEarningSearchInput!
  ) {
    getAstrologerEarnings(
      searchInput: $searchInput
    ) {
      totalCount
      currentPage
      totalPages

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

export default function AstrologerEarningsPage() {
  // SEARCH STATES
  const [searchName, setSearchName] =
    useState("");

  const [searchEmail, setSearchEmail] =
    useState("");
    const [searchContactNo, setSearchContactNo] =
    useState("");

  const [searchFilterType, setSearchFilterType] =
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
    query: "",
    email: "",
    filterType: "",
    startDate: "",
    endDate: "",
  });

  // DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);

      setFilters({
        query: searchName,
        email: searchEmail,
        contactNo: searchContactNo,
        filterType: searchFilterType,
        startDate,
        endDate,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchName,
    searchEmail,
    searchContactNo,
    searchFilterType,
    startDate,
    endDate,
  ]);

  // SEARCH INPUT
  const searchInput = {
    page,
    limit,
  };

  if (filters.query) {
    searchInput.query = filters.query;
  }

  if (filters.email) {
    searchInput.email = filters.email;
  }
   if (filters.contactNo) {
    searchInput.contactNo = filters.contactNo;
  }

  if (filters.filterType) {
    searchInput.filterType =
      filters.filterType;
  }

  if (
    filters.filterType === "CUSTOM" &&
    filters.startDate &&
    filters.endDate
  ) {
    searchInput.startDate =
      filters.startDate;

    searchInput.endDate =
      filters.endDate;
  }

  // API CALL
  const { data, loading, error } = useQuery(
    GET_ASTROLOGER_EARNINGS,
    {
      variables: {
        searchInput,
      },
      fetchPolicy: "network-only",
    }
  );

  const earnings =
    data?.getAstrologerEarnings?.data || [];

  const totalCount =
    data?.getAstrologerEarnings
      ?.totalCount || 0;

  const totalPages =
    data?.getAstrologerEarnings
      ?.totalPages || 1;

  // TABLE COLUMNS
  const columns = useMemo(
    () => [
      {
        header: "Astrologer",
        render: (row) => (
          <div>
            <p className="font-semibold">
              {row.astrologerName}
            </p>


            <p className="text-xs text-gray-400">
              {row.email}
            </p>
          </div>
        ),
      },
   {
        header: "Contact Number",
        render: (row) => (
          <span className="font-semibold text-blue-600">
            {row.contactNo || 0}
          </span>
        ),
      },
      {
        header: "Balance Coins",
        render: (row) => (
          <span className="font-semibold text-blue-600">
            {row.balanceCoins || 0}
          </span>
        ),
      },

      {
        header: "Total Earned",
        render: (row) => (
          <span className="font-semibold text-green-600">
            ₹ {row.totalEarned || 0}
          </span>
        ),
      },

      {
        header: "Withdrawn",
        render: (row) => (
          <span className="font-semibold text-red-500">
            ₹ {row.totalWithdrawn || 0}
          </span>
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
        Error loading astrologer earnings
      </p>
    );
  }

  return (
    <div className="p-10 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">
          Astrologer Earnings
        </h1>

        <div className="bg-black text-white px-4 py-2 rounded-lg w-fit">
          Total Records : {totalCount}
        </div>
      </div>

      {/* SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white p-5 rounded-xl shadow border">
        {/* NAME */}
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) =>
            setSearchName(e.target.value)
          }
          className="border rounded-lg px-4 py-2 outline-none"
        />

        {/* EMAIL */}
        <input
          type="text"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) =>
            setSearchEmail(e.target.value)
          }
          className="border rounded-lg px-4 py-2 outline-none"
        />
           <input
          type="text"
          placeholder="Search by Contact Number"
          value={searchContactNo}
          onChange={(e) =>
            setSearchContactNo(e.target.value)
          }
          className="border rounded-lg px-4 py-2 outline-none"
        />

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

          <option value="TODAY">
            Today
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
              Loading Earnings...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={earnings}
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