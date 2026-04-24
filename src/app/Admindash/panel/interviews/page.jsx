"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";

/* ---------------- API ---------------- */

const GET_MY_INTERVIEWS = gql`
  query {
    getMyInterviews {
      id
      name
      skills
      experience
      interviewDate
      interviewTime
      round
    }
  }
`;

const UPDATE_RESULT = gql`
  mutation UpdateInterview(
    $astrologerId: ID!
    $status: String!
    $remarks: String
  ) {
    updateInterviewResult(
      astrologerId: $astrologerId
      status: $status
      remarks: $remarks
    ) {
      id
      interviewStatus
    }
  }
`;

/* ---------------- COMPONENT ---------------- */

export default function InterviewerPanel() {
  const { data, refetch } = useQuery(GET_MY_INTERVIEWS);
  const [updateResult] = useMutation(UPDATE_RESULT);

  const [remarks, setRemarks] = useState({});

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN");

  const handleUpdate = async (id, status) => {
    await updateResult({
      variables: {
        astrologerId: id,
        status,
        remarks: remarks[id] || ""
      }
    });

    refetch();
  };

  return (
    <div className="p-6 space-y-5">

      <h1 className="text-xl font-semibold">
        Assigned Interviews
      </h1>

      {data?.getMyInterviews?.length === 0 && (
        <p>No interviews assigned</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">

        {data?.getMyInterviews?.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 shadow-sm space-y-2"
          >
            {/* Candidate */}
            <h2 className="font-semibold text-lg">
              {item.name}
            </h2>

            <p className="text-sm">
              Skills: {item.skills?.join(", ")}
            </p>

            <p className="text-sm">
              Experience: {item.experience} yrs
            </p>

            {/* Interview Info */}
            <div className="bg-gray-50 p-3 rounded">
              <p>Date: {formatDate(item.interviewDate)}</p>
              <p>Time: {item.interviewTime}</p>
              <p>Round: {item.round}</p>
            </div>

            {/* Remarks */}
            <textarea
              placeholder="Add remarks..."
              className="w-full border p-2 rounded text-sm"
              onChange={(e) =>
                setRemarks({
                  ...remarks,
                  [item.id]: e.target.value
                })
              }
            />

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdate(item.id, "PASSED")}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Pass
              </button>

              <button
                onClick={() => handleUpdate(item.id, "REJECTED")}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}