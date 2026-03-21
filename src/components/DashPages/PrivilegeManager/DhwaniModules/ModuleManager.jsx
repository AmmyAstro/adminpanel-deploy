"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  CREATE_MODULE,
  DELETE_MODULE,
  GET_MODULES,
  UPDATE_MODULE,
} from "@/app/graphQL/privilageOperations";

import DataTable from "@/components/utils/DataTable";
import { useActionHandler } from "@/hooks/useActionHandler";
import ConfirmModal from "@/components/Custom/ConfirmModal";
import ProtectedActionButton from "@/components/Custom/ActionButton";
import { usePermissions } from "@/context/PermissionContext";

export default function ModuleManager() {
  const {
    confirmState,
    setConfirmState,
    executeAction,
    handleConfirm,
  } = useActionHandler();

  const { data, loading, error, refetch } = useQuery(GET_MODULES, {
    variables: { page: 1, limit: 10 },
  });

  const { can, isSuperAdmin } = usePermissions();

  const canEdit = isSuperAdmin || can("modules", "update");
  const canCreate = isSuperAdmin || can("modules", "create");
  const modules = data?.getModulesPaginated?.data || [];

  const [createModule] = useMutation(CREATE_MODULE);
  const [updateModule] = useMutation(UPDATE_MODULE);
  const [deleteModule] = useMutation(DELETE_MODULE);

  const [openModal, setOpenModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingModule) {
      setName(editingModule.name);
      setSlug(editingModule.slug);
      setDescription(editingModule.description || "");
    } else {
      setName("");
      setSlug("");
      setDescription("");
    }
  }, [editingModule]);

  const handleSubmit = async () => {
    try {
      const canSubmit =
        isSuperAdmin ||
        (editingModule
          ? can("modules", "update")
          : can("modules", "create"));

      if (!canSubmit) {
        console.log("No permission");
        return;
      }
      if (editingModule) {
        await updateModule({
          variables: {
            id: editingModule.id,
            name,
            slug,
            description,
          },
        });
      } else {
        await createModule({
          variables: {
            name,
            slug,
            description,
            section: "privilege",
          },
        });
      }

      await refetch();
      setOpenModal(false);
      setEditingModule(null);
    } catch (err) {
      console.error("Module save error:", err);
    }
  };

  if (loading) return <p className="p-10">Loading modules...</p>;
  if (error) return <p className="p-10 text-red-500">Error loading modules</p>;

  const moduleColumns = [
    { header: "Name", accessor: "name" },
    { header: "Slug", accessor: "slug" },
    { header: "Description", accessor: "description" },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-3">
          {/* EDIT */}
          <button
            disabled={!canEdit}
            onClick={() => {
              if (!canEdit) return;
              setEditingModule(row);
              setOpenModal(true);
            }}
            className={`px-3 py-1 text-xs rounded ${!canEdit
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white"
              }`}
          >
            Edit
          </button>


          <ProtectedActionButton
            module="modules"
            action="delete"
            executeAction={executeAction}
            mutationFn={deleteModule}
            variables={{ id: row.id }}
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
    <div className="p-10">
      {/* CREATE */}
      <ProtectedActionButton
        module="modules"
        action="create"
        executeAction={() => {
          setEditingModule(null);
          setOpenModal(true);
        }}
        className="px-5 py-2 bg-yellow-500 text-black rounded-lg"
      >
        Create Module
      </ProtectedActionButton>

      {/* GLOBAL CONFIRM MODAL */}
      <ConfirmModal
        open={!!confirmState}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirm}
      />

      {/* TABLE */}
      <div className="mt-10 overflow-x-auto">
        <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          <DataTable columns={moduleColumns} data={modules} />
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
            <h2 className="text-xl font-semibold">
              {editingModule ? "Edit Module" : "Create Module"}
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
                  setOpenModal(false);
                  setEditingModule(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-black text-white rounded"
              >
                {editingModule ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}