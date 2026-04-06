import { formatCurrency } from '../../utils/formatters';

export default function FAROverview({ report }) {
  const formatPercent = (value) => {
    if (value === null || value === undefined) return '0.0%';
    return `${Number(value).toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Forecast Sales Ratio</p>
        <p className="text-4xl font-bold text-amber-900 mt-3">{formatPercent(report.forecastSalesRatio)}</p>
        <p className="text-gray-600 text-sm mt-2">Forecast accuracy level</p>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Total Forecast</p>
        <p className="text-4xl font-bold text-amber-900 mt-3">{formatCurrency(report.totalForecast)}</p>
        <p className="text-gray-600 text-sm mt-2">Forecast amount for the round</p>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Total Sales</p>
        <p className="text-4xl font-bold text-amber-900 mt-3">{formatCurrency(report.totalSales)}</p>
        <p className="text-gray-600 text-sm mt-2">Actual sales achieved</p>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Forecast Gap</p>
        <p className="text-4xl font-bold text-amber-900 mt-3">{formatCurrency((report.totalForecast || 0) - (report.totalSales || 0))}</p>
        <p className="text-gray-600 text-sm mt-2">Forecast minus actual sales</p>
      </div>
    </div>
  );
}
