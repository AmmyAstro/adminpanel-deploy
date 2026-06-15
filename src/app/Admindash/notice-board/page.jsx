"use client";

import CustomButton from "@/components/Custom/CustomButtom";
import { useState } from "react";

export default function CreateNotice() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetType: "ALL",
    astrologers: [],
    isPinned: false,
    isActive: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    // Apollo Mutation
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-5">
        Create Notice
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Title */}

        <div>
          <label className="block mb-2">
            Notice Title
          </label>

          <input
            type="text"
            className="border rounded-lg w-full p-3"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
          />
        </div>

        {/* Description */}

        <div>
          <label className="block mb-2">
            Description
          </label>

          <textarea
            rows={6}
            className="border rounded-lg w-full p-3"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />
        </div>

        {/* Audience */}

        <div>
          <label className="block mb-2">
            Audience
          </label>

          <select
            className="border rounded-lg w-full p-3"
            value={formData.targetType}
            onChange={(e) =>
              setFormData({
                ...formData,
                targetType: e.target.value,
              })
            }
          >
            <option value="ALL">
              All Astrologers
            </option>

            <option value="SELECTED">
              Selected Astrologers
            </option>
          </select>
        </div>

        {/* Multi Select */}

        {formData.targetType ===
          "SELECTED" && (
          <div>
            <label className="block mb-2">
              Select Astrologers
            </label>

            <select
              multiple
              className="border rounded-lg w-full p-3 h-40"
            >
              <option value="1">
                Rahul Sharma
              </option>

              <option value="2">
                Amit Joshi
              </option>

              <option value="3">
                Neha Verma
              </option>
            </select>
          </div>
        )}

        {/* Pin */}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.isPinned}
            onChange={(e) =>
              setFormData({
                ...formData,
                isPinned:
                  e.target.checked,
              })
            }
          />

          <span>
            Pin this notice
          </span>
        </div>

        {/* Active */}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({
                ...formData,
                isActive:
                  e.target.checked,
              })
            }
          />

          <span>
            Active Notice
          </span>
        </div>

        <CustomButton
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded-lg">
          Create Notice
        </CustomButton>
      </form>
    </div>
  );
}