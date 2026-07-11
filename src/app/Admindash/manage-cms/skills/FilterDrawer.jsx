"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_ASTROLOGER_FILTER,
  UPDATE_ASTROLOGER_FILTER,
} from "@/graphql/astrologerFilter";

const COLORS = [
  { bg: "#F3E8FF", text: "#7C3AED" },
  { bg: "#DBEAFE", text: "#2563EB" },
  { bg: "#DCFCE7", text: "#16A34A" },
  { bg: "#FCE7F3", text: "#DB2777" },
  { bg: "#FEF3C7", text: "#D97706" },
  { bg: "#FEE2E2", text: "#DC2626" },
];

export default function FilterDrawer({
  open,
  onClose,
  filter,
  refetch,
}) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    bgColor: COLORS[0].bg,
    textColor: COLORS[0].text,
    sortOrder: 1,
    isActive: true,
  });

  useEffect(() => {
    if (filter) {
      setForm({
        name: filter.name,
        slug: filter.slug,
        bgColor: filter.bgColor,
        textColor: filter.textColor,
        sortOrder: filter.sortOrder,
        isActive: filter.isActive,
      });
    } else {
      setForm({
        name: "",
        slug: "",
        bgColor: COLORS[0].bg,
        textColor: COLORS[0].text,
        sortOrder: 1,
        isActive: true,
      });
    }
  }, [filter]);

  const [createFilter, { loading }] = useMutation(
    CREATE_ASTROLOGER_FILTER
  );

  const [updateFilter] = useMutation(
    UPDATE_ASTROLOGER_FILTER
  );

  async function handleSave() {
    const payload = {
      ...form,
      slug:
        form.slug ||
        form.name
          .toLowerCase()
          .replace(/\s+/g, "-"),
    };

    if (filter) {
      await updateFilter({
        variables: {
          id: filter.id,
          input: payload,
        },
      });
    } else {
      await createFilter({
        variables: {
          input: payload,
        },
      });
    }

    refetch();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">

      <div className="h-full w-[420px] overflow-y-auto bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-xl font-bold">
            {filter
              ? "Edit Filter"
              : "Create Filter"}
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <label className="mb-2 block text-sm font-medium">
          Filter Name
        </label>

        <input
          className="mb-4 w-full rounded-xl border p-3"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <label className="mb-2 block text-sm font-medium">
          Slug
        </label>

        <input
          className="mb-4 w-full rounded-xl border p-3"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value,
            })
          }
        />

        <label className="mb-3 block text-sm font-medium">
          Choose Theme
        </label>

        <div className="mb-5 flex flex-wrap gap-3">

          {COLORS.map((c) => (
            <button
              key={c.bg}
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  bgColor: c.bg,
                  textColor: c.text,
                })
              }
              className={`h-10 w-10 rounded-full border-4 ${
                form.bgColor === c.bg
                  ? "border-black"
                  : "border-white"
              }`}
              style={{
                background: c.bg,
              }}
            />
          ))}

        </div>

        <label className="mb-2 block text-sm font-medium">
          Sort Order
        </label>

        <input
          type="number"
          className="mb-5 w-full rounded-xl border p-3"
          value={form.sortOrder}
          onChange={(e) =>
            setForm({
              ...form,
              sortOrder: Number(e.target.value),
            })
          }
        />

        <label className="mb-3 block text-sm font-medium">
          Preview
        </label>

        <div className="mb-6">

          <span
            className="rounded-full px-5 py-2 font-semibold"
            style={{
              background: form.bgColor,
              color: form.textColor,
            }}
          >
            {form.name || "Preview"}
          </span>

        </div>

        <label className="mb-6 flex items-center gap-3">

          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({
                ...form,
                isActive: e.target.checked,
              })
            }
          />

          Active

        </label>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white hover:bg-violet-700"
        >
          {loading
            ? "Saving..."
            : filter
            ? "Update Filter"
            : "Create Filter"}
        </button>

      </div>

    </div>
  );
}