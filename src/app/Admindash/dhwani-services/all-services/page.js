"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import Image from "next/image";
import toast from "react-hot-toast";

import { usePermissions } from "@/context/PermissionContext";
import { useActionHandler } from "@/hooks/useActionHandler";
import ConfirmModal from "@/components/Custom/ConfirmModal";
import ProtectedActionButton from "@/components/Custom/ActionButton";
import { gql } from "@apollo/client";

/* ------------------ GRAPHQL ------------------ */

const GET_SERVICES = gql`
  query getServices {
    getServices {
      id
      name
      slug
      type
      price
      description
      image
      category {
        id
        name
      }
    }
  }
`;

const GET_CATEGORIES = gql`
  query getCategories {
    getCategories {
      id
      name
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation ($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
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

const UPDATE_SERVICE = gql`
  mutation ($id: ID!, $input: CreateServiceInput!) {
    updateService(id: $id, input: $input) {
      id
    }
  }
`;

const DELETE_SERVICE = gql`
  mutation ($id: ID!) {
    deleteService(id: $id)
  }
`;

/* ------------------ COMPONENT ------------------ */

export default function DhwaniServicesAdmin() {
  const client = useApolloClient();

  const { can, isSuperAdmin } = usePermissions();
  const { confirmState, setConfirmState, executeAction, handleConfirm } =
    useActionHandler();

const canRead = isSuperAdmin || can("services", "read");
const canCreate = isSuperAdmin || can("services", "create");
const canUpdate = isSuperAdmin || can("services", "update");

  const { data, refetch } = useQuery(GET_SERVICES);
  const { data: catData, refetch: refetchCategories } =
    useQuery(GET_CATEGORIES);

  const [createCategory] = useMutation(CREATE_CATEGORY);
  const [createService] = useMutation(CREATE_SERVICE);
  const [updateService] = useMutation(UPDATE_SERVICE);
  const [deleteService] = useMutation(DELETE_SERVICE);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "DIRECT_SERVICE",
    price: "",
    description: "",
    longText: "",
    categoryId: "",
  });

  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [preview, setPreview] = useState("");

  /* ------------------ EDIT PREFILL ------------------ */

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        slug: editing.slug,
        type: editing.type,
        price: editing.price || "",
        description: editing.description || "",
        longText: editing.longText || "",
        categoryId: editing.category?.id || "",
      });

      setPreview(editing.image || "");
    }
  }, [editing]);

  /* ------------------ RESET ------------------ */

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      type: "DIRECT_SERVICE",
      price: "",
      description: "",
      longText: "",
      categoryId: "",
    });
    setPreview("");
    setEditing(null);
    setIsNewCategory(false);
    setNewCategoryInput("");
  };

  /* ------------------ IMAGE ------------------ */

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ------------------ SUBMIT ------------------ */

  const handleSubmit = async () => {
    try {
      const allowed =
        isSuperAdmin ||
        (editing
          ? can("services", "update")
          : can("services", "create"));

      if (!allowed) return;

      if (form.type === "CATEGORY" && !form.categoryId) {
        return toast.error("Category required");
      }

      const input = {
        name: form.name,
        slug: form.slug,
        type: form.type,
        price: form.price ? parseFloat(form.price) : null,
        description: form.description,
        longText: form.longText,
        image: preview || "",
        categoryId:
          form.type === "CATEGORY" ? form.categoryId : null,
      };

      if (editing) {
        await updateService({ variables: { id: editing.id, input } });
        toast.success("Updated ✅");
      } else {
        await createService({ variables: { input } });
        toast.success("Created 🚀");
      }

      resetForm();
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ------------------ DELETE ------------------ */

  const handleDelete = (id) => {
    executeAction({
      mutationFn: deleteService,
      variables: { id },
      onSuccess: refetch,
    });
  };

  /* ------------------ UI ------------------ */

  return (
    <div className="p-6">

      <button
        disabled={!canCreate}
        onClick={() => {
          if (!canCreate) return;
          resetForm();
          setOpen(true);
        }}
        className={`px-4 py-2 mb-4 rounded ${
          !canCreate
            ? "bg-gray-300 text-gray-500"
            : "bg-purple-600 text-white"
        }`}
      >
        + Add Service
      </button>

      <ConfirmModal
        open={!!confirmState}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirm}
      />

      {/* LIST */}
      <div className="grid grid-cols-3 gap-4">
        {data?.getServices?.map((item) => (
          <div key={item.id} className="p-4 bg-white shadow rounded">

            {item.image && (
              <Image
                src={item.image}
                alt=""
                width={300}
                height={150}
                className="h-32 w-full object-cover rounded mb-2"
              />
            )}

            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>₹{item.price || "-"}</p>
            <p>Type: {item.type}</p>
            <p>Category: {item.category?.name || "None"}</p>

            <div className="flex gap-2 mt-2">
              <button
                disabled={!canUpdate}
                onClick={() => {
                  if (!canUpdate) return;
                  setEditing(item);
                  setOpen(true);
                }}
                className="bg-blue-500 text-white px-2 py-1 text-xs"
              >
                Edit
              </button>

              <ProtectedActionButton
                module="services"
                action="delete"
                executeAction={executeAction}
                mutationFn={deleteService}
                variables={{ id: item.id }}
                onSuccess={refetch}
                className="bg-red-500 text-white px-2 py-1 text-xs"
              >
                Delete
              </ProtectedActionButton>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-[420px]">

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
              onChange={(e) => {
                setForm({
                  ...form,
                  type: e.target.value,
                  categoryId: "",
                });
                setIsNewCategory(false);
              }}
            >
              <option value="DIRECT_SERVICE">Direct</option>
              <option value="CATEGORY">Category</option>
            </select>

            {/* CATEGORY */}
            {form.type === "CATEGORY" && (
              <>
                {!isNewCategory ? (
                  <select
                    className="border p-2 w-full mb-2"
                    value={form.categoryId || ""}
                    onChange={(e) => {
                      if (e.target.value === "__new__") {
                        setIsNewCategory(true);
                      } else {
                        setForm({
                          ...form,
                          categoryId: e.target.value,
                        });
                      }
                    }}
                  >
                    <option value="">Select Category</option>

                    {catData?.getCategories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}

                    <option value="__new__">+ Create New</option>
                  </select>
                ) : (
                  <div className="flex gap-2 mb-2">
                    <input
                      placeholder="New Category"
                      className="border p-2 flex-1"
                      value={newCategoryInput}
                      onChange={(e) =>
                        setNewCategoryInput(e.target.value)
                      }
                    />

                    <button
                      className="bg-green-500 text-white px-3"
                      onClick={async () => {
                        const name = newCategoryInput.trim().toLowerCase();

                        if (!name) return toast.error("Enter name");

                        const existing = catData?.getCategories?.find(
                          (c) => c.name.toLowerCase() === name
                        );

                        if (existing) {
                          setForm({
                            ...form,
                            categoryId: existing.id,
                          });
                          setIsNewCategory(false);
                          setNewCategoryInput("");
                          return;
                        }

                        const res = await createCategory({
                          variables: { input: { name } },
                        });

                        await refetchCategories(); // 🔥 fix

                        setForm({
                          ...form,
                          categoryId: res.data.createCategory.id,
                        });

                        setIsNewCategory(false);
                        setNewCategoryInput("");
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </>
            )}

            {/* EXTRA FIELDS */}
            <input
              placeholder="Price"
              className="border p-2 w-full mb-2"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <input
              placeholder="Description"
              className="border p-2 w-full mb-2"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <textarea
              placeholder="Long Text"
              className="border p-2 w-full mb-2"
              value={form.longText}
              onChange={(e) =>
                setForm({ ...form, longText: e.target.value })
              }
            />

            <input
              type="file"
              className="border p-2 w-full mb-2"
              onChange={handleImageChange}
            />

            {preview && (
              <Image
                src={preview}
                alt=""
                width={200}
                height={200}
                className="h-32 w-full object-cover"
              />
            )}

            <button
              onClick={handleSubmit}
              className="bg-purple-600 text-white w-full p-2"
            >
              Save
            </button>

          </div>
        </div>
      )}
    </div>
  );
}