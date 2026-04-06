import { useMemo } from 'react';

export default function MSACharts({ teamCompanies }) {
  if (!teamCompanies || teamCompanies.length === 0) {
    return <div className="text-center text-gray-500 py-8">No market share data available</div>;
  }

  const chartData = useMemo(() => {
    // Sort by market share descending
    return [...teamCompanies]
      .sort((a, b) => (b.marketShare || 0) - (a.marketShare || 0))
      .map(team => ({
        teamNum: team.teamNum,
        marketShare: team.marketShare || 0,
        _id: team._id,
      }));
  }, [teamCompanies]);

  // Calculate percentages for visualization
  const total = chartData.reduce((sum, item) => sum + item.marketShare, 0);
  const chartItems = chartData.map(item => ({
    ...item,
    percentage: total > 0 ? (item.marketShare / total * 100) : 0,
  }));

  // Colors for bars
  const colors = [
    'bg-blue-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-lime-500',
    'bg-yellow-500',
    'bg-amber-500',
    'bg-orange-500',
    'bg-red-500',
  ];

  return (
    <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Market Share Distribution</h3>

      {/* Horizontal Bar Chart */}
      <div className="space-y-4">
        {chartItems.map((item, idx) => (
          <div key={item._id} className="flex items-center gap-4">
            <div className="w-24 text-right font-semibold text-gray-700">
              Team {item.teamNum}
            </div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded-full overflow-hidden relative">
                <div
                  className={`h-full ${colors[idx % colors.length]} transition-all duration-300 flex items-center justify-end pr-3`}
                  style={{ width: `${item.percentage}%` }}
                >
                  {item.percentage > 10 && (
                    <span className="text-white text-sm font-semibold">{item.percentage.toFixed(1)}%</span>
                  )}
                </div>
              </div>
            </div>
            <div className="w-16 text-right text-gray-600">
              {item.marketShare.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-600 text-sm">Total Market</p>
            <p className="text-2xl font-bold text-gray-900">{total.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Teams</p>
            <p className="text-2xl font-bold text-gray-900">{chartItems.length}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Leader Share</p>
            <p className="text-2xl font-bold text-blue-600">{chartItems[0]?.percentage.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
