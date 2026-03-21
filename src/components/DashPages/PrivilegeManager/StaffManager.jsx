"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import {
  CREATE_STAFF,
  DELETE_STAFF,
  GET_DEPARTMENTS,
  GET_PERMISSIONS,
  GET_ROLES,
  GET_STAFF,
  UPDATE_STAFF,
} from "@/app/graphQL/privilageOperations";

import CustomInput from "@/components/Custom/CustomInput";
import CustomDropdown from "@/components/Custom/CustomDropdown";
import CustomButton from "@/components/Custom/CustomButtom";
import DataTable from "@/components/utils/DataTable";

import { usePermissions } from "@/context/PermissionContext";
import { useActionHandler } from "@/hooks/useActionHandler";
import ProtectedActionButton from "@/components/Custom/ActionButton";
import ConfirmModal from "@/components/Custom/ConfirmModal";

export default function StaffManager() {
  /* =========================
      PERMISSIONS
  ========================= */

  const { can, isSuperAdmin } = usePermissions();

  const canCreate = isSuperAdmin || can("staff", "create");
  const canUpdate = isSuperAdmin || can("staff", "update");

  /* =========================
      ACTION HANDLER
  ========================= */

  const {
    confirmState,
    setConfirmState,
    executeAction,
    handleConfirm,
  } = useActionHandler();

  /* =========================
      QUERIES
  ========================= */

  const { data, refetch } = useQuery(GET_STAFF, {
    variables: { page: 1, limit: 10 },
  });

  const { data: depData } = useQuery(GET_DEPARTMENTS);
  const { data: roleData } = useQuery(GET_ROLES);
  const { data: permData } = useQuery(GET_PERMISSIONS);

  const staffList = data?.getStaff?.data || [];
  const departments = depData?.getDepartments?.data || [];
  const roles = roleData?.getRoles?.data || [];
  const permissions = permData?.getPermissions?.data || [];

  /* =========================
      MUTATIONS
  ========================= */

  const [createStaff] = useMutation(CREATE_STAFF);
  const [updateStaff] = useMutation(UPDATE_STAFF);
  const [deleteStaff] = useMutation(DELETE_STAFF);

  /* =========================
      STATE
  ========================= */

  const [openModal, setOpenModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    departmentId: "",
    roleId: "",
    permissionIds: [],
  });

  /* =========================
      HELPERS
  ========================= */

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      departmentId: "",
      roleId: "",
      permissionIds: [],
    });
    setEditingStaff(null);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* =========================
      CREATE / UPDATE
  ========================= */

  const handleSubmit = async () => {
    try {
      const canSubmit =
        isSuperAdmin ||
        (editingStaff
          ? can("staff", "update")
          : can("staff", "create"));

      if (!canSubmit) return;

      if (editingStaff) {
        await updateStaff({
          variables: {
            staffId: editingStaff.id,
            ...form,
          },
        });
      } else {
        await createStaff({
          variables: form,
        });
      }

      await refetch();
      resetForm();
      setOpenModal(false);
    } catch (err) {
      console.error("Staff save error:", err);
    }
  };

  /* =========================
      EDIT
  ========================= */

  const handleEdit = (staff) => {
    if (!canUpdate) return;

    setEditingStaff(staff);

    setForm({
      name: staff.name,
      email: staff.email,
      password: "",
      departmentId: staff.department?.id || "",
      roleId: staff.role?.id || "",
      permissionIds: staff.permissions.map((p) => p.id),
    });

    setOpenModal(true);
  };

  /* =========================
      TABLE
  ========================= */

  const staffColumns = useMemo(
    () => [
      { header: "Name", accessor: "name" },
      { header: "Email", accessor: "email" },
      {
        header: "Department",
        render: (row) => row.department?.name || "-",
      },
      {
        header: "Role",
        render: (row) => row.role?.name || "-",
      },
      {
        header: "Permissions",
        render: (row) =>
          row.permissions?.map((p) => p.name).join(", ") || "-",
      },
      {
        header: "Actions",
        render: (row) => (
          <div className="flex justify-center gap-2">
            {/* EDIT */}
            <button
              disabled={!canUpdate}
              onClick={() => handleEdit(row)}
              className={`px-3 py-1 text-xs rounded ${
                !canUpdate
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
            >
              Edit
            </button>

            {/* DELETE */}
            <ProtectedActionButton
              module="staff"
              action="delete"
              executeAction={executeAction}
              mutationFn={deleteStaff}
              variables={{ staffId: row.id }}
              onSuccess={refetch}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded"
            >
              Delete
            </ProtectedActionButton>
          </div>
        ),
      },
    ],
    [canUpdate]
  );

  /* =========================
      UI
  ========================= */

  return (
    <div className="p-10 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Staff Management
        </h2>

        <CustomButton
          disabled={!canCreate}
          className={`px-4 py-1 ${
            !canCreate
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : ""
          }`}
          variant="green"
          onClick={() => {
            if (!canCreate) return;
            resetForm();
            setOpenModal(true);
          }}
        >
          Create Staff
        </CustomButton>
      </div>

      {/* CONFIRM */}
      <ConfirmModal
        open={!!confirmState}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirm}
      />

      {/* TABLE */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        <DataTable columns={staffColumns} data={staffList} />
      </div>

      {/* MODAL */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenModal(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-lg w-[700px] p-8 space-y-6">
            <h3 className="text-lg font-semibold">
              {editingStaff ? "Edit Staff" : "Create Staff"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                label="Name"
                value={form.name}
                onChange={(e) =>
                  updateField("name", e.target.value)
                }
              />

              <CustomInput
                label="Email"
                value={form.email}
                onChange={(e) =>
                  updateField("email", e.target.value)
                }
              />

              {!editingStaff && (
                <CustomInput
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    updateField("password", e.target.value)
                  }
                />
              )}

              <CustomDropdown
                value={form.departmentId}
                onChange={(e) =>
                  updateField("departmentId", e.target.value)
                }
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </CustomDropdown>

              <CustomDropdown
                value={form.roleId}
                onChange={(e) =>
                  updateField("roleId", e.target.value)
                }
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </CustomDropdown>

              {/* PERMISSIONS */}
              <div className="flex flex-col col-span-2">
                <label className="mb-2 font-medium">
                  Permissions
                </label>

                <div className="border rounded-md p-3 max-h-40 overflow-y-auto grid grid-cols-2 gap-2">
                  {permissions.map((p) => {
                    const checked = form.permissionIds.includes(
                      p.id
                    );

                    return (
                      <label
                        key={p.id}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const updated = checked
                              ? form.permissionIds.filter(
                                  (id) => id !== p.id
                                )
                              : [...form.permissionIds, p.id];

                            updateField("permissionIds", updated);
                          }}
                        />
                        {p.name}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <CustomButton
                className="px-4 py-1"
                variant="gray"
                onClick={() => {
                  resetForm();
                  setOpenModal(false);
                }}
              >
                Cancel
              </CustomButton>

              <CustomButton
                className="px-4 py-1"
                variant="green"
                onClick={handleSubmit}
              >
                {editingStaff ? "Update" : "Create"}
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}