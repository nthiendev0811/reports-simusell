export default function CRROverview({ teamCompanies }) {
  if (!teamCompanies || teamCompanies.length === 0) {
    return <div className="text-center text-gray-500">No team data available</div>;
  }

  // Sort by various metrics to determine rankings
  const getSortedTeams = (compareFn) => {
    return [...teamCompanies].sort(compareFn);
  };

  // Get current team (assuming first team is our team)
  const currentTeam = teamCompanies[0];
  const currentCumulative = currentTeam?.cumulativePerformanceData;

  // Rankings by revenue
  const revenueRanking = getSortedTeams((a, b) => {
    const aRevenue = a.cumulativePerformanceData?.revenue || 0;
    const bRevenue = b.cumulativePerformanceData?.revenue || 0;
    return bRevenue - aRevenue;
  });
  const revenueRank = revenueRanking.findIndex(t => t._id === currentTeam?._id) + 1;

  // Rankings by profit
  const profitRanking = getSortedTeams((a, b) => {
    const aProfit = a.cumulativePerformanceData?.profit || 0;
    const bProfit = b.cumulativePerformanceData?.profit || 0;
    return bProfit - aProfit;
  });
  const profitRank = profitRanking.findIndex(t => t._id === currentTeam?._id) + 1;

  // Rankings by forecasted revenue
  const forecastRanking = getSortedTeams((a, b) => {
    const aForecast = a.cumulativePerformanceData?.forecastedRevenue || 0;
    const bForecast = b.cumulativePerformanceData?.forecastedRevenue || 0;
    return bForecast - aForecast;
  });
  const forecastRank = forecastRanking.findIndex(t => t._id === currentTeam?._id) + 1;

  const formatMoney = (value) => {
    if (!value) return '$0';
    return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const getRankColor = (rank, total) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank <= Math.ceil(total / 2)) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Current Revenue */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Current Revenue</p>
        <p className="text-3xl font-bold text-blue-900 mt-2">
          {formatMoney(currentCumulative?.revenue)}
        </p>
        <p className={`text-sm font-semibold mt-2 ${getRankColor(revenueRank, teamCompanies.length)}`}>
          Rank #{revenueRank} of {teamCompanies.length}
        </p>
      </div>

      {/* Current Profit */}
      <div className={`bg-gradient-to-br ${currentCumulative?.profit >= 0 ? 'from-green-50 to-green-100 border-green-200' : 'from-red-50 to-red-100 border-red-200'} p-6 rounded-lg border`}>
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Cumulative Profit</p>
        <p className={`text-3xl font-bold mt-2 ${currentCumulative?.profit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
          {formatMoney(currentCumulative?.profit)}
        </p>
        <p className={`text-sm font-semibold mt-2 ${getRankColor(profitRank, teamCompanies.length)}`}>
          Rank #{profitRank} of {teamCompanies.length}
        </p>
      </div>

      {/* Forecasted Revenue */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Forecasted Revenue</p>
        <p className="text-3xl font-bold text-purple-900 mt-2">
          {formatMoney(currentCumulative?.forecastedRevenue)}
        </p>
        <p className={`text-sm font-semibold mt-2 ${getRankColor(forecastRank, teamCompanies.length)}`}>
          Rank #{forecastRank} of {teamCompanies.length}
        </p>
      </div>

      {/* Competition Summary */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Competition</p>
        <p className="text-3xl font-bold text-indigo-900 mt-2">{teamCompanies.length}</p>
        <p className="text-sm text-gray-600 mt-2">Teams in competition</p>
      </div>
    </div>
  );
}
