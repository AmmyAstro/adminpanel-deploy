"use client";

import CustomButton from "@/components/Custom/CustomButtom";
import { gql } from "@apollo/client";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// ======================================================
// QUERIES & MUTATIONS
// ======================================================

const GET_FRAUD_FLAGS = gql`
  query GetFraudFlags($searchInput: FraudFlagSearchInput) {
    getFraudFlags(searchInput: $searchInput) {
      totalCount
      currentPage
      totalPages
      data {
        id
        keyword
        createdAt
      }
    }
  }
`;

const CREATE_FRAUD_FLAG = gql`
  mutation CreateFraudFlag($keyword: String!) {
    createFraudFlag(keyword: $keyword) {
      id
      keyword
      createdAt
    }
  }
`;

const DELETE_FRAUD_FLAG = gql`
  mutation DeleteFraudFlag($id: ID!) {
    deleteFraudFlag(id: $id)
  }
`;

// ======================================================
// COMPONENT
// ======================================================

export default function FraudFlagPage() {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);

  const limit = 10;

  // ======================================================
  // GET FRAUD FLAGS
  // ======================================================

  const [getFraudFlags, { data, loading }] = useLazyQuery(GET_FRAUD_FLAGS, {
    fetchPolicy: "network-only",
  });

  // ======================================================
  // CREATE FRAUD FLAG
  // ======================================================

  const [createFraudFlag, { loading: createLoading }] =
    useMutation(CREATE_FRAUD_FLAG);

  // ======================================================
  // DELETE FRAUD FLAG
  // ======================================================

  const [deleteFraudFlag] = useMutation(DELETE_FRAUD_FLAG);

  // ======================================================
  // FETCH FRAUD FLAGS
  // ======================================================

  const fetchFraudFlags = () => {
    getFraudFlags({
      variables: {
        searchInput: {
          page,
          limit,
          query: search,
        },
      },
    });
  };

  useEffect(() => {
    fetchFraudFlags();
  }, [page, search]);

  // ======================================================
  // HANDLE CREATE
  // ======================================================

  const handleCreate = async () => {
    if (!keyword.trim()) {
      alert("Please enter keyword");
      return;
    }

    try {
      await createFraudFlag({
        variables: {
          keyword,
        },
      });

      setKeyword("");

      setOpenModal(false);

      fetchFraudFlags();

      toast.success("Keyword added successfully");
    } catch (error) {
      console.log(error);

      toast.error(error?.message || "Failed to add keyword");
    }
  };

  // ======================================================
  // HANDLE DELETE
  // ======================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this keyword?",
    );

    if (!confirmDelete) return;

    try {
      await deleteFraudFlag({
        variables: {
          id,
        },
      });

      fetchFraudFlags();

      toast.success("Keyword deleted successfully");
    } catch (error) {
      console.log(error);

      toast.error(error?.message || "Failed to delete keyword");
    }
  };

  // ======================================================
  // DATA
  // ======================================================

  const fraudFlags = data?.getFraudFlags?.data || [];

  const totalPages = data?.getFraudFlags?.totalPages || 1;

  const totalCount = data?.getFraudFlags?.totalCount || 0;

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="p-6 bg-[#f5f5f7] min-h-screen">
      <div className="grid grid-cols-1 gap-6">
        {/* =========================================
            TABLE SECTION
        ========================================= */}

        <div className="bg-white rounded-3xl shadow-sm p-5">
          {/* =========================================
              HEADER
          ========================================= */}

          <div className="flex flex-col lg:flex-row lg:items-center justify-evenly gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Fraud Keywords</h2>

              <p className="text-sm text-gray-500 mt-1">
                Manage fraud keywords list
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* SEARCH */}

              <input
                type="text"
                placeholder="Search keyword..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="border rounded-2xl border-gray-300 px-4 py-2 outline-none focus:border-violet-500 w-full sm:w-102"
              />

              {/* ADD BUTTON */}

             
            </div>
             <CustomButton
                onClick={() => setOpenModal(true)}
                className="bg-purple-400  text-white px-5 py-3  rounded-2xl whitespace-nowrap"
              >
                + Add Keyword
              </CustomButton>
          </div>

          {/* =========================================
              TABLE
          ========================================= */}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 rounded-l-2xl">
                    Keyword
                  </th>

                  <th className="text-left p-4 text-sm font-semibold text-gray-700">
                    Created At
                  </th>

                  <th className="text-center p-4 text-sm font-semibold text-gray-700 rounded-r-2xl">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-10 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : fraudFlags?.length > 0 ? (
                  fraudFlags.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-4 text-gray-700">{item.keyword}</td>

                      <td className="p-4 text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-xl text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-10 text-gray-500">
                      No fraud keywords found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* =========================================
              FOOTER
          ========================================= */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
            <p className="text-sm text-gray-500">
              Total Keywords: {totalCount}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded-xl border ${
                  page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Prev
              </button>

              <span className="text-sm font-medium">
                {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-4 py-2 rounded-xl border ${
                  page === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          ADD KEYWORD MODAL
      ====================================================== */}

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-6 relative">
            {/* CLOSE BUTTON */}

            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>

            {/* TITLE */}

            <h2 className="text-2xl font-semibold mb-2">Add Fraud Keyword</h2>

            <p className="text-sm text-gray-500 mb-6">
              Add suspicious words or fraud keywords
            </p>

            {/* INPUT */}

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm text-gray-600">
                  Keyword
                </label>

                <input
                  type="text"
                  placeholder="Enter keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full border rounded-2xl px-4 py-3 outline-none border-gray-300 focus:border-violet-500"
                />
              </div>

              {/* ACTION BUTTONS */}

              <div className="flex items-center justify-end gap-3 pt-2">
                <CustomButton
                  onClick={() => setOpenModal(false)}
                  className="border bg-red-300 border-gray-300 px-5 py-2 rounded-2xl"
                >
                  Cancel
                </CustomButton>

                <CustomButton
                  onClick={handleCreate}
                  disabled={createLoading}
                  className="bg-green-600 hover:bg-violet-700 transition text-white px-5 py-2 rounded-2xl"
                >
                  {createLoading ? "Saving..." : "Save Keyword"}
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
