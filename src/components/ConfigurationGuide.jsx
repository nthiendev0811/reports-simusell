export default function ConfigurationGuide() {
  const premiumReports = [
    { type: 'premium-csa', name: 'Customer Service Analysis (CSA)' },
    { type: 'premium-hhsss', name: 'Hiring & Human Resources Shortlist (HHSSS)' },
    { type: 'premium-hrr', name: 'Human Resources Report (HRR)' },
    { type: 'premium-csr', name: 'Customer Satisfaction Report (CSR)' },
    { type: 'premium-ta', name: 'Territory Assessment (TA)' },
    { type: 'premium-ci', name: 'Competitive Intelligence (CI)' },
    { type: 'premium-cdr', name: 'Capacity Deployment Report (CDR)' },
    { type: 'premium-rdr', name: 'Regional Distribution Report (RDR)' },
    { type: 'premium-sfr', name: 'Sales Forecast Report (SFR)' },
    { type: 'premium-mpf', name: 'Market Potential Forecast (MPF)' },
    { type: 'premium-msr', name: 'Market Share Report (MSR)' },
    { type: 'premium-eipr', name: 'Extended Industry Performance Report (EIPR)' }
  ];

  const standardReports = [
    { type: 'standard-md', name: 'Management Development (MD)' },
    { type: 'standard-qpls', name: 'Quarterly Profit & Loss Statement (QPLS)' },
    { type: 'standard-crr', name: 'Competitive Ranking Report (CRR)' },
    { type: 'standard-msa', name: 'Market Share Analysis (MSA)' },
    { type: 'standard-tsr', name: 'Team Summary Report (TSR)' },
    { type: 'standard-far', name: 'Forecast Accuracy Report (FAR)' },
    { type: 'standard-ipr', name: 'Industry Performance Report (IPR)' },
    { type: 'standard-isp', name: 'Industry Sales Potential (ISP)' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold tracking-tight">⚙️ Configuration Guide</h1>
          <p className="mt-3 text-lg text-amber-50">
            Learn how to properly configure report URLs with required parameters.
          </p>
        </div>

        {/* Missing Parameter Alert */}
        <div className="rounded-3xl border-2 border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900">Missing or Invalid Configuration</h3>
              <p className="mt-1 text-amber-800">
                The report type was not specified or is invalid. Please use one of the report types below and provide the required parameters.
              </p>
            </div>
          </div>
        </div>

        {/* Required Parameters Section */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Required Parameters</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
              <h3 className="font-semibold text-blue-900">type (Required)</h3>
              <p className="text-sm text-blue-800 mt-1">
                The report type you want to display. Choose from the lists below.
              </p>
              <code className="mt-2 block bg-white p-2 text-xs rounded border border-blue-200">
                ?type=premium-csa
              </code>
            </div>

            <div className="border-l-4 border-green-500 bg-green-50 p-4">
              <h3 className="font-semibold text-green-900">simulationId, teamId, roundNum (Optional)</h3>
              <p className="text-sm text-green-800 mt-1">
                Query parameters to fetch a specific report. If not provided, the system will load any available report of that type.
              </p>
              <code className="mt-2 block bg-white p-2 text-xs rounded border border-green-200">
                ?type=premium-csa&simulationId=ABC123&teamId=XYZ789&roundNum=3
              </code>
            </div>

            <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
              <h3 className="font-semibold text-purple-900">reportId (Alternative)</h3>
              <p className="text-sm text-purple-800 mt-1">
                Alternatively, you can provide a specific report ID to fetch that exact report.
              </p>
              <code className="mt-2 block bg-white p-2 text-xs rounded border border-purple-200">
                ?type=premium-csa&reportId=123456
              </code>
            </div>
          </div>
        </div>

        {/* Premium Reports */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Premium Reports</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {premiumReports.map((report) => (
              <div
                key={report.type}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-blue-50 transition"
              >
                <div>
                  <div className="font-medium text-slate-900">{report.name}</div>
                  <code className="text-xs text-slate-600">type={report.type}</code>
                </div>
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Standard Reports */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Standard Reports</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {standardReports.map((report) => (
              <div
                key={report.type}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-green-50 transition"
              >
                <div>
                  <div className="font-medium text-slate-900">{report.name}</div>
                  <code className="text-xs text-slate-600">type={report.type}</code>
                </div>
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Example URLs */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Example URLs</h2>
          <div className="space-y-4 font-mono text-sm">
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
              <div className="text-yellow-400">// Premium report with specific simulation</div>
              <div className="text-slate-100 mt-2">
                https://yourapp.com/?type=premium-csa&simulationId=sim123&teamId=team456&roundNum=2
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
              <div className="text-yellow-400">// Premium report with direct report ID</div>
              <div className="text-slate-100 mt-2">
                https://yourapp.com/?type=premium-mpf&reportId=report789
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
              <div className="text-yellow-400">// Standard report - will load any available</div>
              <div className="text-slate-100 mt-2">
                https://yourapp.com/?type=standard-md
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
              <div className="text-yellow-400">// Standard report with specific parameters</div>
              <div className="text-slate-100 mt-2">
                https://yourapp.com/?type=standard-md&simulationId=sim123&teamId=team456&roundNum=1
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border border-blue-200">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">💡 Tips</h2>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>If no simulation parameters are provided, the system will load any available report of that type.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>Use <code className="bg-white px-2 py-1 rounded text-xs">reportId</code> to fetch a specific report directly.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>All report types are case-insensitive (e.g., <code className="bg-white px-2 py-1 rounded text-xs">premium-csa</code> is the same as <code className="bg-white px-2 py-1 rounded text-xs">PREMIUM-CSA</code>).</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>If no parameters are provided at all, the system defaults to the Standard MD report.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
