import { saveAs } from "file-saver";

export const exportCSV = (rows, filename = "astrologers") => {
  const csv = [
    ["Name", "Email", "Phone", "Joined On"],
    ...rows.map((x) => [
      x.displayName,
      x.email,
      x.contactNo,
      x.createdAt,
    ]),
  ]
    .map((e) => e.join(","))
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, `${filename}.csv`);
};