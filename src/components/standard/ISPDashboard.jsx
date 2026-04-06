import ISPOverview from './ISPOverview';
import ISPTable from './ISPTable';

export default function ISPDashboard({ states }) {
  return (
    <div className="space-y-8 p-8">
      <ISPOverview states={states} />
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">State Sales Potentials</h2>
        <ISPTable states={states} />
      </div>
    </div>
  );
}
