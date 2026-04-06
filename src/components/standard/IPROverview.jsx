export default function IPROverview({ teamCompanies }) {
  if (!teamCompanies || teamCompanies.length === 0) {
    return <div className="text-center text-gray-500">No industry performance data available</div>;
  }

  const sortedCurrent = [...teamCompanies].sort((a, b) => (b.currentMarketSharePercent || 0) - (a.currentMarketSharePercent || 0));
  const sortedAggregate = [...teamCompanies].sort((a, b) => (b.aggregateMarketSharePercent || 0) - (a.aggregateMarketSharePercent || 0));
  const ourTeam = teamCompanies[0];

  const rankCurrent = sortedCurrent.findIndex(team => team._id === ourTeam?._id) + 1;
  const rankAggregate = sortedAggregate.findIndex(team => team._id === ourTeam?._id) + 1;

  const formatPercent = (value) => {
    if (value === null || value === undefined) return '0.0%';
    return `${Number(value).toFixed(1)}%`;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank === 2) return 'text-slate-600';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-700';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Current Market Share</p>
        <p className="text-4xl font-bold text-slate-900 mt-3">{formatPercent(ourTeam.currentMarketSharePercent)}</p>
        <p className={`text-sm font-semibold mt-3 ${getRankBadge(rankCurrent)}`}>Rank #{rankCurrent}</p>
        <p className="text-gray-500 text-sm">Based on the latest market share</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Aggregate Market Share</p>
        <p className="text-4xl font-bold text-slate-900 mt-3">{formatPercent(ourTeam.aggregateMarketSharePercent)}</p>
        <p className={`text-sm font-semibold mt-3 ${getRankBadge(rankAggregate)}`}>Rank #{rankAggregate}</p>
        <p className="text-gray-500 text-sm">Across the full reporting period</p>
      </div>

      <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Competitors</p>
        <p className="text-4xl font-bold text-cyan-900 mt-3">{teamCompanies.length}</p>
        <p className="text-gray-500 text-sm mt-3">Teams included in IPR</p>
      </div>

      <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Top Competitor</p>
        <p className="text-4xl font-bold text-cyan-900 mt-3">Team {sortedCurrent[0]?.teamNum}</p>
        <p className="text-gray-500 text-sm mt-3">Best current market share</p>
      </div>
    </div>
  );
}
