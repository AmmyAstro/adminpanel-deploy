"use client";

import { gql } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import CustomInput from "@/components/Custom/CustomInput";
import CustomButton from "@/components/Custom/CustomButtom";
import DataTable from "@/components/utils/DataTable";
import { usePermissions } from "@/context/PermissionContext";
import { useActionHandler } from "@/hooks/useActionHandler";
import { useMutation, useQuery } from "@apollo/client/react";
import ProtectedActionButton from "@/components/Custom/ActionButton";
import ConfirmModal from "@/components/Custom/ConfirmModal";
import { GET_ASTRO_LIST } from "@/app/graphQL/astroHiring";
import Link from "next/link";
import dayjs from "dayjs";

const DELETE_ASTRO = gql`
  mutation DeleteAstrologer($astrologerId: ID!) {
    deleteAstrologer(astrologerId: $astrologerId)
  }
`;

export default function AstroList() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const { can, isSuperAdmin } = usePermissions();

  const canView = isSuperAdmin || can("astrologer", "read");
  const canUpdate = isSuperAdmin || can("astrologer", "update");
  const canDelete = isSuperAdmin || can("astrologer", "delete");

  const { confirmState, setConfirmState, executeAction, handleConfirm } =
    useActionHandler();

  const { data, loading, refetch } = useQuery(GET_ASTRO_LIST, {
    variables: {
      searchInput: {
        query: "",
        limit: 10,
        page: 1,
      },
    },
  });

  const [deleteAstrologer] = useMutation(DELETE_ASTRO);

  const astrologers = data?.getAstrologerListBySearch?.data || [];

  const viewProfile = (id) => {
    router.push(`/Admindash/astromain/astroprofile/${id}`);
  };

  const handleEdit = (id) => {
    router.push(`/Admindash/astromain/edit-astrologer/${id}`);
  };

  /* =========================
      TABLE COLUMNS
  ========================= */

  const columns = [
    {
      header: "Name",
      accessor: "name",
      render: (row) => (
        <div className="flex flex-col">
          <Link
            href={`/Admindash/astromain/astroprofile/${row.id}`}
            className="font-bold text-purple-500"
          >
            {row.displayName}
          </Link>
          <small className="text-gray-400">ID: {row.id?.slice(0, 15)}</small>
        </div>
      ),
    },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "contactNo" },
    {
  header: "Joined On",
  render: (row) =>
    dayjs(row.createdAt).format("DD MMM YYYY hh:mm A"),
},

    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-2">
          {/* VIEW */}
          <button
            disabled={!canView}
            onClick={() => {
              if (!canView) return;
              viewProfile(row.id);
            }}
            className={`px-2 py-1 text-xs rounded ${
              !canView
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            View
          </button>

          {/* EDIT */}
          <button
            disabled={!canUpdate}
            onClick={() => {
              if (!canUpdate) return;
              handleEdit(row.id);
            }}
            className={`px-2 py-1 text-xs rounded ${
              !canUpdate
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-yellow-500 text-white"
            }`}
          >
            Edit
          </button>

          {/* DELETE */}
          <ProtectedActionButton
            module="astrologer"
            action="delete"
            executeAction={executeAction}
            mutationFn={deleteAstrologer}
            variables={{ astrologerId: row.id }}
            onSuccess={refetch}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded"
          >
            Delete
          </ProtectedActionButton>
        </div>
      ),
    },
  ];

  /* =========================
      SEARCH
  ========================= */

  const handleSearch = () => {
    refetch({
      searchInput: {
        query,
        limit: 10,
        page: 1,
      },
    });
  };

  /* =========================
      UI
  ========================= */

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="shadow-md rounded-xl p-3 bg-purple-200 mb-6 flex justify-between">
        <h2 className="text-xl font-bold text-purple-900">Astrologer List</h2>

        <div className="flex gap-2">
          <CustomInput
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <CustomButton onClick={handleSearch}>Search</CustomButton>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={!!confirmState}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirm}
      />

      {/* TABLE */}
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <DataTable columns={columns} data={astrologers} />
      )}
    </div>
  );
}
