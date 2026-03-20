"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  CREATE_ROLE,
  DELETE_ROLE,
  GET_ROLES,
  UPDATE_ROLE,
} from "@/app/graphQL/privilageOperations";

import DataTable from "@/components/utils/DataTable";
import { hasPermission } from "@/app/helper/permissionHelper";
import { usePermissions } from "@/hooks/usePermission";

import { useActionHandler } from "@/hooks/useActionHandler";
import ConfirmModal from "@/components/Custom/ConfirmModal";

export default function RolesManager() {
  const { permissions } = usePermissions();

  const {
    confirmState,
    setConfirmState,
    executeAction,
    handleConfirm,
  } = useActionHandler();

  const { data, loading, error, refetch } = useQuery(GET_ROLES, {
    variables: { page: 1, limit: 10 },
  });

  const roles = data?.getRoles?.data || [];

  const [createRole] = useMutation(CREATE_ROLE);
  const [updateRole] = useMutation(UPDATE_ROLE);
  const [deleteRole] = useMutation(DELETE_ROLE);

  const [openModal, setOpenModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const canCreateRole = hasPermission(permissions, "roles", "create");
  const canDeleteRole = hasPermission(permissions, "roles", "delete");

  useEffect(() => {
    if (editingRole) {
      setName(editingRole.name);
      setSlug(editingRole.slug);
      setDescription(editingRole.description || "");
    } else {
      setName("");
      setSlug("");
      setDescription("");
    }
  }, [editingRole]);

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setEditingRole(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingRole) {
        await updateRole({
          variables: {
            id: editingRole.id,
            name,
            slug,
            description,
          },
        });
      } else {
        await createRole({
          variables: {
            name,
            slug,
            description,
          },
        });
      }

      await refetch();
      resetForm();
      setOpenModal(false);
    } catch (err) {
      console.error("Role save error:", err);
    }
  };

  if (loading) return <p className="p-10">Loading Roles...</p>;
  if (error) return <p className="p-10 text-red-500">Error loading roles</p>;

  const roleColumns = [
    { header: "Name", accessor: "name" },
    { header: "Slug", accessor: "slug" },
    { header: "Description", accessor: "description" },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-3">
          {/* EDIT */}
          <button
            onClick={() => {
              setEditingRole(row);
              setOpenModal(true);
            }}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
          >
            Edit
          </button>

          {/* DELETE (Centralized) */}
          <button
            disabled={!canDeleteRole}
            onClick={() =>
              executeAction({
                module: "roles",
                action: "delete",
                mutationFn: deleteRole,
                variables: { roleId: row.id },
                onSuccess: refetch,
              })
            }
            className={`px-3 py-1 text-xs rounded ${
              canDeleteRole
                ? "bg-red-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-10 space-y-5">
      {/* CREATE */}
      {canCreateRole && (
        <button
          onClick={() => {
            resetForm();
            setOpenModal(true);
          }}
          className="px-5 py-2 bg-yellow-500 text-black rounded-lg"
        >
          Create Role
        </button>
      )}

      {/* GLOBAL CONFIRM MODAL */}
      <ConfirmModal
        open={!!confirmState}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirm}
      />

      {/* TABLE */}
      <div className="mt-10 overflow-x-auto">
        <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          <DataTable columns={roleColumns} data={roles} />
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
            <h2 className="text-xl font-semibold">
              {editingRole ? "Edit Role" : "Create Role"}
            </h2>

            <input
              type="text"
              placeholder="Name"
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Slug"
              className="w-full border p-2 rounded"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            <textarea
              placeholder="Description"
              className="w-full border p-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setOpenModal(false);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-black text-white rounded"
              >
                {editingRole ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}