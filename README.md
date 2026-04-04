# SimuSell Reports

React application for displaying Sales Management Simulation reports.

## Features

- ✅ Standard Report MD (Management Development)
- ✅ Premium Report EIPR (Extended Industry Performance Report)
- ✅ Responsive design
- ✅ Tailwind CSS styling
- ✅ Ready for Vercel deployment

## Report Types

### Standard Report MD
Simple message-based report showing team greetings and management updates.

**URL Parameters:**
```
?type=standard-md&simulationId=XXX&teamId=YYY&roundNum=1
```

### Premium Report EIPR
Comprehensive performance report with:
- Competitive performance table
- Sales territories visualization
- Employment changes (hired/terminated)
- Sales force details
- Salesperson cards

**URL Parameters:**
```
?type=premium-eipr&simulationId=XXX&teamId=YYY&roundNum=1&roundId=ZZZ
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Deploy!

## Usage in Bubble

Once deployed, embed in Bubble using an iframe:

```html
<!-- Standard Report MD -->
<iframe 
  src="https://your-vercel-app.vercel.app?type=standard-md&simulationId=<insert>&teamId=<insert>&roundNum=<insert>"
  width="100%" 
  height="800px"
  frameborder="0">
</iframe>

<!-- Premium Report EIPR -->
<iframe 
  src="https://your-vercel-app.vercel.app?type=premium-eipr&simulationId=<insert>&teamId=<insert>&roundNum=<insert>&roundId=<insert>"
  width="100%" 
  height="1200px"
  frameborder="0">
</iframe>
```

## API Endpoints

The app fetches data from:

- `Prod_StandardReport_MD` - Standard reports
- `Prod_PremiumReport_EIPR` - Premium reports
- `Prod_SalePerson` - Salesperson data
- `Prod_SalesTerritory` - Territory data

## Project Structure

```
simusell-reports/
├── src/
│   ├── components/
│   │   ├── standard/          # Standard report components
│   │   ├── premium/           # Premium report components
│   │   └── shared/            # Shared components
│   ├── pages/
│   │   ├── StandardReportMD.jsx
│   │   └── PremiumReportEIPR.jsx
│   ├── services/
│   │   └── api.js             # API calls
│   ├── utils/
│   │   └── formatters.js      # Helper functions
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Adding More Report Types

To add additional report types:

1. Create new component in `src/pages/`
2. Add API function in `src/services/api.js`
3. Update routing in `src/App.jsx`
4. Deploy!

## Support

For issues or questions, contact the development team.
