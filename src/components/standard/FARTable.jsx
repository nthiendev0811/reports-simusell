import { formatCurrency } from '../../utils/formatters';

export default function FARTable({ salesPeople }) {
  if (!salesPeople || salesPeople.length === 0) {
    return <div className="text-center text-gray-500 py-8">No salesperson forecast data available</div>;
  }

  const rows = [...salesPeople].sort((a, b) => {
    const aError = Math.abs(a.forecastError || 0);
    const bError = Math.abs(b.forecastError || 0);
    return aError - bError;
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Salesperson</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Forecast Error</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Salesperson ID</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((person) => (
            <tr key={person._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-gray-900 font-semibold">
                {person.firstName || 'Unknown'} {person.lastName || ''}
              </td>
              <td className={`px-6 py-4 text-right font-mono ${person.forecastError >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(person.forecastError)}
              </td>
              <td className="px-6 py-4 text-right text-gray-700 font-mono">
                {person.salesPersonId || person._id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
