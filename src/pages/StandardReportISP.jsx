import { useState, useEffect } from 'react';
import { fetchStandardReportISP, fetchBubbleObjectsByIds } from '../services/api';
import { formatDate, generateSubject } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ISPDashboard from '../components/standard/ISPDashboard';

export default function StandardReportISP() {
  const [report, setReport] = useState(null);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const params = new URLSearchParams(window.location.search);
        const simulationId = params.get('simulationId') || '1774781149806x783139239505952800';
        const teamId = params.get('teamId') || '1774781534734x108395326443880450';
        const roundNum = params.get('roundNum') || '1';

        const data = await fetchStandardReportISP(simulationId, teamId, roundNum);
        setReport(data);

        if (Array.isArray(data.states) && data.states.length > 0) {
          const stateRecords = await fetchBubbleObjectsByIds('prod_standardreport_isp_states', data.states);
          setStates(stateRecords);
        }
      } catch (err) {
        console.error('Error loading ISP report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!report) return <ErrorMessage error="No ISP report data found" />;

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-10 py-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Industry Sales Potential</h1>
            <p className="text-sky-100 mt-2">Round {report.roundNum} - {generateSubject(report.roundNum)}</p>
            <p className="text-sky-100 text-sm mt-1">{formatDate(report['Created Date'])}</p>
          </div>
        </div>

        <ISPDashboard states={states} />
      </div>
    </div>
  );
}
