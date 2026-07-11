"use client";

import { Trash2, X } from "lucide-react";

export default function DeleteModal({
  open,
  onClose,
  onDelete,
  title = "Item",
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-[420px] rounded-3xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <div className="flex items-center gap-3">

            <div className="rounded-full bg-red-100 p-3">
              <Trash2 className="text-red-600" size={22} />
            </div>

            <div>

              <h2 className="text-xl font-bold">

                Delete {title}

              </h2>

              <p className="text-sm text-gray-500">

                This action cannot be undone.

              </p>

            </div>

          </div>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="p-6">

          Are you sure you want to delete this {title.toLowerCase()}?

        </div>

        <div className="flex justify-end gap-3 border-t p-5">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onDelete}
            className="rounded-xl bg-red-600 px-5 py-2 text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}