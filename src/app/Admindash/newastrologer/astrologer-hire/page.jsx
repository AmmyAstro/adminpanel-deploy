"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import DataTable from "@/components/utils/DataTable";
import { usePermissions } from "@/context/PermissionContext";

import {
    GET_NEW_ASTROLOGERS,
    SCHEDULE_INTERVIEW,
    UPDATE_INTERVIEW_STATUS,
    UPDATE_DOCUMENT_STATUS,
    UPDATE_APPROVAL_STATUS,
    GET_PENDING_APPLICATIONS,
} from "@/app/graphQL/astroHiring";
import { GET_INTERVIEWERS } from "@/app/graphQL/astroHiring";

export default function AstrologerHiring() {
    const { can, isSuperAdmin } = usePermissions();

    const { data } = useQuery(GET_PENDING_APPLICATIONS);

    const [scheduleInterview] = useMutation(SCHEDULE_INTERVIEW);
    const [updateInterviewStatus] = useMutation(UPDATE_INTERVIEW_STATUS);
    const [updateDocumentStatus] = useMutation(UPDATE_DOCUMENT_STATUS);
    const [updateApprovalStatus] = useMutation(UPDATE_APPROVAL_STATUS);
    const { data: interviewerData } = useQuery(GET_INTERVIEWERS);
    const interviewers = interviewerData?.getInterviewers || [];
    const astrologers = data?.getPendingApplications || [];
console.log("API DATA:", data);
    const [openModal, setOpenModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const [activeTab, setActiveTab] = useState("interview");

    const [form, setForm] = useState({
        interviewer: "",
        date: "",
        time: "",
        round: "1",
    });

    const handleSchedule = async () => {
        await scheduleInterview({
            variables: {
                astrologerId: selected.id,
                interviewer: form.interviewer,
                interviewDate: form.date,
                interviewTime: form.time,
                round: Number(form.round),
            },
        });

        refetch();
    };

    const columns = [
        { header: "Name", accessor: "name" },
        { header: "Gender", accessor: "gender" },
        { header: "Phone", accessor: "phoneNumber" },
      {
  header: "Skills",
  render: (row) => row.skills.join(", "),
},
{
  header: "Languages",
  render: (row) => row.languages.join(", "),
},

        {
            header: "Insights",
            render: (row) => (
                <div className="flex gap-1 items-center justify-start">
                    <button
                        onClick={() => {
                            setSelected(row);
                            setOpenModal(true);
                            setActiveTab("interview");
                        }}
                        className="px-3 py-1 text-xs cursor-pointer hover:scale-103 bg-purple-500 text-white rounded-full"
                    >
                        Insights
                    </button>
                    <div className="flex text-violet-400 flex-col text-[10px] items-center justify-end"><span>Interview :{selected?.interviewStatus}</span>
                        <span>Documents :{selected?.documentStatus}</span></div>
                </div>
            ),
        },

        {
            header: "Approval",
            render: (row) => (
                <select
                    value={row.approvalStatus}
                    disabled={row.documentStatus !== "VERIFIED"}
                    onChange={(e) =>
                        updateApprovalStatus({
                            variables: {
                                astrologerId: row.id,
                                status: e.target.value,
                            },
                        })
                    }
                    className="border p-1 rounded"
                >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            ),
        },
    ];

    return (
        <div className="p-10 space-y-5">
            <DataTable columns={columns} data={astrologers} />

            <div className="flex justify-end">
                <button className="bg-purple-600 text-white px-5 py-2 rounded">
                    Final Save
                </button>
            </div>

            {/* MODAL */}
            {openModal && selected && (
                <div className="fixed inset-0  bg-black/40 flex justify-center items-center">
                    <div className="bg-white w-[800px] rounded-xl p-5 space-y-2">
                        {/* HEADER */}
                        <div className="flex justify-between">
                            <h2> {selected.name}</h2>
                            <button onClick={() => setOpenModal(false)}>✕</button>
                        </div>

                        {/* TABS */}
                        <div className="flex gap-5 items-center justify-evenly bg-purple-200 rounded-xl w-full p-2">
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => setActiveTab("interview")}
                                    className={`px-4 py-2 rounded-lg transition-all
                                     ${activeTab === "interview"
                                            ? "border-b-2 border-purple-600 shadow-xl font-semibold"
                                            : "text-gray-600"
                                        }
                                         `}
                                >
                                    Interview
                                </button>

                                <div>
                                    <h5 className="text-xs bg-purple-200 font-semibold text-purple-600 rounded-lg">Status: <span>{selected?.interviewStatus}</span></h5>
                                </div>
                            </div>

                            <button
                                disabled={selected?.interviewStatus !== "PASSED"}
                                onClick={() => setActiveTab("documents")}
                                className={`px-4 py-2 rounded-lg transition-all
      ${activeTab === "documents"
                                        ? "border-b-2 border-purple-600 shadow-xl font-semibold"
                                        : "text-gray-600"
                                    }
      ${selected?.interviewStatus !== "PASSED" ? "opacity-50 cursor-not-allowed" : ""}
    `}
                            >
                                Documents
                            </button>
                        </div>

                        {/* INTERVIEW */}
                        {activeTab === "interview" && (
                            <div className="p-5 shadow-xl rounded-xl border border-gray-200 space-y-4">
                                {/* <select
                                    value={selected.interviewStatus}
                                    onChange={(e) =>
                                        updateInterviewStatus({
                                            variables: {
                                                astrologerId: selected.id,
                                                status: e.target.value,
                                            },
                                        })
                                    }
                                    className="border p-2 w-full"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="SCHEDULED">Scheduled</option>
                                    <option value="PASSED">Passed</option>
                                    <option value="REJECTED">Rejected</option>
                                </select> */}

                                {selected?.interviewStatus !== "SCHEDULED" ? (
                                    <div className="grid grid-cols-2 gap-5 ">
                                        <select
                                            className="w-full border border-gray-100 rounded-full shadow-lg p-2"
                                            onChange={(e) =>
                                                setForm({ ...form, interviewerId: e.target.value })
                                            }
                                        >
                                            <option value="">Select Interviewer</option>

                                            {interviewers.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>

                                        <input
                                            type="date"
                                            className="w-full border border-gray-100 rounded-full shadow-lg p-2"
                                            onChange={(e) =>
                                                setForm({ ...form, date: e.target.value })
                                            }
                                        />

                                        <input
                                            type="time"
                                            className="w-full border border-gray-100 rounded-full shadow-lg p-2"
                                            onChange={(e) =>
                                                setForm({ ...form, time: e.target.value })
                                            }
                                        />

                                        <select
                                            className="w-full border border-gray-100 rounded-full shadow-lg p-2"
                                            onChange={(e) =>
                                                setForm({ ...form, round: e.target.value })
                                            }
                                        >
                                            <option value="1">Round 1</option>
                                            <option value="2">Round 2</option>
                                            <option value="3">Round 3</option>
                                        </select>

                                        <button
                                            onClick={handleSchedule}
                                            className="bg-black text-white rounded-full place-self-center col-span-2 px-4 py-2"
                                        >
                                            Schedule
                                        </button>
                                    </div>
                                ) : (
                                    <div className="border p-3">
                                        <p>{selected.interviewer}</p>
                                        <p>{selected.interviewDate}</p>
                                        <p>{selected.interviewTime}</p>
                                        <p>Round: {selected.round}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* DOCUMENTS */}
                        {activeTab === "documents" && (
                            <div className="space-y-4">
                                <select
                                    value={selected.documentStatus}
                                    onChange={(e) =>
                                        updateDocumentStatus({
                                            variables: {
                                                astrologerId: selected.id,
                                                status: e.target.value,
                                            },
                                        })
                                    }
                                    className="border p-2 w-full"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="VERIFIED">Verified</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>

                                <input type="file" />
                                <input type="file" />
                                <input type="file" />
                                <input type="file" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
