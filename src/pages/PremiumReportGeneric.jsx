import { useState, useEffect } from 'react';
import {
  fetchPremiumReportByType,
  fetchAnyPremiumReportByType,
  fetchBubbleObjectById,
  fetchBubbleObjectsByIds
} from '../services/api';
import { formatDate, formatNumber, formatCurrency, generateSubject } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const REPORT_CONFIG = {
  CSA: { tableName: 'Prod_PremiumReport_CSA', title: 'Customer Service Analysis' },
  HHSSS: { tableName: 'Prod_PremiumReport_HHSSS', title: 'Hiring & Human Resources Shortlist' },
  HRR: { tableName: 'Prod_PremiumReport_HRR', title: 'Human Resources Report' },
  CSR: { tableName: 'Prod_PremiumReport_CSR', title: 'Customer Satisfaction Report' },
  TA: { tableName: 'Prod_PremiumReport_TA', title: 'Territory Assessment' },
  CI: { tableName: 'Prod_PremiumReport_CI', title: 'Competitive Intelligence' },
  CDR: { tableName: 'Prod_PremiumReport_CDR', title: 'Capacity Deployment Report' },
  RDR: { tableName: 'Prod_PremiumReport_RDR', title: 'Regional Distribution Report' },
  SFR: { tableName: 'Prod_PremiumReport_SFR', title: 'Sales Forecast Report' }
};

const NESTED_TABLES = {
  CSA: { states: 'prod_premiumreport_csa_states' },
  HHSSS: { shortlist: 'prod_premiumreport_hhsss_shortlist' },
  HRR: { salesPeople: 'prod_premiumreport_hrr_salesperson' },
  CSR: {
    aAccountStates: 'prod_premiumreport_csr_accountstate',
    bAccountStates: 'prod_premiumreport_csr_accountstate',
    cAccountStates: 'prod_premiumreport_csr_accountstate'
  },
  TA: { territories: 'prod_premiumreport_ta_territory' },
  CDR: { states: 'prod_premiumreport_cdr_state' },
  RDR: { states: 'prod_premiumreport_rdr_state' },
  SFR: { salesPeople: 'prod_premiumreport_sfr_salesperson' }
};

function getNestedTable(reportKey, fieldName) {
  return NESTED_TABLES[reportKey]?.[fieldName] || null;
}

function TextBadge({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-100 p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function renderStateRows(states = []) {
  return states.map((state) => (
    <tr key={state._id || state.stateInitials}>
      <td className="px-4 py-4 text-sm text-slate-900">{state.stateInitials || state.name || 'Unknown'}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{state.underservedSegments ?? state.marketShare ?? ''}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{state.customerSatisfaction ?? ''}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{state.roleSatisfaction ?? ''}</td>
    </tr>
  ));
}

export default function PremiumReportGeneric({ reportKey }) {
  const [report, setReport] = useState(null);
  const [nestedData, setNestedData] = useState({});
  const [simulationName, setSimulationName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const config = REPORT_CONFIG[reportKey];
  if (!config) {
    return <ErrorMessage error={`Unsupported premium report type: ${reportKey}`} />;
  }

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
          reportData = await fetchAnyPremiumReportByType(config.tableName);
        } else if (reportId) {
          reportData = await fetchBubbleObjectById(config.tableName, reportId);
        } else {
          reportData = await fetchPremiumReportByType(config.tableName, simulationId, teamId, roundNum);
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

        const nested = {};
        const fields = Object.entries(reportData).filter(
          ([, value]) => Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string')
        );

        await Promise.all(fields.map(async ([field, ids]) => {
          const tableName = getNestedTable(reportKey, field);
          if (!tableName) return;
          const list = await fetchBubbleObjectsByIds(tableName, ids);
          nested[field] = list;
        }));

        setNestedData(nested);
      } catch (err) {
        console.error('Error loading premium generic report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [config.tableName, reportKey]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!report) return <ErrorMessage error="No report data found" />;

  const stateRows = nestedData.states || [];
  const shortlistRows = nestedData.shortlist || [];
  const hrSalesPeople = nestedData.salesPeople || [];
  const csrAStates = nestedData.aAccountStates || [];
  const csrBStates = nestedData.bAccountStates || [];
  const csrCStates = nestedData.cAccountStates || [];
  const taTerritories = nestedData.territories || [];
  const sfrSalesPeople = nestedData.salesPeople || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{report.fullName || config.title}</h1>
              <p className="mt-3 text-lg text-slate-200">{generateSubject(report.roundNum)}</p>
            </div>
            <div className="space-y-2 text-right">
              <div className="text-sm uppercase text-slate-300">Report type</div>
              <div className="text-2xl font-semibold">{config.title}</div>
              <div className="text-sm text-slate-300">Round {report.roundNum}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <TextBadge label="Cost" value={formatCurrency(report.cost ?? 0)} />
          <TextBadge label="Instructor Only" value={report.instructorOnly ? 'Yes' : 'No'} />
          <TextBadge label="Simulation" value={simulationName || report.simulationId || 'Unknown'} />
          <TextBadge label="Team" value={teamName || report.teamId || 'Unknown'} />
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
              <div className="mt-1 text-slate-900">{report.type || reportKey}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Created</div>
              <div className="mt-1 text-slate-900">{formatDate(report['Created Date'])}</div>
            </div>
          </div>
        </div>

        {reportKey === 'CSA' && (
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Territory States</h2>
            {stateRows.length === 0 ? (
              <p className="mt-4 text-slate-500">No state-level CSA data available.</p>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="border-b bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold">State</th>
                      <th className="px-4 py-3 text-sm font-semibold">Underserved Segments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {stateRows.map((state) => (
                      <tr key={state._id || state.stateInitials}>
                        <td className="px-4 py-4 text-sm text-slate-900">{state.stateInitials || 'Unknown'}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{state.underservedSegments ?? 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {reportKey === 'HHSSS' && (
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
        )}

        {reportKey === 'HRR' && (
          <div className="rounded-3xl bg-white p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Team Satisfaction Summary</h2>
              <div className="grid gap-4 sm:grid-cols-3 mt-4">
                <TextBadge label="Team Avg Satisfaction" value={`${report.teamAverageSatisfaction ?? 0}%`} />
                <TextBadge label="Industry Avg Satisfaction" value={`${report.industryAverageSatisfaction ?? 0}%`} />
                <TextBadge label="Compensation" value={`${report.teamAvgCompensationSatisfaction ?? 0}%`} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Employee Satisfaction</h3>
              {hrSalesPeople.length === 0 ? (
                <p className="mt-4 text-slate-500">No salesperson satisfaction details available.</p>
              ) : (
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full divide-y divide-slate-200 text-left">
                    <thead className="border-b bg-slate-50 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-sm font-semibold">Name</th>
                        <th className="px-4 py-3 text-sm font-semibold">Overall</th>
                        <th className="px-4 py-3 text-sm font-semibold">Role</th>
                        <th className="px-4 py-3 text-sm font-semibold">Compensation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {hrSalesPeople.map((person) => (
                        <tr key={person._id || person.name}>
                          <td className="px-4 py-4 text-sm text-slate-900">{person.name || 'Unknown'}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{person.overallSatisfaction ?? 'N/A'}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{person.roleSatisfaction ?? 'N/A'}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{person.compensationSatisfaction ?? 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {reportKey === 'CSR' && (
          <div className="rounded-3xl bg-white p-6 shadow-sm space-y-6">
            <div className="grid gap-4 xl:grid-cols-3">
              <TextBadge label="A Account States" value={csrAStates.length} />
              <TextBadge label="B Account States" value={csrBStates.length} />
              <TextBadge label="C Account States" value={csrCStates.length} />
            </div>
            {[{ label: 'A Account', rows: csrAStates }, { label: 'B Account', rows: csrBStates }, { label: 'C Account', rows: csrCStates }].map((section) => (
              <div key={section.label}>
                <h3 className="text-lg font-semibold text-slate-900">{section.label} Satisfaction</h3>
                {section.rows.length === 0 ? (
                  <p className="mt-4 text-slate-500">No records available.</p>
                ) : (
                  <div className="overflow-x-auto mt-4">
                    <table className="min-w-full divide-y divide-slate-200 text-left">
                      <thead className="border-b bg-slate-50 text-slate-700">
                        <tr>
                          <th className="px-4 py-3 text-sm font-semibold">State</th>
                          <th className="px-4 py-3 text-sm font-semibold">Customer Satisfaction</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {section.rows.map((state) => (
                          <tr key={state._id || state.stateInitials}>
                            <td className="px-4 py-4 text-sm text-slate-900">{state.stateInitials || 'Unknown'}</td>
                            <td className="px-4 py-4 text-sm text-slate-600">{state.customerSatisfaction ?? 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {reportKey === 'TA' && (
          <div className="rounded-3xl bg-white p-6 shadow-sm space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <TextBadge label="Industry Avg Territory" value={formatNumber(report.industryAverageTerritorySize ?? 0)} />
              <TextBadge label="Team Avg Territory" value={formatNumber(report.teamAverageTerritorySize ?? 0)} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Territories</h3>
              {taTerritories.length === 0 ? (
                <p className="mt-4 text-slate-500">No territory details available.</p>
              ) : (
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full divide-y divide-slate-200 text-left">
                    <thead className="border-b bg-slate-50 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-sm font-semibold">Territory</th>
                        <th className="px-4 py-3 text-sm font-semibold">Size</th>
                        <th className="px-4 py-3 text-sm font-semibold">States</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {taTerritories.map((territory) => (
                        <tr key={territory._id || territory.name}>
                          <td className="px-4 py-4 text-sm text-slate-900">{territory.name || 'Unknown'}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{formatNumber(territory.size ?? 0)}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{Array.isArray(territory.states) ? territory.states.length : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {reportKey === 'CI' && (
          <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Competitive Intelligence</h2>
            <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-600">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Competitor Standard Reports</div>
                <div className="mt-1 text-slate-900">{report.competitorStandardReports || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Competitor Student Team</div>
                <div className="mt-1 text-slate-900">{report.competitorStudentTeamId || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Competitor Team Number</div>
                <div className="mt-1 text-slate-900">{report.competitorTeamNum ?? 'N/A'}</div>
              </div>
            </div>
          </div>
        )}

        {reportKey === 'CDR' && (
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Capacity Deployment States</h2>
            {stateRows.length === 0 ? (
              <p className="mt-4 text-slate-500">No CDR state details available.</p>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="border-b bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold">State</th>
                      <th className="px-4 py-3 text-sm font-semibold">Team Number</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {stateRows.map((state) => (
                      <tr key={state._id || state.stateInitials}>
                        <td className="px-4 py-4 text-sm text-slate-900">{state.stateInitials || 'Unknown'}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{state.teamNum ?? 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {reportKey === 'RDR' && (
          <div className="rounded-3xl bg-white p-6 shadow-sm space-y-6">
            <TextBadge label="Fair Share" value={`${report.fairShare ?? 0}%`} />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Regional State Share</h2>
              {stateRows.length === 0 ? (
                <p className="mt-4 text-slate-500">No RDR state data available.</p>
              ) : (
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full divide-y divide-slate-200 text-left">
                    <thead className="border-b bg-slate-50 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-sm font-semibold">State</th>
                        <th className="px-4 py-3 text-sm font-semibold">Market Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {stateRows.map((state) => (
                        <tr key={state._id || state.stateInitials}>
                          <td className="px-4 py-4 text-sm text-slate-900">{state.stateInitials || 'Unknown'}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{state.marketShare ?? 'N/A'}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {reportKey === 'SFR' && (
          <div className="rounded-3xl bg-white p-6 shadow-sm space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <TextBadge label="Next Quarter Forecast" value={formatCurrency(report.totalNextQuarterSalesForecast ?? 0)} />
              <TextBadge label="Percent of Last Quarter" value={`${report.totalPercentageOfLastQuarterSales ?? 0}%`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Salespeople Market Share</h2>
              {sfrSalesPeople.length === 0 ? (
                <p className="mt-4 text-slate-500">No SFR salesperson details available.</p>
              ) : (
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full divide-y divide-slate-200 text-left">
                    <thead className="border-b bg-slate-50 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-sm font-semibold">Name</th>
                        <th className="px-4 py-3 text-sm font-semibold">Sales Person ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {sfrSalesPeople.map((person) => (
                        <tr key={person._id || person.salesPersonId}>
                          <td className="px-4 py-4 text-sm text-slate-900">{person.name || 'Unknown'}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{person.salesPersonId || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
