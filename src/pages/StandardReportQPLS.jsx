import { useState, useEffect } from 'react';
import { fetchStandardReportQPLS, fetchBubbleObjectsByIds, fetchBubbleObjectById } from '../services/api';
import { formatDate, generateSubject } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import QPLSTable from '../components/standard/QPLSTable';

export default function StandardReportQPLS() {
  const [report, setReport] = useState(null);
  const [salesPeople, setSalesPeople] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const params = new URLSearchParams(window.location.search);
        const simulationId = params.get('simulationId') || '1774781149806x783139239505952800';
        const teamId = params.get('teamId') || '1774781534734x108395326443880450';
        const roundNum = params.get('roundNum') || '1';

        // Fetch main QPLS report
        const data = await fetchStandardReportQPLS(simulationId, teamId, roundNum);
        setReport(data);

        // Fetch salespeople data
        if (data.salesPeople && Array.isArray(data.salesPeople)) {
          const people = await fetchBubbleObjectsByIds('prod_standardreport_qpls_salespeople', data.salesPeople);
          setSalesPeople(people);
        }

        // Fetch totals data
        if (data.total) {
          const total = await fetchBubbleObjectById('prod_standardreport_qpls_total', data.total);
          setTotals(total);
        }
      } catch (err) {
        console.error('Error loading QPLS report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!report) return <ErrorMessage error="No QPLS report data found" />;

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-10 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {report.fullName || 'Team Report'}
            </h1>
            <p className="text-blue-100 mt-2">Quarterly Profit and Loss Statement</p>
          </div>
          <div className="text-right text-white">
            <p className="text-lg font-semibold">Round {report.roundNum}</p>
            <p className="text-blue-100">{formatDate(report['Created Date'])}</p>
          </div>
        </div>

        {/* P&L Summary */}
        <div className="px-10 py-8 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-gray-600 text-sm font-semibold">Sales Volume</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {totals?.salesVolume?.toLocaleString() || '-'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-gray-600 text-sm font-semibold">Revenue</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${totals?.revenue?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '-'}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded">
              <p className="text-gray-600 text-sm font-semibold">Gross Profit</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                ${totals?.grossProfit?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '-'}
              </p>
            </div>
            <div className={`${totals?.netProfit >= 0 ? 'bg-green-50' : 'bg-red-50'} p-4 rounded`}>
              <p className="text-gray-600 text-sm font-semibold">Net Profit</p>
              <p className={`text-2xl font-bold mt-1 ${totals?.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totals?.netProfit?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* QPLS Table */}
        <QPLSTable salesPeople={salesPeople} totals={totals} />
      </div>
    </div>
  );
}
