export default function MSATeamTable({ teamCompanies }) {
  if (!teamCompanies || teamCompanies.length === 0) {
    return <div className="text-center text-gray-500 py-8">No market share data available</div>;
  }

  // Sort by market share descending
  const sortedTeams = [...teamCompanies]
    .sort((a, b) => (b.marketShare || 0) - (a.marketShare || 0))
    .map((team, idx) => ({
      ...team,
      rank: idx + 1,
    }));

  const total = sortedTeams.reduce((sum, team) => sum + (team.marketShare || 0), 0);

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getRowColor = (rank, total) => {
    if (rank === 1) return 'bg-yellow-50 border-l-4 border-yellow-400';
    if (rank === 2) return 'bg-gray-50 border-l-4 border-gray-400';
    if (rank === 3) return 'bg-orange-50 border-l-4 border-orange-400';
    if (rank <= Math.ceil(total / 2)) return 'bg-green-50 border-l-4 border-green-200';
    return 'bg-white border-l-4 border-gray-200';
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Team</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Market Share</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Percentage of Total</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team) => {
            const sharePercent = total > 0 ? (team.marketShare / total * 100) : 0;
            return (
              <tr key={team._id} className={`border-b border-gray-200 hover:bg-opacity-75 transition ${getRowColor(team.rank, sortedTeams.length)}`}>
                <td className="px-6 py-4 text-center font-bold text-lg">
                  {getMedalEmoji(team.rank)}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  Team {team.teamNum}
                </td>
                <td className="px-6 py-4 text-right text-gray-700 font-mono font-semibold">
                  {(team.marketShare || 0).toFixed(1)}%
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${sharePercent}%` }}
                      />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm w-12 text-right">
                      {sharePercent.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 border-t-2 border-gray-300 font-bold">
            <td colSpan="2" className="px-6 py-3 text-gray-900">
              Total Market Share
            </td>
            <td className="px-6 py-3 text-right text-gray-900 font-mono">
              {total.toFixed(1)}%
            </td>
            <td className="px-6 py-3 text-right text-gray-900">
              100.0%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
