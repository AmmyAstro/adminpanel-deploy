"use client";

import {
  CREATE_NOTICE,
  DELETE_NOTICE,
  GET_ASTRO_LIST,
  GET_NOTICES,
  UPDATE_NOTICE,
} from "@/app/graphQL/astroHiring";
import CustomButton from "@/components/Custom/CustomButtom";
import CustomToggle from "@/components/Custom/CustomToggle";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateNotice() {
const [formData, setFormData] = useState({
  id: null,
  title: "",
  description: "",
  targetType: "ALL",
  astrologers: [],
  isActive: true,
});
  const { data: astroData } = useQuery(GET_ASTRO_LIST);

  const astrologers = astroData?.getAstrologers || [];

  const [createNotice] = useMutation(CREATE_NOTICE);

const handleSubmit = async (e) => {
  e.preventDefault();

  const isEditMode = !!formData.id;

  try {
    if (isEditMode) {
      await updateNotice({
        variables: {
          id: formData.id,

          input: {
            title: formData.title,
            description: formData.description,
            targetType: formData.targetType,

            astrologers:
              formData.targetType === "SELECTED"
                ? formData.astrologers
                : [],

            isActive: formData.isActive,
          },
        },

        refetchQueries: [GET_NOTICES],
      });

      toast.success("Notice Updated");
    } else {
      await createNotice({
        variables: {
          input: {
            title: formData.title,
            description: formData.description,

            targetType: formData.targetType,

            astrologers:
              formData.targetType === "SELECTED"
                ? formData.astrologers
                : [],

            isActive: formData.isActive,

            startDate:
              formData.startDate || null,

            endDate:
              formData.endDate || null,
          },
        },

        refetchQueries: [GET_NOTICES],
      });

      toast.success("Notice Created");
    }

    // reset form
    setFormData({
      title: "",
      description: "",
      targetType: "ALL",
      astrologers: [],
      isActive: true,
    });
  } catch (err) {
    toast.error(
      err?.message || "Something went wrong"
    );
  }
};
  const [deleteNotice] = useMutation(DELETE_NOTICE);

  const handleDelete = async (id) => {
    try {
      await deleteNotice({
        variables: { id },

        refetchQueries: [GET_NOTICES],
      });

      toast.success("Notice deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };
  const [updateNotice] = useMutation(UPDATE_NOTICE);

  const handleToggle = async (notice) => {
    try {
      await updateNotice({
        variables: {
          id: notice.id,

          input: {
            isActive: !notice.isActive,
          },
        },

        refetchQueries: [GET_NOTICES],
      });

      toast.success("Notice updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const { data: noticeData, loading: noticeLoading } = useQuery(GET_NOTICES);
  const notices = noticeData?.getNotices || [];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-5">Create Notice</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}

        <div>
          <label className="block mb-2">Notice Title</label>

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
          <label className="block mb-2">Description</label>

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
          <label className="block mb-2">Audience</label>

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
            <option value="ALL">All Astrologers</option>

            <option value="SELECTED">Selected Astrologers</option>
          </select>
        </div>

        {/* Multi Select */}

        {formData.targetType === "SELECTED" && (
          <div>
            <label className="block mb-2">Select Astrologers</label>

            <select
              multiple
              className="border rounded-lg w-full p-3 h-48"
              value={formData.astrologers}
              onChange={(e) => {
                const values = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value,
                );

                setFormData({
                  ...formData,
                  astrologers: values,
                });
              }}
            >
              {astrologers.map((astro) => (
                <option key={astro.id} value={astro.id}>
                  {astro.displayName || astro.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pin */}

        {/* Active */}

        <div className="flex items-center justify-between border rounded-lg p-3">
          <span className="font-medium">Active Notice</span>

          <CustomToggle
            id="activeNotice"
            checked={formData.isActive}
            onChange={(val) =>
              setFormData({
                ...formData,
                isActive: val,
              })
            }
          />
        </div>

  <CustomButton
  type="submit"
  className="bg-green-600 text-white px-6 py-3 rounded-lg"
>
  {formData.id
    ? "Update Notice"
    : "Create Notice"}
</CustomButton>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Notices</h2>

        <div className="grid gap-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="border rounded-xl p-5 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{notice.title}</h3>

                  <p className="text-gray-600 mt-2">{notice.description}</p>
                </div>

                <div className="flex gap-2">
                  <CustomButton
                    variant="black"
                    onClick={() => {
                      setFormData({
                        id: notice.id,

                        title: notice.title,

                        description: notice.description,

                        targetType: notice.targetType,

                        astrologers:
                          notice.astrologers?.map((a) => a.astrologer.id) || [],

                        isActive: notice.isActive,
                      });
                    }}
                  >
                    Edit
                  </CustomButton>

                  <CustomButton
                    variant="red"
                    onClick={() => handleDelete(notice.id)}
                  >
                    Delete
                  </CustomButton>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Audience:
                    <span className="font-semibold ml-2">
                      {notice.targetType}
                    </span>
                  </p>

                  {notice.targetType === "SELECTED" && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {notice.astrologers?.map((item) => (
                        <span
                          key={item.astrologer.id}
                          className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full"
                        >
                          {item.astrologer.displayName || item.astrologer.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <CustomToggle
                  id={`notice-${notice.id}`}
                  checked={notice.isActive}
                  onChange={() => handleToggle(notice)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
