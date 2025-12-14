# HealthViz Project Context

## Project Overview
HealthViz is a real-time health and environment analytics dashboard built with React, TypeScript, and AWS Amplify Gen 2.

## Tech Stack
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Charts: Recharts, Plotly.js, D3.js
- Maps: Leaflet, react-globe.gl
- Backend: AWS Amplify Gen 2 (Cognito for Auth)
- Export: jsPDF, xlsx

## Key Features
1. Executive Dashboard with real-time metrics
2. Deep Analysis with 15+ chart types
3. Geographic Insights with 2D/3D maps
4. Region Comparison tools
5. Report generation (PDF, Excel, CSV)

## Data Sources
- COVID-19: Our World in Data API
- Air Quality: AQICN API

## Development Guidelines
- Use TypeScript for all components
- Follow React best practices
- Implement error handling for all API calls
- Show "Data not available" message when no data
- Use Tailwind CSS for styling
- Ensure responsive design

## File Structure
- `/src/components/Charts/` - All visualization components
- `/src/components/Dashboard/` - Main dashboard components
- `/src/components/Layout/` - Header, Sidebar
- `/src/pages/` - Page components
- `/src/services/` - API service layer
- `/src/types/` - TypeScript interfaces
- `/src/utils/` - Data processing utilities
