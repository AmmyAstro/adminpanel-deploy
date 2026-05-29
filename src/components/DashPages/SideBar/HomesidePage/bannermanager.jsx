"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/utils/DataTable";
import { usePermissions } from "@/context/PermissionContext";
import { useActionHandler } from "@/hooks/useActionHandler";
import ConfirmModal from "@/components/Custom/ConfirmModal";
import ProtectedActionButton from "@/components/Custom/ActionButton";
import toast from "react-hot-toast";
import {
  CREATE_BANNER,
  DELETE_BANNER,
  GET_BANNERS,
  UPDATE_BANNER,
} from "@/app/graphQL/homeGql";
import { useMutation, useQuery } from "@apollo/client/react";

export default function BannerManager() {
  const { can, isSuperAdmin } = usePermissions();

  const canRead = isSuperAdmin || can("banners", "read");
  const canCreate = isSuperAdmin || can("banners", "create");
  const canUpdate = isSuperAdmin || can("banners", "update");

  const { confirmState, setConfirmState, executeAction, handleConfirm } =
    useActionHandler();

  const { data, loading, error, refetch } = useQuery(GET_BANNERS, {
    skip: !canRead,
  });

  const [localBanners, setLocalBanners] = useState([]);

  useEffect(() => {
    if (data?.getBanners) {
      setLocalBanners(data.getBanners);
    }
  }, [data]);

  const [createBanner] = useMutation(CREATE_BANNER);
  const [updateBanner] = useMutation(UPDATE_BANNER);
  const [deleteBanner] = useMutation(DELETE_BANNER);

  const [openModal, setOpenModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const [form, setForm] = useState({
    heading: "",
    subheading: "",
    slug: "",
    sortorder: "",
    bannerlink: "",
    language: "en",
  });

  useEffect(() => {
    if (editingBanner) {
      setForm(editingBanner);
    } else {
      resetForm();
    }
  }, [editingBanner]);

  const resetForm = () => {
    setForm({
      heading: "",
      subheading: "",
      slug: "",
      sortorder: "",
      bannerlink: "",
      language: "en",
    });
    setFile(null);
    setEditingBanner(null);
  };

  // 🔥 Auto slug
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "heading") {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      setForm((prev) => ({
        ...prev,
        heading: value,
        slug,
      }));
      return;
    }

    if (name === "sortorder") {
      setForm((prev) => ({
        ...prev,
        sortorder: Math.max(0, Number(value)),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔥 Upload (multer)
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      "https://dhwaniastro.com/adminAuth/api/upload-banner",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    return data.url;
  };

  // 🔥 Submit
  const handleSubmit = async () => {
    try {
      if (!form.heading || !form.slug) {
        toast.error("Heading & slug required");
        return;
      }

      let imageUrl;

      if (file) {
        setUploading(true);
        imageUrl = await uploadFile(file);
        setUploading(false);
      }

      const input = {
        ...form,
        ...(imageUrl && { imageUrl }),
      };

      if (editingBanner) {
        await updateBanner({
          variables: {
            id: editingBanner.id,
            input,
          },
        });
        toast.success("Updated 🚀");
      } else {
        await createBanner({
          variables: { input },
        });
        toast.success("Created 🚀");
      }

      setOpenModal(false);
      resetForm();
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (!canRead) return <p className="p-10">No permission</p>;
  if (loading) return <p className="p-10">Loading...</p>;
  if (error) return <p className="p-10 text-red-500">Error</p>;

  const bannerColumns = [
    { header: "Heading", accessor: "heading" },
    { header: "Language", accessor: "language" },
    { header: "Sort", accessor: "sortorder" },

    // 🔥 STATUS TOGGLE
    {
      header: "Status",
      render: (row) => (
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.status}
            disabled={loadingId === row.id}
            onChange={async () => {
              if (!canUpdate) return;

              // optimistic
              setLocalBanners((prev) =>
                prev.map((b) =>
                  b.id === row.id ? { ...b, status: !b.status } : b,
                ),
              );

              try {
                setLoadingId(row.id);

                await updateBanner({
                  variables: {
                    id: row.id,
                    input: { status: !row.status },
                  },
                });

                toast.success("Updated");
              } catch {
                toast.error("Failed");
              } finally {
                setLoadingId(null);
              }
            }}
            className="sr-only peer"
          />

          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative transition">
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5"></div>
          </div>
        </label>
      ),
    },

    // 🔥 IMAGE
    // {
    //   header: "Image",
    //   render: (row) => (
    //     <img
    //       src={
    //         row.imageUrl
    //           ? `http://localhost:4000${row.imageUrl}`
    //           : "/no-image.png"
    //       }
    //       onError={(e) => (e.target.src = "/no-image.png")}
    //       className="h-12 w-20 object-cover rounded"
    //     />
    //   ),
    // },

    // 🔥 ACTIONS
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            disabled={!canUpdate}
            onClick={() => {
              setEditingBanner(row);
              setOpenModal(true);
            }}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
          >
            Edit
          </button>

          <ProtectedActionButton
            module="banners"
            action="delete"
            executeAction={executeAction}
            mutationFn={deleteBanner}
            variables={{ id: row.id }}
            onSuccess={refetch}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded"
          >
            Delete
          </ProtectedActionButton>
        </div>
      ),
    },
  ];

  return (
    <div className="p-10 space-y-5">
      {/* CREATE */}
      <button
        disabled={!canCreate}
        onClick={() => {
          resetForm();
          setOpenModal(true);
        }}
        className="px-5 py-2 bg-purple-500 text-white rounded"
      >
        Add Banner
      </button>

      {/* CONFIRM */}
      <ConfirmModal
        open={!!confirmState}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirm}
      />

      {/* EMPTY */}
      {localBanners.length === 0 && (
        <p className="text-center py-10 text-gray-500">No banners found 🚫</p>
      )}

      {/* TABLE */}
      <DataTable columns={bannerColumns} data={localBanners} />

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-[500px] space-y-3">
            <h2 className="text-xl font-semibold">
              {editingBanner ? "Edit" : "Create"}
            </h2>

            <input
              name="heading"
              placeholder="Heading"
              value={form.heading}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="subheading"
              placeholder="Subheading"
              value={form.subheading}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="slug"
              placeholder="Slug"
              value={form.slug}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="bannerlink"
              placeholder="Link"
              value={form.bannerlink}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="sortorder"
              type="number"
              placeholder="Sort"
              value={form.sortorder}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input type="file" onChange={(e) => setFile(e.target.files[0])} />

            {file && <img src={URL.createObjectURL(file)} className="h-20" />}

            {editingBanner?.imageUrl && !file && (
              <img
                src={`http://localhost:4000${editingBanner.imageUrl}`}
                className="h-20"
              />
            )}

            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpenModal(false)}>Cancel</button>

              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="px-4 py-2 bg-black text-white rounded"
              >
                {uploading
                  ? "Uploading..."
                  : editingBanner
                    ? "Update"
                    : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
