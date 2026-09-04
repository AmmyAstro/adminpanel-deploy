"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import DataTable from "@/components/utils/DataTable";



import { APPROVE_REFUND_REQUEST,  GET_REFUND_REQUESTS, REJECT_REFUND_REQUEST } from "@/app/graphQL/astroHiring";
import RejectRefundModal from "../../user/RejectRefundModal";

export default function RefundList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");

  const [selectedRefund, setSelectedRefund] = useState(null);
  const [openRejectModal, setOpenRejectModal] = useState(false);

  // --------------------------------
  // GET REFUND LIST
  // --------------------------------

  const { data, loading, error, refetch } = useQuery(
   GET_REFUND_REQUESTS,
    {
      variables: {
        page,
        limit,
        status: status || null,
      },
      fetchPolicy: "network-only",
    }
  );

  // --------------------------------
  // APPROVE
  // --------------------------------

  const [approveRefund, { loading: approving }] = useMutation(
    APPROVE_REFUND_REQUEST
  );

  // --------------------------------
  // REJECT
  // --------------------------------

  const [rejectRefund, { loading: rejecting }] = useMutation(
    REJECT_REFUND_REQUEST
  );

  const refundList =
    data?.getRefundRequests?.data || [];

  const totalCount =
    data?.getRefundRequests?.totalCount || 0;

  const totalPages =
    data?.getRefundRequests?.totalPages || 1;

  // --------------------------------
  // APPROVE HANDLER
  // --------------------------------

  const handleApprove = async (row) => {
    const confirmed = window.confirm(
      `Are you sure you want to approve ₹${row.refundAmount} refund?`
    );

    if (!confirmed) return;

    try {
      await approveRefund({
        variables: {
          id: row.id,
        },
      });

      await refetch();
    } catch (error) {
      console.error("Approve refund error:", error);

      alert(
        error?.message ||
          "Failed to approve refund request."
      );
    }
  };

  // --------------------------------
  // OPEN REJECT MODAL
  // --------------------------------

  const handleRejectClick = (row) => {
    setSelectedRefund(row);
    setOpenRejectModal(true);
  };

  // --------------------------------
  // REJECT HANDLER
  // --------------------------------

  const handleReject = async (reason) => {
    if (!selectedRefund?.id) return;

    try {
      await rejectRefund({
        variables: {
          id: selectedRefund.id,
          reason,
        },
      });

      setOpenRejectModal(false);
      setSelectedRefund(null);

      await refetch();
    } catch (error) {
      console.error("Reject refund error:", error);

      alert(
        error?.message ||
          "Failed to reject refund request."
      );
    }
  };

  // --------------------------------
  // STATUS STYLE
  // --------------------------------

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // --------------------------------
  // TABLE COLUMNS
  // --------------------------------

  const columns = useMemo(
    () => [
      {
        header: "Staff Name",
        accessor: "requestedByStaffName",
        width: "130px",

        render: (row) => (
          <div>
            <p className="font-semibold text-gray-800">
              {row.requestedByStaffName || "-"}
            </p>

            <p className="text-[10px] text-gray-500">
              Staff ID: {row.requestedByStaffId || "-"}
            </p>
          </div>
        ),
      },

      {
        header: "Transaction ID",
        accessor: "transactionId",
        width: "150px",

        render: (row) => (
          <span className="break-all text-gray-600">
            {row.transactionId || "-"}
          </span>
        ),
      },

      {
        header: "Order ID",
        accessor: "orderId",
        width: "140px",

        render: (row) => (
          <span className="break-all text-gray-600">
            {row.orderId || "-"}
          </span>
        ),
      },

      {
        header: "Customer",
        accessor: "userName",
        width: "150px",

        render: (row) => (
          <div>
            <p className="font-semibold text-violet-600">
              {row.userName || "N/A"}
            </p>

            <p className="text-[10px] text-gray-500">
              ID: {row.userId || "-"}
            </p>

            {row.userMobile && (
              <p className="text-[10px] text-gray-500">
                {row.userMobile}
              </p>
            )}
          </div>
        ),
      },

      {
        header: "Astrologer",
        accessor: "astrologerName",
        width: "150px",

        render: (row) => (
          <div>
            <p className="font-semibold text-violet-600">
              {row.astrologerName || "N/A"}
            </p>

            <p className="text-[10px] text-gray-500">
              ID: {row.astrologerId || "-"}
            </p>
          </div>
        ),
      },

      {
        header: "Refund Type",
        accessor: "refundType",
        width: "110px",

        render: (row) => (
          <span className="capitalize">
            {row.refundType
              ? row.refundType.toLowerCase()
              : "-"}
          </span>
        ),
      },

      {
        header: "Refund Duration",
        accessor: "refundDuration",
        width: "120px",

        render: (row) => (
          <span className="font-semibold">
            {row.refundDuration || 0} min
          </span>
        ),
      },

      {
        header: "Refund Amount",
        accessor: "refundAmount",
        width: "120px",

        render: (row) => (
          <span className="font-semibold text-red-600">
            ₹ {row.refundAmount ?? 0}
          </span>
        ),
      },

      {
        header: "Mode",
        accessor: "mode",
        width: "90px",

        render: (row) => (
          <span>
            {row.mode || "-"}
          </span>
        ),
      },

      {
        header: "Refund Reason",
        accessor: "refundReason",
        width: "180px",

        render: (row) => (
          <span className="break-words">
            {row.refundReason || "-"}
          </span>
        ),
      },

      {
        header: "Session Date",
        accessor: "sessionDate",
        width: "150px",

        render: (row) => {
          if (!row.sessionDate) {
            return "-";
          }

          return new Date(
            row.sessionDate
          ).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          });
        },
      },

      {
        header: "Request Date",
        accessor: "createdAt",
        width: "150px",

        render: (row) => {
          if (!row.createdAt) {
            return "-";
          }

          return new Date(
            row.createdAt
          ).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          });
        },
      },

      {
        header: "Approve Staff",
        accessor: "approvedByStaffName",
        width: "150px",

        render: (row) => {
          if (row.status === "APPROVED") {
            return (
              <div>
                <p className="font-semibold text-green-600">
                  {row.approvedByStaffName || "-"}
                </p>

                <p className="text-[10px] text-gray-500">
                  ID: {row.approvedByStaffId || "-"}
                </p>

                {row.approvedAt && (
                  <p className="text-[10px] text-gray-500">
                    {new Date(
                      row.approvedAt
                    ).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            );
          }

          if (row.status === "REJECTED") {
            return (
              <div>
                <p className="font-semibold text-red-600">
                  {row.rejectedByStaffName || "-"}
                </p>

                <p className="text-[10px] text-gray-500">
                  ID: {row.rejectedByStaffId || "-"}
                </p>

                {row.rejectedAt && (
                  <p className="text-[10px] text-gray-500">
                    {new Date(
                      row.rejectedAt
                    ).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            );
          }

          return "-";
        },
      },

      // --------------------------------
      // ACTION
      // --------------------------------

      {
        header: "Action",
        accessor: "action",
        width: "150px",

        render: (row) => {
          if (row.status === "APPROVED") {
            return (
              <span className="font-semibold text-green-600">
                Completed
              </span>
            );
          }

          if (row.status === "REJECTED") {
            return (
              <div>
                <span className="font-semibold text-red-600">
                  Rejected
                </span>

                {row.rejectionReason && (
                  <p className="mt-1 text-[10px] text-gray-500">
                    {row.rejectionReason}
                  </p>
                )}
              </div>
            );
          }

          return (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                disabled={approving || rejecting}
                onClick={() => handleApprove(row)}
                className="w-[75px] rounded-md bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {approving ? "..." : "Approve"}
              </button>

              <button
                type="button"
                disabled={approving || rejecting}
                onClick={() => handleRejectClick(row)}
                className="w-[75px] rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          );
        },
      },
    ],
    [approving, rejecting]
  );

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error) {
    return (
      <div className="p-10 text-red-500">
        Error loading refund requests
      </div>
    );
  }

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="space-y-5 p-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Refund List
          </h1>

          <p className="text-sm text-gray-500">
            Total Requests: {totalCount}
          </p>
        </div>

        {/* STATUS FILTER */}

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none"
        >
          <option value="">
            All Status
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="APPROVED">
            Approved
          </option>

          <option value="REJECTED">
            Rejected
          </option>
        </select>
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">
        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-md">
            Loading Refund Requests...
          </div>
        ) : refundList.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-md">
            No refund requests found.
          </div>
        ) : (
          <div className="min-w-[1900px]">
            <DataTable
              columns={columns}
              data={refundList}
              startIndex={(page - 1) * limit}
            />
          </div>
        )}
      </div>

      {/* PAGINATION */}

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            Show
          </span>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>

          <span className="text-sm font-medium text-gray-600">
            per page
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              setPage((prev) => prev - 1)
            }
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              page === 1
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Previous
          </button>

          <span className="text-sm font-semibold">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() =>
              setPage((prev) => prev + 1)
            }
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              page >= totalPages
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* REJECT MODAL */}

      <RejectRefundModal
        open={openRejectModal}
        onClose={() => {
          if (rejecting) return;

          setOpenRejectModal(false);
          setSelectedRefund(null);
        }}
        onSubmit={handleReject}
        loading={rejecting}
      />
    </div>
  );
}