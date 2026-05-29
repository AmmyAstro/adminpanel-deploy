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
        receiverName
        message
        matchedKeywords
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
    // ======================================================
    // PERMISSIONS
    // ======================================================

    const { can, isSuperAdmin } = usePermissions();

    const canUpdate = isSuperAdmin || can("fraud_logs", "update");

    // ======================================================
    // ACTION HANDLER
    // ======================================================

    const { confirmState, setConfirmState, executeAction, handleConfirm } =
        useActionHandler();

    // ======================================================
    // STATES
    // ======================================================

    const [page, setPage] = useState(1);

    const [limit] = useState(10);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    // ======================================================
    // GET FRAUD LOGS
    // ======================================================

    const [getFraudLogs, { data, loading }] = useLazyQuery(GET_FRAUD_LOGS, {
        fetchPolicy: "network-only",
    });

    // ======================================================
    // UPDATE FRAUD STATUS
    // ======================================================

    const [updateFraudStatus] = useMutation(UPDATE_FRAUD_STATUS);

    // ======================================================
    // FETCH DATA
    // ======================================================

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

    // ======================================================
    // HANDLE STATUS UPDATE
    // ======================================================

    //   const handleUpdateStatus = async (variables) => {
    //     const res = await updateFraudStatus({
    //       variables,
    //     });

    //     return {
    //       data: {
    //         updateFraudLogStatus: {
    //           success: true,
    //           message: `Marked as ${variables.status}`,
    //         },
    //       },
    //     };
    //   };

    // ======================================================
    // DATA
    // ======================================================

    const fraudLogs = data?.getFraudLogs?.data || [];

    const totalCount = data?.getFraudLogs?.totalCount || 0;

    const totalPages = data?.getFraudLogs?.totalPages || 1;

    // ======================================================
    // TABLE COLUMNS
    // ======================================================

    const columns = useMemo(
        () => [
            {
                header: "Order ID",
                accessor: "orderId",
            },

            {
                header: "Sender",
                render: (row) => (
                    <div>
                        <p className="font-medium">{row.senderName}</p>
                    </div>
                ),
            },

            {
                header: "Receiver",
                render: (row) => (
                    <div>
                        <p className="font-medium">{row.receiverName}</p>
                    </div>
                ),
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
                render: (row) => (
                    <div className="max-w-[350px]">
                        <p className="text-sm text-gray-700 line-clamp-3">{row.message}</p>
                    </div>
                ),
            },

            {
                header: "Status",

                render: (row) => (
                    <span
                        className={`px-3 py-1 rounded-xl text-xs font-medium
            ${row.status === "FRAUD"
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

                render: (row) => (
                    <div className="flex items-center justify-center gap-2">
                        {/* FRAUD BUTTON */}

                        <ProtectedActionButton
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
                            className={`px-4 py-2 rounded-xl text-sm text-white
  ${!canUpdate
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600"
                                }`}
                        >
                            Fraud
                        </ProtectedActionButton>

                        {/* FINE BUTTON */}

                        <ProtectedActionButton
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
                            className={`px-4 py-2 rounded-xl text-sm text-white
  ${!canUpdate
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-600"
                                }`}
                        >
                            Fine
                        </ProtectedActionButton>
                    </div>
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
              ${page === 1
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
              ${page === totalPages
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
        </div>
    );
}
