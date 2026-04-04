export default function ReportHeader({ teamName, date }) {
  return (
    <div className="bg-blue-600 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">{teamName}</h1>
        <p className="text-blue-100 mt-1">Report Date: {date}</p>
      </div>
    </div>
  );
}