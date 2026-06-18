"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";

import DataTable from "@/components/utils/DataTable";
import Link from "next/link";
import CustomToggle from "@/components/Custom/CustomToggle";
import { TOGGLE_REVIEW_FLAG } from "@/app/graphQL/astroHiring";
import { useRouter } from "next/navigation";
import SessionMessagesModal from "../../usermain/SessionModal";

const GET_USER_REVIEWS = gql`
  query GetUserReviews($searchInput: UserReviewSearchInput!) {
    getUserReviews(searchInput: $searchInput) {
      totalCount
      currentPage
      totalPages
      averageRating

      data {
        reviewId
        sessionId

        userId
        userName
        mobile

        astrologerId

        astrologerName
        displayName

        isFlagged

        sessionType

        rating
        comment

        createdAt
      }
    }
  }
`;

export default function ReviewsPage() {
  // SEARCH STATES
  const [searchName, setSearchName] = useState("");

  const [searchMobile, setSearchMobile] = useState("");

  const [searchAstrologerName, setSearchAstrologerName] = useState("");

  const [searchRating, setSearchRating] = useState("");

  const [searchSessionType, setSearchSessionType] = useState("");

  const [searchFilterType, setSearchFilterType] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");
const [openModal, setOpenModal] = useState(false);
const [selectedSession, setSelectedSession] = useState(null);
  // PAGINATION
  const [page, setPage] = useState(1);

  const limit = 10;

  // FILTERS
  const [filters, setFilters] = useState({
    query: "",
    mobile: "",
    astrologerName: "",
    rating: "",
    sessionType: "",

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
        astrologerName: searchAstrologerName,
        rating: searchRating,
        sessionType: searchSessionType,

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
    searchRating,
    searchSessionType,

    searchFilterType,
    startDate,
    endDate,
  ]);

  const [toggleReviewFlag] = useMutation(TOGGLE_REVIEW_FLAG);
  const router = useRouter();
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

  if (filters.rating) {
    searchInput.rating = Number(filters.rating);
  }

  if (filters.sessionType) {
    searchInput.sessionType = filters.sessionType;
  }

  if (filters.filterType) {
    searchInput.filterType = filters.filterType;
  }

  if (filters.filterType === "CUSTOM" && filters.startDate && filters.endDate) {
    searchInput.startDate = filters.startDate;

    searchInput.endDate = filters.endDate;
  }

  // API CALL
  const { data, loading, error } = useQuery(GET_USER_REVIEWS, {
    variables: {
      searchInput,
    },
    fetchPolicy: "network-only",
  });

  const reviews = data?.getUserReviews?.data || [];

  const totalCount = data?.getUserReviews?.totalCount || 0;

  const totalPages = data?.getUserReviews?.totalPages || 1;

  const averageRating = data?.getUserReviews?.averageRating || 0;

  // TABLE COLUMNS
  const columns = useMemo(
    () => [
      {
        header: "User",
        render: (row) => (
          <div>
            <Link
              href={`""`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {row.userName}
            </Link>

            <p className="text-xs text-gray-500">{row.userId?.slice(0, 20)}</p>
          </div>
        ),
      },

      {
        header: "Astrologer",
        render: (row) => (
          <Link
            href={`/Admindash/astromain/astroprofile/${row.astrologerId}`}
            className="font-semibold text-purple-600 hover:underline"
          >
            {row.displayName}
          </Link>
        ),
      },

      {
        header: "Session Type",
        render: (row) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              row.sessionType === "CALL"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {row.sessionType}
          </span>
        ),
      },

      {
        header: "Rating",
        render: (row) => (
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>

            <span className="font-semibold">{row.rating}</span>
          </div>
        ),
      },

      {
        header: "Comment",
        render: (row) => (
          <div className="max-w-[300px] break-words">
            {row.comment || "N/A"}
          </div>
        ),
      },
  {
  header: "Chat History",
  render: (row) =>
    row.sessionId ? (
      <button
        onClick={() => {
          setSelectedSession(row.sessionId);
          setOpenModal(true);
        }}
        className="px-3 py-1 bg-black text-white rounded-lg text-xs"
      >
        View Chat
      </button>
    ) : (
      <span className="text-gray-400">N/A</span>
    ),
},

      {
        header: "Flag",
        render: (row) => (
          <CustomToggle
            checked={row.isFlagged}
            onChange={async (val) => {
              try {
                await toggleReviewFlag({
                  variables: {
                    reviewId: row.reviewId,
                    isFlagged: val,
                  },
                });

                toast.success("Review updated");
              } catch (err) {
                toast.error("Update failed");
              }
            }}
          />
        ),
      },

      {
        header: "Created At",
        render: (row) => new Date(row.createdAt).toLocaleString(),
      },
    ],
  [toggleReviewFlag]
  );

  if (error) {
    return <p className="p-10 text-red-500">Error loading reviews</p>;
  }

  return (
    <div className="p-10 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-bold">User Reviews</h1>

        <div className="flex flex-wrap gap-3">
          <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm font-semibold">
            Average Rating : {averageRating}
          </div>

          <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Total Reviews : {totalCount}
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4 bg-white p-5 rounded-xl shadow border">
        {/* USER NAME */}
        <input
          type="text"
          placeholder="Search user"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none"
        />

        {/* MOBILE */}
        <input
          type="text"
          placeholder="Search mobile"
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

        {/* RATING */}
        <select
          value={searchRating}
          onChange={(e) => setSearchRating(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none"
        >
          <option value="">All Ratings</option>

          <option value="5">5 Star</option>

          <option value="4">4 Star</option>

          <option value="3">3 Star</option>

          <option value="2">2 Star</option>

          <option value="1">1 Star</option>
        </select>

        {/* SESSION TYPE */}
        <select
          value={searchSessionType}
          onChange={(e) => setSearchSessionType(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none"
        >
          <option value="">All Sessions</option>

          <option value="CHAT">CHAT</option>

          <option value="CALL">CALL</option>
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

      {/* TABLE */}
      <div className="overflow-x-auto">
        <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">Loading Reviews...</div>
          ) : (
            <DataTable columns={columns} data={reviews} />
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
      <SessionMessagesModal
  open={openModal}
  onClose={() => {
    setOpenModal(false);
    setSelectedSession(null);
  }}
  sessionId={selectedSession}
/>
    </div>
    
  );
}
