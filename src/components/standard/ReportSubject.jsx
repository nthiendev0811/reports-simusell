export default function ReportSubject({ subject }) {
  return (
    <div className="bg-gray-100 p-4 border-b">
      <div className="mx-auto">
        <h2 className="text-lg font-semibold text-gray-900">{subject}</h2>
      </div>
    </div>
  );
}