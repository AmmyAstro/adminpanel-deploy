export default function DataTable({ columns, data }) {
  return (
    <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">

      <table className="w-full border-separate border-spacing-0">

      
        <thead className="bg-purple-300 border-b">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-5 py-3 text-left text-sm font-semibold "
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 border-b">

              {columns.map((col, i) => (
                <td
                  key={i}
                  className="px-5 py-4  text-sm"
                >
                  {col.render
                    ? col.render(row)
                    : row[col.accessor] || "-"}
                </td>
              ))}

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}