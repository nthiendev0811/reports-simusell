import IPROverview from './IPROverview';
import IPRTable from './IPRTable';

export default function IPRDashboard({ teamCompanies }) {
  return (
    <div className="space-y-8 p-8">
      <IPROverview teamCompanies={teamCompanies} />
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Industry Performance by Team</h2>
        <IPRTable teamCompanies={teamCompanies} />
      </div>
    </div>
  );
}
