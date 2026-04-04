# Deployment Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Test Locally

```bash
npm run dev
```

Visit: `http://localhost:5173?type=standard-md&simulationId=test&teamId=test&roundNum=1`

### 3. Build for Production

```bash
npm run build
```

## Deploy to Vercel

### Method 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Answer prompts:
# - Link to existing project? No
# - Project name: simusell-reports
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod

# You'll get a URL like: https://simusell-reports.vercel.app
```

### Method 2: GitHub + Vercel (Recommended for Teams)

```bash
# 1. Initialize Git
git init
git add .
git commit -m "Initial commit"

# 2. Create GitHub repository
# Go to github.com and create a new repository

# 3. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/simusell-reports.git
git branch -M main
git push -u origin main

# 4. Deploy on Vercel
# - Go to vercel.com
# - Click "New Project"
# - Import from GitHub
# - Select your repository
# - Click "Deploy"

# Vercel will auto-deploy on every git push!
```

## Usage in Bubble

Once deployed, you'll get a URL like:
```
https://simusell-reports.vercel.app
```

### Embed in Bubble

Add an HTML element to your Bubble page:

```html
<!-- For Standard Report MD -->
<iframe 
  src="https://simusell-reports.vercel.app?type=standard-md&simulationId=<insert dynamic data>&teamId=<insert dynamic data>&roundNum=<insert dynamic data>"
  width="100%" 
  height="800px"
  style="border: none; border-radius: 8px;">
</iframe>

<!-- For Premium Report EIPR -->
<iframe 
  src="https://simusell-reports.vercel.app?type=premium-eipr&simulationId=<insert dynamic data>&teamId=<insert dynamic data>&roundNum=<insert dynamic data>&roundId=<insert dynamic data>"
  width="100%" 
  height="1400px"
  style="border: none; border-radius: 8px;">
</iframe>
```

### Dynamic Parameters in Bubble

Replace `<insert dynamic data>` with Bubble's dynamic expressions:

```
<insert dynamic data: Current Page Simulation's _id>
<insert dynamic data: Current User's studentTeam's teamCompanyId's _id>
<insert dynamic data: Current Page Round's roundNum>
<insert dynamic data: Current Page Round's _id>
```

## Testing URLs

### Standard Report MD
```
https://your-app.vercel.app?type=standard-md&simulationId=1773469471490x3092038409663283&teamId=1773469533592x5730739537811866&roundNum=1
```

### Premium Report EIPR
```
https://your-app.vercel.app?type=premium-eipr&simulationId=1773469471490x3092038409663283&teamId=1773469533592x5730739537811866&roundNum=1&roundId=1773469471490x1112408639340544
```

## Updating the App

### With Vercel CLI
```bash
# Make changes to code
# Then deploy
vercel --prod
```

### With GitHub
```bash
# Make changes to code
git add .
git commit -m "Update reports"
git push

# Vercel automatically deploys!
```

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Reports Not Loading
- Check browser console for errors
- Verify API endpoints are accessible
- Check URL parameters are correct

### Styling Issues
```bash
# Rebuild Tailwind CSS
npm run build
```

## Environment Variables (If Needed)

Create `.env` file:
```
VITE_API_BASE_URL=https://salesmanagementsimulation.bubbleapps.io/version-test/api/1.1
```

Then update in Vercel dashboard:
- Go to Project Settings
- Environment Variables
- Add variables
- Redeploy

## Performance Optimization

The app is already optimized with:
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Vite build optimization
- ✅ Tailwind CSS purging

## Support

For issues:
1. Check README.md
2. Check browser console
3. Check Vercel deployment logs
4. Contact dev team

## Next Steps

After deployment:
1. Test both report types
2. Verify data loading
3. Check mobile responsiveness
4. Integrate in Bubble
5. Train users
