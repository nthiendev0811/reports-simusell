import FAROverview from './FAROverview';
import FARTable from './FARTable';

export default function FARDashboard({ report, salesPeople }) {
  return (
    <div className="space-y-8 p-8">
      <FAROverview report={report} />
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Salesperson Forecast Accuracy</h2>
        <FARTable salesPeople={salesPeople} />
      </div>
    </div>
  );
}
