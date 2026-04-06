export default function TSROverview({ report, teamCompanies }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-violet-50 p-6 rounded-lg border border-violet-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Team Name</p>
        <p className="text-2xl font-bold text-violet-900 mt-3">{report.fullName || 'Unknown Team'}</p>
      </div>

      <div className="bg-violet-50 p-6 rounded-lg border border-violet-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">TSR Type</p>
        <p className="text-2xl font-bold text-violet-900 mt-3">{report.type || 'TSR'}</p>
      </div>

      <div className="bg-violet-50 p-6 rounded-lg border border-violet-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Team Companies</p>
        <p className="text-2xl font-bold text-violet-900 mt-3">{teamCompanies.length}</p>
      </div>

      <div className="bg-violet-50 p-6 rounded-lg border border-violet-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Simulation ID</p>
        <p className="text-2xl font-bold text-violet-900 mt-3">{report.simulationId || 'N/A'}</p>
      </div>
    </div>
  );
}
