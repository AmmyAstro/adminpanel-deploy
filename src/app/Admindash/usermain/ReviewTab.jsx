"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import dayjs from "dayjs";
import Link from "next/link";

import DataTable from "@/components/utils/DataTable";
import { GET_USER_REVIEWS } from "@/app/graphQL/astroHiring";
import Pagination from "../Pagination";

const LIMIT = 50;

export default function ReviewTab({
  userId,
  setOpenModal,
  setSelectedSession,
}) {
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery(GET_USER_REVIEWS, {
    variables: {
      searchInput: {
        userId,
        page,
        limit: LIMIT,
      },
    },
    fetchPolicy: "cache-first",
  });

  const reviewData = data?.getUserReviews;

  const reviews = reviewData?.data || [];

  const columns = useMemo(
    () => [
      {
        header: "Review ID",
        render: (row) => row.reviewId?.slice(0, 8),
      },

      {
        header: "Session ID",
        render: (row) => row.sessionId?.slice(0, 8) || "-",
      },

      {
        header: "Astrologer",
        render: (row) => (
          <div>
            <Link
              href={`/Admindash/astromain/astroprofile/${row.astrologerId}`}
              className="font-semibold text-violet-600 hover:underline"
            >
              {row.displayName || row.astrologerName}
            </Link>
          </div>
        ),
      },

      {
        header: "Rating",
        render: (row) => `⭐ ${row.rating}`,
      },

      {
        header: "Comment",
        render: (row) => (
          <div className="max-w-[260px] truncate">
            {row.comment || "-"}
          </div>
        ),
      },

      {
        header: "Date",
        render: (row) =>
          dayjs(row.createdAt).format("DD MMM YYYY hh:mm A"),
      },

      {
        header: "Action",
        render: (row) => (
          <button
            title="View Chat"
            onClick={() => {
              setSelectedSession(row.sessionId);
              setOpenModal(true);
            }}
            className="text-blue-600 hover:text-blue-800 hover:scale-105 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height={20}
              width={20}
              viewBox="0 0 640 640"
            >
              <path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z" />
            </svg>
          </button>
        ),
      },
    ],
    [setOpenModal, setSelectedSession]
  );

  if (loading) {
    return (
      <div className="py-10 text-center">
        Loading reviews...
      </div>
    );
  }

  return (
    <>
      <DataTable columns={columns} data={reviews} />

      <Pagination
        page={reviewData?.currentPage || page}
        totalPages={reviewData?.totalPages || 1}
        onPrevious={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </>
  );
}