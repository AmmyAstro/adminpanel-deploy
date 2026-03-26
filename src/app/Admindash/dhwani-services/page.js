"use client";

import { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import Image from "next/image";
import toast from "react-hot-toast";
import { usePermissions } from "@/context/PermissionContext";

const GET_SERVICES = gql`
  query {
    getServices {
      id
      name
      slug
      type
      price
      description
      image
      parent {
        id
        name
      }
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

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        name: "",
        slug: "",
        type: "DIRECT_SERVICE",
        price: "",
        description: "",
        longText: "",
        categoryId: "",
    });

    const [categories, setCategories] = useState([]);
    const [catOpen, setCatOpen] = useState(false);
    const [newCatInput, setNewCatInput] = useState("");

    const [preview, setPreview] = useState("");

    const { data, refetch } = useQuery(GET_SERVICES, {
        skip: !canView,
    });

    const [createService] = useMutation(CREATE_SERVICE);

    // 🔥 extract categories
    useEffect(() => {
        if (data?.getServices) {
            const cats = data.getServices.filter(
                (i) => i.type === "CATEGORY"
            );
            setCategories(cats);
        }
    }, [data]);

    // 🔥 image preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    // 🔥 submit
    const handleSubmit = async () => {
        if (!canCreate) return;

        try {
            const isTempCategory =
                form.categoryId?.startsWith("temp-");

            await createService({
                variables: {
                    input: {
                        name: form.name,
                        slug: form.slug,
                        type: form.type,

                        price: form.price ? parseFloat(form.price) : null,

                        description: form.description,
                        longText: form.longText,
                        image: preview || "",

                        // 🔥 ONLY when CATEGORY selected
                        parentId:
                            form.type === "CATEGORY" && !isTempCategory
                                ? form.categoryId || null
                                : null,

                        newCategory:
                            form.type === "CATEGORY" && isTempCategory
                                ? newCatInput
                                : null,
                    },
                },
            });

            toast.success("Created 🚀");
            refetch();
            setOpen(false);

            // reset
            setForm({
                name: "",
                slug: "",
                type: "DIRECT_SERVICE",
                price: "",
                description: "",
                longText: "",
                categoryId: "",
            });

            setNewCatInput("");
            setPreview("");

        } catch (err) {
            console.error(err);
            toast.error("Error");
        }
    };

    if (!canView) {
        return (
            <div className="p-10 text-red-500">
                No permission to view
            </div>
        );
    }

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Services</h2>

                <button
                    disabled={!canCreate}
                    onClick={() => setOpen(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                    + Add Service
                </button>
            </div>

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

                        <h3 className="font-semibold">{item.name}</h3>

                        <p className="text-sm text-gray-500">
                            {item.description}
                        </p>

                        <p className="text-purple-600 font-bold">
                            ₹{item.price}
                        </p>

                        <p className="text-xs mt-1">
                            {item.type === "CATEGORY"
                                ? "Category"
                                : "Direct Service"}
                        </p>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-[420px]">

                        <h2 className="text-lg font-bold mb-4">
                            Add Service
                        </h2>

                        {/* NAME */}
                        <input
                            placeholder="Name"
                            className="border p-2 w-full mb-2"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        {/* SLUG */}
                        <input
                            placeholder="Slug"
                            className="border p-2 w-full mb-2"
                            value={form.slug}
                            onChange={(e) =>
                                setForm({ ...form, slug: e.target.value })
                            }
                        />

                        {/* TYPE */}
                        <select
                            className="border p-2 w-full mb-2"
                            value={form.type}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    type: e.target.value,
                                    categoryId: "", // reset
                                })
                            }
                        >
                            <option value="DIRECT_SERVICE">
                                Direct Service
                            </option>
                            <option value="CATEGORY">
                                Category
                            </option>
                        </select>

                        {/* 🔥 CATEGORY FIELD → ONLY WHEN CATEGORY SELECTED */}
                        {form.type === "CATEGORY" && (
                            <div className="relative mb-2">

                                <div
                                    onClick={() => setCatOpen(!catOpen)}
                                    className="border p-2 w-full cursor-pointer bg-white"
                                >
                                    {form.categoryId
                                        ? categories.find(
                                            (c) => c.id === form.categoryId
                                        )?.name
                                        : "Select Parent Category (Optional)"}
                                </div>

                                {catOpen && (
                                    <div className="absolute z-50 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-auto">

                                        {categories.map((cat) => (
                                            <div
                                                key={cat.id}
                                                onClick={() => {
                                                    setForm({
                                                        ...form,
                                                        categoryId: cat.id,
                                                    });
                                                    setCatOpen(false);
                                                }}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {cat.name}
                                            </div>
                                        ))}

                                        {/* INLINE CREATE */}
                                        <div className="flex items-center gap-2 p-2 border-t">
                                            <input
                                                placeholder="Create new category"
                                                className="flex-1 p-1 border rounded"
                                                value={newCatInput}
                                                onChange={(e) =>
                                                    setNewCatInput(e.target.value)
                                                }
                                            />

                                            <button
                                                className="bg-green-500 text-white px-2 rounded"
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    if (!newCatInput.trim()) return;

                                                    const newId =
                                                        "temp-" + Date.now();

                                                    setCategories((prev) => [
                                                        ...prev,
                                                        { id: newId, name: newCatInput },
                                                    ]);

                                                    setForm({
                                                        ...form,
                                                        categoryId: newId,
                                                    });

                                                    setNewCatInput("");
                                                    setCatOpen(false);
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}


                        <input
                            placeholder="Price"
                            className="border p-2 w-full mb-2"
                            value={form.price}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    price: e.target.value,
                                })
                            }
                        />


                        {/* DESCRIPTION */}
                        <input
                            placeholder="Short Description"
                            className="border p-2 w-full mb-2"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                        />

                        {/* LONG TEXT */}
                        <textarea
                            placeholder="Long Description"
                            className="border p-2 w-full mb-2"
                            value={form.longText}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    longText: e.target.value,
                                })
                            }
                        />

                        {/* IMAGE */}
                        <input
                            type="file"
                            accept="image/*"
                            className="border p-2 w-full mb-2"
                            onChange={handleImageChange}
                        />

                        {preview && (
                            <Image
                                src={preview}
                                alt="preview"
                                width={200}
                                height={200}
                                className="h-32 w-full object-cover rounded mb-2"
                            />
                        )}

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-purple-600 text-white py-2 rounded"
                        >
                            Save
                        </button>

                        <button
                            onClick={() => setOpen(false)}
                            className="w-full mt-2 text-gray-500"
                        >
                            Cancel
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}