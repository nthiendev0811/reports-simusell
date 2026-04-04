export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900"></div>
      <p className="mt-6 text-lg text-gray-600">Loading report...</p>
    </div>
  );
}
