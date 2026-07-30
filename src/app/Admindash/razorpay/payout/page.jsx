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
import { EXPORT_PAYOUT_REPORT } from "@/app/graphQL/astroHiring";
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

      payableAmount
    }
  }
`;
export default function RazorpayPayouts() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const client = useApolloClient();

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
      setSelectedRows(reportData.map((x) => x.id));
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
        toDate: new Date(`${filters.endDate}T23:59:59.999`).toISOString(),
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
    .filter((x) => selectedRows.includes(x.astrologerName))
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
        <div className="flex items-center gap-2">
          <div className="font-semibold">{row.bankName}</div>

          <div className="font-semibold">{row.ifsc}</div>
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

    {
      header: "Last Payout",
      render: (r) => `₹${r.lastPaidAmount.toFixed(2)}`,
    },

    {
      header: "Payable Amount",

      render: (r) => (
        <span className="text-green-600 font-bold">
          ₹{r.payableAmount.toFixed(2)}
        </span>
      ),
    },
  ];
  const handleExcelExport = async () => {
    const rows = await getExportData();

    exportExcel(rows, "Payout Report", "PayoutReport.xlsx");

   await  handleMakePayment();
  };
  const handleCSVExport = async () => {
    const rows = await getExportData();

    exportCSV(rows, "PayoutReport");

   await  handleMakePayment();
  };
  const handlePDFExport = async () => {
    const rows = await getExportData();

    exportPDF(rows, "Payout Report", "PayoutReport.pdf");

   await  handleMakePayment();
  };
  const handlePrintExport = async () => {
    await getExportData();

    printTable();

   await  handleMakePayment();
  };
  const handleExportCurrent = async () => {
    const rows = await getExportData();

    exportExcel(rows, "Payout Report", "PayoutReport.xlsx");

   await  handleMakePayment();
  };
  const handleExportAll = async () => {
    const rows = await getExportData();

    exportExcel(rows, "Payout Report", "PayoutReport.xlsx");

   await  handleMakePayment();
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-medium"
          >
            Make Payment
          </button>

          {searched && (
            <ExportMenu
              onExcel={handleExcelExport}
              onCSV={handleCSVExport}
              onPDF={handlePDFExport}
              onPrint={handlePrintExport}
              onExportCurrent={handleExportCurrent}
              onExportAll={handleExportAll}
            />
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {!searched ? (
          <div className="py-24 text-center text-gray-500">
            <h2 className="text-xl font-semibold mb-2">No Report</h2>

            <p>
              Select Start Date and End Date then click
              <b> Make Payment</b>.
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
    </div>
  );
}
