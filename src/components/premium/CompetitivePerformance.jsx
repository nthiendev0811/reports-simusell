import { formatCurrency } from '../../utils/formatters';

export default function CompetitivePerformance({ teams = [] }) {
  if (!teams || teams.length === 0) return null;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Competitive Performance</h2>
        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition no-print"
        >
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Period</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Profit ($)</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Rank</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Profit ($)</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700"># Territories</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700"># States with Reps</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700"># States with Reps</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{team.period || 'Last Quarter'}</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(team.quarterlyRevenue || team.revenue || 0)}
                </td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(team.quarterlyProfit || team.profit || 0)}
                </td>
                <td className="py-3 px-4 text-center text-gray-900">
                  {team.salesRank || team.rank || '-'}
                </td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(team.quarterlyProfit || team.profit || 0)}
                </td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {team.numTerritories || 0}
                </td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {team.numStates || 0}
                </td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {team.numStates || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
