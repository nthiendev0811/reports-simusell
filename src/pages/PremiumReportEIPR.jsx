import { useState, useEffect } from 'react';
import { fetchPremiumReportEIPR, fetchSalespeople, fetchTerritories } from '../services/api';
import { formatDate, generateSubject } from '../utils/formatters';
import CompetitivePerformance from '../components/premium/CompetitivePerformance';
import SalesContactCard from '../components/premium/SalesContactCard';
import EmploymentChanges from '../components/premium/EmploymentChanges';
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
        const params = new URLSearchParams(window.location.search);
        const simulationId = params.get('simulationId');
        const teamId = params.get('teamId');
        const roundNum = params.get('roundNum');
        const roundId = params.get('roundId');

        if (!simulationId || !teamId || !roundNum) {
          throw new Error('Missing required parameters: simulationId, teamId, or roundNum');
        }

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

  const oldTerritories = report.oldTerritoryIDs || [];
  const newTerritories = report.newTerritoryIDs || [];
  const hiredEmployees = salespeople.length > 0
    ? salespeople.filter(sp => sp.wasHired)
    : (report.hiredSalesPeopleIDs || []).map((id) => ({
        firstName: 'Hired',
        lastName: id.slice(-6),
        jobTitle: 'Salesperson',
        _id: id,
      }));
  const terminatedEmployees = salespeople.length > 0
    ? salespeople.filter(sp => sp.terminateEmployment)
    : [];
  const employedSalesforceCount = report.employedSalesPeopleIDs?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-800 text-white px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">{report.fullName || 'Extended Industry Performance Report'}</h1>
                <p className="text-gray-300 mt-1">{generateSubject(report.roundNum)}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300">Report Date</div>
                <div className="text-lg font-semibold">{formatDate(report['Created Date'])}</div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-white border-b">
            <div className="flex">
              <button className="px-6 py-3 bg-gray-100 font-medium border-b-2 border-blue-600">
                Standard Reports
              </button>
              <button className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-50">
                Premium Reports
              </button>
            </div>
          </div>
          
          {/* Premium Report Menu */}
          <div className="bg-white p-4 border-b">
            <div className="relative">
              <select className="w-64 px-4 py-2 bg-blue-600 text-white rounded font-medium">
                <option>Extended Industry Performance Report</option>
                <option>Market Potential Forecast</option>
                <option>Market Share Report</option>
                <option>Customer Segment Analysis</option>
                <option>Human Resources Report</option>
                <option>Customer Satisfaction Report</option>
                <option>Territory Analysis</option>
                <option>Competitive Insights</option>
                <option>Extended Industry Performance Report</option>
                <option>Competitive Dominance Report</option>
                <option>Relative Dominance Report</option>
                <option>Sales Forecast Report</option>
              </select>
            </div>
          </div>
        </div>

        {/* Competitive Performance */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-blue-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">Competitive Performance</h2>
          </div>
          
          <div className="mb-4">
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium">Last Quarter</button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Total</button>
            </div>
          </div>
          {report.competitivePerformance?.length > 0 ? (
            <CompetitivePerformance teams={report.competitivePerformance} />
          ) : (
            <div className="text-gray-500 py-8 text-center border border-dashed border-gray-300 rounded-lg">
              No competitive performance data available for this report.
            </div>
          )}
        </div>

        {/* Sales Territories */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-green-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">Sales Territories</h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-center text-gray-700">Old Territories</h3>
              <div className="bg-gray-100 rounded-lg p-4 min-h-[300px] flex items-center justify-center border-2 border-gray-200">
                <div className="text-center">
                  <svg className="w-full h-48 mx-auto" viewBox="0 0 400 300">
                    <rect x="50" y="50" width="100" height="80" fill="#8b5cf6" opacity="0.7" />
                    <rect x="150" y="80" width="80" height="60" fill="#8b5cf6" opacity="0.7" />
                    <text x="100" y="95" fill="white" fontSize="12" fontWeight="bold">CA</text>
                    <text x="185" y="115" fill="white" fontSize="12" fontWeight="bold">NV</text>
                  </svg>
                  <p className="text-sm text-gray-600 mt-2">US Territory Map</p>
                  <p className="text-xs text-gray-500 mt-3">Old territory IDs: {oldTerritories.length}</p>
                  {oldTerritories.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2 break-words">{oldTerritories.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-center text-gray-700">New Territories</h3>
              <div className="bg-gray-100 rounded-lg p-4 min-h-[300px] flex items-center justify-center border-2 border-gray-200">
                <div className="text-center">
                  <svg className="w-full h-48 mx-auto" viewBox="0 0 400 300">
                    <rect x="50" y="50" width="100" height="80" fill="#e0e0e0" opacity="0.5" />
                    <rect x="150" y="80" width="80" height="60" fill="#e0e0e0" opacity="0.5" />
                    <text x="100" y="95" fill="#999" fontSize="12" fontWeight="bold">CA</text>
                    <text x="185" y="115" fill="#999" fontSize="12" fontWeight="bold">NV</text>
                  </svg>
                  <p className="text-sm text-gray-600 mt-2">US Territory Map</p>
                  <p className="text-xs text-gray-500 mt-3">New territory IDs: {newTerritories.length}</p>
                  {newTerritories.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2 break-words">{newTerritories.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Changes */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-purple-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">Employment Changes</h2>
          </div>
          <EmploymentChanges 
            hired={hiredEmployees} 
            terminated={terminatedEmployees} 
          />
        </div>

        {/* Sales Force */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-orange-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">Sales Force</h2>
          </div>
          {salespeople.length > 0 ? (
            <>
              <div className="mb-6 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Salary ($)</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Commission (%)</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Quota ($)</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Bonus ($)</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Hours of Supervision</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Recognition</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Promotion</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Training</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salespeople.map((sp, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-900">{sp.firstName} {sp.lastName}</td>
                        <td className="px-3 py-2 text-right text-gray-700">{sp.salary || 0}</td>
                        <td className="px-3 py-2 text-right text-gray-700">{sp.commissionPercentage || 0}</td>
                        <td className="px-3 py-2 text-right text-gray-700">{sp.quota || 0}</td>
                        <td className="px-3 py-2 text-right text-gray-700">{sp.bonus || 0}</td>
                        <td className="px-3 py-2 text-center text-gray-700">{sp.hoursSupervision || 0}</td>
                        <td className="px-3 py-2 text-center text-gray-700">{sp.recognition || '-'}</td>
                        <td className="px-3 py-2 text-center text-gray-700">{sp.givePromotion ? 'Yes' : 'No'}</td>
                        <td className="px-3 py-2 text-center text-gray-700">{sp.training || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-gray-900">Sales Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {salespeople.map((sp, index) => (
                    <SalesContactCard key={index} salesperson={sp} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600 py-12">
              {employedSalesforceCount > 0 ? (
                <>
                  <div className="text-xl font-semibold mb-3">Sales force details not available</div>
                  <div>{employedSalesforceCount} employed salesperson IDs were returned</div>
                  <div className="mt-4 text-sm text-gray-500 break-words">
                    {report.employedSalesPeopleIDs?.join(', ')}
                  </div>
                </>
              ) : (
                <div>No sales force data available for this round.</div>
              )}
            </div>
          )}

        {/* Reports Purchased */}

        {/* Reports Purchased */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-gray-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">Reports Purchased</h2>
          </div>
          <p className="text-gray-500 text-center py-8 bg-gray-50 rounded">
            No reports were purchased during this round.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
