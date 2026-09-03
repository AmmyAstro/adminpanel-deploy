"use client";

import { useState } from "react";
import {
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client/react";
import { gql } from "@apollo/client";
import { exportExcel } from "@/components/utils/export/exportExcel";
import { exportPDF } from "@/components/utils/export/exportPDF";
import { exportCSV } from "@/components/utils/export/exportCsv";
import { printTable } from "@/components/utils/export/exportPrint";
import ExportMenu from "@/components/Custom/ExportMenu";
import DataTable from "@/components/utils/DataTable";
import { EXPORT_PAYOUT_REPORT, GET_ASTROLOGER_PAYOUT_HISTORY } from "@/app/graphQL/astroHiring";
const GET_PAYOUT_REPORT = gql`
  query PayoutReport($fromDate: String!, $toDate: String!) {
    payoutReport(fromDate: $fromDate, toDate: $toDate) {
      astrologerId
      astrologerName
      profilePic

      accountHolderName
      accountNumber
      bankName
      ifsc
      panNumber
      state

      totalSessions

      totalRevenue

      commissionPercent
      commission

      earning

      pgChargeRate
      pgCharge

      gstRate
      cgst
      sgst
      igst

      pgTotal

      grossAmount

      tdsPercent
      tdsAmount

      lastPaidAmount
      totalPaid
      payableAmount
    }
  }
`;
export default function RazorpayPayouts() {
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [pendingExport, setPendingExport] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const client = useApolloClient();
  const [selectedAstrologer, setSelectedAstrologer] = useState(null);
  const [showPayoutHistory, setShowPayoutHistory] = useState(false);

  const [
    getAstrologerPayoutHistory,
    { data: payoutHistoryData, loading: payoutHistoryLoading },
  ] = useLazyQuery(GET_ASTROLOGER_PAYOUT_HISTORY, {
    fetchPolicy: "network-only",
  });
  const handleViewPayoutHistory = async (astrologer) => {
    setSelectedAstrologer(astrologer);
    setShowPayoutHistory(true);

    await getAstrologerPayoutHistory({
      variables: {
        astrologerId: astrologer.astrologerId,
      },
    });
  };
  const openRemarkModal = (exportType) => {
    setPendingExport(exportType);
    setRemark("");
    setShowRemarkModal(true);
  };
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

const toggleSelectAll = () => {
  if (selectedRows.length === reportData.length) {
    setSelectedRows([]);
  } else {
    setSelectedRows(reportData.map((x) => x.astrologerId));
  }
};

  const [getPayoutReport, { loading, error }] = useLazyQuery(
    GET_PAYOUT_REPORT,
    {
      fetchPolicy: "network-only",
    },
  );
  const [exportPayoutReport] = useMutation(EXPORT_PAYOUT_REPORT);
  const getExportData = async () => {
const { data } = await exportPayoutReport({
  variables: {
    fromDate: new Date(filters.startDate).toISOString(),

    toDate: new Date(
      `${filters.endDate}T23:59:59.999`
    ).toISOString(),

    remark: remark.trim(),
  },
});
    console.log("Mutation Response", data);
    return data.exportPayoutReport.map((x) => ({
      Astrologer: x.astrologerName,

      AccountHolder: x.accountHolderName,

      AccountNumber: x.accountNumber,

      Bank: x.bankName,

      IFSC: x.ifsc,

      PAN: x.panNumber,

      State: x.state,

      Sessions: x.totalSessions,

      Revenue: x.totalRevenue,

      Earning: x.earning,

      PGCharge: x.pgCharge,

      IGST: x.igst,

      CGST: x.cgst,

      SGST: x.sgst,

      PGTotal: x.pgTotal,

      GrossAmount: x.grossAmount,

      TDS: x.tdsAmount,

      LastPaid: x.lastPaidAmount,

      Payable: x.payableAmount,
    }));
  };
  const [reportData, setReportData] = useState([]);

  const [searched, setSearched] = useState(false);

  const handleMakePayment = async () => {
    if (!filters.startDate || !filters.endDate) {
      alert("Please select Start Date and End Date");
      return;
    }

    const { data } = await getPayoutReport({
      variables: {
        fromDate: new Date(filters.startDate).toISOString(),

        toDate: new Date(`${filters.endDate}T23:59:59.999`).toISOString(),
      },
    });

    setReportData(data?.payoutReport || []);

    setSearched(true);
  };

  const currentExportData = reportData.map((x) => ({
    Astrologer: x.astrologerName,

    AccountHolder: x.accountHolderName,

    AccountNumber: x.accountNumber,

    Bank: x.bankName,

    IFSC: x.ifsc,

    PAN: x.panNumber,

    State: x.state,

    Sessions: x.totalSessions,

    Revenue: x.totalRevenue,

    Earning: x.earning,

    PGCharge: x.pgCharge,

    IGST: x.igst,

    CGST: x.cgst,

    SGST: x.sgst,

    PGTotal: x.pgTotal,

    GrossAmount: x.grossAmount,

    TDS: x.tdsAmount,

    LastPaid: x.lastPaidAmount,

    Payable: x.payableAmount,
  }));

  const selectedExportData = reportData
    .filter((x) => selectedRows.includes(x.astrologerId))
    .map((x) => ({
      Astrologer: x.astrologerName,

      Sessions: x.totalSessions,

      Revenue: x.totalRevenue,

      Commission: x.commission,

      Earning: x.earning,

      PGCharge: x.pgCharge,

      CGST: x.cgst,

      SGST: x.sgst,

      IGST: x.igst,

      PGTotal: x.pgTotal,

      GrossAmount: x.grossAmount,

      TDS: x.tdsAmount,

      LastPaid: x.lastPaidAmount,

      Payable: x.payableAmount,
    }));
  const exportData =
    selectedRows.length > 0 ? selectedExportData : currentExportData;

  const columns = [
    {
      header: "",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.astrologerId)}
          onChange={() => toggleSelection(row.astrologerId)}
        />
      ),
      width: "40px",
    },

    {
      header: "Astrologer",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-semibold">{row.astrologerName}</div>

            <div className="text-xs text-gray-500">
              {row.astrologerId.slice(0, 6)}
            </div>
          </div>
        </div>
      ),
    },

    {
      header: "Bank A/C Holder",
      accessor: "accountHolderName",
    },

    {
      header: "Bank A/C No",
      accessor: "accountNumber",
    },

    {
      header: "Bank Name",
      render: (row) => (
        <div className="flex flex-col text-xs items-center gap-1">
          <div className="">{row.bankName}</div>

          <div className="">{row.ifsc}</div>
        </div>
      ),
    },

    {
      header: "PAN Card",
      accessor: "panNumber",
    },
    {
      header: "State",
      accessor: "state",
    },

    {
      header: "Total Revenue",
      render: (r) => `₹${r.totalRevenue.toFixed(2)}`,
    },

    {
      header: "Earning",
      render: (r) => `₹${r.earning.toFixed(2)}`,
    },

    {
      header: "Deducted PG Charges (2.11%)",
      render: (r) => `₹${r.pgCharge.toFixed(2)}`,
    },

    {
      header: "IGST (18%)",
      render: (r) => `₹${r.igst.toFixed(2)}`,
    },

    {
      header: "CGST (9%)",
      render: (r) => `₹${r.cgst.toFixed(2)}`,
    },

    {
      header: "SGST (9%)",
      render: (r) => `₹${r.sgst.toFixed(2)}`,
    },

    {
      header: "PG Total",
      render: (r) => `₹${r.pgTotal.toFixed(2)}`,
    },

    {
      header: "Gross Amount",
      render: (r) => `₹${r.grossAmount.toFixed(2)}`,
    },

    {
      header: "Deducted TDS",
      render: (r) => `₹${r.tdsAmount.toFixed(2)}`,
    },

    // {
    //   header: "Total Paid",
    //   render: (r) => `₹${r.totalPaid.toFixed(2)}`,
    // },
    {
      header: "Payable Amount",

      render: (r) => (
        <span className="text-green-600 font-bold">
          ₹{r.payableAmount.toFixed(2)}
        </span>
      ),
    },

    {
      header: "Last Payout",
      render: (r) => `₹${r.lastPaidAmount.toFixed(2)}`,
    },
    {
      header: "Action",
      render: (r) => (
        <button
          type="button"
          title="View Payout History"
          onClick={() => handleViewPayoutHistory(r)}
          className="flex cursor-pointer hover:scale-105 items-center justify-center text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height={20}
            width={20}
            viewBox="0 0 640 640"
            fill="currentColor"
          >
            <path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z" />
          </svg>
        </button>
      ),
    },
  ];
const handleExcelExport = () => {
  exportExcel(exportData, "Payout Report", "PayoutReport.xlsx");
};

const handleCSVExport = () => {
  exportCSV(exportData, "PayoutReport");
};

const handlePDFExport = () => {
  exportPDF(exportData, "Payout Report", "PayoutReport.pdf");
};

const submitExport = async () => {
  if (!remark.trim()) {
    alert("Please enter remark");
    return;
  }

  try {
    setExportLoading(true);

    // =========================
    // EXPORT ONLY
    // =========================
    if (pendingExport === "excel") {
      exportExcel(
        exportData,
        "Payout Report",
        "PayoutReport.xlsx"
      );
    }

    if (pendingExport === "csv") {
      exportCSV(exportData, "PayoutReport");
    }

    if (pendingExport === "pdf") {
      exportPDF(
        exportData,
        "Payout Report",
        "PayoutReport.pdf"
      );
    }

    // =========================
    // PROCESS PAYOUT ONLY
    // =========================
    if (pendingExport === "payout") {
      const astrologerIds =
        selectedRows.length > 0
          ? selectedRows
          : reportData.map((x) => x.astrologerId);

      await exportPayoutReport({
        variables: {
          fromDate: new Date(
            filters.startDate
          ).toISOString(),

          toDate: new Date(
            `${filters.endDate}T23:59:59.999`
          ).toISOString(),

          remark: remark.trim(),

          astrologerIds,
        },
      });

      alert("Payout processed successfully");

      setSelectedRows([]);

      // refresh report
      await handleMakePayment();
    }

    setShowRemarkModal(false);
    setRemark("");
    setPendingExport(null);

  } catch (error) {
    console.error("Action failed:", error);
    alert("Action failed");
  } finally {
    setExportLoading(false);
  }
};

  return (
    <div className="p- space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payout Report</h1>
      </div>

      {/* FILTERS */}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-end gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>

            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  startDate: e.target.value,
                })
              }
              className="border rounded-full border-gray-300 px-4 py-2 w-56"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>

            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  endDate: e.target.value,
                })
              }
              className="border rounded-full border-gray-300 px-4 py-2 w-56"
            />
          </div>

          <button
            onClick={handleMakePayment}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-full "
          >
            Search
          </button>

       {searched && (
  <div className="flex items-center gap-3">
    <ExportMenu
      onExcel={handleExcelExport}
      onCSV={handleCSVExport}
      onPDF={handlePDFExport}
    />

    <button
      type="button"
      onClick={() => openRemarkModal("payout")}
      disabled={!reportData.length}
      className="rounded-full bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-50"
    >
      Process Payout
    </button>
  </div>
)}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-400 shadow-sm overflow-hidden">
        {!searched ? (
          <div className="py-24 text-center text-gray-500">
            <h2 className="text-xl font-semibold mb-2">No Report</h2>

            <p>
              Select Start Date and End Date then click
              <b> Search button</b>.
            </p>
          </div>
        ) : loading ? (
          <div className="py-20 text-center">Loading...</div>
        ) : error ? (
          <div className="py-20 text-center text-red-500">{error.message}</div>
        ) : reportData.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No payout found for selected dates.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[1500px]">
              <DataTable columns={columns} data={reportData} />
            </div>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {/* FOOTER */}

      {/* <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold">
            {(filters.page - 1) * filters.limit + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {Math.min(filters.page * filters.limit, summary.totalCount || 0)}
          </span>{" "}
          of <span className="font-semibold">{summary.totalCount || 0}</span>
          entries
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={filters.page === 1}
            onClick={() => handlePageChange(1)}
            className="border rounded-lg px-3 py-2 disabled:opacity-40"
          >
            {"<<"}
          </button>

          <button
            disabled={filters.page === 1}
            onClick={() => handlePageChange(filters.page - 1)}
            className="border rounded-lg px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>

          <span className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold">
            {filters.page}
          </span>

          <button
            disabled={filters.page >= (summary.totalPages || 1)}
            onClick={() => handlePageChange(filters.page + 1)}
            className="border rounded-lg px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>

          <button
            disabled={filters.page >= (summary.totalPages || 1)}
            onClick={() => handlePageChange(summary.totalPages)}
            className="border rounded-lg px-3 py-2 disabled:opacity-40"
          >
            {">>"}
          </button>
        </div>
      </div> */}
      {showPayoutHistory && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-7xl rounded-xl bg-white shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedAstrologer?.astrologerName}
                </h2>

                <p className="text-sm text-gray-500">
                  ID: {selectedAstrologer?.astrologerId}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPayoutHistory(false);
                  setSelectedAstrologer(null);
                }}
                className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="max-h-[70vh] overflow-auto p-6">
              {payoutHistoryLoading ? (
                <div className="py-20 text-center">
                  Loading payout history...
                </div>
              ) : payoutHistoryData?.getAstrologerPayoutHistory?.length ===
                0 ? (
                <div className="py-20 text-center text-gray-500">
                  No payout history found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1200px] border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-left text-sm">
                        <th className="border p-3">#</th>
                        <th className="border p-3">Remark</th>
                        <th className="border p-3">Earning</th>
                        <th className="border p-3">Deducted PG Charges</th>
                        <th className="border p-3">Sub Total</th>
                        <th className="border p-3">Deducted TDS</th>
                        <th className="border p-3">Paid Amount</th>
                        <th className="border p-3">Start Date</th>
                        <th className="border p-3">End Date</th>
                        <th className="border p-3">Paid On</th>
                      </tr>
                    </thead>

                    <tbody>
                      {payoutHistoryData?.getAstrologerPayoutHistory?.map(
                        (payout, index) => (
                          <tr key={payout.id} className="text-sm">
                            <td className="border p-3">{index + 1}</td>

                            <td className="border p-3">
                              {payout.remark || "-"}
                            </td>

                            <td className="border p-3">
                              ₹{Number(payout.earning || 0).toFixed(2)}
                            </td>

                            <td className="border p-3">
                              ₹{Number(payout.pgCharge || 0).toFixed(2)}
                            </td>

                            <td className="border p-3">
                              ₹{Number(payout.subTotal || 0).toFixed(2)}
                            </td>

                            <td className="border p-3">
                              ₹{Number(payout.tdsAmount || 0).toFixed(2)}
                            </td>

                            <td className="border p-3">
                              <span className="font-bold text-green-600">
                                ₹{Number(payout.paidAmount || 0).toFixed(2)}
                              </span>
                            </td>

                            <td className="border p-3">
                              {payout.startDate
                                ? new Date(
                                    payout.startDate,
                                  ).toLocaleDateString()
                                : "-"}
                            </td>

                            <td className="border p-3">
                              {payout.endDate
                                ? new Date(payout.endDate).toLocaleDateString()
                                : "-"}
                            </td>

                            <td className="border p-3">
                              {payout.paidOn
                                ? new Date(payout.paidOn).toLocaleString()
                                : "-"}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showRemarkModal && (
  <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">

      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-bold">
          Add Remark
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Please enter a remark before exporting the payout report.
        </p>
      </div>

      <div className="p-6">

        <label className="mb-2 block text-sm font-medium">
          Remark
        </label>

        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Enter payout remark..."
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-300 p-3 outline-none focus:border-indigo-500"
        />

        <div className="mt-5 flex justify-end gap-3">

          <button
            type="button"
            onClick={() => {
              setShowRemarkModal(false);
              setRemark("");
              setPendingExport(null);
            }}
            disabled={exportLoading}
            className="rounded-lg border border-gray-300 px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submitExport}
            disabled={exportLoading}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {exportLoading ? "Processing..." : "Submit"}
          </button>

        </div>

      </div>
    </div>
  </div>
)}
    </div>
  );
}
