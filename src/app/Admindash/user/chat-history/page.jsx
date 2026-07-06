"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";

import DataTable from "@/components/utils/DataTable";
import SessionMessagesModal from "../SessionModal";
import { GET_USERS_CHAT_HISTORY } from "@/app/graphQL/astroHiring";
import Link from "next/link";
import SessionRemedyModal from "../SessionRemedyModal";

export default function UserChatHistoryPage() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  // SEARCH STATES
  const [searchName, setSearchName] = useState("");

  const [searchMobile, setSearchMobile] = useState("");

  const [searchAstrologerName, setSearchAstrologerName] = useState("");
  const [openRemedyModal, setOpenRemedyModal] = useState(false);
  const [searchType, setSearchType] = useState("");

  const [searchStatus, setSearchStatus] = useState("");

  const [searchFilterType, setSearchFilterType] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

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

  // DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);

      setFilters({
        query: searchName,
        mobile: searchMobile,
        astrologerName: searchAstrologerName,
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
    searchInput.astrologerName = filters.astrologerName;
  }

  if (filters.status) {
    searchInput.status = filters.status;
  }

  if (filters.filterType) {
    searchInput.filterType = filters.filterType;
  }

  if (filters.filterType === "CUSTOM" && filters.startDate && filters.endDate) {
    searchInput.startDate = filters.startDate;

    searchInput.endDate = filters.endDate;
  }

  // API CALL
  const { data, loading, error } = useQuery(GET_USERS_CHAT_HISTORY, {
    variables: {
      searchInput,
    },
    fetchPolicy: "network-only",
  });

  const history = data?.getUsersChatHistory?.data || [];

  const totalCount = data?.getUsersChatHistory?.totalCount || 0;

  const totalPages = data?.getUsersChatHistory?.totalPages || 1;

  const totalCoinsDeducted = data?.getUsersChatHistory?.totalCoinsDeducted || 0;

  const totalCoinsEarned = data?.getUsersChatHistory?.totalCoinsEarned || 0;

  const totalCommission = data?.getUsersChatHistory?.totalCommission || 0;

  // TABLE COLUMNS
  const columns = useMemo(
    () => [
      {
        header: "SessionID",
        render: (row) => (
          <span className="font-extralight text-blue-600">
            {row.sessionId?.slice(0, 8)}
          </span>
        ),
      },
      {
        header: "User",
        render: (row) => (
          <div>
            <Link
              href={`/Admindash/usermain/userprofile/${row.userId}`}
              className="font-semibold text-violet-600 hover:underline"
            >
              {row.userName}
            </Link>

            <p className="text-xs text-gray-500">{row.userId?.slice(0, 8)}</p>
            <p className="text-[10px] font-bold text-purple-600">
              {row.source}
            </p>
          </div>
        ),
      },

      {
        header: "Astrologer",
        render: (row) => (
          <div>
            <Link
              href={`/Admindash/astromain/astroprofile/${row.astrologerId}`}
              className="font-semibold text-violet-600 hover:underline"
            >
              {row.astrologerName}
            </Link>

            <p className="text-xs text-gray-500">
              {row.astrologerId?.slice(0, 8)}
            </p>
          </div>
        ),
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
        header: "Amount Deducted",
        render: (row) => (
          <span className="font-semibold text-red-500">
            {row.coinsDeducted}
          </span>
        ),
      },
      {
        header: "Status",
        render: (row) => {
          const status = row.status || "";

          const statusStyles = {
            REQUESTED: "bg-orange-100 text-orange-700",
            ACCEPTED: "bg-blue-100 text-blue-700",
            ONGOING: "bg-purple-100 text-purple-700",
            COMPLETED: "bg-green-100 text-green-700",
            CANCELLED: "bg-red-100 text-red-700",
            FAILED: "bg-gray-200 text-gray-700",
          };

          const formattedStatus = status
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <div className="flex flex-col">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusStyles[status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {formattedStatus}
              </span>

              {(status === "CANCELLED" || status === "REJECTED") && row.by && (
                <span className="text-[10px] mt-1 text-red-500 font-medium">
                  {row.by}
                </span>
              )}
            </div>
          );
        },
      },

      {
        header: "Duration",
        render: (row) => {
          const sec = Number(row.durationSec || 0);

          if (sec < 60) {
            return <span>{sec} sec</span>;
          }

          const minutes = Math.floor(sec / 60);
          const seconds = sec % 60;

          return (
            <span>
              {minutes}.{String(seconds).padStart(2, "0")} min
            </span>
          );
        },
      },

      {
        header: "Created Date",
        render: (row) => (
          <div className="text-xs">
            {new Date(row.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "Asia/Kolkata",
            })}
            <p className="text-xs text-gray-500">
              {new Date(row.createdAt).toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ),
      },
      {
        header: "Actions",
        render: (row) => (
          <div className="flex items-center justify-center gap-2">
            <button
              title="View Chat"
              onClick={() => {
                setSelectedSession(row.sessionId);
                setOpenModal(true);
              }}
              className="flex cursor-pointer hover:scale-104 items-center justify-center text-blue-600 hover:text-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={20}
                width={20}
                viewBox="0 0 640 640"
              >
                {" "}
                <path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z" />{" "}
              </svg>
            </button>

            <button
              title="View Remedy"
              onClick={() => {
                setSelectedSession(row.sessionId);
                setOpenRemedyModal(true);
              }}
              className="flex hover:scale-104 cursor-pointer items-center justify-center text-green-600 hover:text-green-800"
            >
              <svg height={20} width={20} viewBox="0 0 640 640">
                <path d="M311.6 95C297.5 75.5 274.9 64 250.9 64C209.5 64 176 97.5 176 138.9L176 141.3C176 205.7 258 274.7 298.2 304.6C311.2 314.3 328.7 314.3 341.7 304.6C381.9 274.6 463.9 205.7 463.9 141.3L463.9 138.9C463.9 97.5 430.4 64 389 64C365 64 342.4 75.5 328.3 95L320 106.7L311.6 95zM141.3 405.5L98.7 448L64 448C46.3 448 32 462.3 32 480L32 544C32 561.7 46.3 576 64 576L384.5 576C413.5 576 441.8 566.7 465.2 549.5L591.8 456.2C609.6 443.1 613.4 418.1 600.3 400.3C587.2 382.5 562.2 378.7 544.4 391.8L424.6 480L312 480C298.7 480 288 469.3 288 456C288 442.7 298.7 432 312 432L384 432C401.7 432 416 417.7 416 400C416 382.3 401.7 368 384 368L231.8 368C197.9 368 165.3 381.5 141.3 405.5z" />
              </svg>
            </button>
          </div>
        ),
      },
    ],
    [setSelectedSession, setOpenModal],
  );

  if (error) {
    return <p className="p-10 text-red-500">Error loading chat history</p>;
  }

  return (
    <div className="p-10 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-bold">Users Chat History</h1>

        <div className="flex flex-wrap gap-3">
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold">
            Coins Deducted : {totalCoinsDeducted}
          </div>

          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
            Coins Earned : {totalCoinsEarned}
          </div>

          <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg text-sm font-semibold">
            Commission : {totalCommission}
          </div>

          <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Total Records : {totalCount}
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 bg-white p-5 rounded-xl shadow border">
        {/* USER NAME */}
        <input
          type="text"
          placeholder="Search by user name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none"
        />

        {/* MOBILE */}
        <input
          type="text"
          placeholder="Search by mobile"
          value={searchMobile}
          onChange={(e) => setSearchMobile(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none"
        />

        {/* ASTROLOGER */}
        <input
          type="text"
          placeholder="Search astrologer"
          value={searchAstrologerName}
          onChange={(e) => setSearchAstrologerName(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none"
        />

        {/* STATUS */}
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none"
        >
          <option value="">All Status</option>

          <option value="REQUESTED">REQUESTED</option>

          <option value="ACCEPTED">ACCEPTED</option>

          <option value="ONGOING">ONGOING</option>

          <option value="COMPLETED">COMPLETED</option>

          <option value="CANCELLED">CANCELLED</option>

          <option value="FAILED">FAILED</option>
        </select>

        {/* DATE FILTER */}
        <select
          value={searchFilterType}
          onChange={(e) => setSearchFilterType(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none"
        >
          <option value="">All Time</option>

          <option value="TODAY">Today</option>

          <option value="WEEK">Last Week</option>

          <option value="MONTH">Last Month</option>

          <option value="YEAR">Last Year</option>

          <option value="CUSTOM">Custom Date</option>
        </select>

        {/* START DATE */}
        {searchFilterType === "CUSTOM" && (
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none"
          />
        )}

        {/* END DATE */}
        {searchFilterType === "CUSTOM" && (
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none"
          />
        )}
      </div>

      <SessionMessagesModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sessionId={selectedSession}
      />
      <SessionRemedyModal
        open={openRemedyModal}
        onClose={() => setOpenRemedyModal(false)}
        sessionId={selectedSession}
      />

      {/* TABLE */}
      <div className="overflow-x-auto">
        <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">Loading Chat History...</div>
          ) : (
            <DataTable columns={columns} data={history} />
          )}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={`px-4 py-2 rounded-lg ${
            page === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-black text-white"
          }`}
        >
          Previous
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
          Next
        </button>
      </div>
    </div>
  );
}
