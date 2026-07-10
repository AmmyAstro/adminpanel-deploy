"use client";

import { gql } from "@apollo/client";
import { useApolloClient, useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";

import DataTable from "@/components/utils/DataTable";
import { GET_CALL_RECORDING, GET_USER_CALL_HISTORY } from "@/app/graphQL/astroHiring";
import Link from "next/link";
import SessionRemedyModal from "../SessionRemedyModal";

export default function UserCallHistoryPage() {
  // SEARCH STATES
  const [searchName, setSearchName] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);

  const [searchMobile, setSearchMobile] = useState("");

  const [searchAstrologerName, setSearchAstrologerName] = useState("");
  const [openRemedyModal, setOpenRemedyModal] = useState(false);
  const [searchStatus, setSearchStatus] = useState("");

  const [searchFilterType, setSearchFilterType] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);

  const limit = 10;

    const client = useApolloClient();

  const [filters, setFilters] = useState({
    query: "",
    mobile: "",
    astrologerName: "",
    status: "",
    filterType: "",
    startDate: "",
    endDate: "",
  });

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
  const { data, loading, error } = useQuery(GET_USER_CALL_HISTORY, {
    variables: {
      searchInput,
    },
    fetchPolicy: "network-only",
  });
   const handleDownloadRecording = async (sessionId) => {
      try {
        const { data } = await client.query({
          query: GET_CALL_RECORDING,
          variables: {
            sessionId,
          },
          fetchPolicy: "network-only",
        });
  
        const recording = data?.getCallRecording;
  
        if (!recording?.fileUrl) {
          alert("Recording not found");
          return;
        }
  
        const link = document.createElement("a");
        link.href = recording.fileUrl;
        link.download = recording.fileName || "call-recording.webm";
        link.target = "_blank";
  
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error(err);
        alert("Unable to download recording");
      }
    };

  const history = data?.getUserCallHistory?.data || [];

  const totalCount = data?.getUserCallHistory?.totalCount || 0;

  const totalPages = data?.getUserCallHistory?.totalPages || 1;

  const totalCoinsDeducted = data?.getUserCallHistory?.totalCoinsDeducted || 0;

  const totalCoinsEarned = data?.getUserCallHistory?.totalCoinsEarned || 0;

  const totalCommission = data?.getUserCallHistory?.totalCommission || 0;

  // STATUS COLORS
  const statusStyles = {
    REQUESTED: "bg-yellow-100 text-yellow-700",

    ACCEPTED: "bg-blue-100 text-blue-700",

    ONGOING: "bg-purple-100 text-purple-700",

    COMPLETED: "bg-green-100 text-green-700",

    CANCELLED: "bg-red-100 text-red-700",

    FAILED: "bg-gray-200 text-gray-700",
  };

  // TABLE COLUMNS
  const columns = useMemo(
    () => [
        {
        header: "Session Id",
        render: (row) => (
          <div>
            <p className="text-xs text-gray-500">{row.sessionId?.slice(0, 8)}</p>
          </div>
        ),
      },
      {
        header: "User",
        render: (row) => (
          <div>
            <Link
              href={`/Admindash/user/userprofile/${row.userId}`}
              className="font-semibold text-violet-600 hover:underline"
            >
              {row.userName}
            </Link>

            <p className="text-xs text-gray-500">{row.userId?.slice(0, 8)}</p>
            <p className="text-xs text-gray-500">{row.source}</p>
          </div>
        ),
      },

      {
        header: "Astrologer",
        render: (row) => (
          <div>
            <Link
              href={`/Admindash/astrologer/astroprofile/${row.astrologerId}`}
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
        header: "Time",
        render: (row) =>
          row.endedAt ? new Date(row.endedAt).toLocaleString() : "N/A",
      },
 {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">

     
              <button
                title="Call Details"
                onClick={() => handleDownloadRecording(row.sessionId)}
                className="flex cursor-pointer hover:scale-104 items-center justify-center text-orange-600 hover:text-orange-800"
              >
                <svg height={20} width={20} viewBox="0 0 640 640">
                  <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z" />
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
         <svg height={20} width={20} viewBox="0 0 640 640"><path d="M311.6 95C297.5 75.5 274.9 64 250.9 64C209.5 64 176 97.5 176 138.9L176 141.3C176 205.7 258 274.7 298.2 304.6C311.2 314.3 328.7 314.3 341.7 304.6C381.9 274.6 463.9 205.7 463.9 141.3L463.9 138.9C463.9 97.5 430.4 64 389 64C365 64 342.4 75.5 328.3 95L320 106.7L311.6 95zM141.3 405.5L98.7 448L64 448C46.3 448 32 462.3 32 480L32 544C32 561.7 46.3 576 64 576L384.5 576C413.5 576 441.8 566.7 465.2 549.5L591.8 456.2C609.6 443.1 613.4 418.1 600.3 400.3C587.2 382.5 562.2 378.7 544.4 391.8L424.6 480L312 480C298.7 480 288 469.3 288 456C288 442.7 298.7 432 312 432L384 432C401.7 432 416 417.7 416 400C416 382.3 401.7 368 384 368L231.8 368C197.9 368 165.3 381.5 141.3 405.5z" /></svg>
          </button>
        </div>
      ),
    },
    
    ],
    [],
  );

  if (error) {
    return <p className="p-10 text-red-500">Error loading call history</p>;
  }

  return (
    <div className="p-10 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-bold">User Call History</h1>

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
        <input
          type="text"
          placeholder="Search by user name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none"
        />

        <input
          type="text"
          placeholder="Search by mobile"
          value={searchMobile}
          onChange={(e) => setSearchMobile(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none"
        />

        <input
          type="text"
          placeholder="Search astrologer"
          value={searchAstrologerName}
          onChange={(e) => setSearchAstrologerName(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none"
        />

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

        {searchFilterType === "CUSTOM" && (
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none"
          />
        )}

        {searchFilterType === "CUSTOM" && (
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none"
          />
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">Loading Call History...</div>
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
            <SessionRemedyModal
        open={openRemedyModal}
        onClose={() => setOpenRemedyModal(false)}
        sessionId={selectedSession}
      />
    </div>
  );
}
