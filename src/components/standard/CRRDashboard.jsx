import CRROverview from './CRROverview';
import CRRTable from './CRRTable';

export default function CRRDashboard({ teamCompanies }) {
  return (
    <div className="space-y-8 p-8">
      {/* Overview Cards */}
      <CRROverview teamCompanies={teamCompanies} />
      
      {/* Competitive Ranking Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Competitive Rankings</h2>
        <CRRTable teamCompanies={teamCompanies} />
      </div>
    </div>
  );
}
