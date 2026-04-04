import StandardReportMD from './pages/StandardReportMD';
import PremiumReportEIPR from './pages/PremiumReportEIPR';

function App() {
  // Get report type from URL parameter
  const params = new URLSearchParams(window.location.search);
  const reportType = params.get('type') || 'standard-md';

  // Route to the appropriate report
  switch (reportType.toLowerCase()) {
    case 'premium-eipr':
    case 'premium':
      return <PremiumReportEIPR />;
    case 'standard-md':
    case 'standard':
    default:
      return <StandardReportMD />;
  }
}

export default App;
