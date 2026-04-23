"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import DataTable from "@/components/utils/DataTable";
import { usePermissions } from "@/context/PermissionContext";

import {
  GET_APPLICATIONS,
  SCHEDULE_INTERVIEW,
  UPDATE_DOCUMENT_STATUS,
  UPDATE_APPROVAL_STATUS,
} from "@/app/graphQL/astroHiring";

import { GET_INTERVIEWERS } from "@/app/graphQL/astroHiring";

export default function AstrologerHiring() {
  const { can } = usePermissions();

  const { data, refetch } = useQuery(GET_APPLICATIONS);
  const { data: interviewerData } = useQuery(GET_INTERVIEWERS);

  const [scheduleInterview] = useMutation(SCHEDULE_INTERVIEW);
  const [updateDocumentStatus] = useMutation(UPDATE_DOCUMENT_STATUS);
  const [updateApprovalStatus] = useMutation(UPDATE_APPROVAL_STATUS);

  const [mainTab, setMainTab] = useState("PENDING");
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("interview");

  const [form, setForm] = useState({
    interviewerId: "",
    date: "",
    time: "",
    round: "1",
  });

  const interviewers = interviewerData?.getInterviewers || [];
  const allData = data?.getApplications || [];

  // 🔥 FILTER
  const astrologers = allData.filter((item) => {
    if (mainTab === "PENDING") return item.applicationStatus === "PENDING";
    if (mainTab === "SCHEDULED") return item.interviewStatus === "SCHEDULED";
    if (mainTab === "PASSED") return item.interviewStatus === "PASSED";
    if (mainTab === "APPROVED") return item.approvalStatus === "APPROVED";
    return true;
  });

  // 🔥 STATUS COLORS
  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-800";
      case "SCHEDULED":
        return "text-orange-700";
      case "VERIFIED":
      case "PASSED":
        return "text-green-700";
      case "REJECTED":
        return "text-red-700";
      default:
        return "text-gray-600";
    }
  };

  const StatusBadge = ({ status }) => (
    <span className={`text-[10px] ${getStatusStyle(status)}`}>
      {status}
    </span>
  );

  // 🔥 SCHEDULE
  const handleSchedule = async () => {
    if (!form.interviewerId) return alert("Select interviewer");

    const res = await scheduleInterview({
      variables: {
        astrologerId: selected.id,
        interviewerId: form.interviewerId,
        interviewDate: form.date,
        interviewTime: form.time,
        round: Number(form.round),
      },
    });

    const updatedId = res.data.scheduleInterview.id;

    // 🔥 fetch fresh data
    const freshData = await refetch();

    const fresh = freshData.data.getApplications.find(
      (a) => a.id === updatedId
    );

    setSelected(fresh);
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Gender", accessor: "gender" },
    { header: "Phone", accessor: "phoneNumber" },

    {
      header: "Skills",
      render: (row) => row.skills?.join(", ") || "-",
    },
    {
      header: "Languages",
      render: (row) => row.languages?.join(", ") || "-",
    },

    {
      header: "Insights",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              setSelected(row);
              setOpenModal(true);
              setActiveTab("interview");
            }}
            className="px-3 py-1 text-xs bg-purple-500 text-white rounded-full"
          >
            Insights
          </button>

          <div className="text-[10px]">
            <div>
              <b>I:</b> <StatusBadge status={row.interviewStatus} />
            </div>
            <div>
              <b>D:</b> <StatusBadge status={row.documentStatus} />
            </div>
          </div>
        </div>
      ),
    },

    {
      header: "Approval",
      render: (row) =>
        can("approve_astrologer") ? (
          <select
            value={row.approvalStatus}
            disabled={row.documentStatus !== "VERIFIED"}
            onChange={(e) =>
              updateApprovalStatus({
                variables: {
                  astrologerId: row.id,
                  status: e.target.value,
                },
              }).then(() => refetch())
            }
            className="border p-1 rounded"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        ) : (
          <span>{row.approvalStatus}</span>
        ),
    },
  ];

  return (
    <div className="p-10 space-y-5">

      {/* TABS */}
      <div className="flex gap-4">
        {["PENDING", "SCHEDULED", "PASSED", "APPROVED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setMainTab(tab)}
            className={`px-4 py-2 rounded-full text-sm ${
              mainTab === tab
                ? "bg-purple-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={astrologers} />

      {/* MODAL */}
      {openModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white w-[700px] rounded-xl p-5 space-y-4">

            {/* HEADER */}
            <div className="flex justify-between">
              <h2>{selected.name}</h2>
              <button onClick={() => setOpenModal(false)}>✕</button>
            </div>

            {/* TABS */}
            <div className="flex justify-evenly bg-purple-200 p-2 rounded-xl">
              <button onClick={() => setActiveTab("interview")}>
                Interview
              </button>

              <button
                disabled={selected.interviewStatus !== "PASSED"}
                className={
                  selected.interviewStatus !== "PASSED"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
                onClick={() => setActiveTab("documents")}
              >
                Documents
              </button>
            </div>

            {/* INTERVIEW */}
            {activeTab === "interview" && (
              <>
                {/* CREATE MODE */}
                {selected.interviewStatus === "PENDING" && (
                  <div className="grid grid-cols-2 gap-4">

                    <select
                      onChange={(e) =>
                        setForm({ ...form, interviewerId: e.target.value })
                      }
                    >
                      <option>Select Interviewer</option>
                      {interviewers.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="date"
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                    />

                    <input
                      type="time"
                      onChange={(e) =>
                        setForm({ ...form, time: e.target.value })
                      }
                    />

                    <select
                      onChange={(e) =>
                        setForm({ ...form, round: e.target.value })
                      }
                    >
                      <option value="1">Round 1</option>
                      <option value="2">Round 2</option>
                    </select>

                    <button
                      onClick={handleSchedule}
                      className="col-span-2 bg-black text-white py-2 rounded"
                    >
                      Schedule
                    </button>
                  </div>
                )}

                {/* DETAILS MODE */}
                {["SCHEDULED", "PASSED"].includes(
                  selected.interviewStatus
                ) && (
                  <div className="bg-gray-50 p-4 rounded-xl space-y-2">

                    <p>
                      <b>Interviewer:</b>{" "}
                      {interviewers.find(
                        (i) => i.id === selected.interviewerId
                      )?.name || "-"}
                    </p>

                    <p>
                      <b>Date:</b>{" "}
                      {selected.interviewDate
                        ? new Date(
                            selected.interviewDate
                          ).toLocaleDateString()
                        : "-"}
                    </p>

                    <p>
                      <b>Time:</b> {selected.interviewTime || "-"}
                    </p>

                    <p>
                      <b>Round:</b> {selected.round || "-"}
                    </p>

                    <button
                      onClick={() => {
                        setSelected({
                          ...selected,
                          interviewStatus: "PENDING",
                        });

                        setForm({
                          interviewerId:
                            selected.interviewerId || "",
                          date:
                            selected.interviewDate?.split("T")[0] ||
                            "",
                          time: selected.interviewTime || "",
                          round: selected.round || "1",
                        });
                      }}
                      className="bg-orange-500 text-white px-4 py-2 rounded"
                    >
                      Reschedule
                    </button>
                  </div>
                )}
              </>
            )}

            {/* DOCUMENTS */}
            {activeTab === "documents" && (
              <select
                value={selected.documentStatus}
                onChange={async (e) => {
                  const res = await updateDocumentStatus({
                    variables: {
                      astrologerId: selected.id,
                      status: e.target.value,
                    },
                  });

                  setSelected(res.data.updateDocumentStatus);
                  refetch();
                }}
              >
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Rejected</option>
              </select>
            )}
          </div>
        </div>
      )}
    </div>
  );
}