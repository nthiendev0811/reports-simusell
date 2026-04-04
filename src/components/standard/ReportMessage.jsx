export default function ReportMessage({ message }) {
  return (
    <div className="p-6">
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}