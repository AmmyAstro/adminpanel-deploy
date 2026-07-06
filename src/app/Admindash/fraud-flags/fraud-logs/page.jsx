"use client";

import { gql } from "@apollo/client";
import { useLazyQuery, useMutation } from "@apollo/client/react";

import { useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";

import DataTable from "@/components/utils/DataTable";

import ConfirmModal from "@/components/Custom/ConfirmModal";

import ProtectedActionButton from "@/components/Custom/ActionButton";

import { usePermissions } from "@/context/PermissionContext";

import { useActionHandler } from "@/hooks/useActionHandler";
import SessionMessagesModal from "../../user/SessionModal";
import Link from "next/link";

// ======================================================
// QUERIES & MUTATIONS
// ======================================================

const GET_FRAUD_LOGS = gql`
  query GetFraudLogs($searchInput: FraudLogSearchInput) {
    getFraudLogs(searchInput: $searchInput) {
      totalCount
      currentPage
      totalPages

      data {
        id
        orderId
        senderName
        sessionId
        receiverName
        message
        matchedKeywords
        receiverId
        senderId
        status
        createdAt
      }
    }
  }
`;

const UPDATE_FRAUD_STATUS = gql`
  mutation UpdateFraud($id: ID!, $status: FraudStatus!) {
    updateFraudLogStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

// ======================================================
// COMPONENT
// ======================================================

export default function FraudLogsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const { can, isSuperAdmin } = usePermissions();

  const canUpdate = isSuperAdmin || can("fraud_logs", "update");

  const { confirmState, setConfirmState, executeAction, handleConfirm } =
    useActionHandler();

  const [page, setPage] = useState(1);

  const [limit] = useState(10);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [getFraudLogs, { data, loading }] = useLazyQuery(GET_FRAUD_LOGS, {
    fetchPolicy: "network-only",
  });

  const [updateFraudStatus] = useMutation(UPDATE_FRAUD_STATUS);

  const fetchFraudLogs = () => {
    getFraudLogs({
      variables: {
        searchInput: {
          page,
          limit,
          query: search,
          status: status || undefined,
        },
      },
    });
  };

  useEffect(() => {
    fetchFraudLogs();
  }, [page, search, status]);

  const fraudLogs = data?.getFraudLogs?.data || [];

  const totalCount = data?.getFraudLogs?.totalCount || 0;

  const totalPages = data?.getFraudLogs?.totalPages || 1;

  const columns = useMemo(
    () => [
      {
        header: "Order ID",
        render: (row) => (
          <div>
            <p className="font-medium">{row.orderId?.slice(0, 8)}</p>
          </div>
        ),
      },

      {
        header: "Sender",
        render: (row) => {
          const profilePath =
            row.senderName?.toLowerCase() === "astrologer"
              ? `/Admindash/asrologer/astroprofile/${row.senderId}`
              : `/Admindash/usermain/userprofile/${row.senderId}`;

          return (
            <div>
              <Link
                href={profilePath}
                className="font-semibold text-violet-600 hover:underline"
              >
                {row.senderName}
              </Link>

              <p className="font-medium">{row.senderId?.slice(0, 8)}</p>
            </div>
          );
        },
      },

      {
        header: "Receiver",
        render: (row) => {
          const profilePath =
            row.receiverName?.toLowerCase() === "astrologer"
              ? `/Admindash/asrologer/astroprofile/${row.receiverId}`
              : `/Admindash/usermain/userprofile/${row.receiverId}`;

          return (
            <div>
              <Link
                href={profilePath}
                className="font-semibold text-violet-600 hover:underline"
              >
                {row.receiverName}
              </Link>

              <p className="font-medium">{row.receiverId?.slice(0, 8)}</p>
            </div>
          );
        },
      },

      {
        header: "Keywords",
        render: (row) => (
          <div className="flex flex-wrap gap-2">
            {row?.matchedKeywords?.map((keyword, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs"
              >
                {keyword}
              </span>
            ))}
          </div>
        ),
      },

{
  header: "Message",
  width: "300px",
  render: (row) => (
    <div className="group relative">
      <p
        title={row.message}
        className="truncate text-sm text-gray-700 cursor-pointer"
      >
        {row.message}
      </p>

      <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-[9999]">
        <div className="max-w-80 rounded-lg bg-black p-3 text-sm text-white shadow-xl break-words whitespace-normal">
          {row.message}
        </div>
      </div>
    </div>
  ),
},

      {
        header: "Status",

        render: (row) => (
          <span
            className={`px-3 py-1 rounded-xl text-xs font-medium
            ${
              row.status === "FRAUD"
                ? "bg-red-100 text-red-600"
                : row.status === "FINE"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-700"
            }
          `}
          >
            {row.status}
          </span>
        ),
      },

      {
        header: "Date & Time",

        render: (row) => (
          <div>
            <p className="text-sm">
              {new Date(row.createdAt).toLocaleDateString()}
            </p>

            <p className="text-xs text-gray-500">
              {new Date(row.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ),
      },

      {
        header: "Actions",

        render: (row) => {
          const isFraud = row.status === "FRAUD";
          const isFine = row.status === "FINE";
          const isResolved = isFraud || isFine;

          return (
            <div className="flex items-center justify-center gap-2">
              {/* Fraud */}
              <ProtectedActionButton
                disabled={isResolved && !isFraud}
                module="fraud_logs"
                action="update"
                executeAction={executeAction}
                mutationFn={() =>
                  updateFraudStatus({
                    variables: {
                      id: row.id,
                      status: "FRAUD",
                    },
                  })
                }
                onSuccess={fetchFraudLogs}
                className={`px-4 py-1 rounded-xl text-xs text-white  
            ${
              row.status === "FRAUD"
                ? "bg-red-700 ring-2 ring-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 cursor-pointer"
            }
            ${
              isResolved && row.status !== "FRAUD"
                ? "opacity-50 cursor-not-allowed hidden"
                : ""
            }
          `}
              >
                Fraud
              </ProtectedActionButton>

              {/* Fine */}
              <ProtectedActionButton
                disabled={isResolved && !isFine}
                module="fraud_logs"
                action="update"
                executeAction={executeAction}
                mutationFn={() =>
                  updateFraudStatus({
                    variables: {
                      id: row.id,
                      status: "FINE",
                    },
                  })
                }
                onSuccess={fetchFraudLogs}
                className={`px-4 py-1 rounded-xl text-xs text-white 
            ${
              row.status === "FINE"
                ? "bg-green-700 ring-2 ring-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 cursor-pointer"
            }
            ${
              isResolved && row.status !== "FINE"
                ? "opacity-50 cursor-not-allowed hidden"
                : ""
            }
          `}
              >
                Fine
              </ProtectedActionButton>
            </div>
          );
        },
      },

      {
        header: "Chat",

        render: (row) => (
          <button
            onClick={() => {
              setSelectedSession(row.sessionId);
              setOpenModal(true);
            }}
            className="px-3 py-1 rounded-full bg-violet-600 text-white text-xs hover:bg-violet-700 hover:scale-103 cursor-pointer"
          >
            Chat
          </button>
        ),
      },
    ],
    [page, limit, canUpdate],
  );

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="p-6 bg-[#f5f5f7] min-h-screen">
      {/* ======================================================
          CONFIRM MODAL
      ====================================================== */}

      <ConfirmModal
        open={!!confirmState}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirm}
      />

      {/* ======================================================
          CARD
      ====================================================== */}

      <div className="bg-white rounded-3xl shadow-sm p-5">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Fraud Logs</h2>

            <p className="text-sm text-gray-500 mt-1">
              Monitor suspicious chats & fraud keywords
            </p>
          </div>

          {/* FILTERS */}

          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* SEARCH */}

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setPage(1);
              }}
              className="border rounded-2xl border-gray-300 px-4 py-2.5 outline-none focus:border-violet-500 w-full md:w-72"
            />

            {/* STATUS */}

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);

                setPage(1);
              }}
              className="border rounded-2xl border-gray-300 px-4 py-2.5 outline-none focus:border-violet-500"
            >
              <option value="">All Status</option>

              <option value="PENDING">Pending</option>

              <option value="FRAUD">Fraud</option>

              <option value="FINE">Fine</option>
            </select>
          </div>
        </div>

        {/* ======================================================
            TABLE
        ====================================================== */}

        <div className="overflow-x-auto">
          <div className="min-w-full bg-white rounded-2xl overflow-hidden">
            <DataTable columns={columns} data={fraudLogs} loading={loading} />
          </div>
        </div>

        {/* ======================================================
            FOOTER
        ====================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500">
            Total Fraud Logs: {totalCount}
          </p>

          {/* PAGINATION */}

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded-xl border
              ${
                page === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }
            `}
            >
              Prev
            </button>

            <span className="text-sm font-medium">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded-xl border
              ${
                page === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }
            `}
            >
              Next
            </button>
          </div>
        </div>
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
