export default function DataTableSimple({ columns, data }) {
  // Renders a simple table with provided columns [{key, header}] and data [{col1, col2...}]
  return (
    <div className="overflow-x-auto w-full my-4">
      <table className="min-w-full border rounded-sm text-right text-sm">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} className="font-bold px-3 py-1 bg-muted">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 10).map((row, idx) => (
            <tr key={idx} className="even:bg-muted/40">
              {columns.map(col => (
                <td key={col.key} className="px-3 py-1">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

