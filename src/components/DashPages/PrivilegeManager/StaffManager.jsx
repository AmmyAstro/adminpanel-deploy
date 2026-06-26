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
  const { can, isSuperAdmin } = usePermissions();
  const canCreate = isSuperAdmin || can("staff", "create");
  const canUpdate = isSuperAdmin || can("staff", "update");
  const { confirmState, setConfirmState, executeAction, handleConfirm } =
    useActionHandler();
  const { data, refetch } = useQuery(GET_STAFF, {
    variables: { page: 1, limit: 10 },
  });
  const { data: depData } = useQuery(GET_DEPARTMENTS);
  const { data: roleData } = useQuery(GET_ROLES);
  const { data: permData } = useQuery(GET_PERMISSIONS, {
    variables: {
      page: 1,
      limit: 1000,
    },
  });
  const staffList = data?.getStaff?.data || [];
  const departments = depData?.getDepartments?.data || [];
  const roles = roleData?.getRoles?.data || [];
  const permissions = permData?.getPermissions?.data || [];

  const groupedPermissions = useMemo(() => {
    return permissions.reduce((acc, permission) => {
      const module = permission.modules?.[0];

      if (!module) return acc;

      if (!acc[module.id]) {
        acc[module.id] = {
          id: module.id,
          name: module.name,
          permissions: [],
        };
      }

      acc[module.id].permissions.push(permission);

      return acc;
    }, {});
  }, [permissions]);
  const formatPermissionName = (permission) => {
    if (!permission.includes(".")) return permission;

    const [module, action] = permission.split(".");

    const actionMap = {
      read: "View",
      create: "Create",
      update: "Update",
      delete: "Delete",
    };

    const moduleName = module
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return `${actionMap[action] || action} ${moduleName}`;
  };

  const getActionColor = (name) => {
    const action = name.split(".")[1];

    switch (action) {
      case "read":
        return "bg-blue-100 text-blue-700";

      case "create":
        return "bg-green-100 text-green-700";

      case "update":
        return "bg-yellow-100 text-yellow-700";

      case "delete":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const [createStaff] = useMutation(CREATE_STAFF);
  const [updateStaff] = useMutation(UPDATE_STAFF);
  const [deleteStaff] = useMutation(DELETE_STAFF);

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

  const handleSubmit = async () => {
    try {
      const canSubmit =
        isSuperAdmin ||
        (editingStaff ? can("staff", "update") : can("staff", "create"));

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
        render: (row) => row.permissions?.map((p) => p.name).join(", ") || "-",
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
    [canUpdate],
  );

  return (
    <div className="p-10 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Staff Management</h2>

        <CustomButton
          disabled={!canCreate}
          className={`px-4 py-1 ${
            !canCreate ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
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

      <ConfirmModal
        open={!!confirmState}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirm}
      />

      <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        <DataTable columns={staffColumns} data={staffList} />
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[700px] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingStaff ? "Edit Staff" : "Create Staff"}
              </h3>

              <button
                onClick={() => {
                  resetForm();
                  setOpenModal(false);
                }}
                className="text-gray-500 hover:text-red-500 text-md cursor-pointer bg-gray-200 rounded-full h-8 w-8"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                label="Name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />

              <CustomInput
                label="Email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />

              {!editingStaff && (
                <CustomInput
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                />
              )}

              <CustomDropdown
                value={form.departmentId}
                onChange={(e) => updateField("departmentId", e.target.value)}
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
                onChange={(e) => updateField("roleId", e.target.value)}
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
                <div className="border rounded-md p-3 max-h-60 overflow-y-auto grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <label className="mb-3 block font-semibold text-gray-700">
                      Permissions
                    </label>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-h-[420px] overflow-y-auto pr-2">
                      {Object.values(groupedPermissions).map((module) => (
                        <div
                          key={module.id}
                          className="border border-gray-300  rounded-xl shadow-sm overflow-hidden"
                        >
                          {/* Header */}

                          <div className="bg-purple-200 px-4 py-2 flex items-center justify-between border-b">
                            <h3 className="font-semibold text-xs text-violet-700">
                              {module.name}
                            </h3>

                            {/* <span className="bg-violet-200 text-violet-700 text-xs px-2 py-1 rounded-full">
                              {module.permissions.length}
                            </span> */}
                          </div>

                          {/* Permissions */}

                          <div className="divide-y">
                            {module.permissions.map((permission) => {
                              const checked = form.permissionIds.includes(
                                permission.id,
                              );

                              return (
                                <label
                                  key={permission.id}
                                  className="flex items-center justify-between px-4 py-1 cursor-pointer hover:bg-gray-50"
                                >
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        const updated = checked
                                          ? form.permissionIds.filter(
                                              (id) => id !== permission.id,
                                            )
                                          : [
                                              ...form.permissionIds,
                                              permission.id,
                                            ];

                                        updateField("permissionIds", updated);
                                      }}
                                    />

                                    {/* <span className="text-sm font-medium">
                                      {formatPermissionName(permission.name)}
                                    </span> */}
                                  </div>

                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${getActionColor(permission.name)}`}
                                  >
                                    {permission.name.split(".")[1] === "read"
                                      ? "View"
                                      : permission.name
                                          .split(".")[1]
                                          .charAt(0)
                                          .toUpperCase() +
                                        permission.name.split(".")[1].slice(1)}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
