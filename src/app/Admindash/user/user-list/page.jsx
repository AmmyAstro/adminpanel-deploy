"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";

import DataTable from "@/components/utils/DataTable";
import Link from "next/link";
import {  UPDATE_USER_STATUS} from "@/app/graphQL/astroHiring";
import CustomToggle from "@/components/Custom/CustomToggle";

const GET_USERS = gql`
  query GetUsers($searchInput: UserSearchInput!) {
    getUsersListBySearch(searchInput: $searchInput) {
      totalCount
      currentPage
      totalPages

      data {
        id
        name
        mobile
        gender
        isActive
        userCoins

        createdAt
        updatedAt
      }
    }
  }
`;

export default function UsersListPage() {
  // SEARCH STATES
  const [searchName, setSearchName] = useState("");

  const [searchMobile, setSearchMobile] = useState("");

  const [searchFilterType, setSearchFilterType] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  // PAGINATION
  const [page, setPage] = useState(1);

 const limit = 80;

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
  }, [searchName, searchMobile, searchFilterType, startDate, endDate]);

  // SEARCH INPUT
  const searchInput = {
    page,
    limit,
  };
  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);

  if (filters.query) {
    searchInput.query = filters.query;
  }

  if (filters.mobile) {
    searchInput.mobile = filters.mobile;
  }

  if (filters.filterType) {
    searchInput.filterType = filters.filterType;
  }

  if (filters.filterType === "CUSTOM" && filters.startDate && filters.endDate) {
    searchInput.startDate = filters.startDate;

    searchInput.endDate = filters.endDate;
  }

  // API CALL
  const { data, loading, error , refetch } = useQuery(GET_USERS, {
    variables: {
      searchInput,
    },
    fetchPolicy: "network-only",
  });

  const users = data?.getUsersListBySearch?.data || [];

  const totalCount = data?.getUsersListBySearch?.totalCount || 0;

  const totalPages = data?.getUsersListBySearch?.totalPages || 1;

  // TABLE COLUMNS
  const columns = useMemo(
    () => [
      {
        header: "Name",
        render: (row) => (
          <div>         
            <Link
              href={`/Admindash/user/userprofile/${row.id}`}
              className="font-semibold text-violet-600 flex flex-col  hover:underline"
            >
              {row.name || "N/A"}
            </Link>
            <p className="text-xs font-semibold"> {row.id?.slice(0, 8)}</p>
          </div>
        ),
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
          <Link
            href={`/Admindash/user/userprofile/${row.id}`}
            className=" rounded-full px-3 py-1 text-xs text-white hover:scale-104 bg-blue-400"
          >
            View
          </Link>
        ),
      },
      {
        header: "Status",
        render: (row) => (
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                row.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {row.isActive ? "Active" : "Inactive"}
            </span>

            <CustomToggle
              checked={row.isActive}
              onChange={async (value) => {
                try {
                  await updateUserStatus({
                    variables: {
                      userId: row.id,
                      isActive: value,
                    },
                  });

                  await refetch();
                } catch (err) {
                  console.error(err);
                }
              }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  if (error) {
    return <p className="p-10 text-red-500">Error loading users list</p>;
  }

  return (
    <div className="p- space-y-3">
  
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Users List</h1>

        <div className="bg-black text-sm text-white px-4 py-1 rounded-full w-fit">
          Total Records : {totalCount}
        </div>
      </div>

 
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white p-3 rounded-xl shadow border border-gray-200">
   
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border rounded-full border-gray-300 placeholder:text-gray-300 px-4 py-1 outline-none"
        />
        <input
          type="text"
          placeholder="Search by mobile"
          value={searchMobile}
          onChange={(e) => setSearchMobile(e.target.value)}
          className="border rounded-full border-gray-300 placeholder:text-gray-300 px-4 py-1 outline-none"
        />
        <select
          value={searchFilterType}
          onChange={(e) => setSearchFilterType(e.target.value)}
          className="border rounded-full border-gray-300 px-4 py-1  outline-none"
        >
          <option value="">All Time</option>

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

  
      <div className="overflow-x-auto">
        <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">Loading Users...</div>
          ) : (
            <DataTable columns={columns} data={users} />
          )}
        </div>
      </div>


      <div className="flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={`px-2 text-sm py-2 rounded-full ${
            page === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-black text-white"
          }`}
        >
      <svg width={20} height={20} viewBox="0 0 640 640"><path d="M105.4 297.4C92.9 309.9 92.9 330.2 105.4 342.7L265.4 502.7C277.9 515.2 298.2 515.2 310.7 502.7C323.2 490.2 323.2 469.9 310.7 457.4L173.3 320L310.6 182.6C323.1 170.1 323.1 149.8 310.6 137.3C298.1 124.8 277.8 124.8 265.3 137.3L105.3 297.3zM457.4 137.4L297.4 297.4C284.9 309.9 284.9 330.2 297.4 342.7L457.4 502.7C469.9 515.2 490.2 515.2 502.7 502.7C515.2 490.2 515.2 469.9 502.7 457.4L365.3 320L502.6 182.6C515.1 170.1 515.1 149.8 502.6 137.3C490.1 124.8 469.8 124.8 457.3 137.3z"/></svg>
        </button>

        <div className=" text-sm">
          Page {page} of {totalPages || 1}
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className={`px-2 text-sm py-2 rounded-full ${
            page >= totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-black text-white"
          }`}
        >
    <svg width={20} height={20} viewBox="0 0 640 640"><path d="M535.1 342.6C547.6 330.1 547.6 309.8 535.1 297.3L375.1 137.3C362.6 124.8 342.3 124.8 329.8 137.3C317.3 149.8 317.3 170.1 329.8 182.6L467.2 320L329.9 457.4C317.4 469.9 317.4 490.2 329.9 502.7C342.4 515.2 362.7 515.2 375.2 502.7L535.2 342.7zM183.1 502.6L343.1 342.6C355.6 330.1 355.6 309.8 343.1 297.3L183.1 137.3C170.6 124.8 150.3 124.8 137.8 137.3C125.3 149.8 125.3 170.1 137.8 182.6L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7z"/></svg>
        </button>
      </div>
    </div>
  );
}
