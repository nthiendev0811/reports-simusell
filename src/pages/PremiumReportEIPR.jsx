import { useState, useEffect } from 'react';
import { fetchPremiumReportEIPR, fetchSalespeople, fetchTerritories } from '../services/api';
import { formatDate, generateSubject } from '../utils/formatters';
import CompetitivePerformance from '../components/premium/CompetitivePerformance';
import SalesContactCard from '../components/premium/SalesContactCard';
import EmploymentChanges from '../components/premium/EmploymentChanges';
import SalesForceTable from '../components/premium/SalesForceTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function PremiumReportEIPR() {
  const [report, setReport] = useState(null);
  const [salespeople, setSalespeople] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const DEFAULT_SIMULATION_ID = 'replace-with-simulation-id';
        const DEFAULT_TEAM_ID = 'replace-with-team-id';
        const DEFAULT_ROUND_NUM = '1';

        const params = new URLSearchParams(window.location.search);
        const simulationId = params.get('simulationId') || DEFAULT_SIMULATION_ID;
        const teamId = params.get('teamId') || DEFAULT_TEAM_ID;
        const roundNum = params.get('roundNum') || DEFAULT_ROUND_NUM;
        const roundId = params.get('roundId');

        // Fetch premium report
        const reportData = await fetchPremiumReportEIPR(simulationId, teamId, roundNum);
        setReport(reportData);

        const salespeopleData = await fetchSalespeople(simulationId, roundId, teamId, roundNum);
        setSalespeople(salespeopleData);

        const territoriesData = await fetchTerritories(simulationId, roundId, teamId, roundNum);
        setTerritories(territoriesData);
      } catch (err) {
        console.error('Error loading report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!report) return <ErrorMessage error="No report data found" />;

  const oldTerritories = report.oldTerritoryIDs || [];
  const newTerritories = report.newTerritoryIDs || [];
  const territoryNames = territories.map((territory) => territory.name || territory.title || territory._id || 'Unknown');
  const hiredEmployees = salespeople.length > 0
    ? salespeople.filter((person) => person.wasHired)
    : (report.hiredSalesPeopleIDs || []).map((id) => ({
        _id: id,
        firstName: 'Hired',
        lastName: id.slice(-6),
        jobTitle: 'Salesperson',
      }));
  const terminatedEmployees = salespeople.length > 0
    ? salespeople.filter((person) => person.terminateEmployment)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-900 text-white px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold">{report.fullName || 'Extended Industry Performance Report'}</h1>
                <p className="mt-2 text-gray-300">{generateSubject(report.roundNum)}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Report Date</div>
                <div className="text-2xl font-semibold">{formatDate(report['Created Date'])}</div>
              </div>
            </div>
          </div>
          <div className="bg-white border-t px-6 py-4">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">Premium Report</span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">Round {report.roundNum || 'N/A'}</span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">Team: {report.team || report.teamName || 'Unknown'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900">Old Territories</h2>
            <p className="mt-4 text-sm text-gray-600">{oldTerritories.length} territory IDs</p>
            <p className="mt-2 text-xs text-gray-500">{territories.length > 0 ? `Fetched ${territories.length} territory records` : 'No territory records fetched'}</p>
            {territoryNames.length > 0 && (
              <div className="mt-3 text-xs text-gray-500 space-y-1 break-words">{territoryNames.join(', ')}</div>
            )}
            {oldTerritories.length > 0 && (
              <div className="mt-4 text-xs text-gray-500 space-y-1 break-words">{oldTerritories.join(', ')}</div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900">New Territories</h2>
            <p className="mt-4 text-sm text-gray-600">{newTerritories.length} territory IDs</p>
            <p className="mt-2 text-xs text-gray-500">{territories.length > 0 ? `Fetched ${territories.length} territory records` : 'No territory records fetched'}</p>
            {newTerritories.length > 0 && (
              <div className="mt-4 text-xs text-gray-500 space-y-1 break-words">{newTerritories.join(', ')}</div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900">Sales Force Summary</h2>
            <p className="mt-4 text-sm text-gray-600">Hired: {hiredEmployees.length}</p>
            <p className="mt-1 text-sm text-gray-600">Terminated: {terminatedEmployees.length}</p>
            <p className="mt-1 text-sm text-gray-600">Employed IDs: {report.employedSalesPeopleIDs?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-blue-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">Competitive Performance</h2>
          </div>
          {report.competitivePerformance?.length > 0 ? (
            <CompetitivePerformance teams={report.competitivePerformance} />
          ) : (
            <div className="text-gray-500 py-8 text-center border border-dashed border-gray-300 rounded-lg">
              No competitive performance data available for this report.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Territory Overview</h2>
            <div className="grid gap-4">
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <h3 className="font-semibold">Old Territories</h3>
                <p className="mt-2 text-gray-700">{oldTerritories.length} territories</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <h3 className="font-semibold">New Territories</h3>
                <p className="mt-2 text-gray-700">{newTerritories.length} territories</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Employment Changes</h2>
            <EmploymentChanges hired={hiredEmployees} terminated={terminatedEmployees} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-orange-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">Sales Force</h2>
          </div>
          {salespeople.length > 0 ? (
            <SalesForceTable salespeople={salespeople} />
          ) : (
            <div className="text-center text-gray-600 py-10 border border-dashed border-gray-300 rounded-lg">
              {report.employedSalesPeopleIDs?.length > 0 ? (
                <>
                  <div className="text-xl font-semibold mb-3">Sales force details not available</div>
                  <div>{report.employedSalesPeopleIDs.length} employed salesperson IDs were returned</div>
                  <div className="mt-4 text-sm text-gray-500 break-words">{report.employedSalesPeopleIDs.join(', ')}</div>
                </>
              ) : (
                <div>No sales force data available for this round.</div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-teal-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">Sales Contact</h2>
          </div>
          {salespeople.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {salespeople.map((sp, index) => (
                <SalesContactCard key={index} salesperson={sp} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-10 border border-dashed border-gray-300 rounded-lg">
              No sales contact available.
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-indigo-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">Sales Contest</h2>
          </div>
          {report.salesContestID || report.salesContestName ? (
            <div className="space-y-3 text-sm text-gray-700">
              {report.salesContestName && (
                <div>
                  <span className="font-semibold">Contest:</span> {report.salesContestName}
                </div>
              )}
              {report.salesContestID && (
                <div>
                  <span className="font-semibold">Contest ID:</span> {report.salesContestID}
                </div>
              )}
              {report.salesContestWinnerID && (
                <div>
                  <span className="font-semibold">Winner ID:</span> {report.salesContestWinnerID}
                </div>
              )}
              {report.salesContestSummary && (
                <div className="text-gray-600">{report.salesContestSummary}</div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10 border border-dashed border-gray-300 rounded-lg">
              No sales contest information is available for this round.
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-gray-700 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">Reports Purchased</h2>
          </div>
          {report.reportsPurchasedIDs?.length > 0 ? (
            <div className="grid gap-3">
              {report.reportsPurchasedIDs.map((id) => (
                <div key={id} className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                  <div className="text-sm text-gray-700">Report ID: {id}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10 border border-dashed border-gray-300 rounded-lg">
              No reports were purchased during this round.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
