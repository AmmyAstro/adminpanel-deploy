"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import DataTable from "@/components/utils/DataTable";
import { usePermissions } from "@/context/PermissionContext";

import {
  GET_APPLICATIONS,
  SCHEDULE_INTERVIEW,
  UPDATE_APPROVAL_STATUS,
  UPLOAD_IMAGE,
  SAVE_AND_VERIFY_KYC,
  REJECT_KYC,
} from "@/app/graphQL/astroHiring";

import { GET_INTERVIEWERS } from "@/app/graphQL/astroHiring";

export default function AstrologerHiring() {
  const { can } = usePermissions();

  const { data, refetch } = useQuery(GET_APPLICATIONS);
  const { data: interviewerData } = useQuery(GET_INTERVIEWERS);

  const [scheduleInterview] = useMutation(SCHEDULE_INTERVIEW);
  const [updateApprovalStatus] = useMutation(UPDATE_APPROVAL_STATUS);
  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const [saveAndVerifyKyc] = useMutation(SAVE_AND_VERIFY_KYC);
  const [rejectKyc] = useMutation(REJECT_KYC);

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

  const interviewerMap = Object.fromEntries(
    interviewers.map((i) => [i.id, i.name])
  );

  const StatusBadge = ({ status }) => {
    const map = {
      pending: "bg-yellow-500",
      scheduled: "bg-orange-500",
      passed: "bg-green-500",
      rejected: "bg-red-500",
      verified: "bg-green-600",
    };
    return (
      <span className={`w-2 h-2 rounded-full ${map[status?.toLowerCase()] || "bg-gray-400"}`} />
    );
  };

  // 🔥 Schedule / Reschedule
  const handleSchedule = async () => {
    if (!form.interviewerId) return alert("Select interviewer");

    await scheduleInterview({
      variables: {
        astrologerId: selected.id,
        interviewerId: form.interviewerId,
        interviewDate: form.date,
        interviewTime: form.time,
        round: Number(form.round),
      },
    });

    refetch();
  };

  // 🔥 Upload Docs
  const handleUpload = async (key, file) => {
    if (!file) return;

    const res = await uploadImage({ variables: { file } });
    const url = res.data.uploadImage.url;

    setSelected((prev) => ({
      ...prev,
      kyc: {
        ...prev.kyc,
        [key]: url,
      },
    }));
  };

  // 🔥 Save & Verify
  const handleSave = async () => {
    await saveAndVerifyKyc({
      variables: {
        astrologerId: selected.id,
        ...selected.kyc,
        status: "VERIFIED",
      },
    });
    refetch();
  };

  const handleReject = async () => {
    await rejectKyc({ variables: { astrologerId: selected.id } });
    refetch();
  };

  // 🔥 TABLE COLUMNS
  const columns = [
    { header: "Name", accessor: "name" },
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
      header: "Experience",
      accessor: "experience",
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
            Open
          </button>

          <div className="text-[10px]">
            <div className="flex items-center gap-1">
              <b>I:</b> <StatusBadge status={row.interviewStatus} />
            </div>
            <div className="flex items-center gap-1">
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
                variables: { astrologerId: row.id, status: e.target.value },
              }).then(refetch)
            }
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        ) : (
          row.approvalStatus
        ),
    },
  ];

  return (
    <div className="p-10">
      <DataTable columns={columns} data={allData} />

      {openModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white w-[700px] rounded-xl p-5 space-y-4">

            <div className="flex justify-between">
              <h2>{selected.name}</h2>
              <button onClick={() => setOpenModal(false)}>✕</button>
            </div>

            {/* Tabs */}
            <div className="flex justify-evenly bg-purple-200 p-2 rounded-xl">
              <button onClick={() => setActiveTab("interview")}>Interview</button>
              <button
                disabled={selected.interviewStatus !== "PASSED"}
                onClick={() => setActiveTab("documents")}
              >
                Documents
              </button>
            </div>

            {/* 🔥 INTERVIEW TAB */}
            {activeTab === "interview" && (
              <div className="space-y-3">

                {/* IF NOT SCHEDULED */}
                {selected.interviewStatus === "PENDING" && (
                  <>
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

                    <input type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} />
                    <input type="time" onChange={(e) => setForm({ ...form, time: e.target.value })} />

                    <button onClick={handleSchedule} className="bg-black text-white px-4 py-2 rounded">
                      Schedule Interview
                    </button>
                  </>
                )}

                {/* IF SCHEDULED / PASSED */}
                {["SCHEDULED", "PASSED", "REJECTED"].includes(selected.interviewStatus) && (
                  <div className="bg-gray-100 p-3 rounded space-y-2 text-sm">

                    <p><b>Interviewer:</b> {interviewerMap[selected.interviewerId] || "-"}</p>
                    <p><b>Date:</b> {selected.interviewDate?.split("T")[0] || "-"}</p>
                    <p><b>Time:</b> {selected.interviewTime || "-"}</p>
                    <p><b>Round:</b> {selected.round || "-"}</p>
                    <p><b>Status:</b> {selected.interviewStatus}</p>

                    <button
                      onClick={() => {
                        setSelected({ ...selected, interviewStatus: "PENDING" });
                        setForm({
                          interviewerId: selected.interviewerId || "",
                          date: selected.interviewDate?.split("T")[0] || "",
                          time: selected.interviewTime || "",
                          round: selected.round || "1",
                        });
                      }}
                      className="bg-orange-500 text-white px-3 py-1 rounded"
                    >
                      Reschedule
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 🔥 DOCUMENT TAB */}
            {activeTab === "documents" && (
              <div className="space-y-4">

                {/* BANK */}
                <div className="grid grid-cols-2 gap-2">
                  {["accountHolderName","accountNumber","bankName","ifsc","branchName","panNumber"].map((field) => (
                    <input
                      key={field}
                      placeholder={field}
                      value={selected.kyc?.[field] || ""}
                      onChange={(e) =>
                        setSelected((prev) => ({
                          ...prev,
                          kyc: { ...prev.kyc, [field]: e.target.value },
                        }))
                      }
                      className="border p-2 rounded text-xs"
                    />
                  ))}
                </div>

                {/* DOCS */}
                {["profileImage","aadhaarImage","panImage","passbookImage"].map((key) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span>{key}</span>
                    {selected.kyc?.[key] && <a href={selected.kyc[key]} target="_blank">View</a>}
                    <input type="file" onChange={(e) => handleUpload(key, e.target.files[0])} />
                  </div>
                ))}

                <div className="flex gap-3">
                  <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
                    Save & Verify
                  </button>
                  <button onClick={handleReject} className="bg-red-600 text-white px-4 py-2 rounded">
                    Reject
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}