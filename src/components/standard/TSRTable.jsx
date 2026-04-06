function formatValue(value) {
  if (value === null || value === undefined) return '-';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default function TSRTable({ teamCompanies }) {
  if (!teamCompanies || teamCompanies.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600">
        No team company records were found for this report.
      </div>
    );
  }

  const columns = Object.keys(teamCompanies[0]).filter((key) => key !== '_id');

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {col.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {teamCompanies.map((company) => (
            <tr key={company._id || JSON.stringify(company)}>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{company._id || 'n/a'}</td>
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 text-sm text-gray-700">
                  {formatValue(company[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
