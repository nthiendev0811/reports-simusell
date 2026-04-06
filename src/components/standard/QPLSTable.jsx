import { formatCurrency } from '../../utils/formatters';

export default function QPLSTable({ salesPeople, totals }) {
  const PLLineItems = [
    { section: 'Sales Volume', label: 'Sales Volume (units sold)', key: 'salesVolume', isHeader: true },
    { label: 'Revenue', key: 'revenue', indent: true },
    { label: 'A Accounts', key: 'aAccount', indent: true, subItem: true },
    { label: 'B Accounts', key: 'bAccount', indent: true, subItem: true },
    { label: 'C Accounts', key: 'cAccount', indent: true, subItem: true },
    { section: 'COGS', label: 'Cost of Goods Sold', key: 'cogs', isHeader: true },
    { label: 'Gross Profit', key: 'grossProfit', isBold: true },
    { section: 'Expenses', label: 'Expenses', key: null, isHeader: true },
    { label: 'Salary', key: 'salary', indent: true },
    { label: 'Commission', key: 'commission', indent: true },
    { label: 'Bonus', key: 'bonus', indent: true },
    { label: 'Contest', key: 'contest', indent: true },
    { label: 'Training', key: 'training', indent: true },
    { label: 'Travel', key: 'travel', indent: true },
    { label: 'New Hire Guaranteed Payment', key: 'employmentOfferPayment', indent: true },
    { label: 'Price of Reports Ordered', key: 'costOfReports', indent: true },
    { label: 'Net Profit (Loss)', key: 'netProfit', isBold: true, isFinal: true },
  ];

  const formatValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        return value.toLocaleString('en-US');
      } else {
        return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
      }
    }
    return value;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300">
            <th className="px-6 py-4 text-left font-semibold text-gray-700">Line Item</th>
            {salesPeople.map((person) => (
              <th key={person._id} className="px-4 py-4 text-right font-semibold text-gray-700 whitespace-nowrap">
                {person.name}
              </th>
            ))}
            {totals && (
              <th className="px-4 py-4 text-right font-semibold text-gray-700 bg-gray-50 border-l border-gray-300">
                Total
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {PLLineItems.map((item, idx) => {
            if (item.isHeader) {
              return (
                <tr key={idx} className="bg-blue-50 border-y border-gray-200">
                  <td colSpan={salesPeople.length + (totals ? 2 : 1)} className="px-6 py-3 font-bold text-blue-900">
                    ▼ {item.label}
                  </td>
                </tr>
              );
            }

            return (
              <tr
                key={idx}
                className={`border-b border-gray-200 ${
                  item.isFinal ? 'bg-yellow-50 border-y-2 border-gray-400' : ''
                } ${item.isBold && !item.isFinal ? 'bg-gray-50 font-semibold' : ''}`}
              >
                <td className={`px-6 py-3 text-gray-700 ${item.indent ? 'pl-10' : ''} ${item.subItem ? 'pl-14' : ''} ${item.isBold ? 'font-semibold' : ''} ${item.isFinal ? 'font-bold' : ''}`}>
                  {item.label}
                </td>

                {/* Data columns for each salesperson */}
                {salesPeople.map((person) => (
                  <td key={person._id} className={`px-4 py-3 text-right font-mono whitespace-nowrap ${item.isBold ? 'font-semibold' : ''} ${item.isFinal ? 'font-bold text-lg' : ''}`}>
                    {item.key && person[item.key] !== undefined ? formatValue(person[item.key]) : '-'}
                  </td>
                ))}

                {/* Totals column */}
                {totals && (
                  <td className={`px-4 py-3 text-right font-mono whitespace-nowrap bg-gray-50 border-l border-gray-300 ${item.isBold ? 'font-semibold' : ''} ${item.isFinal ? 'font-bold text-lg text-green-700' : ''}`}>
                    {item.key && totals[item.key] !== undefined ? formatValue(totals[item.key]) : '-'}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
