"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";

import DataTable from "@/components/utils/DataTable";

const GET_USER_CALL_HISTORY = gql`
  query GetUserCallHistory(
    $searchInput: UserCallHistorySearchInput!
  ) {
    getUserCallHistory(
      searchInput: $searchInput
    ) {
      totalCount
      currentPage
      totalPages

      totalCoinsDeducted
      totalCoinsEarned
      totalCommission

      data {
        sessionId

        userId
        userName
        mobile

        astrologerId
        astrologerName

        type
        status

        ratePerMin
        durationSec

        coinsDeducted
        coinsEarned
        commission

        startedAt
        endedAt
        createdAt
      }
    }
  }
`;

export default function UserCallHistoryPage() {
  // SEARCH STATES
  const [searchName, setSearchName] =
    useState("");

  const [searchMobile, setSearchMobile] =
    useState("");

  const [
    searchAstrologerName,
    setSearchAstrologerName,
  ] = useState("");

  const [searchStatus, setSearchStatus] =
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

  // FILTERS
  const [filters, setFilters] = useState({
    query: "",
    mobile: "",
    astrologerName: "",
    status: "",
    filterType: "",
    startDate: "",
    endDate: "",
  });

  // DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);

      setFilters({
        query: searchName,
        mobile: searchMobile,
        astrologerName:
          searchAstrologerName,
        status: searchStatus,
        filterType: searchFilterType,
        startDate,
        endDate,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchName,
    searchMobile,
    searchAstrologerName,
    searchStatus,
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

  if (filters.mobile) {
    searchInput.mobile = filters.mobile;
  }

  if (filters.astrologerName) {
    searchInput.astrologerName =
      filters.astrologerName;
  }

  if (filters.status) {
    searchInput.status = filters.status;
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
    GET_USER_CALL_HISTORY,
    {
      variables: {
        searchInput,
      },
      fetchPolicy: "network-only",
    }
  );

  const history =
    data?.getUserCallHistory?.data || [];

  const totalCount =
    data?.getUserCallHistory
      ?.totalCount || 0;

  const totalPages =
    data?.getUserCallHistory
      ?.totalPages || 1;

  const totalCoinsDeducted =
    data?.getUserCallHistory
      ?.totalCoinsDeducted || 0;

  const totalCoinsEarned =
    data?.getUserCallHistory
      ?.totalCoinsEarned || 0;

  const totalCommission =
    data?.getUserCallHistory
      ?.totalCommission || 0;

  // STATUS COLORS
  const statusStyles = {
    REQUESTED:
      "bg-yellow-100 text-yellow-700",

    ACCEPTED:
      "bg-blue-100 text-blue-700",

    ONGOING:
      "bg-purple-100 text-purple-700",

    COMPLETED:
      "bg-green-100 text-green-700",

    CANCELLED:
      "bg-red-100 text-red-700",

    FAILED:
      "bg-gray-200 text-gray-700",
  };

  // TABLE COLUMNS
  const columns = useMemo(
    () => [
      {
        header: "User",
        render: (row) => (
          <div>
            <p className="font-semibold">
              {row.userName}
            </p>

            <p className="text-xs text-gray-500">
              {row.mobile}
            </p>
          </div>
        ),
      },

      {
        header: "Astrologer",
        accessor: "astrologerName",
      },

      {
        header: "Rate / Min",
        render: (row) => (
          <span className="font-semibold text-blue-600">
            ₹ {row.ratePerMin}
          </span>
        ),
      },

      {
        header: "Duration",
        render: (row) => {
          const mins = Math.floor(
            row.durationSec / 60
          );

          const secs =
            row.durationSec % 60;

          return (
            <span>
              {mins}m {secs}s
            </span>
          );
        },
      },

      {
        header: "Coins Deducted",
        render: (row) => (
          <span className="font-semibold text-red-500">
            {row.coinsDeducted}
          </span>
        ),
      },

      {
        header: "Coins Earned",
        render: (row) => (
          <span className="font-semibold text-green-600">
            {row.coinsEarned}
          </span>
        ),
      },

      {
        header: "Commission",
        render: (row) => (
          <span className="font-semibold text-orange-500">
            {row.commission}
          </span>
        ),
      },

      {
        header: "Status",
        render: (row) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              statusStyles[row.status] ||
              "bg-gray-100 text-gray-700"
            }`}
          >
            {row.status}
          </span>
        ),
      },

      {
        header: "Started At",
        render: (row) =>
          row.startedAt
            ? new Date(
                row.startedAt
              ).toLocaleString()
            : "N/A",
      },

      {
        header: "Ended At",
        render: (row) =>
          row.endedAt
            ? new Date(
                row.endedAt
              ).toLocaleString()
            : "N/A",
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
        Error loading call history
      </p>
    );
  }

  return (
    <div className="p-10 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-bold">
          User Call History
        </h1>

        <div className="flex flex-wrap gap-3">
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold">
            Coins Deducted :
            {" "}
            {totalCoinsDeducted}
          </div>

          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
            Coins Earned :
            {" "}
            {totalCoinsEarned}
          </div>

          <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg text-sm font-semibold">
            Commission :
            {" "}
            {totalCommission}
          </div>

          <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Total Records :
            {" "}
            {totalCount}
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 bg-white p-5 rounded-xl shadow border">
        <input
          type="text"
          placeholder="Search by user name"
          value={searchName}
          onChange={(e) =>
            setSearchName(e.target.value)
          }
          className="border rounded-lg px-4 py-2 outline-none"
        />

        <input
          type="text"
          placeholder="Search by mobile"
          value={searchMobile}
          onChange={(e) =>
            setSearchMobile(
              e.target.value
            )
          }
          className="border rounded-lg px-4 py-2 outline-none"
        />

        <input
          type="text"
          placeholder="Search astrologer"
          value={searchAstrologerName}
          onChange={(e) =>
            setSearchAstrologerName(
              e.target.value
            )
          }
          className="border rounded-lg px-4 py-2 outline-none"
        />

        <select
          value={searchStatus}
          onChange={(e) =>
            setSearchStatus(
              e.target.value
            )
          }
          className="border rounded-lg px-4 py-2 outline-none"
        >
          <option value="">
            All Status
          </option>

          <option value="REQUESTED">
            REQUESTED
          </option>

          <option value="ACCEPTED">
            ACCEPTED
          </option>

          <option value="ONGOING">
            ONGOING
          </option>

          <option value="COMPLETED">
            COMPLETED
          </option>

          <option value="CANCELLED">
            CANCELLED
          </option>

          <option value="FAILED">
            FAILED
          </option>
        </select>

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
              Loading Call History...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={history}
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