import { useState, useEffect } from 'react';
import {
  fetchPremiumReportByType,
  fetchAnyPremiumReportByType,
  fetchBubbleObjectById,
  fetchBubbleObjectsByIds
} from '../services/api';
import { formatDate, formatCurrency, generateSubject } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const TABLE_NAME = 'Prod_PremiumReport_HHSSS';
const NESTED_TABLE = 'prod_premiumreport_hhsss_shortlist';

export default function PremiumReportHHSSS() {
  const [report, setReport] = useState(null);
  const [shortlistRows, setShortlistRows] = useState([]);
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
        const missingParams = !reportId && !(simulationId && teamId && roundNum);
        if (missingParams) {
          reportData = await fetchAnyPremiumReportByType(TABLE_NAME);
        } else if (reportId) {
          reportData = await fetchBubbleObjectById(TABLE_NAME, reportId);
        } else {
          reportData = await fetchPremiumReportByType(TABLE_NAME, simulationId, teamId, roundNum);
        }

        setReport(reportData);

        if (reportData.simulationId) {
          try {
            const simulation = await fetchBubbleObjectById('Prod_Simulation', reportData.simulationId);
            setSimulationName(simulation?.name || 'Unknown Simulation');
          } catch (e) {
            setSimulationName('Unknown Simulation');
          }
        }

        if (reportData.teamId) {
          try {
            const team = await fetchBubbleObjectById('Prod_TeamCompany', reportData.teamId);
            setTeamName(team?.companyName || team?.name || 'Unknown Team');
          } catch (e) {
            setTeamName('Unknown Team');
          }
        }

        const shortlistIds = Array.isArray(reportData.shortlist)
          ? reportData.shortlist.filter((id) => typeof id === 'string')
          : [];
        if (shortlistIds.length > 0) {
          const shortlist = await fetchBubbleObjectsByIds(NESTED_TABLE, shortlistIds);
          setShortlistRows(shortlist);
        }
      } catch (err) {
        console.error('Error loading HHSSS report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!report) return <ErrorMessage error="No HHSSS report data found" />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{report.fullName || 'Hiring & Human Resources Shortlist'}</h1>
              <p className="mt-3 text-lg text-slate-200">{generateSubject(report.roundNum)}</p>
            </div>
            <div className="space-y-2 text-right">
              <div className="text-sm uppercase text-slate-300">Report type</div>
              <div className="text-2xl font-semibold">HHSSS</div>
              <div className="text-sm text-slate-300">Round {report.roundNum}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase text-slate-500">Cost</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{formatCurrency(report.cost ?? 0)}</div>
            <div className="mt-2 text-sm text-slate-500">Report cost</div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase text-slate-500">Instructor Only</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{report.instructorOnly ? 'Yes' : 'No'}</div>
            <div className="mt-2 text-sm text-slate-500">Instructor visibility</div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase text-slate-500">Simulation</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{simulationName}</div>
            <div className="mt-2 text-sm text-slate-500">Simulation name</div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase text-slate-500">Team</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{teamName}</div>
            <div className="mt-2 text-sm text-slate-500">Team name</div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Report Overview</h2>
          <div className="grid gap-4 md:grid-cols-3 mt-4 text-sm text-slate-600">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Round</div>
              <div className="mt-1 text-slate-900">{report.roundNum}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Type</div>
              <div className="mt-1 text-slate-900">HHSSS</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Created</div>
              <div className="mt-1 text-slate-900">{formatDate(report['Created Date'])}</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Shortlist Candidates</h2>
          {shortlistRows.length === 0 ? (
            <p className="mt-4 text-slate-500">No shortlist details available.</p>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="border-b bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-sm font-semibold">Job Title</th>
                    <th className="px-4 py-3 text-sm font-semibold">Salary</th>
                    <th className="px-4 py-3 text-sm font-semibold">Profit Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {shortlistRows.map((candidate) => (
                    <tr key={candidate._id || candidate.name}>
                      <td className="px-4 py-4 text-sm text-slate-900">{candidate.name}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{candidate.jobTitle || 'N/A'}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{formatCurrency(candidate.salary)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{candidate.profitContribution || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}