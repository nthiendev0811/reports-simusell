import { formatCurrency } from '../../utils/formatters';

export default function SalesForceTable({ salespeople = [] }) {
  if (!salespeople || salespeople.length === 0) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Sales Force</h2>
        <p className="text-gray-500 text-center py-8">No salespeople data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Sales Force</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Salary ($)</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Commission (%)</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Quota ($)</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Bonus ($)</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Hours of Supervision</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Recognition</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Training</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Sales Forecast ($)</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">A Accounts (%)</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">B Accounts (%)</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">C Accounts (%)</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Assigned Sales Territory</th>
            </tr>
          </thead>
          <tbody>
            {salespeople.map((sp, index) => (
              <tr key={sp._id || index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">
                  {sp.firstName} {sp.lastName}
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {formatCurrency(sp.salary || 0)}
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {((sp.commissionPercentage || 0) * 100).toFixed(0)}%
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {formatCurrency(sp.quota || 0)}
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {formatCurrency(sp.bonus || 0)}
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {sp.hoursSupervision || 0}
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {sp.recognition || 'no'}
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {sp.training || 'None'}
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {formatCurrency(sp.forecastedRevenue || 0)}
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {sp.aAccountPercent || 0}%
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {sp.bAccountPercent || 0}%
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {sp.cAccountPercent || 0}%
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {sp.salesTerritoryName || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
