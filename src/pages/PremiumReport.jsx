import { useState, useEffect } from 'react';
import { fetchPremiumReportData } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CompetitivePerformance from '../components/premium/CompetitivePerformance';
import SalesForceTable from '../components/premium/SalesForceTable';
import USMap from '../components/premium/USMap';
import SalesContactCard from '../components/premium/SalesContactCard';
import EmploymentChanges from '../components/premium/EmploymentChanges';

export default function PremiumReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const params = new URLSearchParams(window.location.search);
        const simulationId = params.get('simulationId');
        const teamId = params.get('teamId');
        const roundNum = params.get('roundNum');

        if (!simulationId || !teamId || !roundNum) {
          throw new Error('Missing required parameters: simulationId, teamId, or roundNum');
        }

        const data = await fetchPremiumReportData(simulationId, teamId, roundNum);
        setReportData(data);
      } catch (err) {
        console.error('Error loading premium report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!reportData) return <ErrorMessage error="No report data found" />;

  // Extract territory states
  const oldTerritoryStates = reportData.territories
    .filter(t => t.isOldTerritory)
    .flatMap(t => t.stateNames || []);
  
  const newTerritoryStates = reportData.territories
    .filter(t => !t.isOldTerritory)
    .flatMap(t => t.stateNames || []);

  // Get hired and terminated employees
  const hiredEmployees = reportData.salespeople.filter(sp => sp.wasHired);
  const terminatedEmployees = reportData.salespeople.filter(sp => sp.terminateEmployment);

  // Get a sales contact (first salesperson or null)
  const salesContact = reportData.salespeople.length > 0 ? reportData.salespeople[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg px-8 py-6 mb-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {reportData.team?.teamName || 'Premium Report'}
              </h1>
              <p className="text-gray-300">
                Round {new URLSearchParams(window.location.search).get('roundNum')} Performance Report
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Report Type</div>
              <div className="text-xl font-semibold">Premium Report</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-300">
          <div className="flex">
            <button className="px-6 py-3 text-sm font-semibold bg-gray-100 border-b-2 border-transparent hover:border-gray-400">
              Standard Reports
            </button>
            <button className="px-6 py-3 text-sm font-semibold bg-gray-900 text-white border-b-2 border-gray-900">
              Premium Reports
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-lg shadow-lg p-6 md:p-8">
          {/* Competitive Performance Table */}
          <CompetitivePerformance team={reportData.team} />

          {/* Sales Territories Maps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <USMap states={oldTerritoryStates} title="Old Territories" />
            <USMap states={newTerritoryStates} title="New Territories" />
          </div>

          {/* Employment Changes */}
          <EmploymentChanges 
            hired={hiredEmployees} 
            terminated={terminatedEmployees} 
          />

          {/* Sales Force Table */}
          <SalesForceTable salespeople={reportData.salespeople} />

          {/* Sales Contact */}
          <SalesContactCard salesperson={salesContact} />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Report generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
