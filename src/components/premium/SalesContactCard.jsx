import { getInitials, getSalespersonPhotoUrl } from '../../utils/formatters';

export default function SalesContactCard({ salesperson }) {
  if (!salesperson) {
    return (
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Sales Contact</h3>
        <p className="text-gray-500 text-center py-4">No contact available</p>
      </div>
    );
  }

  const photoUrl = getSalespersonPhotoUrl(salesperson.photo);
  const initials = getInitials(salesperson.firstName, salesperson.lastName);

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Sales Contact</h3>
      
      <div className="flex items-center gap-4">
        {photoUrl ? (
          <img 
            src={photoUrl} 
            alt={`${salesperson.firstName} ${salesperson.lastName}`}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold ${photoUrl ? 'hidden' : 'flex'}`}
        >
          {initials}
        </div>
        
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-1">Sales Contact Manager</div>
          <div className="text-xl font-semibold text-gray-900">
            {salesperson.firstName} {salesperson.lastName}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Contact us to discuss your account
          </div>
        </div>
      </div>
    </div>
  );
}
