"use client";

import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";

import {
  GET_ASTROLOGER_FILTERS,
  ASSIGN_ASTROLOGER_FILTERS,
} from "@/graphql/astrologerFilter";

export default function AssignFiltersModal({
  open,
  onClose,
  astrologerId,
  selectedFilters = [],
  refetch,
}) {
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState([]);

  const { data } = useQuery(GET_ASTROLOGER_FILTERS);

  const [assignFilters, { loading }] = useMutation(
    ASSIGN_ASTROLOGER_FILTERS
  );

  useEffect(() => {
    if (open) {
      setSelected(selectedFilters);
    }
  }, [open, selectedFilters]);

  if (!open) return null;

  const filters = data?.getAstrologerFilters || [];

  const filtered = filters.filter((item) =>
    item.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function toggle(id) {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  async function handleSave() {
    await assignFilters({
      variables: {
        input: {
          astrologerId,
          filterIds: selected,
        },
      },
    });

    refetch?.();

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-xl font-bold">
            Assign Filters
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="p-6">

          <div className="relative mb-6">

            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              className="w-full rounded-xl border py-3 pl-10 pr-4"
              placeholder="Search filter..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="mb-6">

            <h4 className="mb-3 font-semibold">
              Selected Filters
            </h4>

            <div className="flex flex-wrap gap-3">

              {selected.length === 0 && (
                <p className="text-sm text-gray-400">
                  No Filter Selected
                </p>
              )}

              {filters
                .filter((f) =>
                  selected.includes(f.id)
                )
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      toggle(item.id)
                    }
                    className="rounded-full px-5 py-2 font-medium"
                    style={{
                      background:
                        item.bgColor,
                      color:
                        item.textColor,
                    }}
                  >
                    {item.name}
                  </button>
                ))}

            </div>

          </div>

          <div>

            <h4 className="mb-3 font-semibold">
              Available Filters
            </h4>

            <div className="flex flex-wrap gap-3">

              {filtered
                .filter(
                  (item) =>
                    !selected.includes(
                      item.id
                    )
                )
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      toggle(item.id)
                    }
                    className="rounded-full border px-5 py-2 transition hover:scale-105"
                  >
                    {item.name}
                  </button>
                ))}

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            onClick={onClose}
            className="rounded-xl border px-6 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-violet-600 px-6 py-2 text-white"
          >
            {loading
              ? "Saving..."
              : "Save Filters"}
          </button>

        </div>

      </div>

    </div>
  );
}