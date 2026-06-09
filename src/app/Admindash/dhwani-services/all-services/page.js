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
import { DELETE_CATEGORY, GET_CATEGORIES } from "@/app/graphQL/astroHiring";

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
  const { data: catData,  refetch: refetchCategories, } = useQuery(GET_CATEGORIES);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);
  const { can, isSuperAdmin } = usePermissions();
  const { confirmState, setConfirmState, executeAction, handleConfirm } =
    useActionHandler();

  const canRead = isSuperAdmin || can("services", "read");
  const canCreate = isSuperAdmin || can("services", "create");
  const canUpdate = isSuperAdmin || can("services", "update");

  const { data, refetch } = useQuery(GET_SERVICES);

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
  const [file, setFile] = useState(null);

  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [preview, setPreview] = useState("");
  const [modalType, setModalType] = useState("service");
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
    setFile(null);
    setEditing(null);
    setIsNewCategory(false);
    setNewCategoryInput("");
  };

  /* ------------------ IMAGE ------------------ */

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  /* ------------------ SUBMIT ------------------ */
  const handleDeleteCategory = (id) => {
    executeAction({
      mutationFn: deleteCategory,
      variables: { id },
      refetch,
    });
  };

  const handleServiceSubmit = async () => {
    let imageUrl = "";

    if (file) {
      const formData = new FormData();

      formData.append("image", file);

      const res = await fetch(
        "https://dhwaniastro.com/adminAuth/api/upload-services",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      const data = await res.json();

      if (!data.url) {
        throw new Error("Invalid upload response");
      }

      imageUrl = data.url;
    }

    await createService({
      variables: {
        input: {
          name: form.name,
          slug: form.slug,
          image: imageUrl,
          price: Number(form.price),
          description: form.description,
          longText: form.longText,
          categoryId: form.categoryId || null,
        },
      },
    });

    toast.success("Service Created");

    refetch();
    resetForm();
    setOpen(false);
  };

  /* ------------------ DELETE ------------------ */

  const handleDelete = (id) => {
    executeAction({
      mutationFn: deleteService,
      variables: { id },
      onSuccess: refetch,
    });
  };

  const handleCategorySubmit = async () => {
    let imageUrl = "";

    if (file) {
      const formData = new FormData();

      formData.append("image", file);

      const res = await fetch(
        "https://dhwaniastro.com/adminAuth/api/upload-services",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      const data = await res.json();

      if (!data.url) {
        throw new Error("Invalid upload response");
      }

      imageUrl = data.url;
    }

    await createCategory({
      variables: {
        input: {
          name: form.name,
          slug: form.slug,
          image: imageUrl,
        },
      },
    });

    toast.success("Category Created");

    refetchCategories();
    resetForm();
    setOpen(false);
  };
  /* ------------------ UI ------------------ */

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => {
            resetForm();
            setModalType("category");
            setOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Category
        </button>

        <button
          onClick={() => {
            resetForm();
            setModalType("service");
            setOpen(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          + Add Service
        </button>
      </div>

      <ConfirmModal
        open={!!confirmState}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirm}
      />

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {catData?.getCategories?.map((cat) => (
    <div
      key={cat.id}
      className="bg-white shadow rounded-lg overflow-hidden"
    >
      {cat.image && (
        <Image
          src={`https://dhwaniastro.com${cat.image}`}
          alt={cat.name}
          width={250}
          height={150}
          className="w-full h-32 object-cover"
        />
      )}

      <div className="p-3">
        <h3 className="font-semibold">
          {cat.name}
        </h3>

        <p className="text-xs text-gray-500 mb-3">
          {cat.slug}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setModalType("category");
              setEditing(cat);
              setOpen(true);
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
          >
            Edit
          </button>

          <ProtectedActionButton
            module="services"
            action="delete"
            executeAction={executeAction}
            mutationFn={deleteCategory}
            variables={{ id: cat.id }}
           onSuccess={refetch}
            className="bg-red-500 text-white px-3 py-1 rounded text-xs"
          >
            Delete
          </ProtectedActionButton>
        </div>
      </div>
    </div>
  ))}
</div>

      {/* LIST */}
      <div className="grid grid-cols-3 gap-4">
        {data?.getServices?.map((item) => (
          <div key={item.id} className="p-4 bg-white shadow rounded">
            {item.image && (
              <Image
                src={`https://dhwaniastro.com${item.image}`}
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
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {modalType === "category" ? "Add Category" : "Add Service"}
            </h2>

            {/* CATEGORY FORM */}

            {modalType === "category" && (
              <>
                <input
                  placeholder="Category Name"
                  className="border p-2 w-full mb-3"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Category Slug"
                  className="border p-2 w-full mb-3"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      slug: e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  className="border p-2 w-full mb-3"
                  onChange={handleImageChange}
                />

                {preview && (
                  <Image
                    src={preview}
                    alt=""
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}

                <button
                  onClick={handleCategorySubmit}
                  className="bg-green-600 text-white w-full p-2 rounded"
                >
                  Save Category
                </button>
              </>
            )}

            {/* SERVICE FORM */}

            {modalType === "service" && (
              <>
                <input
                  placeholder="Service Name"
                  className="border p-2 w-full mb-3"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Service Slug"
                  className="border p-2 w-full mb-3"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      slug: e.target.value,
                    })
                  }
                />

                {/* CATEGORY DROPDOWN */}

                <select
                  className="border p-2 w-full mb-3"
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categoryId: e.target.value,
                    })
                  }
                >
                  <option value="">Direct Service</option>

                  {catData?.getCategories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Price"
                  className="border p-2 w-full mb-3"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Short Description"
                  className="border p-2 w-full mb-3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Long Description"
                  className="border p-2 w-full mb-3"
                  rows={5}
                  value={form.longText}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      longText: e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  className="border p-2 w-full mb-3"
                  onChange={handleImageChange}
                />

                {preview && (
                  <Image
                    src={preview}
                    alt=""
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}

                <button
                  onClick={handleServiceSubmit}
                  className="bg-purple-600 text-white w-full p-2 rounded"
                >
                  Save Service
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
