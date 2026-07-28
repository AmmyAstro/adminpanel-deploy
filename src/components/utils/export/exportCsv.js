import { saveAs } from "file-saver";

export const exportCSV = (
  rows,
  filename = "Export"
) => {
  if (!rows?.length) return;

  const headers = Object.keys(rows[0]);

  const csv = [
    headers,
    ...rows.map((row) =>
      headers.map((header) => {
        const value = row[header] ?? "";

        return `"${String(value).replace(/"/g, '""')}"`;
      })
    ),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, `${filename}.csv`);
};