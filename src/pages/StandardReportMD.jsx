import { useState, useEffect } from 'react';
import { fetchStandardReportMD, fetchBubbleObjectById, fetchBubbleObjectsByIds } from '../services/api';
import { formatDate, generateSubject, getInitials } from '../utils/formatters';
import ReportHeader from '../components/standard/ReportHeader';
import ReportSubject from '../components/standard/ReportSubject';
import ReportMessage from '../components/standard/ReportMessage';
import EmploymentChanges from '../components/premium/EmploymentChanges';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function StandardReportMD() {
  const [report, setReport] = useState(null);
  const [salesContest, setSalesContest] = useState(null);
  const [contestWinner, setContestWinner] = useState(null);
  const [reportsPurchased, setReportsPurchased] = useState([]);
  const [oldTerritoryRecords, setOldTerritoryRecords] = useState([]);
  const [newTerritoryRecords, setNewTerritoryRecords] = useState([]);
  const [hiredSalespeople, setHiredSalespeople] = useState([]);
  const [firedSalespeople, setFiredSalespeople] = useState([]);
  const [employedSalespeople, setEmployedSalespeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const params = new URLSearchParams(window.location.search);
        const simulationId = params.get('simulationId') || '1774781149806x783139239505952800';
        const teamId = params.get('teamId') || '1774781534734x108395326443880450';
        const roundNum = params.get('roundNum') || '1';

        const data = await fetchStandardReportMD(simulationId, teamId, roundNum);
        setReport(data);

        const [oldTerritories, newTerritories, hiredPeople, firedPeople, employedPeople] = await Promise.all([
          data.oldTerritoryIDs?.length
            ? fetchBubbleObjectsByIds('prod_standardreport_md_oldterritory', data.oldTerritoryIDs)
            : [],
          data.newTerritoryIDs?.length
            ? fetchBubbleObjectsByIds('prod_standardreport_md_newterritory', data.newTerritoryIDs)
            : [],
          data.hiredSalesPeopleIDs?.length
            ? fetchBubbleObjectsByIds('prod_standardreport_md_hiredsalesperson', data.hiredSalesPeopleIDs)
            : [],
          data.firedSalesPeopleIDs?.length
            ? fetchBubbleObjectsByIds('prod_standardreport_md_firedsalesperson', data.firedSalesPeopleIDs)
            : [],
          data.employedSalesPeopleIDs?.length
            ? fetchBubbleObjectsByIds('prod_standardreport_md_employedsalesperson', data.employedSalesPeopleIDs)
            : [],
        ]);

        setOldTerritoryRecords(oldTerritories);
        setNewTerritoryRecords(newTerritories);
        setHiredSalespeople(hiredPeople);
        setFiredSalespeople(firedPeople);
        setEmployedSalespeople(employedPeople);

        if (data.salesContestID) {
          const contest = await fetchBubbleObjectById('prod_standardreport_md_salescontest', data.salesContestID);
          setSalesContest(contest);
        }

        if (data.contestWinnerID) {
          const winner = await fetchBubbleObjectById('prod_standardreport_md_contestwinner', data.contestWinnerID);
          setContestWinner(winner);
        }

        if (Array.isArray(data.reportsPurchasedIDs) && data.reportsPurchasedIDs.length > 0) {
          const purchases = await Promise.all(
            data.reportsPurchasedIDs.map(async (id) => {
              try {
                return await fetchBubbleObjectById('prod_standardreport_md_reportspurchased', id);
              } catch {
                return { _id: id };
              }
            })
          );
          setReportsPurchased(purchases.filter(Boolean));
        }
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

  const oldTerritories = oldTerritoryRecords.length > 0
    ? oldTerritoryRecords
    : (report.oldTerritoryIDs || []).map((id) => ({ _id: id, name: id }));
  const newTerritories = newTerritoryRecords.length > 0
    ? newTerritoryRecords
    : (report.newTerritoryIDs || []).map((id) => ({ _id: id, name: id }));
  const hiredEmployees = hiredSalespeople.length > 0
    ? hiredSalespeople
    : (report.hiredSalesPeopleIDs || []).map((id) => ({
        firstName: 'Hired',
        lastName: id.slice(-6),
        _id: id,
      }));
  const firedEmployees = firedSalespeople.length > 0
    ? firedSalespeople
    : (report.firedSalesPeopleIDs || []).map((id) => ({
        firstName: 'Fired',
        lastName: id.slice(-6),
        _id: id,
      }));
  const employedPeople = employedSalespeople.length > 0
    ? employedSalespeople
    : (report.employedSalesPeopleIDs || []).map((id) => ({
        _id: id,
        firstName: 'Employee',
        lastName: id.slice(-6),
      }));
  const employedCount = report.employedSalesPeopleIDs?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ReportHeader
            teamName={report.fullName || 'Team Report'}
            date={formatDate(report['Created Date'])}
          />
          <ReportSubject subject={generateSubject(report.roundNum)} />
          <ReportMessage
            message={report.message || 'This report summarizes territory, employment, and sales contest decisions for the selected round.'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-[rgb(9,23,71)] mb-4">Sales Territories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[rgb(9,23,71)]/10 bg-[rgb(101,202,28)]/10">
                <h3 className="font-semibold mb-2 text-[rgb(9,23,71)]">Old Territories</h3>
                <p className="text-sm text-[rgb(9,23,71)] mb-3">{oldTerritories.length} territory records</p>
                {oldTerritories.length > 0 ? (
                  <div className="text-xs text-[rgb(9,23,71)] space-y-1 break-words">
                    {oldTerritories.map((territory) => (
                      <div key={territory._id}>{territory.name || territory._id}</div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[rgb(9,23,71)]">No old territories recorded.</p>
                )}
              </div>
              <div className="p-4 rounded-xl border border-[rgb(9,23,71)]/10 bg-[rgb(101,202,28)]/10">
                <h3 className="font-semibold mb-2 text-[rgb(9,23,71)]">New Territories</h3>
                <p className="text-sm text-[rgb(9,23,71)] mb-3">{newTerritories.length} territory records</p>
                {newTerritories.length > 0 ? (
                  <div className="text-xs text-[rgb(9,23,71)] space-y-1 break-words">
                    {newTerritories.map((territory) => (
                      <div key={territory._id}>{territory.name || territory._id}</div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[rgb(9,23,71)]">No new territories recorded.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-[rgb(9,23,71)] mb-4">Sales Force</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-[rgb(9,23,71)]/10">
                <div className="text-sm text-[rgb(9,23,71)]">Employed Salespeople</div>
                <div className="text-3xl font-semibold text-[rgb(9,23,71)]">{employedCount}</div>
              </div>
              {employedCount > 0 && (
                <div className="p-4 bg-white rounded-xl border border-[rgb(9,23,71)]/10">
                  <h3 className="font-semibold mb-2 text-[rgb(9,23,71)]">Employees</h3>
                  <div className="text-xs text-[rgb(9,23,71)] space-y-1 break-words">
                    {employedPeople.map((person) => (
                      <div key={person._id}>
                        {person.firstName || 'Employee'} {person.lastName || ''}
                        {person.jobTitle ? ` — ${person.jobTitle}` : ''}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmploymentChanges hired={hiredEmployees} terminated={firedEmployees} />

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Sales Contest</h2>
              {salesContest ? (
                <>
                  <div className="text-lg font-semibold text-gray-900">{salesContest.name || salesContest._id}</div>
                  <p className="text-gray-600 mt-2">{salesContest.description || 'No contest description available.'}</p>
                </>
              ) : report.salesContestID ? (
                <p className="text-gray-600">Sales contest ID: {report.salesContestID}</p>
              ) : (
                <p className="text-gray-500">No sales contest assigned.</p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">Reports Purchased</h2>
              {reportsPurchased.length > 0 ? (
                <ul className="text-sm text-[rgb(9,23,71)] space-y-2">
                  {reportsPurchased.map((reportItem) => (
                    <li key={reportItem._id}>
                      {reportItem.Slug || reportItem._id}
                      {reportItem['Created Date'] ? ` — ${formatDate(reportItem['Created Date'])}` : ''}
                    </li>
                  ))}
                </ul>
              ) : report.reportsPurchasedIDs?.length > 0 ? (
                <div className="text-[rgb(9,23,71)] space-y-1 break-words">
                  {report.reportsPurchasedIDs.map((id) => (
                    <div key={id}>{id}</div>
                  ))}
                </div>
              ) : (
                <p className="text-[rgb(9,23,71)]">No reports were purchased this round.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
