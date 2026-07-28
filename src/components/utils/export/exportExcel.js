import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportExcel = (rows, sheetName = "Sheet1", fileName = "Export.xlsx") => {
  const wb = XLSX.utils.book_new();

  const ws = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(new Blob([excelBuffer]), fileName);
};