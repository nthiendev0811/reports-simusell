export default function CRRTable({ teamCompanies }) {
  if (!teamCompanies || teamCompanies.length === 0) {
    return <div className="text-center text-gray-500 py-8">No team data available</div>;
  }

  // Prepare data with rankings
  const formatMoney = (value) => {
    if (!value) return '$0';
    return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  // Sort by cumulative revenue to determine rankings
  const teamsWithRanks = teamCompanies.map((team, idx) => ({
    ...team,
    rank: idx + 1,
    revenue: team.cumulativePerformanceData?.revenue || 0,
    profit: team.cumulativePerformanceData?.profit || 0,
    forecastedRevenue: team.cumulativePerformanceData?.forecastedRevenue || 0,
  })).sort((a, b) => b.revenue - a.revenue);

  const getRankMedalColor = (rank) => {
    if (rank === 1) return 'bg-yellow-50 border-l-4 border-yellow-400';
    if (rank === 2) return 'bg-gray-50 border-l-4 border-gray-400';
    if (rank === 3) return 'bg-orange-50 border-l-4 border-orange-400';
    return 'bg-white border-l-4 border-gray-200';
  };

  const getRankMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Team</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Cumulative Revenue</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Cumulative Profit</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Forecasted Revenue</th>
          </tr>
        </thead>
        <tbody>
          {teamsWithRanks.map((team) => (
            <tr key={team._id} className={`border-b border-gray-200 hover:bg-gray-50 transition ${getRankMedalColor(team.rank)}`}>
              <td className="px-6 py-4 text-center font-bold text-lg">
                {getRankMedal(team.rank)}
              </td>
              <td className="px-6 py-4 font-semibold text-gray-900">
                Team {team.teamNum}
              </td>
              <td className="px-6 py-4 text-right text-gray-700 font-mono">
                {formatMoney(team.revenue)}
              </td>
              <td className={`px-6 py-4 text-right font-mono font-semibold ${team.profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatMoney(team.profit)}
              </td>
              <td className="px-6 py-4 text-right text-gray-700 font-mono">
                {formatMoney(team.forecastedRevenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
