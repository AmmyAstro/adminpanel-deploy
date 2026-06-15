"use client";

import { CREATE_BLOG_CATEGORY, DELETE_BLOG_CATEGORY, GET_BLOG_CATEGORIES, UPDATE_BLOG_CATEGORY } from "@/app/graphQL/managecms";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";





export default function Page() {
  const [showForm, setShowForm] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      slug: "",
    });

  const { data, loading, refetch } =
    useQuery(GET_BLOG_CATEGORIES);

  const [createCategory] =
    useMutation(CREATE_BLOG_CATEGORY);

  const [updateCategory] =
    useMutation(UPDATE_BLOG_CATEGORY);

  const [deleteCategory] =
    useMutation(DELETE_BLOG_CATEGORY);

  const handleSubmit = async () => {
    try {
      if (editing) {
        await updateCategory({
          variables: {
            id: editing.id,
            input: formData,
          },
        });
      } else {
        await createCategory({
          variables: {
            input: formData,
          },
        });
      }

      await refetch();

      setFormData({
        name: "",
        slug: "",
      });

      setEditing(null);

      setShowForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (category) => {
    setEditing(category);

    setFormData({
      name: category.name,
      slug: category.slug,
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Delete this category?"
      )
    )
      return;

    await deleteCategory({
      variables: {
        id,
      },
    });

    refetch();
  };

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-bold">
          Blog Categories
        </h1>

        <button
          onClick={() =>
            setShowForm(true)
          }
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Create Blog Category
        </button>

      </div>

      {/* FORM */}

      {showForm && (
        <div className="border rounded-lg p-5 mb-8 bg-white">

          <div className="grid grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name:
                    e.target.value,
                })
              }
              className="border p-3 rounded"
            />

            <input
              type="text"
              placeholder="Slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  slug:
                    e.target.value,
                })
              }
              className="border p-3 rounded"
            />

          </div>

          <div className="flex gap-3 mt-5">

            <button
              onClick={
                handleSubmit
              }
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {editing
                ? "Update"
                : "Submit"}
            </button>

            <button
              onClick={() => {
                setShowForm(false);

                setEditing(null);

                setFormData({
                  name: "",
                  slug: "",
                });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      {/* LIST */}

      <div className="bg-white rounded-lg border">

        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Slug
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {!loading &&
              data?.blogCategories?.map(
                (item) => (
                  <tr
                    key={item.id}
                    className="border-b"
                  >
                    <td className="p-4">
                      {item.name}
                    </td>

                    <td className="p-4">
                      {item.slug}
                    </td>

                    <td className="p-4 flex gap-2">

                      <button
                        onClick={() =>
                          handleEdit(
                            item
                          )
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            item.id
                          )
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                )
              )}

          </tbody>

        </table>

      </div>

    </div>
  );
}