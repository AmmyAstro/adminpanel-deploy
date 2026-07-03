import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportExcel = (rows) => {
  const sheet = rows.map((x) => ({
    Name: x.displayName,
    Email: x.email,
    Phone: x.contactNo,
    Joined: x.createdAt,
  }));

  const wb = XLSX.utils.book_new();

  const ws = XLSX.utils.json_to_sheet(sheet);

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    "Astrologers"
  );

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer]),
    "Astrologers.xlsx"
  );
}; 