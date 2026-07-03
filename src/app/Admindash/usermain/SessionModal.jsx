"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

const GET_ADMIN_SESSION_MESSAGES = gql`
  query AdminGetSessionMessages($sessionId: String!) {
    adminGetSessionMessages(sessionId: $sessionId) {
      success
      totalCount

      data {
        id
        sender
        message
        image
        time
        createdAt
      }
    }
  }
`;

export default function SessionMessagesModal({ open, onClose, sessionId }) {
  // API CALL
  const { data, loading, error } = useQuery(GET_ADMIN_SESSION_MESSAGES, {
    variables: {
      sessionId,
    },

    skip: !sessionId || !open,

    fetchPolicy: "cache-first",
  });

  const messages = data?.adminGetSessionMessages?.data || [];

  // CLOSE IF NOT OPEN
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-500 bg-black/60 flex items-center justify-center p-4">
      <div className=" w-full  max-w-3xl rounded-2xl overflow-hidden shadow-2xl">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Session Chat History
            </h2>

            <p className="text-xs text-violet-100 mt-1">
              Session ID : {sessionId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 transition flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* BODY */}
        <div className="h-[600px] overflow-y-auto bg-gradient-to-b from-slate-100 via-white to-slate-100 px-5 py-2">
          {" "}
          {/* LOADING */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              Loading messages...
            </div>
          ) : error ? (
            /* ERROR */
            <div className="flex items-center justify-center h-full text-red-500">
              Error loading messages
            </div>
          ) : messages.length > 0 ? (
            /* MESSAGES */
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  className={`flex items-end gap-3 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative max-w-[78%] px-3 py-3 shadow-lg rounded-[22px]
${
  msg.sender === "user"
    ? "bg-gradient-to-br from-violet-600 to-purple-500 text-white rounded-br-md"
    : "bg-white border border-gray-200 rounded-bl-md"
}`}
                  >
                    <div className={`text-[10px] ${msg.sender === "user"? "text-white": "text-purple-600"} font-extralight opacity-70 mb-1`}>
                      {msg.sender}
                    </div>

                    {/* MESSAGE */}
                    {msg.message && (
                      <p className="text-sm break-words">{msg.message}</p>
                    )}

                    {/* IMAGE */}
                    {msg.image && (
                      <div className="mt-2">
                        <Image
                          unoptimized
                          width={320}
                          height={320}
                          src={msg.image.replace("/v2/uploads/", "/uploads/")}
                          alt="chat"
                          className="rounded-2xl border object-cover cursor-pointer hover:scale-[1.03] transition"
                        />

                        <div
                          className={`flex items-center gap-1 text-xs mt-2 ${
                            msg.sender === "user"
                              ? "text-violet-100"
                              : "text-gray-500"
                          }`}
                        >
                          <ImageIcon size={14} />
                          Image
                        </div>
                      </div>
                    )}

                    {/* TIME */}
                    <div
                      className={`text-[10px] mt-2 text-right ${
                        msg.sender === "user"
                          ? "text-violet-100"
                          : "text-gray-400"
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY */
            <div className="h-full flex flex-col justify-center items-center">
              <div className="h-20 w-20 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                💬
              </div>

              <h3 className="font-semibold text-gray-700">No Messages Found</h3>

              <p className="text-gray-500 text-sm mt-1">
                This session doesn't contain any chat messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
