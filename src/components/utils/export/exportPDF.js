import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = (
  rows,
  title = "Report",
  filename = "Report.pdf"
) => {
  if (!rows?.length) return;

  const doc = new jsPDF();

  doc.text(title, 14, 15);

  const headers = Object.keys(rows[0]);

  autoTable(doc, {
    head: [headers],
    body: rows.map((row) =>
      headers.map((header) => row[header] ?? "")
    ),
  });

  doc.save(filename);
};