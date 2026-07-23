"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import dayjs from "dayjs";
import {
  END_SESSION_BY_ADMIN,
  GET_SESSION_ANALYTICS,
} from "@/app/graphQL/astroHiring";
import SocketContext from "@/context/socketContext";
import { useContext, useEffect, useRef } from "react";

export default function OngoingSessions() {
    const chatEndedRef = useRef(false);

  const { data, loading, error } = useQuery(GET_SESSION_ANALYTICS, {
    variables: {
      status: "ONGOING",
      filter: "MONTH",
    },
    fetchPolicy: "network-only",
  });
  const { socket, connectSocket } = useContext(SocketContext);
useEffect(() => {
  if (!socket) {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      return;
    }

    connectSocket({ token });
  }
}, [socket]);
const handleEndSession = (item) => {
  console.log("===== END BUTTON CLICKED =====");
  console.log("Item:", item);
  console.log("Socket:", socket);
  console.log("Socket Connected:", socket?.connected);

  if (chatEndedRef.current) {
    console.log("Chat already ended");
    return;
  }

  if (!socket) {
    console.log("Socket not available");
    return;
  }

  const payload = {
    room_id: item.roomId,
    astroId: item.astrologerId,
    userId: item.userId,
  };

  console.log("Emitting chatCompletedByAdmin");
  console.log("Payload:", payload);

  socket.emit("chatCompletedByAdmin", payload);

  console.log("Emit called successfully");

  // chatEndedRef.current = true;
};

  const sessions = data?.getSessionAnalytics?.recentSessions || [];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow">
        Loading ongoing sessions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-2xl p-5">
        {error.message}
      </div>
    );
  }
  const getDuration = (startedAt) => {
    if (!startedAt) return "-";

    const diff = dayjs().diff(dayjs(startedAt), "second");

    const hrs = Math.floor(diff / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    const secs = diff % 60;

    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }

    return `${mins}m ${secs}s`;
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-[#2c0a4d]">
          Ongoing Sessions
        </h2>

        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
          {sessions.length} Active
        </span>
      </div>

      {sessions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No ongoing sessions found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-50 text-[#2c0a4d]">
                <th className="text-left p-3">User</th>
                <th>Type</th>
                <th className="text-left p-3">Session</th>
                <th className="text-left p-3">Rate/Min</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Duration</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((item) => (
                <tr key={item.sessionId} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.userName || "-"}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.type === "CHAT"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3 text-xs">
                    {item.roomId.slice(0, 8) || "-"}
                  </td>

                  <td className="p-3">₹{item.ratePerMin || 0}/min</td>

                  <td className="p-3 font-semibold text-green-600">
                    ₹{item.coinsDeducted || 0}
                  </td>

                  <td className="p-3 font-medium text-orange-600">
                    {getDuration(item.startedAt)}
                  </td>
                  <td className="p-3">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                      onClick={() => handleEndSession(item)}
                    >
                      End
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
