import { useState, useEffect } from 'react';
import { fetchStandardReportMSA, fetchBubbleObjectsByIds } from '../services/api';
import { formatDate, generateSubject } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import MSADashboard from '../components/standard/MSADashboard';

export default function StandardReportMSA() {
  const [report, setReport] = useState(null);
  const [salesPeople, setSalesPeople] = useState([]);
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

        // Fetch main MSA report
        const data = await fetchStandardReportMSA(simulationId, teamId, roundNum);
        setReport(data);

        // Fetch salespeople
        if (data.salesPeople && Array.isArray(data.salesPeople)) {
          const people = await fetchBubbleObjectsByIds('prod_standardreport_msa_salespeople', data.salesPeople);
          setSalesPeople(people);
        }

        // Fetch team companies
        if (data.teamCompanies && Array.isArray(data.teamCompanies)) {
          const companies = await fetchBubbleObjectsByIds('prod_standardreport_msa_teamcompanies', data.teamCompanies);
          setTeamCompanies(companies.sort((a, b) => a.teamNum - b.teamNum));
        }
      } catch (err) {
        console.error('Error loading MSA report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!report) return <ErrorMessage error="No MSA report data found" />;

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-10 py-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Market Share Analysis
            </h1>
            <p className="text-cyan-100 mt-2">
              Round {report.roundNum} - {generateSubject(report.roundNum)}
            </p>
            <p className="text-cyan-100 text-sm mt-1">{formatDate(report['Created Date'])}</p>
          </div>
        </div>

        {/* Dashboard */}
        <MSADashboard salesPeople={salesPeople} teamCompanies={teamCompanies} />
      </div>
    </div>
  );
}
