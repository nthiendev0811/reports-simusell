import TSROverview from './TSROverview';
import TSRTable from './TSRTable';

export default function TSRDashboard({ report, teamCompanies }) {
  return (
    <div className="space-y-8 p-8">
      <TSROverview report={report} teamCompanies={teamCompanies} />
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Companies</h2>
        <TSRTable teamCompanies={teamCompanies} />
      </div>
    </div>
  );
}
