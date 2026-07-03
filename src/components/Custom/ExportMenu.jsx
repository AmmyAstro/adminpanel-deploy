"use client";

import { useState, useRef, useEffect } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  ChevronDown,
} from "lucide-react";

export default function ExportMenu({
  onExcel,
  onCSV,
  onPDF,
  onPrint,
  onExportCurrent,
  onExportAll,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () =>
      document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg bg-violet-600 text-white px-4 py-2 hover:bg-violet-700"
      >
        <Download size={18} />

        Export

        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border z-50">

          <button
            onClick={onExcel}
            className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
          >
            <FileSpreadsheet size={18} />

            Excel (.xlsx)
          </button>

          <button
            onClick={onCSV}
            className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
          >
            📄 CSV
          </button>

          <button
            onClick={onPDF}
            className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
          >
            <FileText size={18} />

            PDF
          </button>

          <button
            onClick={onPrint}
            className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
          >
            <Printer size={18} />

            Print
          </button>

          <hr />

          <button
            onClick={onExportCurrent}
            className="w-full px-4 py-3 hover:bg-gray-50 text-left"
          >
            📤 Export Current Page
          </button>

          <button
            onClick={onExportAll}
            className="w-full px-4 py-3 hover:bg-gray-50 text-left"
          >
            🌍 Export All Results
          </button>
        </div>
      )}
    </div>
  );
}