"use client";

import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import DataTable from "@/components/utils/DataTable";
import { GET_PAYMENT_REPORTS } from "@/app/graphQL/razorpay";

export default function RazorpayReports() {
    const [filters, setFilters] = useState({
        query: "",
        status: "",
        filterType: "MONTH",
        startDate: "",
        endDate: "",
        page: 1,
        limit: 10,
    });

    const [searchText, setSearchText] = useState("");

    const [getReports, { data, loading, error }] = useLazyQuery(
        GET_PAYMENT_REPORTS,
        {
            fetchPolicy: "network-only",
        }
    );

    // =========================
    // BUILD CLEAN GRAPHQL INPUT
    // =========================
    const buildSearchInput = (payload) => {
        return {
            ...(payload.query?.trim()
                ? { query: payload.query.trim() }
                : {}),

            ...(payload.status
                ? { status: payload.status }
                : {}),

            ...(payload.filterType
                ? { filterType: payload.filterType }
                : {}),

            ...(payload.filterType === "CUSTOM" &&
            payload.startDate &&
            payload.endDate
                ? {
                      startDate: payload.startDate,
                      endDate: payload.endDate,
                  }
                : {}),

            page: payload.page || 1,
            limit: payload.limit || 10,
        };
    };

    // =========================
    // FETCH REPORTS
    // =========================
    const fetchReports = (customFilters = filters) => {
        getReports({
            variables: {
                searchInput: buildSearchInput(customFilters),
            },
        });
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // =========================
    // SEARCH HANDLER
    // =========================
    const handleSearch = () => {
        const updated = {
            ...filters,
            query: searchText,
            page: 1,
        };

        setFilters(updated);

        fetchReports(updated);
    };

    // =========================
    // FILTER CHANGE
    // =========================
    const handleFilterChange = (key, value) => {
        const updated = {
            ...filters,
            [key]: value,
            page: 1,
        };

        // RESET DATES IF NOT CUSTOM
        if (key === "filterType" && value !== "CUSTOM") {
            updated.startDate = "";
            updated.endDate = "";
        }

        setFilters(updated);

        // CUSTOM FILTER waits for Apply button
        if (updated.filterType !== "CUSTOM") {
            fetchReports(updated);
        }
    };

    // =========================
    // PAGINATION
    // =========================
    const handlePageChange = (page) => {
        const updated = {
            ...filters,
            page,
        };

        setFilters(updated);

        fetchReports(updated);
    };

    const reportData = data?.getPaymentReports?.data || [];

    const summary = data?.getPaymentReports || {};

    // =========================
    // TABLE COLUMNS
    // =========================
    const columns = [
        {
            header: "User",
            render: (row) => (
                <div>
                    <p className="font-semibold">
                        {row.userName || "-"}
                    </p>

                    <p className="text-xs text-gray-500">
                        {row.mobile || "-"}
                    </p>
                </div>
            ),
        },

        {
            header: "Recharge Pack",
            accessor: "rechargePackName",
        },

        {
            header: "Order ID",
            accessor: "razorpayOrderId",
        },

        {
            header: "Amount",
            render: (row) => (
                <span className="font-semibold text-green-600">
                    ₹{row.amount}
                </span>
            ),
        },

        {
            header: "Coins",
            render: (row) => (
                <span className="font-medium">
                    {row.coins}
                </span>
            ),
        },

        {
            header: "Status",
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                        row.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : row.status === "FAILED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                    {row.status}
                </span>
            ),
        },

        {
            header: "Date",
            render: (row) => (
                <div className="text-sm">
                    {new Date(row.createdAt).toLocaleDateString()}
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Razorpay Reports
                </h1>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Amount
                    </p>

                    <h2 className="text-2xl font-bold text-green-600">
                        ₹{summary.totalAmount || 0}
                    </h2>
                </div>

                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Paid Amount
                    </p>

                    <h2 className="text-2xl font-bold text-blue-600">
                        ₹{summary.paidAmount || 0}
                    </h2>
                </div>

                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Failed Amount
                    </p>

                    <h2 className="text-2xl font-bold text-red-600">
                        ₹{summary.failedAmount || 0}
                    </h2>
                </div>

                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Coins
                    </p>

                    <h2 className="text-2xl font-bold text-yellow-500">
                        {summary.totalCoins || 0}
                    </h2>
                </div>

            </div>

            {/* FILTERS */}
            <div className="bg-white border rounded-xl p-4 shadow-sm">

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                    {/* SEARCH */}
                    <div className="md:col-span-2 flex gap-2">

                        <input
                            type="text"
                            placeholder="Search name / mobile / order id"
                            value={searchText}
                            onChange={(e) =>
                                setSearchText(e.target.value)
                            }
                            className="w-full border rounded-lg px-4 py-2"
                        />

                        <button
                            onClick={handleSearch}
                            className="bg-black text-white px-5 rounded-lg"
                        >
                            Search
                        </button>

                    </div>

                    {/* STATUS */}
                    <select
                        value={filters.status}
                        onChange={(e) =>
                            handleFilterChange(
                                "status",
                                e.target.value
                            )
                        }
                        className="border rounded-lg px-4 py-2"
                    >
                        <option value="">All Status</option>
                        <option value="CREATED">CREATED</option>
                        <option value="PAID">PAID</option>
                        <option value="FAILED">FAILED</option>
                    </select>

                    {/* FILTER TYPE */}
                    <select
                        value={filters.filterType}
                        onChange={(e) =>
                            handleFilterChange(
                                "filterType",
                                e.target.value
                            )
                        }
                        className="border rounded-lg px-4 py-2"
                    >
                        <option value="TODAY">Today</option>
                        <option value="WEEK">Week</option>
                        <option value="MONTH">Month</option>
                        <option value="YEAR">Year</option>
                        <option value="CUSTOM">Custom</option>
                    </select>

                </div>

                {/* CUSTOM DATE FILTER */}
                {filters.filterType === "CUSTOM" && (

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    startDate: e.target.value,
                                }))
                            }
                            className="border rounded-lg px-4 py-2"
                        />

                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    endDate: e.target.value,
                                }))
                            }
                            className="border rounded-lg px-4 py-2"
                        />

                        <button
                            onClick={() => fetchReports(filters)}
                            className="bg-yellow-500 text-black rounded-lg"
                        >
                            Apply Date Filter
                        </button>

                    </div>
                )}

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">

                {loading ? (
                    <div className="p-10 text-center">
                        Loading Reports...
                    </div>
                ) : error ? (
                    <div className="p-10 text-center text-red-500">
                        {error.message}
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={reportData}
                    />
                )}

            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between">

                <p className="text-sm text-gray-500">
                    Total Records: {summary.totalCount || 0}
                </p>

                <div className="flex gap-2">

                    <button
                        disabled={filters.page === 1}
                        onClick={() =>
                            handlePageChange(filters.page - 1)
                        }
                        className="px-4 py-2 border rounded-lg disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <button
                        disabled={
                            filters.page >=
                            (summary.totalPages || 1)
                        }
                        onClick={() =>
                            handlePageChange(filters.page + 1)
                        }
                        className="px-4 py-2 border rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>
    );
}