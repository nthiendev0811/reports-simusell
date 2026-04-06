export default function IPRTable({ teamCompanies }) {
  if (!teamCompanies || teamCompanies.length === 0) {
    return <div className="text-center text-gray-500 py-8">No team performance data available</div>;
  }

  const sortedTeams = [...teamCompanies]
    .sort((a, b) => (b.currentMarketSharePercent || 0) - (a.currentMarketSharePercent || 0))
    .map((team, index) => ({
      ...team,
      currentRank: index + 1,
    }));

  const formatPercent = (value) => {
    if (value === null || value === undefined) return '0.0%';
    return `${Number(value).toFixed(1)}%`;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Team</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Current Market Share</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Aggregate Market Share</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team) => (
            <tr key={team._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-lg font-semibold text-gray-900">{team.currentRank}</td>
              <td className="px-6 py-4 text-gray-900">Team {team.teamNum}</td>
              <td className="px-6 py-4 text-right font-mono text-gray-700">{formatPercent(team.currentMarketSharePercent)}</td>
              <td className="px-6 py-4 text-right font-mono text-gray-700">{formatPercent(team.aggregateMarketSharePercent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
