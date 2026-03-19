"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { CREATE_PERMISSION, DELETE_PERMISSION, GET_MODULES, GET_PERMISSIONS, UPDATE_PERMISSION } from "@/app/graphQL/privilageOperations";
import DataTable from "@/components/utils/DataTable";


export default function PermissionManager() {
  const { data, refetch } = useQuery(GET_PERMISSIONS, {
    variables: { page: 1, limit: 10 },
  });
  const { data: moduleData } = useQuery(GET_MODULES);

  const [createPermission] = useMutation(CREATE_PERMISSION);
  const [updatePermission] = useMutation(UPDATE_PERMISSION);
  const [deletePermission] = useMutation(DELETE_PERMISSION);

  const permissions = data?.getPermissions?.data || [];
const modules = moduleData?.getModules?.data || [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [selectedModules, setSelectedModules] = useState([]);

  const resetForm = () => {
    setName("");
    setSelectedModules([]);
    setEditing(null);
  };

  const handleSubmit = async () => {
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
        },
      });
    }

    await refetch();
    resetForm();
    setOpen(false);
  };

  const handleDelete = async (id) => {
    await deletePermission({ variables: { permissionId: id } });
    refetch();
  };
  const permissionColumns = [
  {
    header: "Name",
    accessor: "name",
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
        <button
          onClick={() => {
            setEditing(row);
            setName(row.name);
            setSelectedModules(row.modules?.map((m) => m.id) || []);
            setOpen(true);
          }}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(row.id)}
          className="px-3 py-1 text-xs bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    ),
  },
];

  return (
    <div className="p-10 space-y-5">
      <button
        onClick={() => {
          resetForm();
          setOpen(true);
        }}
        className="bg-yellow-500 px-4 py-2 rounded"
      >
        Create Permission
      </button>

     


     <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
     
    <DataTable
    columns={permissionColumns}
    data={permissions}
  />
     
     </div>

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
                  (o) => o.value,
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
