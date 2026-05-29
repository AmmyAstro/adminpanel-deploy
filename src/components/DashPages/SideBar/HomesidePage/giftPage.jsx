"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import DataTable from "@/components/utils/DataTable";
import { usePermissions } from "@/context/PermissionContext";
import { useActionHandler } from "@/hooks/useActionHandler";
import ConfirmModal from "@/components/Custom/ConfirmModal";
import ProtectedActionButton from "@/components/Custom/ActionButton";
import toast from "react-hot-toast";

import {
  CREATE_GIFT,
  DELETE_GIFT,
  GET_GIFTS,
  UPDATE_GIFT,
} from "@/app/graphQL/homeGql";

export default function GiftManager() {
  const { can, isSuperAdmin } = usePermissions();

  const {
    confirmState,
    setConfirmState,
    executeAction,
    handleConfirm,
  } = useActionHandler();

  const { data, loading, error, refetch } = useQuery(GET_GIFTS);
  const gifts = data?.getGifts?.data || data?.getGifts || [];

  const [createGift] = useMutation(CREATE_GIFT);
  const [updateGift] = useMutation(UPDATE_GIFT);
  const [deleteGift] = useMutation(DELETE_GIFT);

  const [openModal, setOpenModal] = useState(false);
  const [editingGift, setEditingGift] = useState(null);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("active");
  const [submitting, setSubmitting] = useState(false);

  const canCreate = isSuperAdmin || can("gifts", "create");
  const canUpdate = isSuperAdmin || can("gifts", "update");

  useEffect(() => {
    if (editingGift) {
      setName(editingGift.name);
      setAmount(editingGift.amount);
      setStatus(editingGift.status);
      setPreview(`http://localhost:4001${editingGift.image}`);
      setFile(null);
    } else {
      resetForm();
    }
  }, [editingGift]);

  const resetForm = () => {
    setName("");
    setAmount("");
    setFile(null);
    setPreview(null);
    setStatus("active");
    setEditingGift(null);
  };

  // 🔥 FILE VALIDATION + PREVIEW
  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    if (selected.size > 2 * 1024 * 1024) {
      toast.error("Max file size is 2MB");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // 🔥 MAIN SUBMIT LOGIC
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      let imageUrl = editingGift?.image || "";

      // STEP 1: upload file
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("https://dhwaniastro.com/adminAuth/api/upload-gifts", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();

        if (!data.url) throw new Error("Invalid upload response");

        imageUrl = data.url;
      }

      // STEP 2: GraphQL mutation
      if (editingGift) {
        await updateGift({
          variables: {
            id: editingGift.id,
            input: {
              name,
              amount: Number(amount),
              image: imageUrl,
              status,
            },
          },
        });

        toast.success("Gift updated");
      } else {
        await createGift({
          variables: {
            input: {
              name,
              amount: Number(amount),
              image: imageUrl,
              status,
            },
          },
        });

        toast.success("Gift created");
      }

      setOpenModal(false);
      resetForm();
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const giftColumns = [
    { header: "Name", accessor: "name" },
    { header: "Amount", accessor: "amount" },
    {
      header: "Image",
      render: (row) => (
        <img
          src={
            row.image
              ? `http://localhost:4001${row.image}`
              : "/placeholder.png"
          }
          className="h-10 w-10 object-cover mx-auto rounded"
        />
      ),
    },
    { header: "Status", accessor: "status" },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-3">

          {canUpdate && (
            <button
              onClick={() => {
                setEditingGift(row);
                setOpenModal(true);
              }}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
            >
              Edit
            </button>
          )}

          <ProtectedActionButton
            module="gifts"
            action="delete"
            executeAction={executeAction}
            mutationFn={deleteGift}
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

  if (loading) return <p className="p-10">Loading...</p>;
  if (error) return <p className="p-10 text-red-500">{error.message}</p>;

  return (
    <div className="p-10 space-y-5">

      {/* CREATE BUTTON */}
      <button
        disabled={!canCreate}
        onClick={() => {
          resetForm();
          setOpenModal(true);
        }}
        className={`px-5 py-2 rounded ${
          canCreate
            ? "bg-yellow-500 text-black"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Add Gift
      </button>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={!!confirmState}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirm}
      />

      {/* TABLE */}
      <DataTable columns={giftColumns} data={gifts} />

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

            <h2 className="text-lg font-semibold">
              {editingGift ? "Edit Gift" : "Create Gift"}
            </h2>

            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded"
            />

            {/* IMAGE PREVIEW */}
            {preview && (
              <img
                src={preview}
                className="h-20 mx-auto object-cover rounded"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 bg-black text-white rounded"
              >
                {submitting
                  ? "Processing..."
                  : editingGift
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