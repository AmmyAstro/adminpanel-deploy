"use client";

import { useState } from "react";

export default function RejectRefundModal({
  open,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setError("Please enter rejection reason.");
      return;
    }

    setError("");

    await onSubmit(trimmedReason);

    setReason("");
  };

  const handleClose = () => {
    if (loading) return;

    setReason("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            Reject Refund Request
          </h2>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="text-2xl leading-none text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Rejection Reason
          </label>

          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            rows={4}
            placeholder="Enter rejection reason..."
            className={`w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none ${
              error
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
          />

          {error && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}