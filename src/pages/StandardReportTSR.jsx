import { useState, useEffect } from 'react';
import { fetchStandardReportTSR, fetchBubbleObjectsByIds } from '../services/api';
import { formatDate, generateSubject } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import TSRDashboard from '../components/standard/TSRDashboard';

export default function StandardReportTSR() {
  const [report, setReport] = useState(null);
  const [teamCompanies, setTeamCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const params = new URLSearchParams(window.location.search);
        const simulationId = params.get('simulationId') || '1774781149806x783139239505952800';
        const teamId = params.get('teamId') || '1774781534734x108395326443880450';
        const roundNum = params.get('roundNum') || '1';

        const data = await fetchStandardReportTSR(simulationId, teamId, roundNum);
        setReport(data);

        const companies = Array.isArray(data.teamCompanies) ? data.teamCompanies : [];
        const objectCompanies = companies.filter((item) => item && typeof item === 'object');
        const stringIds = companies.filter((item) => typeof item === 'string');

        if (stringIds.length > 0) {
          const fetched = await fetchBubbleObjectsByIds('prod_standardreport_tsr_teamcompanies', stringIds);
          setTeamCompanies([...objectCompanies, ...fetched]);
        } else if (objectCompanies.length > 0) {
          setTeamCompanies(objectCompanies);
        }
      } catch (err) {
        console.error('Error loading TSR report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!report) return <ErrorMessage error="No TSR report data found" />;

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 px-10 py-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Team Summary Report</h1>
            <p className="text-violet-100 mt-2">Round {report.roundNum} - {generateSubject(report.roundNum)}</p>
            <p className="text-violet-100 text-sm mt-1">{formatDate(report['Created Date'])}</p>
          </div>
        </div>

        <TSRDashboard report={report} teamCompanies={teamCompanies} />
      </div>
    </div>
  );
}
