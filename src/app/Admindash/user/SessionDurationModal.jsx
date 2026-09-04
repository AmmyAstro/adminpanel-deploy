"use client";

import { CREATE_REFUND_REQUEST } from "@/app/graphQL/astroHiring";
import { useEffect, useState } from "react";

export default function SessionDurationModal({
  open,
  onClose,
  session,
  onSubmit,
}) {
  const [minutes, setMinutes] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");

  const durationSec = Number(session?.durationSec || 0);

  // Example:
  // 150 sec => max 2 min
  // 460 sec => max 7 min
  const maxMinutes = Math.floor(durationSec / 60);

  useEffect(() => {
    if (open) {
      setMinutes("");
      setRemark("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleMinutesChange = (e) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    setMinutes(value);

    if (!value) {
      setError("");
      return;
    }

    const enteredMinutes = Number(value);

    if (enteredMinutes > maxMinutes) {
      setError(
        `Maximum allowed duration is ${maxMinutes} minute${
          maxMinutes !== 1 ? "s" : ""
        }.`,
      );
    } else if (enteredMinutes < 1) {
      setError("Duration must be at least 1 minute.");
    } else {
      setError("");
    }
  };
  const [createRefundRequest] = useMutation(
  CREATE_REFUND_REQUEST
);
  const ratePerMin = Number(session?.ratePerMin || 0);
  const enteredMinutes = Number(minutes || 0);

  const calculatedAmount = ratePerMin * enteredMinutes;

  const handleSubmit = async () => {
    const enteredMinutes = Number(minutes);

    if (!minutes) {
      setError("Please enter duration.");
      return;
    }

    if (enteredMinutes < 1) {
      setError("Duration must be at least 1 minute.");
      return;
    }

    if (enteredMinutes > maxMinutes) {
      setError(
        `Duration cannot be more than ${maxMinutes} minute${
          maxMinutes !== 1 ? "s" : ""
        }.`,
      );
      return;
    }

    onSubmit({
      sessionId: session?.sessionId,
      durationMinutes: enteredMinutes,
      durationSeconds: enteredMinutes * 60,
      remark: remark.trim(),
    });

    onClose();
      try {
  await createRefundRequest({
  variables: {
    input: {
      sessionId: session.sessionId,
      refundDuration: Number(minutes),
      refundReason: remark,
      refundType: "Complete",
      mode: "Chat",
    },
  },
});

    onClose();

    // optional toast
  } catch (error) {
    console.error(error);
    setError(
      error?.message || "Failed to create refund request"
    );
  }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Refund Process</h2>

            <p className="mt-1 text-xs text-gray-500">
              Session: {session?.sessionId?.slice(0, 8) || "N/A"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          {/* Actual Duration */}
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Actual Session Duration</p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              {Math.floor(durationSec / 60)} min {durationSec % 60} sec
            </p>
          </div>
          {/* Rate & Amount */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rate / Minute</span>

              <span className="font-semibold text-gray-900">₹{ratePerMin}</span>
            </div>

            <div className="my-3 border-t border-blue-100" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Selected Duration</span>

              <span className="font-semibold text-gray-900">
                {enteredMinutes || 0} min
              </span>
            </div>

            <div className="my-3 border-t border-blue-100" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Amount
              </span>

              <span className="text-xl font-bold text-blue-600">
                ₹{calculatedAmount}
              </span>
            </div>
          </div>

          {/* Duration Input */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Duration to Apply
            </label>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={minutes}
                onChange={handleMinutesChange}
                placeholder={`Enter minutes (max ${maxMinutes})`}
                className={`w-full rounded-full border px-4 py-3 pr-20 text-sm outline-none transition ${
                  error
                    ? "border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                minutes
              </span>
            </div>

            {error && (
              <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
            )}

            <p className="mt-1 text-xs text-gray-400">
              Maximum allowed: {maxMinutes} minute
              {maxMinutes !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Remark */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Remark
            </label>

            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter remark..."
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
