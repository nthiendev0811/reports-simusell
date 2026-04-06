import { useState, useEffect } from 'react';
import { fetchStandardReportFAR, fetchBubbleObjectsByIds } from '../services/api';
import { formatDate, generateSubject } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import FARDashboard from '../components/standard/FARDashboard';

export default function StandardReportFAR() {
  const [report, setReport] = useState(null);
  const [salesPeople, setSalesPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const params = new URLSearchParams(window.location.search);
        const simulationId = params.get('simulationId') || '1774781149806x783139239505952800';
        const teamId = params.get('teamId') || '1774781534734x108395326443880450';
        const roundNum = params.get('roundNum') || '1';

        const data = await fetchStandardReportFAR(simulationId, teamId, roundNum);
        setReport(data);

        if (Array.isArray(data.salesPeople) && data.salesPeople.length > 0) {
          const people = await fetchBubbleObjectsByIds('prod_standardreport_far_salespeople', data.salesPeople);
          setSalesPeople(people);
        }
      } catch (err) {
        console.error('Error loading FAR report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!report) return <ErrorMessage error="No FAR report data found" />;

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-10 py-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Forecast Accuracy Report</h1>
            <p className="text-amber-100 mt-2">Round {report.roundNum} - {generateSubject(report.roundNum)}</p>
            <p className="text-amber-100 text-sm mt-1">{formatDate(report['Created Date'])}</p>
          </div>
        </div>

        <FARDashboard report={report} salesPeople={salesPeople} />
      </div>
    </div>
  );
}
