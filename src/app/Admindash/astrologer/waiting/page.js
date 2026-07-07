"use client";

import {
  GET_ALL_WAITING_QUEUES,
  GET_ASTROLOGER_WAITING_USERS,
} from "@/app/graphQL/astroHiring";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import { BsPersonCircle } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
import { MdChat } from "react-icons/md";

export default function WaitingQueue({ astrologerId }) {
  const { data, loading, error, refetch } = useQuery(GET_ALL_WAITING_QUEUES, {
    fetchPolicy: "network-only",
  });

  const queues = data?.getAllWaitingQueues || [];

  //   if (loading) {
  //     return <div className="p-10 text-center">Loading Queue...</div>;
  //   }

  //   if (error) {
  //     return <div className="p-10 text-center text-red-500">{error.message}</div>;
  //   }

  return (
    <div className="space-y-6">
      {queues.map((astro) => (
        <div
          key={astro.astrologerId}
          className="rounded-xl border bg-white shadow"
        >
          <div className="flex items-center justify-between border-b p-5">
            <div className="flex items-center gap-4">
              <img
                src={astro.astrologerProfilePic}
                className="h-12 w-12 rounded-full"
              />

              <div>
                <h2 className="font-semibold">{astro.astrologerName}</h2>

                <p className="text-sm text-gray-500">
                  Waiting : {astro.waitingCount}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span
                className={`rounded px-3 py-1 text-sm ${
                  astro.isOnline
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {astro.isOnline ? "Online" : "Offline"}
              </span>

              <span
                className={`rounded px-3 py-1 text-sm ${
                  astro.isBusy
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {astro.isBusy ? "Busy" : "Free"}
              </span>
            </div>
          </div>

          <div className="divide-y">
            {astro.waitingUsers.map((user, index) => (
              <div
                key={user.roomId}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <div className="font-medium">
                    #{index + 1} {user.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {user.countryCode} {user.mobile}
                  </div>

                  <div className="text-xs text-gray-400">{user.roomId}</div>
                </div>

                <div className="flex items-center gap-6">
                  <div>{user.type}</div>

                  <div>{user.maximumTime} Min</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
