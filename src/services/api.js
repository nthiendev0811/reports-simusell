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
 * Fetch Standard Report QPLS (Quarterly Profit and Loss Statement)
 */
export async function fetchStandardReportQPLS(simulationId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamId', constraint_type: 'equals', value: teamId },
    { key: 'roundNum', constraint_type: 'equals', value: roundNum }
  ];
  
  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/Prod_StandardReport_QPLS?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error('No standard report QPLS found');
  }
  
  return data.response.results[0];
}

/**
 * Fetch Standard Report CRR (Competitive Ranking Report)
 */
export async function fetchStandardReportCRR(simulationId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamId', constraint_type: 'equals', value: teamId },
    { key: 'roundNum', constraint_type: 'equals', value: roundNum }
  ];
  
  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/Prod_StandardReport_CRR?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error('No standard report CRR found');
  }
  
  return data.response.results[0];
}

/**
 * Fetch Standard Report IPR (Industry Performance Report)
 */
export async function fetchStandardReportIPR(simulationId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamId', constraint_type: 'equals', value: teamId },
    { key: 'roundNum', constraint_type: 'equals', value: roundNum }
  ];
  
  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/Prod_StandardReport_IPR?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error('No standard report IPR found');
  }
  
  return data.response.results[0];
}

/**
 * Fetch Standard Report FAR (Forecast Accuracy Report)
 */
export async function fetchStandardReportFAR(simulationId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamId', constraint_type: 'equals', value: teamId },
    { key: 'roundNum', constraint_type: 'equals', value: roundNum }
  ];
  
  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/Prod_StandardReport_FAR?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error('No standard report FAR found');
  }
  
  return data.response.results[0];
}

/**
 * Fetch Standard Report TSR (Team Summary Report)
 */
export async function fetchStandardReportTSR(simulationId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamId', constraint_type: 'equals', value: teamId },
    { key: 'roundNum', constraint_type: 'equals', value: roundNum }
  ];
  
  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/Prod_StandardReport_TSR?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error('No standard report TSR found');
  }
  
  return data.response.results[0];
}

/**
 * Fetch Standard Report ISP (Industry Sales Potential)
 */
export async function fetchStandardReportISP(simulationId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamId', constraint_type: 'equals', value: teamId },
    { key: 'roundNum', constraint_type: 'equals', value: roundNum }
  ];
  
  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/Prod_StandardReport_ISP?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error('No standard report ISP found');
  }
  
  return data.response.results[0];
}

/**
 * Fetch Standard Report MSA (Market Share Analysis)
 */
export async function fetchStandardReportMSA(simulationId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamId', constraint_type: 'equals', value: teamId },
    { key: 'roundNum', constraint_type: 'equals', value: roundNum }
  ];
  
  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/Prod_StandardReport_MSA?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error('No standard report MSA found');
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
 * Fetch Premium Report MPF (Market Potential Forecast)
 */
export async function fetchPremiumReportMPF(simulationId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamId', constraint_type: 'equals', value: teamId },
    { key: 'roundNum', constraint_type: 'equals', value: roundNum }
  ];
  
  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/Prod_PremiumReport_MPF?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error('No premium report MPF found');
  }
  
  return data.response.results[0];
}

/**
 * Fetch any available Premium Report MPF when query params are not present
 */
export async function fetchAnyPremiumReportMPF() {
  const url = `${API_BASE_URL}/obj/Prod_PremiumReport_MPF?limit=1`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error('No premium report MPF available');
  }

  return data.response.results[0];
}

/**
 * Fetch any premium report by table name, using the first matching item.
 */
export async function fetchAnyPremiumReportByType(tableName) {
  const url = `${API_BASE_URL}/obj/${tableName}?limit=1`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error(`No premium report available for ${tableName}`);
  }

  return data.response.results[0];
}

/**
 * Fetch premium report by Bubble table name.
 */
export async function fetchPremiumReportByType(tableName, simulationId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamId', constraint_type: 'equals', value: teamId },
    { key: 'roundNum', constraint_type: 'equals', value: roundNum }
  ];

  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/${tableName}?${queryString}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error(`No premium report found for ${tableName}`);
  }

  return data.response.results[0];
}

/**
 * Fetch Premium Report MSR (Market Share Report)
 */
export async function fetchPremiumReportMSR(simulationId, teamId, roundNum) {
  const constraints = [
    { key: 'simulationId', constraint_type: 'equals', value: simulationId },
    { key: 'teamId', constraint_type: 'equals', value: teamId },
    { key: 'roundNum', constraint_type: 'equals', value: roundNum }
  ];

  const queryString = buildConstraints(constraints);
  const url = `${API_BASE_URL}/obj/Prod_PremiumReport_MSR?${queryString}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error('No premium report MSR found');
  }

  return data.response.results[0];
}

export async function fetchAnyPremiumReportMSR() {
  const url = `${API_BASE_URL}/obj/Prod_PremiumReport_MSR?limit=1`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.response || !data.response.results || data.response.results.length === 0) {
    throw new Error('No premium report MSR available');
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
