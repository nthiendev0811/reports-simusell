import { useState, useEffect } from 'react';
import { fetchPremiumReportMPF, fetchAnyPremiumReportMPF, fetchBubbleObjectsByIds, fetchBubbleObjectById } from '../services/api';
import { formatCurrency, formatNumber, formatDate, generateSubject } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function PremiumReportMPF() {
  const [report, setReport] = useState(null);
  const [territories, setTerritories] = useState([]);
  const [simulationName, setSimulationName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const params = new URLSearchParams(window.location.search);
        const simulationId = params.get('simulationId');
        const teamId = params.get('teamId');
        const roundNum = params.get('roundNum');
        const reportId = params.get('reportId') || params.get('id');

        let reportData;
        if (reportId) {
          reportData = await fetchBubbleObjectById('Prod_PremiumReport_MPF', reportId);
        } else if (simulationId && teamId && roundNum) {
          reportData = await fetchPremiumReportMPF(simulationId, teamId, roundNum);
        } else {
          reportData = await fetchAnyPremiumReportMPF();
        }

        setReport(reportData);

        if (reportData.simulationId) {
          try {
            const simulation = await fetchBubbleObjectById('Prod_Simulation', reportData.simulationId);
            setSimulationName(simulation?.name || 'Unknown Simulation');
          } catch (e) {
            console.warn('Unable to fetch simulation name', e);
            setSimulationName('Unknown Simulation');
          }
        }

        if (reportData.teamId) {
          try {
            const team = await fetchBubbleObjectById('Prod_TeamCompany', reportData.teamId);
            setTeamName(team?.companyName || team?.name || 'Unknown Team');
          } catch (e) {
            console.warn('Unable to fetch team name', e);
            setTeamName('Unknown Team');
          }
        }

        const territoryIds = Array.isArray(reportData.salesTerritories)
          ? reportData.salesTerritories.filter(Boolean)
          : [];

        const territoryObjects = territoryIds.filter((id) => typeof id === 'string');
        if (territoryObjects.length > 0) {
          const territoryData = await fetchBubbleObjectsByIds('prod_premiumreport_mpf_salesterritories', territoryObjects);
          setTerritories(territoryData);
        } else if (Array.isArray(reportData.salesTerritories) && reportData.salesTerritories.length > 0) {
          setTerritories(reportData.salesTerritories);
        }
      } catch (err) {
        console.error('Error loading MPF report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!report) return <ErrorMessage error="No MPF report data found" />;

  const totalTerritories = territories.length;
  const totalPotential = territories.reduce((sum, territory) => sum + (territory.totalPotential || 0), 0);
  const totalA = territories.reduce((sum, territory) => sum + (territory.aAccountPotential || 0), 0);
  const totalB = territories.reduce((sum, territory) => sum + (territory.bAccountPotential || 0), 0);
  const totalC = territories.reduce((sum, territory) => sum + (territory.cAccountPotential || 0), 0);
  const totalStates = territories.reduce((sum, territory) => sum + (Array.isArray(territory.state) ? territory.state.length : 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{report.fullName || 'Market Potential Forecast Report'}</h1>
              <p className="mt-3 text-lg text-slate-200">{generateSubject(report.roundNum)}</p>
            </div>
            <div className="space-y-2 text-right">
              <div className="text-sm uppercase text-slate-300">Report type</div>
              <div className="text-2xl font-semibold">MPF</div>
              <div className="text-sm text-slate-300">Round {report.roundNum}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase text-slate-500">Territories</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{totalTerritories}</div>
            <div className="mt-2 text-sm text-slate-500">Sales territories in this report</div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase text-slate-500">Total Sales Potential</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{formatCurrency(totalPotential)}</div>
            <div className="mt-2 text-sm text-slate-500">Combined A/B/C potentials</div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase text-slate-500">States Covered</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{formatNumber(totalStates)}</div>
            <div className="mt-2 text-sm text-slate-500">Total states across all territories</div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase text-slate-500">Instructor Only</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{report.instructorOnly ? 'Yes' : 'No'}</div>
            <div className="mt-2 text-sm text-slate-500">Instructor visibility for this report</div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Territory Sales Potentials</h2>
                <p className="mt-1 text-sm text-slate-500">Review the potential by territory and account tier.</p>
              </div>
            </div>

            {territories.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
                No territory details are available for this report.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold">Territory</th>
                      <th className="px-4 py-3 text-sm font-semibold">States</th>
                      <th className="px-4 py-3 text-sm font-semibold">Total Potential</th>
                      <th className="px-4 py-3 text-sm font-semibold">A Potential</th>
                      <th className="px-4 py-3 text-sm font-semibold">B Potential</th>
                      <th className="px-4 py-3 text-sm font-semibold">C Potential</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {territories.map((territory) => (
                      <tr key={territory._id || territory.name}>
                        <td className="px-4 py-4 text-sm font-medium text-slate-900">{territory.name || 'Untitled Territory'}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{Array.isArray(territory.state) ? territory.state.length : 0}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{formatCurrency(territory.totalPotential)}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{formatCurrency(territory.aAccountPotential)}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{formatCurrency(territory.bAccountPotential)}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{formatCurrency(territory.cAccountPotential)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Report Details</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Simulation</div>
                <div className="mt-1 text-slate-900">{simulationName || report.simulationId || 'Unknown'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Team</div>
                <div className="mt-1 text-slate-900">{teamName || report.teamId || 'Unknown'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Round</div>
                <div className="mt-1 text-slate-900">{report.roundNum}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Type</div>
                <div className="mt-1 text-slate-900">{report.type || 'MPF'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Report Created</div>
                <div className="mt-1 text-slate-900">{formatDate(report['Created Date'])}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">High-Potential Territories</h2>
          {territories.length === 0 ? (
            <p className="mt-4 text-slate-500">No territory potential details available.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {territories
                .slice()
                .sort((a, b) => (b.totalPotential || 0) - (a.totalPotential || 0))
                .slice(0, 3)
                .map((territory) => (
                  <div key={territory._id || territory.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{territory.name || 'Untitled Territory'}</p>
                        <p className="mt-1 text-sm text-slate-500">{Array.isArray(territory.state) ? territory.state.length : 0} states</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-slate-900">{formatCurrency(territory.totalPotential)}</p>
                        <p className="text-xs uppercase tracking-wide text-slate-500">Total potential</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
