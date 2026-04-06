import { formatCurrency } from '../../utils/formatters';

export default function ISPTable({ states }) {
  if (!states || states.length === 0) {
    return <div className="text-center text-gray-500 py-8">No state potential records available</div>;
  }

  const rows = [...states].sort((a, b) => (b.totalPotential || 0) - (a.totalPotential || 0));

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">State</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">A Account Potential</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">B Account Potential</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">C Account Potential</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total Potential</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Market Size</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((state) => (
            <tr key={state._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-gray-900 font-semibold">{state.name || state.stateInitials || 'Unknown'}</td>
              <td className="px-6 py-4 text-right text-gray-700 font-mono">{formatCurrency(state.aAccountPotential)}</td>
              <td className="px-6 py-4 text-right text-gray-700 font-mono">{formatCurrency(state.bAccountPotential)}</td>
              <td className="px-6 py-4 text-right text-gray-700 font-mono">{formatCurrency(state.cAccountPotential)}</td>
              <td className="px-6 py-4 text-right text-gray-700 font-mono">{formatCurrency(state.totalPotential)}</td>
              <td className="px-6 py-4 text-right text-gray-700 font-mono">{formatCurrency(state.marketSize)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
