"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";

import DataTable from "@/components/utils/DataTable";
import Link from "next/link";

const GET_USERS = gql`
  query GetUsers(
    $searchInput: UserSearchInput!
  ) {
    getUsersListBySearch(
      searchInput: $searchInput
    ) {
      totalCount
      currentPage
      totalPages

      data {
        id
        name
        mobile
        gender

        userCoins
        

        createdAt
        updatedAt
      }
    }
  }
`;

export default function UsersListPage() {
  // SEARCH STATES
  const [searchName, setSearchName] =
    useState("");

  const [searchMobile, setSearchMobile] =
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
    mobile: "",
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
        filterType: searchFilterType,
        startDate,
        endDate,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchName,
    searchMobile,
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
    GET_USERS,
    {
      variables: {
        searchInput,
      },
      fetchPolicy: "network-only",
    }
  );

  const users =
    data?.getUsersListBySearch?.data || [];

  const totalCount =
    data?.getUsersListBySearch
      ?.totalCount || 0;

  const totalPages =
    data?.getUsersListBySearch
      ?.totalPages || 1;

  // TABLE COLUMNS
  const columns = useMemo(
    () => [
    {
  header: "Name",
  render: (row) => (
    <Link
      href={`/Admindash/usermain/userprofile/${row.id}`}
      className="font-semibold text-violet-600 hover:underline"
    >
      {row.name || "N/A"}
    </Link>
  ),
},

      {
        header: "Mobile",
        accessor: "mobile",
      },

      {
        header: "Gender",
        render: (row) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              row.gender === "MALE"
                ? "bg-blue-100 text-blue-700"
                : row.gender === "FEMALE"
                ? "bg-pink-100 text-pink-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {row.gender || "N/A"}
          </span>
        ),
      },
      {
  header: "Wallet Coins",
  render: (row) => (
    <span className="font-semibold text-green-600">
      {row.userCoins || 0}
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

      {
        header: "Updated At",
        render: (row) =>
          new Date(
            row.updatedAt
          ).toLocaleString(),
      },
    ],
    []
  );

  if (error) {
    return (
      <p className="p-10 text-red-500">
        Error loading users list
      </p>
    );
  }

  return (
    <div className="p-10 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">
          Users List
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

        {/* MOBILE */}
        <input
          type="text"
          placeholder="Search by mobile"
          value={searchMobile}
          onChange={(e) =>
            setSearchMobile(e.target.value)
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

        {/* STATUS */}
        <div className="flex items-center px-4 rounded-lg border bg-gray-50 text-sm text-gray-500">
          Backend Search Enabled
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">
              Loading Users...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={users}
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