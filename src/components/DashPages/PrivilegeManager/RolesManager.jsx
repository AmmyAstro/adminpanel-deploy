"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import {
    CREATE_ROLE,
    DELETE_ROLE,
    GET_ROLES,
    UPDATE_ROLE,
} from "@/app/graphQL/privilageOperations";

import DataTable from "@/components/utils/DataTable";
import { usePermissions } from "@/context/PermissionContext";
import { useActionHandler } from "@/hooks/useActionHandler";
import ConfirmModal from "@/components/Custom/ConfirmModal";
import ProtectedActionButton from "@/components/Custom/ActionButton";
import toast from "react-hot-toast";

export default function RolesManager() {
    const { can, isSuperAdmin } = usePermissions();

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

    // 🔥 PERMISSION FLAGS
    const canCreate = isSuperAdmin || can("roles", "create");
    const canUpdate = isSuperAdmin || can("roles", "update");

    useEffect(() => {
        if (editingRole) {
            setName(editingRole.name);
            setSlug(editingRole.slug);
            setDescription(editingRole.description || "");
        } else {
            resetForm();
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
            const canSubmit =
                isSuperAdmin ||
                (editingRole ? can("roles", "update") : can("roles", "create"));

            if (!canSubmit) return;

            if (editingRole) {
                await updateRole({
                    variables: {
                        roleId: editingRole.id,
                        name,
                        slug,
                        description,
                    },
                });

                toast.success("Role updated");   

            } else {
                await createRole({
                    variables: {
                        name,
                        slug,
                        description,
                    },
                });

                toast.success("Role created");  
            }

            // ✅ COMMON
            setOpenModal(false);
            resetForm();
            refetch();
        } catch (error) {
            console.error(error);
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
                        disabled={!canUpdate}
                        onClick={() => {
                            if (!canUpdate) return;
                            setEditingRole(row);
                            setOpenModal(true);
                        }}
                        className={`px-3 py-1 text-xs rounded-full ${!canUpdate
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white"
                            }`}
                    >
                        Edit
                    </button>

                    {/* DELETE */}
                    <ProtectedActionButton
                        module="roles"
                        action="delete"
                        executeAction={executeAction}
                        mutationFn={deleteRole}
                        variables={{ roleId: row.id }}
                        onSuccess={refetch}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded-full"
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
                    setOpenModal(true);
                }}
                className={`px-5 py-2 rounded-full ${!canCreate
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-500 text-black"
                    }`}
            >
                Create Role
            </button>

            {/* CONFIRM */}
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

            {/* MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
                        <h2 className="text-xl text-center text-violet-600  font-bold">
                            {editingRole ? "Edit Role" : "Create Role"}
                        </h2>

                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full border p-2 rounded-full border-gray-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Slug"
                            className="w-full border p-2 rounded-full border-gray-300"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                        />

                        <textarea
                            placeholder="Description"
                            className="w-full border p-2  border-gray-300 rounded-2xl"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => {
                                    resetForm();
                                    setOpenModal(false);
                                }}
                                className="px-4 py-2 border border-gray-500 rounded-full"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-green-600 text-white rounded-full"
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