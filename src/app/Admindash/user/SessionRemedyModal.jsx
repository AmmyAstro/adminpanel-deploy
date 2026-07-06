"use client";

import { GET_SESSION_REMEDIES } from "@/app/graphQL/astroHiring";
import { useQuery } from "@apollo/client/react";
import dayjs from "dayjs";

export default function SessionRemedyModal({
  open,
  onClose,
  sessionId,
}) {
  const { data, loading } = useQuery(GET_SESSION_REMEDIES, {
    variables: {
      sessionId,
    },
    skip: !open || !sessionId,
      fetchPolicy: "cache-first",
  });

  if (!open) return null;

  const remedies = data?.getSessionRemedies || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-[700px] max-h-[80vh] overflow-hidden">

        <div className="flex justify-between items-center border-b p-4">
          <h2 className="font-bold text-lg">
            Session Remedies
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[65vh]">

          {loading && (
            <p>Loading...</p>
          )}

          {!loading && remedies.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No remedies found for this session.
            </div>
          )}

          <div className="space-y-4">

            {remedies.map((item, index) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">
                    Remedy #{index + 1}
                  </span>

              <span className="text-sm text-gray-500">
  {new Date(Number(item.createdAt)).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}
</span>
                </div>

              <p className="whitespace-pre-wrap text-gray-700">
  {item.remedyText.replace(/<[^>]*>/g, "")}
</p>
              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
}