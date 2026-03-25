"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

import { usePermissions } from "@/context/PermissionContext";
import ProtectedActionButton from "@/components/Custom/ActionButton";
import { useActionHandler } from "@/hooks/useActionHandler";
import ConfirmModal from "@/components/Custom/ConfirmModal";
import toast from "react-hot-toast";

const GET_SERVICES = gql`
  query ($parentId: ID) {
    getServices(parentId: $parentId) {
      id
      name
      slug
      hasChildren
    }
  }
`;

const CREATE_SERVICE = gql`
  mutation ($input: CreateServiceInput!) {
    createService(input: $input) {
      id
    }
  }
`;

export default function DhwaniServicesAdmin() {
  const { can, isSuperAdmin } = usePermissions();

  const canCreate = isSuperAdmin || can("dhwani-services", "create");
  const canView = isSuperAdmin || can("dhwani-services", "read");

  const [parentId, setParentId] = useState(null);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "SERVICE",
    price: "",
  });

  const { data, refetch } = useQuery(GET_SERVICES, {
    variables: { parentId },
    skip: !canView, // 🔥 block API if no permission
  });

  const [createService] = useMutation(CREATE_SERVICE);
//   canUpdate = can("dhwani-services", "update")
// canDelete = can("dhwani-services", "delete")

  const handleSubmit = async () => {
    if (!canCreate) return;

    try {
      await createService({
        variables: {
          input: {
            ...form,
            parentId,
            price: form.price ? parseFloat(form.price) : null,
          },
        },
      });

      toast.success("Service created");
      refetch();
      setOpen(false);
      setForm({ name: "", slug: "", type: "SERVICE", price: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ NO VIEW PERMISSION
  if (!canView) {
    return (
      <div className="p-10 text-red-500">
        You do not have permission to view this page
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {parentId ? "Sub Services" : "All Services"}
        </h2>

        {/* CREATE BUTTON */}
        <button
          disabled={!canCreate}
          onClick={() => {
            if (!canCreate) return;
            setOpen(true);
          }}
          className={`px-4 py-2 rounded ${
            !canCreate
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-600 text-white"
          }`}
        >
          + Add
        </button>
      </div>

      {/* BACK */}
      {parentId && (
        <button
          onClick={() => setParentId(null)}
          className="mb-4 text-blue-500"
        >
          ← Back
        </button>
      )}

      {/* LIST */}
      <div className="grid grid-cols-3 gap-4">
        {data?.getServices.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-50"
            onClick={() => {
              if (item.hasChildren) {
                setParentId(item.id);
              }
            }}
          >
            <p className="font-semibold">{item.name}</p>

            {item.hasChildren && (
              <p className="text-sm text-purple-500">Open →</p>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-[400px]">

            <h2 className="text-lg font-bold mb-4">
              {parentId ? "Add Sub Service" : "Add Service"}
            </h2>

            <input
              placeholder="Name"
              className="border p-2 w-full mb-2"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Slug"
              className="border p-2 w-full mb-2"
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: e.target.value })
              }
            />

            <select
              className="border p-2 w-full mb-2"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="SERVICE">Service</option>
              <option value="CATEGORY">Category</option>
            </select>

            {form.type === "SERVICE" && (
              <input
                placeholder="Price"
                className="border p-2 w-full mb-2"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />
            )}

            <button
              disabled={!canCreate}
              onClick={handleSubmit}
              className={`w-full px-4 py-2 rounded ${
                !canCreate
                  ? "bg-gray-300 text-gray-500"
                  : "bg-purple-600 text-white"
              }`}
            >
              Save
            </button>

            <button
              onClick={() => setOpen(false)}
              className="mt-2 text-gray-500 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}