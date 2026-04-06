import { useState, useEffect } from 'react';
import { fetchStandardReportCRR, fetchBubbleObjectsByIds, fetchBubbleObjectById } from '../services/api';
import { formatDate, generateSubject } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CRRDashboard from '../components/standard/CRRDashboard';

export default function StandardReportCRR() {
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

        // Fetch main CRR report
        const data = await fetchStandardReportCRR(simulationId, teamId, roundNum);
        setReport(data);

        // Fetch team companies with their performance data
        if (data.teamCompanies && Array.isArray(data.teamCompanies)) {
          const companies = await fetchBubbleObjectsByIds('prod_standardreport_crr_teamcompanies', data.teamCompanies);
          
          // Enrich with cumulative and quarterly performance data
          const enrichedCompanies = await Promise.all(
            companies.map(async (company) => {
              const enriched = { ...company };
              
              // Fetch cumulative performance
              if (company.cumulativePerformance) {
                try {
                  enriched.cumulativePerformanceData = await fetchBubbleObjectById(
                    'prod_standardreport_crr_teamcompanies_cumulativeperformance',
                    company.cumulativePerformance
                  );
                } catch (err) {
                  console.warn('Error fetching cumulative performance:', err);
                }
              }
              
              // Fetch quarterly performances
              if (company.quarterlyPerformances && Array.isArray(company.quarterlyPerformances)) {
                try {
                  enriched.quarterlyPerformancesData = await fetchBubbleObjectsByIds(
                    'prod_standardreport_crr_teamcompanies_quarterlyperformances',
                    company.quarterlyPerformances
                  );
                } catch (err) {
                  console.warn('Error fetching quarterly performances:', err);
                  enriched.quarterlyPerformancesData = [];
                }
              }
              
              return enriched;
            })
          );
          
          setTeamCompanies(enrichedCompanies.sort((a, b) => a.teamNum - b.teamNum));
        }
      } catch (err) {
        console.error('Error loading CRR report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!report) return <ErrorMessage error="No CRR report data found" />;

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-10 py-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Competitive Ranking Report
            </h1>
            <p className="text-purple-100 mt-2">
              Round {report.roundNum} - {generateSubject(report.roundNum)}
            </p>
            <p className="text-purple-100 text-sm mt-1">{formatDate(report['Created Date'])}</p>
          </div>
        </div>

        {/* Dashboard */}
        <CRRDashboard teamCompanies={teamCompanies} />
      </div>
    </div>
  );
}
