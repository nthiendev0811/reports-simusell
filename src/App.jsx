import StandardReportMD from './pages/StandardReportMD';
import StandardReportQPLS from './pages/StandardReportQPLS';
import StandardReportCRR from './pages/StandardReportCRR';
import StandardReportMSA from './pages/StandardReportMSA';
import StandardReportTSR from './pages/StandardReportTSR';
import StandardReportFAR from './pages/StandardReportFAR';
import StandardReportIPR from './pages/StandardReportIPR';
import StandardReportISP from './pages/StandardReportISP';
import PremiumReportEIPR from './pages/PremiumReportEIPR';
import PremiumReportMPF from './pages/PremiumReportMPF';
import PremiumReportMSR from './pages/PremiumReportMSR';
import PremiumReportCSA from './pages/PremiumReportCSA';
import PremiumReportHHSSS from './pages/PremiumReportHHSSS';
import PremiumReportGeneric from './pages/PremiumReportGeneric';
import ConfigurationGuide from './components/ConfigurationGuide';

function App() {
  // Get report type from URL parameter
  const params = new URLSearchParams(window.location.search);
  const reportType = params.get('type');

  // Show configuration guide if no report type is specified
  if (!reportType) {
    return <ConfigurationGuide />;
  }

  // Route to the appropriate report
  switch (reportType.toLowerCase()) {
    case 'premium-msr':
      return <PremiumReportMSR />;
    case 'premium-csa':
      return <PremiumReportCSA />;
    case 'premium-hhsss':
      return <PremiumReportHHSSS />;
    case 'premium-hrr':
      return <PremiumReportGeneric reportKey="HRR" />;
    case 'premium-csr':
      return <PremiumReportGeneric reportKey="CSR" />;
    case 'premium-ta':
      return <PremiumReportGeneric reportKey="TA" />;
    case 'premium-ci':
      return <PremiumReportGeneric reportKey="CI" />;
    case 'premium-cdr':
      return <PremiumReportGeneric reportKey="CDR" />;
    case 'premium-rdr':
      return <PremiumReportGeneric reportKey="RDR" />;
    case 'premium-sfr':
      return <PremiumReportGeneric reportKey="SFR" />;
    case 'premium-mpf':
      return <PremiumReportMPF />;
    case 'premium-eipr':
    case 'premium':
      return <PremiumReportEIPR />;
    case 'standard-ipr':
    case 'standard-ip':
      return <StandardReportIPR />;
    case 'standard-isp':
    case 'standard-is':
      return <StandardReportISP />;
    case 'standard-far':
    case 'standard-fa':
      return <StandardReportFAR />;
    case 'standard-tsr':
    case 'standard-ts':
      return <StandardReportTSR />;
    case 'standard-msa':
    case 'standard-ms':
      return <StandardReportMSA />;
    case 'standard-crr':
    case 'standard-cr':
      return <StandardReportCRR />;
    case 'standard-qpls':
    case 'standard-ql':
      return <StandardReportQPLS />;
    case 'standard-md':
    case 'standard':
    default:
      return <StandardReportMD />;
  }
}

export default App;
