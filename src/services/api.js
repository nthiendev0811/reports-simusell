const API_BASE_URL = 'https://salesmanagementsimulation.bubbleapps.io/version-test/api/1.1';

/**
 * Build Bubble API constraints query string
 */
function buildConstraints(constraints) {
  return constraints.map((c, i) => 
    `constraints[${i}][key]=${c.key}&constraints[${i}][constraint_type]=${c.constraint_type}&constraints[${i}][value]=${encodeURIComponent(c.value)}`
  ).join('&');
}

/**
 * Fetch Standard Report MD (Management Development)
 */
export async function fetchStandardReportMD(simulationId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamId', constraint_type: 'equals', value: teamId },
    { key: 'roundNum', constraint_type: 'equals', value: roundNum }
  ];
  
  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/Prod_StandardReport_MD?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error('No standard report MD found');
  }
  
  return data.response.results[0];
}

/**
 * Fetch Premium Report EIPR (Extended Industry Performance Report)
 */
export async function fetchPremiumReportEIPR(simulationId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamId', constraint_type: 'equals', value: teamId },
    { key: 'roundNum', constraint_type: 'equals', value: roundNum }
  ];
  
  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/Prod_PremiumReport_EIPR?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error('No premium report EIPR found');
  }
  
  return data.response.results[0];
}

/**
 * Fetch Salespeople for a round and team
 */
export async function fetchSalespeople(simulationId, roundId, teamId) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'roundId', constraint_type: 'equals', value: roundId },
    { key: 'teamCompanyId', constraint_type: 'equals', value: teamId },
    { key: 'employed', constraint_type: 'equals', value: 'true' }
  ];
  
  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/Prod_SalePerson?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  return data.response?.results || [];
}

/**
 * Fetch Sales Territories for a round and team
 */
export async function fetchTerritories(simulationId, roundId, teamId) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'roundId', constraint_type: 'equals', value: roundId },
    { key: 'teamCompanyId', constraint_type: 'equals', value: teamId }
  ];
  
  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/Prod_SalesTerritory?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  return data.response?.results || [];
}

/**
 * Fetch Team Company info
 */
export async function fetchTeamCompany(teamId) {
  const url = `${API_BASE_URL}/obj/Prod_TeamCompany/${teamId}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  return data.response;
}
