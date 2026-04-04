import { useState, useEffect } from 'react';
import { fetchStandardReportMD } from '../services/api';
import { formatDate, generateSubject } from '../utils/formatters';
import ReportHeader from '../components/standard/ReportHeader';
import ReportSubject from '../components/standard/ReportSubject';
import ReportMessage from '../components/standard/ReportMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function StandardReportMD() {
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

        const data = await fetchStandardReportMD(simulationId, teamId, roundNum);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <ReportHeader 
          teamName={report.fullName || 'Team Report'} 
          date={formatDate(report['Created Date'])} 
        />
        <ReportSubject subject={generateSubject(report.roundNum)} />
        <ReportMessage message={report.message || 'No message available.'} />
      </div>
    </div>
  );
}
