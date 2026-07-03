import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = (rows) => {
  const doc = new jsPDF();

  doc.text("Astrologer Report", 14, 15);

  autoTable(doc, {
    head: [["Name", "Email", "Phone"]],
    body: rows.map((x) => [
      x.displayName,
      x.email,
      x.contactNo,
    ]),
  });

  doc.save("Astrologers.pdf");
};