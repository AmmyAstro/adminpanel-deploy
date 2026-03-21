"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import {
  CREATE_DEPARTMENT,
  DELETE_DEPARTMENT,
  GET_DEPARTMENTS,
  UPDATE_DEPARTMENT,
} from "@/app/graphQL/privilageOperations";

import DataTable from "@/components/utils/DataTable";
import { usePermissions } from "@/context/PermissionContext";

import { useActionHandler } from "@/hooks/useActionHandler";
import ProtectedActionButton from "@/components/Custom/ActionButton";
import ConfirmModal from "@/components/Custom/ConfirmModal";

export default function DepartmentManager() {
  const { can, isSuperAdmin } = usePermissions();

  const {
    confirmState,
    setConfirmState,
    executeAction,
    handleConfirm,
  } = useActionHandler();

  const { data, loading, error, refetch } = useQuery(GET_DEPARTMENTS, {
    variables: { page: 1, limit: 10 },
  });

  const departments = data?.getDepartments?.data || [];

  const [createDepartment] = useMutation(CREATE_DEPARTMENT);
  const [updateDepartment] = useMutation(UPDATE_DEPARTMENT);
  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // 🔥 Permissions
  const canCreate = isSuperAdmin || can("departments", "create");
  const canEdit = isSuperAdmin || can("departments", "update");

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditing(null);
  };

  const handleSubmit = async () => {
    try {
      const canSubmit =
        isSuperAdmin ||
        (editing
          ? can("departments", "update")
          : can("departments", "create"));

      if (!canSubmit) {
        console.log("No permission");
        return;
      }

      if (editing) {
        await updateDepartment({
          variables: {
            departmentId: editing.id,
            name,
            description,
          },
        });
      } else {
        await createDepartment({
          variables: { name, description },
        });
      }

      await refetch();
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error("Department save error:", err);
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;
  if (error) return <p className="p-10 text-red-500">Error loading departments</p>;

  const departmentColumns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Description",
      accessor: "description",
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-2">
          {/* EDIT */}
          <button
            disabled={!canEdit}
            onClick={() => {
              if (!canEdit) return;
              setEditing(row);
              setName(row.name);
              setDescription(row.description);
              setOpen(true);
            }}
            className={`px-3 py-1 text-xs rounded ${
              !canEdit
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Edit
          </button>

          {/* DELETE */}
          <ProtectedActionButton
            module="departments"
            action="delete"
            executeAction={executeAction}
            mutationFn={deleteDepartment}
            variables={{ departmentId: row.id }}
            onSuccess={refetch}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded"
          >
            Delete
          </ProtectedActionButton>
        </div>
      ),
    },
  ];

  return (
    <div className="p-10 space-y-5">
      {/* CREATE */}
      <button
        disabled={!canCreate}
        onClick={() => {
          if (!canCreate) return;
          resetForm();
          setOpen(true);
        }}
        className={`px-4 py-2 rounded ${
          !canCreate
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-yellow-500"
        }`}
      >
        Create Department
      </button>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={!!confirmState}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirm}
      />

      {/* TABLE */}
      <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        <DataTable columns={departmentColumns} data={departments} />
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 w-[400px] space-y-4">
            <input
              placeholder="Department Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
                className="border px-3 py-1"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-black text-white px-3 py-1"
              >
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}