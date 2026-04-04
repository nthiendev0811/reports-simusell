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
export async function fetchSalespeople(simulationId, roundId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamCompanyId', constraint_type: 'equals', value: teamId },
    { key: 'employed', constraint_type: 'equals', value: 'true' }
  ];

  if (roundId) {
    constraints.push({ key: 'roundId', constraint_type: 'equals', value: roundId });
  } else if (roundNum) {
    constraints.push({ key: 'roundNum', constraint_type: 'equals', value: roundNum });
  }
  
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
export async function fetchTerritories(simulationId, roundId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamCompanyId', constraint_type: 'equals', value: teamId }
  ];

  if (roundId) {
    constraints.push({ key: 'roundId', constraint_type: 'equals', value: roundId });
  } else if (roundNum) {
    constraints.push({ key: 'roundNum', constraint_type: 'equals', value: roundNum });
  }
  
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

/**
 * Fetch any Bubble object by table name and ID
 */
export async function fetchBubbleObjectById(tableName, id) {
  const url = `${API_BASE_URL}/obj/${tableName}/${id}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  return data.response;
}

export async function fetchBubbleObjectsByIds(tableName, ids = []) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return [];
  }

  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        return await fetchBubbleObjectById(tableName, id);
      } catch (error) {
        console.warn(`Unable to fetch ${tableName} ${id}:`, error);
        return null;
      }
    })
  );

  return results.filter(Boolean);
}
