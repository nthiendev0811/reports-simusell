export default function MSAOverview({ salesPeople, teamCompanies }) {
  if (!teamCompanies || teamCompanies.length === 0) {
    return <div className="text-center text-gray-500">No market share data available</div>;
  }

  // Calculate our team's market share (first team)
  const ourTeam = teamCompanies[0];
  const ourMarketShare = ourTeam?.marketShare || 0;

  // Calculate total and rank
  const totalMarketShare = teamCompanies.reduce((sum, team) => sum + (team.marketShare || 0), 0);
  const ourRank = [...teamCompanies]
    .sort((a, b) => (b.marketShare || 0) - (a.marketShare || 0))
    .findIndex(t => t._id === ourTeam?._id) + 1;

  // Calculate average market share
  const avgMarketShare = totalMarketShare / (teamCompanies.length || 1);

  // Top competitor
  const topCompetitor = [...teamCompanies]
    .sort((a, b) => (b.marketShare || 0) - (a.marketShare || 0))[1];

  const formatPercent = (value) => {
    if (!value) return '0%';
    return (value || 0).toFixed(1) + '%';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Our Market Share */}
      <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-lg border border-cyan-200">
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Our Market Share</p>
        <p className="text-4xl font-bold text-cyan-900 mt-2">{formatPercent(ourMarketShare)}</p>
        <p className="text-sm text-gray-600 mt-2">Team {ourTeam?.teamNum}</p>
      </div>

      {/* Market Position */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Market Position</p>
        <p className="text-4xl font-bold text-blue-900 mt-2">#{ourRank}</p>
        <p className="text-sm text-gray-600 mt-2">of {teamCompanies.length} competitors</p>
      </div>

      {/* Average Market Share */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Industry Average</p>
        <p className="text-4xl font-bold text-purple-900 mt-2">{formatPercent(avgMarketShare)}</p>
        <p className={`text-sm font-semibold mt-2 ${ourMarketShare >= avgMarketShare ? 'text-green-600' : 'text-red-600'}`}>
          {ourMarketShare >= avgMarketShare ? 'Above average' : 'Below average'}
        </p>
      </div>

      {/* Top Competitor */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg border border-amber-200">
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Top Competitor</p>
        <p className="text-4xl font-bold text-amber-900 mt-2">{formatPercent(topCompetitor?.marketShare)}</p>
        <p className="text-sm text-gray-600 mt-2">Team {topCompetitor?.teamNum}</p>
      </div>
    </div>
  );
}
