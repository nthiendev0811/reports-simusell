import { useState, useEffect } from 'react';
import {
  fetchPremiumReportMSR,
  fetchAnyPremiumReportMSR,
  fetchBubbleObjectsByIds,
  fetchBubbleObjectById
} from '../services/api';
import { formatDate, formatNumber, formatCurrency, generateSubject } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function PremiumReportMSR() {
  const [report, setReport] = useState(null);
  const [teamCompanies, setTeamCompanies] = useState([]);
  const [salesPeople, setSalesPeople] = useState([]);
  const [teamQMS, setTeamQMS] = useState([]);
  const [employeeQMS, setEmployeeQMS] = useState([]);
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
          reportData = await fetchBubbleObjectById('Prod_PremiumReport_MSR', reportId);
        } else if (simulationId && teamId && roundNum) {
          reportData = await fetchPremiumReportMSR(simulationId, teamId, roundNum);
        } else {
          reportData = await fetchAnyPremiumReportMSR();
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

        const teamCompanyIds = Array.isArray(reportData.teamCompanies)
          ? reportData.teamCompanies.filter(Boolean)
          : [];

        const loadedTeamCompanies = teamCompanyIds.length > 0
          ? await fetchBubbleObjectsByIds('prod_premiumreport_msr_teamcompanies', teamCompanyIds)
          : [];

        setTeamCompanies(loadedTeamCompanies);

        const salesPersonIds = loadedTeamCompanies.flatMap((company) =>
          Array.isArray(company.salesPeople) ? company.salesPeople.filter(Boolean) : []
        );

        const loadedSalesPeople = salesPersonIds.length > 0
          ? await fetchBubbleObjectsByIds('prod_premiumreport_msr_salesperson', salesPersonIds)
          : [];

        setSalesPeople(loadedSalesPeople);

        const teamQmsIds = loadedTeamCompanies.flatMap((company) =>
          Array.isArray(company.quarterlyMarketShares) ? company.quarterlyMarketShares.filter(Boolean) : []
        );

        const loadedTeamQMS = teamQmsIds.length > 0
          ? await fetchBubbleObjectsByIds('prod_premiumreport_msr_teamqms', teamQmsIds)
          : [];

        setTeamQMS(loadedTeamQMS);

        const employeeQmsIds = loadedSalesPeople.flatMap((person) =>
          Array.isArray(person.quarterlyMarketShares) ? person.quarterlyMarketShares.filter(Boolean) : []
        );

        const loadedEmployeeQMS = employeeQmsIds.length > 0
          ? await fetchBubbleObjectsByIds('prod_premiumreport_msr_spqms', employeeQmsIds)
          : [];

        setEmployeeQMS(loadedEmployeeQMS);
      } catch (err) {
        console.error('Error loading MSR report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!report) return <ErrorMessage error="No MSR report data found" />;

  const currentRound = report.roundNum;
  const activeTeamQMS = teamQMS.filter((qms) => qms.roundNum === currentRound);
  const activeEmployeeQMS = employeeQMS.filter((qms) => qms.roundNum === currentRound);

  const companiesWithShare = teamCompanies.map((company) => {
    const companyQMS = activeTeamQMS.find((qms) => qms.msrTeamCompanyId === company._id);
    return {
      ...company,
      marketShare: companyQMS?.marketShare ?? 0,
      salesPeopleCount: Array.isArray(company.salesPeople) ? company.salesPeople.length : 0,
      teamMarketShare: companyQMS?.marketShare ?? 0
    };
  });

  const employeeRows = salesPeople.map((person) => {
    const personQMS = activeEmployeeQMS.find((qms) => qms.msrSalesPersonId === person._id);
    const company = teamCompanies.find((company) =>
      Array.isArray(company.salesPeople) && company.salesPeople.includes(person._id)
    );

    return {
      ...person,
      teamCompanyName: company?.name || 'Unknown Company',
      aAccount: personQMS?.aAccountMarketShare ?? 0,
      bAccount: personQMS?.bAccountMarketShare ?? 0,
      cAccount: personQMS?.cAccountMarketShare ?? 0,
      teamMarketShare: personQMS?.teamMarketShare ?? 0
    };
  });

  const totalTeamCompanies = teamCompanies.length;
  const totalSalesPeople = salesPeople.length;
  const averageTeamShare = totalTeamCompanies > 0
    ? companiesWithShare.reduce((sum, company) => sum + (company.marketShare || 0), 0) / totalTeamCompanies
    : 0;
  const totalReportCost = report.cost || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{report.fullName || 'Market Share Report'}</h1>
              <p className="mt-3 text-lg text-slate-200">{generateSubject(report.roundNum)}</p>
            </div>
            <div className="space-y-2 text-right">
              <div className="text-sm uppercase text-slate-300">Report type</div>
              <div className="text-2xl font-semibold">MSR</div>
              <div className="text-sm text-slate-300">Round {report.roundNum}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase text-slate-500">Companies</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{totalTeamCompanies}</div>
            <div className="mt-2 text-sm text-slate-500">Team companies in report</div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase text-slate-500">Salespeople</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{totalSalesPeople}</div>
            <div className="mt-2 text-sm text-slate-500">Employees contributing market share</div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase text-slate-500">Avg Team Share</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{formatNumber(averageTeamShare.toFixed(1))}%</div>
            <div className="mt-2 text-sm text-slate-500">Average share per company</div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase text-slate-500">Report Cost</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{formatCurrency(totalReportCost)}</div>
            <div className="mt-2 text-sm text-slate-500">Premium report cost</div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Market Share Within Team</h2>
                <p className="mt-1 text-sm text-slate-500">Current share levels by team company.</p>
              </div>
            </div>

            {companiesWithShare.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
                No team company market share data available.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold">Company</th>
                      <th className="px-4 py-3 text-sm font-semibold">Salespeople</th>
                      <th className="px-4 py-3 text-sm font-semibold">Market Share</th>
                      <th className="px-4 py-3 text-sm font-semibold">Round</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {companiesWithShare.map((company) => (
                      <tr key={company._id || company.studentTeamId}>
                        <td className="px-4 py-4 text-sm font-medium text-slate-900">{company.name || company.studentTeamId || company._id}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{company.salesPeopleCount}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{formatNumber((company.marketShare || 0).toFixed(1))}%</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{currentRound}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Report Info</h2>
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
                <div className="text-xs uppercase tracking-wide text-slate-500">Created</div>
                <div className="mt-1 text-slate-900">{formatDate(report['Created Date'])}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Employee Market Share by Account</h2>
              <p className="mt-1 text-sm text-slate-500">A, B and C account market share for each salesperson.</p>
            </div>
          </div>

          {employeeRows.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
              No employee market share data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold">Employee</th>
                    <th className="px-4 py-3 text-sm font-semibold">Company</th>
                    <th className="px-4 py-3 text-sm font-semibold">A (%)</th>
                    <th className="px-4 py-3 text-sm font-semibold">B (%)</th>
                    <th className="px-4 py-3 text-sm font-semibold">C (%)</th>
                    <th className="px-4 py-3 text-sm font-semibold">Team Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {employeeRows.map((employee) => (
                    <tr key={employee._id || employee.salesPersonId}>
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">{employee.name || employee.salesPersonId || 'Unnamed'}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{employee.teamCompanyName}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{formatNumber((employee.aAccount || 0).toFixed(1))}%</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{formatNumber((employee.bAccount || 0).toFixed(1))}%</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{formatNumber((employee.cAccount || 0).toFixed(1))}%</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{formatNumber((employee.teamMarketShare || 0).toFixed(1))}%</td>
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
