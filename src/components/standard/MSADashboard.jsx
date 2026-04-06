import MSAOverview from './MSAOverview';
import MSACharts from './MSACharts';
import MSATeamTable from './MSATeamTable';

export default function MSADashboard({ salesPeople, teamCompanies }) {
  return (
    <div className="space-y-8 p-8">
      {/* Overview Summary */}
      <MSAOverview salesPeople={salesPeople} teamCompanies={teamCompanies} />

      {/* Market Share Charts */}
      <MSACharts teamCompanies={teamCompanies} />

      {/* Team Market Share Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Share by Team</h2>
        <MSATeamTable teamCompanies={teamCompanies} />
      </div>
    </div>
  );
}
