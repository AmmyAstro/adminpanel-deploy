"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import {
  CREATE_PERMISSION,
  DELETE_PERMISSION,
  GET_MODULES,
  GET_PERMISSIONS,
  UPDATE_PERMISSION,
} from "@/app/graphQL/privilageOperations";

import DataTable from "@/components/utils/DataTable";
import { usePermissions } from "@/context/PermissionContext";
import { useActionHandler } from "@/hooks/useActionHandler";
import ProtectedActionButton from "@/components/Custom/ActionButton";
import ConfirmModal from "@/components/Custom/ConfirmModal";

export default function PermissionManager() {
  const { can, isSuperAdmin } = usePermissions();

  const {
    confirmState,
    setConfirmState,
    executeAction,
    handleConfirm,
  } = useActionHandler();

  const { data, refetch } = useQuery(GET_PERMISSIONS, {
    variables: { page: 1, limit: 100 },
  });

  const { data: moduleData } = useQuery(GET_MODULES);

  const [createPermission] = useMutation(CREATE_PERMISSION);
  const [updatePermission] = useMutation(UPDATE_PERMISSION);
  const [deletePermission] = useMutation(DELETE_PERMISSION);

  const permissions = data?.getPermissions?.data || [];
  const modules = moduleData?.getModulesPaginated?.data || [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [selectedModules, setSelectedModules] = useState([]);

  const [activeTab, setActiveTab] = useState("ALL");

  // 🔥 PERMISSION FLAGS
  const canCreate = isSuperAdmin || can("permissions", "create");
  const canUpdate = isSuperAdmin || can("permissions", "update");

  // 🔥 COUNTS
  const counts = useMemo(() => {
    const system = permissions.filter((p) => p.type === "SYSTEM").length;
    const custom = permissions.filter((p) => p.type === "CUSTOM").length;

    return {
      ALL: permissions.length,
      SYSTEM: system,
      CUSTOM: custom,
    };
  }, [permissions]);

  // 🔥 FILTER
  const filteredPermissions = useMemo(() => {
    if (activeTab === "ALL") return permissions;
    return permissions.filter((p) => p.type === activeTab);
  }, [permissions, activeTab]);

  const resetForm = () => {
    setName("");
    setSelectedModules([]);
    setEditing(null);
  };

  const handleSubmit = async () => {
    try {
      if (name.includes(".")) {
        alert("System permissions cannot be created manually");
        return;
      }

      const canSubmit =
        isSuperAdmin ||
        (editing ? can("permissions", "update") : can("permissions", "create"));

      if (!canSubmit) return;

      if (editing) {
        await updatePermission({
          variables: {
            permissionId: editing.id,
            name,
            moduleIds: selectedModules,
          },
        });
      } else {
        await createPermission({
          variables: {
            name,
            moduleIds: selectedModules,
            type: "CUSTOM",
          },
        });
      }

      await refetch();
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error("Permission save error:", err);
    }
  };

  const permissionColumns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Type",
      render: (row) => {
        const isSystem = row.type === "SYSTEM";

        return (
          <span
            className={`px-2 py-1 text-xs rounded ${
              isSystem
                ? "bg-gray-200 text-gray-700"
                : "bg-green-200 text-green-800"
            }`}
          >
            {isSystem ? "System Default" : "Custom"}
          </span>
        );
      },
    },
    {
      header: "Modules",
      render: (row) =>
        row.modules?.map((m) => m.name).join(", ") || "-",
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-2">
          {/* EDIT */}
          {row.type === "CUSTOM" && (
            <button
              disabled={!canUpdate}
              onClick={() => {
                if (!canUpdate) return;
                setEditing(row);
                setName(row.name);
                setSelectedModules(
                  row.modules?.map((m) => m.id) || []
                );
                setOpen(true);
              }}
              className={`px-3 py-1 text-xs rounded ${
                !canUpdate
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
            >
              Edit
            </button>
          )}

          {/* DELETE */}
          {row.type === "CUSTOM" && (
            <ProtectedActionButton
              module="permissions"
              action="delete"
              executeAction={executeAction}
              mutationFn={deletePermission}
              variables={{ permissionId: row.id }}
              onSuccess={refetch}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded"
            >
              Delete
            </ProtectedActionButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-10 space-y-5">
      {/* 🔥 TABS */}
      <div className="flex gap-2">
        {["ALL", "SYSTEM", "CUSTOM"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* CREATE */}
      <button
        disabled={!canCreate || activeTab === "SYSTEM"}
        onClick={() => {
          if (!canCreate) return;
          resetForm();
          setOpen(true);
        }}
        className={`px-4 py-2 rounded ${
          !canCreate || activeTab === "SYSTEM"
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-yellow-500"
        }`}
      >
        Create Permission
      </button>

      {/* CONFIRM */}
      <ConfirmModal
        open={!!confirmState}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirm}
      />

      {/* TABLE */}
      <div className="w-full bg-white shadow-md rounded-xl border overflow-hidden">
        <DataTable
          columns={permissionColumns}
          data={filteredPermissions}
        />
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 w-[400px] space-y-4">
            <input
              placeholder="Permission Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full"
            />

            <select
              multiple
              value={selectedModules}
              onChange={(e) => {
                const values = [...e.target.selectedOptions].map(
                  (o) => o.value
                );
                setSelectedModules(values);
              }}
              className="border p-2 w-full h-40"
            >
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2 justify-end">
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
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}