import { useState, useEffect } from 'react';
import { fetchStandardReport } from '../services/api';
import { formatDate, generateSubject } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function StandardReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const params = new URLSearchParams(window.location.search);
        const simulationId = params.get('simulationId');
        const teamId = params.get('teamId');
        const roundNum = params.get('roundNum');

        if (!simulationId || !teamId || !roundNum) {
          throw new Error('Missing required parameters: simulationId, teamId, or roundNum');
        }

        const data = await fetchStandardReport(simulationId, teamId, roundNum);
        setReport(data);
      } catch (err) {
        console.error('Error loading report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!report) return <ErrorMessage error="No report data found" />;

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-200 px-10 py-8 flex justify-between items-center border-b border-gray-300">
          <h1 className="text-3xl font-semibold text-gray-900">
            {report.fullName || 'Team Report'}
          </h1>
          <div className="text-gray-600 text-lg">
            {formatDate(report['Created Date'])}
          </div>
        </div>

        {/* Subject */}
        <div className="bg-gray-100 px-10 py-5 border-b border-gray-300">
          <span className="font-semibold text-gray-900">Subject:</span>
          <span className="ml-2 text-gray-900">
            {generateSubject(report.roundNum)}
          </span>
        </div>

        {/* Message Body */}
        <div className="px-10 py-10 whitespace-pre-line text-gray-900 leading-relaxed min-h-[300px]">
          {report.message || 'No message available.'}
        </div>
      </div>
    </div>
  );
}
