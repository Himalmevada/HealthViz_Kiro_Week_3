# HealthViz - Health & Environment Analytics Dashboard

A comprehensive real-time analytics dashboard for monitoring COVID-19 vaccination progress and air quality metrics across multiple countries and cities. Built with React, TypeScript, and AWS Amplify Gen 2.

## 🌟 Features

### 📊 Executive Dashboard
- Real-time metrics cards (Total Vaccinations, Average AQI, Regions Covered, High-Risk Areas)
- Dual-axis charts comparing vaccination trends with AQI levels
- Health vulnerability assessment with risk categorization

### 📈 Deep Analysis
- Vaccination vs Air Quality correlation scatter plots
- Grouped bar charts for multi-metric comparison
- Stacked area charts for trend visualization
- Radar charts for multi-dimensional analysis
- Funnel charts for vaccination journey tracking
- Gauge charts for key indicators

### 🗺️ Geographic Insights
- Interactive 2D maps with Leaflet
- 3D Globe visualization with react-globe.gl
- City markers sized by vulnerability index
- Color-coded risk categories
- Heatmaps showing daily AQI variations
- City comparison charts

### 🔄 Region Comparison
- Side-by-side city comparison
- Metrics: Vaccination Rate, AQI, Population, Healthcare Access, Urbanization, GDP per Capita
- What-If analysis for policy planning

### 📥 Reports & Downloads
- Export to PDF with formatted tables
- Export to Excel with multiple sheets
- Export to CSV for data analysis
- Complete report with all metrics and data

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts and graphs
- **Plotly.js** - Advanced visualizations
- **Leaflet** - 2D maps
- **react-globe.gl** - 3D globe
- **Lucide React** - Icons
- **tsparticles** - Animated backgrounds

### Backend (AWS Amplify Gen 2)
- **Amazon Cognito** - Authentication & User Management
- **AWS Lambda** - Serverless functions (defined for production)

### Data Sources
- **Our World in Data** - COVID-19 vaccination data
- **AQICN API** - Real-time air quality data

### Export Libraries
- **jsPDF** - PDF generation
- **jspdf-autotable** - PDF tables
- **xlsx** - Excel export

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- AWS Account
- AWS Amplify CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Himalmevada/HealthViz_Kiro_Week_3.git
cd HealthViz_Kiro_Week_3
```

2. Install dependencies:
```bash
npm install
```

3. Configure AWS Amplify:
```bash
npx ampx sandbox
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

### Environment Variables

Create a `.env` file in the root directory:
```env
VITE_AQICN_API_KEY=demo
```

## 📁 Project Structure

```
healthviz/
├── .kiro/                    # Kiro AI configuration
├── amplify/
│   ├── auth/                 # Cognito authentication config
│   ├── data/                 # Schema
│   └── functions/            # functions
│       ├── covid-data/       # COVID-19 data API
│       └── aqi-data/         # Air Quality API
├── src/
│   ├── components/
│   │   ├── Charts/           # 15 visualization components
│   │   │   ├── AqiChart.tsx
│   │   │   ├── BubbleChart.tsx
│   │   │   ├── CorrelationChart.tsx
│   │   │   ├── DualAxisChart.tsx
│   │   │   ├── FunnelChart.tsx
│   │   │   ├── GaugeChart.tsx
│   │   │   ├── Globe3DMap.tsx
│   │   │   ├── GroupedBarChart.tsx
│   │   │   ├── HeatmapChart.tsx
│   │   │   ├── HorizontalBarChart.tsx
│   │   │   ├── InteractiveMap.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   ├── StackedAreaChart.tsx
│   │   │   ├── VaccinationChart.tsx
│   │   │   └── VulnerabilityMap.tsx
│   │   ├── Common/           # Shared components
│   │   ├── Dashboard/        # Dashboard components
│   │   └── Layout/           # Layout components
│   ├── pages/                # Page components
│   │   ├── AnalysisPage.tsx
│   │   ├── ComparisonPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── GeographicPage.tsx
│   │   └── ReportsPage.tsx
│   ├── services/             # API services
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
├── package.json
└── README.md
```

## 🔌 Data Sources

- **COVID-19 Data**: [Our World in Data](https://github.com/owid/covid-19-data)
- **Air Quality Data**: [AQICN API](https://aqicn.org/api/)

## 📸 Screenshots

### Login Page
Modern design with animated background.

### Executive Dashboard
Real-time metrics and dual-axis charts.

### Geographic Insights
Interactive 2D and 3D map visualizations.

### Reports
Export functionality with multiple format options.

## 🤖 Built with Kiro AI

This project was developed using **Kiro**, an AI-powered IDE that accelerated development by:
- Generating 15+ chart components
- Implementing complex 3D visualizations
- Creating responsive layouts
- Adding export functionality
- Debugging and optimizing code

The `.kiro` directory is included in this repository as required for the AWS Builder Center submission.

## 📝 Blog Post

Read the full technical blog post about building this project:
[Building HealthViz with AWS Amplify and Kiro AI](link-to-your-blog-post)

## 🙏 Acknowledgments

- AWS Amplify team for the excellent Gen 2 framework
- Kiro AI for accelerating development
- AQICN for air quality data API
- Our World in Data for COVID-19 datasets
  
---

**Made with ❤️ using Kiro and AWS Amplify**
