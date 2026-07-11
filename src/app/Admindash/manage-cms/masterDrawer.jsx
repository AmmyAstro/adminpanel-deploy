"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@apollo/client/react";

export default function MasterDrawer({
  open,
  onClose,
  selected,
  refetch,
  CREATE_ITEM,
  UPDATE_ITEM,
  title = "Skill",
}) {
  const [createItem, { loading: creating }] =
    useMutation(CREATE_ITEM);

  const [updateItem, { loading: updating }] =
    useMutation(UPDATE_ITEM);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    sortOrder: 1,
    isActive: true,
  });

  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name,
        slug: selected.slug,
        sortOrder: selected.sortOrder,
        isActive: selected.isActive,
      });
    } else {
      setForm({
        name: "",
        slug: "",
        sortOrder: 1,
        isActive: true,
      });
    }
  }, [selected]);

  function handleChange(e) {
    const { name, value, type, checked } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  async function handleSubmit() {
    const input = {
      ...form,
      slug:
        form.slug ||
        form.name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-"),
      sortOrder: Number(form.sortOrder),
    };

    try {
      if (selected) {
        await updateItem({
          variables: {
            id: selected.id,
            input,
          },
        });
      } else {
        await createItem({
          variables: {
            input,
          },
        });
      }

      refetch();

      onClose();
    } catch (err) {
      console.log(err);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">

      <div className="h-full w-[460px] bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">

              {selected
                ? `Edit ${title}`
                : `Create ${title}`}

            </h2>

            <p className="text-sm text-gray-500">

              Manage {title.toLowerCase()}

            </p>

          </div>

          <button onClick={onClose}>

            <X />

          </button>

        </div>

        <div className="space-y-6 p-6">

          <div>

            <label className="mb-2 block text-sm font-medium">

              Name

            </label>

            <input
              name="name"
              value={form.name}
              onChange={(e) => {
                handleChange(e);

                if (!selected) {
                  setForm((prev) => ({
                    ...prev,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-"),
                  }));
                }
              }}
              className="w-full rounded-xl border p-3 outline-none focus:border-violet-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">

              Slug

            </label>

            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none focus:border-violet-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">

              Sort Order

            </label>

            <input
              type="number"
              name="sortOrder"
              value={form.sortOrder}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none focus:border-violet-500"
            />

          </div>

          <div className="flex items-center justify-between rounded-xl border p-4">

            <div>

              <h3 className="font-semibold">

                Active Status

              </h3>

              <p className="text-sm text-gray-500">

                Show on website

              </p>

            </div>

            <label className="relative inline-flex cursor-pointer items-center">

              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="peer sr-only"
              />

              <div className="peer h-7 w-12 rounded-full bg-gray-300 transition peer-checked:bg-violet-600">

                <div
                  className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-all ${
                    form.isActive
                      ? "translate-x-5"
                      : ""
                  }`}
                />

              </div>

            </label>

          </div>

          <div className="rounded-xl bg-violet-50 p-4">

            <p className="mb-2 text-sm font-semibold">

              Preview

            </p>

            <span className="rounded-full bg-violet-600 px-5 py-2 text-white">

              {form.name || title}

            </span>

          </div>

        </div>

        <div className="absolute bottom-0 flex w-[460px] justify-end gap-3 border-t bg-white p-5">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={creating || updating}
            className="rounded-xl bg-violet-600 px-6 py-2 text-white"
          >
            {creating || updating
              ? "Saving..."
              : selected
              ? "Update"
              : "Create"}
          </button>

        </div>

      </div>

    </div>
  );
}