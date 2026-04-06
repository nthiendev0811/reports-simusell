import { formatCurrency } from '../../utils/formatters';

export default function ISPOverview({ states }) {
  if (!states || states.length === 0) {
    return <div className="text-center text-gray-500">No state sales potential data available</div>;
  }

  const totals = states.reduce((acc, state) => {
    acc.marketSize += Number(state.marketSize || 0);
    acc.aPotential += Number(state.aAccountPotential || 0);
    acc.bPotential += Number(state.bAccountPotential || 0);
    acc.cPotential += Number(state.cAccountPotential || 0);
    acc.totalPotential += Number(state.totalPotential || 0);
    return acc;
  }, { marketSize: 0, aPotential: 0, bPotential: 0, cPotential: 0, totalPotential: 0 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Total Market Size</p>
        <p className="text-3xl font-bold text-slate-900 mt-3">{formatCurrency(totals.marketSize)}</p>
        <p className="text-sm text-slate-500 mt-2">Across all reported states</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Total Sales Potential</p>
        <p className="text-3xl font-bold text-slate-900 mt-3">{formatCurrency(totals.totalPotential)}</p>
        <p className="text-sm text-slate-500 mt-2">Combined A/B/C account potential</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">A Account Potential</p>
        <p className="text-3xl font-bold text-slate-900 mt-3">{formatCurrency(totals.aPotential)}</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">B+C Potential</p>
        <p className="text-3xl font-bold text-slate-900 mt-3">{formatCurrency(totals.bPotential + totals.cPotential)}</p>
      </div>
    </div>
  );
}
