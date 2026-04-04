/**
 * Format date as MM-DD-YY
 */
export function formatDate(dateString) {
  if (!dateString) {
    const today = new Date();
    return formatDateObject(today);
  }
  
  const date = new Date(dateString);
  return formatDateObject(date);
}

function formatDateObject(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}-${day}-${year}`;
}

/**
 * Generate subject text based on round number
 * Example: Round 1 = "Year 1 Quarter 1", Round 5 = "Year 2 Quarter 1"
 */
export function generateSubject(roundNum) {
  if (!roundNum) return 'Performance Report';
  
  const year = Math.ceil(roundNum / 4);
  const quarter = ((roundNum - 1) % 4) + 1;
  
  return `Year ${year} Quarter ${quarter}`;
}

/**
 * Format currency
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Get initials from first and last name
 */
export function getInitials(firstName, lastName) {
  if (!firstName && !lastName) return '??';
  const first = firstName ? firstName[0] : '';
  const last = lastName ? lastName[0] : '';
  return (first + last).toUpperCase();
}

/**
 * Get salesperson photo URL
 */
export function getSalespersonPhotoUrl(photoName) {
  if (!photoName) return null;
  // Assuming photos are hosted at this path
  return `https://salesmanagementsimulation.bubbleapps.io/version-test/images/${photoName}.png`;
}
