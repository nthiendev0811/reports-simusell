export default function USMap({ states = [], title = "Territories" }) {
  // Simple SVG representation of US states
  // For a production app, you'd want to use a library like react-simple-maps
  // or include the full US map SVG
  
  const hasStates = states && states.length > 0;
  
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <div className="relative bg-gray-100 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
        {hasStates ? (
          <div className="text-center">
            <svg className="w-full h-64 mx-auto" viewBox="0 0 960 600">
              {/* Placeholder US map outline */}
              <rect x="0" y="0" width="960" height="600" fill="#e5e7eb" opacity="0.5"/>
              <text x="480" y="300" textAnchor="middle" className="fill-gray-600 text-4xl">
                US Map
              </text>
              <text x="480" y="340" textAnchor="middle" className="fill-gray-500 text-lg">
                {states.join(', ')}
              </text>
            </svg>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Covered States: <span className="font-semibold">{states.join(', ')}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center">
            <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p>No territories assigned</p>
          </div>
        )}
      </div>
    </div>
  );
}
