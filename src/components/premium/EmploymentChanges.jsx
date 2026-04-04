import { getInitials } from '../../utils/formatters';

export default function EmploymentChanges({ hired = [], terminated = [] }) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Employment Changes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hired Employees */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-700">Hired Employees</h3>
          {hired.length === 0 ? (
            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded">
              No employees were hired this round
            </p>
          ) : (
            <div className="space-y-3">
              {hired.map((emp, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                    {getInitials(emp.firstName, emp.lastName)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {emp.firstName} {emp.lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {emp.jobTitle || 'New Hire'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Terminated Employees */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-red-700">Terminated Employees</h3>
          {terminated.length === 0 ? (
            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded">
              No employees were terminated this round
            </p>
          ) : (
            <div className="space-y-3">
              {terminated.map((emp, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
                    {getInitials(emp.firstName, emp.lastName)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {emp.firstName} {emp.lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {emp.jobTitle || 'Former Employee'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
