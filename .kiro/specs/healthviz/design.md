# HealthViz Design Document

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  React 18 + TypeScript + Vite + Tailwind CSS                   │
├─────────────────────────────────────────────────────────────────┤
│  Pages          │  Components       │  Services                 │
│  - Dashboard    │  - Charts (15)    │  - DashboardAPI          │
│  - Analysis     │  - Layout         │  - Data caching          │
│  - Geographic   │  - Common         │  - Error handling        │
│  - Comparison   │  - Dashboard      │                          │
│  - Reports      │                   │                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS AMPLIFY GEN 2                          │
│  - Cognito (Authentication)                                     │
│  - CloudFront (CDN)                                            │
│  - Amplify Hosting                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL APIs                              │
│  - Our World in Data (COVID-19 vaccinations)                   │
│  - AQICN API (Air Quality Index)                               │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Page Components
| Page | Purpose | Key Components |
|------|---------|----------------|
| DashboardPage | Executive overview | MetricsCards, DualAxisChart, VulnerabilityMap |
| AnalysisPage | Deep data analysis | 10+ chart types, filters |
| GeographicPage | Map visualizations | InteractiveMap, Globe3DMap |
| ComparisonPage | Region comparison | Side-by-side metrics, What-If |
| ReportsPage | Export functionality | PDF/Excel/CSV generators |

### Chart Components (15 total)
| Component | Library | Purpose |
|-----------|---------|---------|
| VaccinationChart | Recharts | Line chart for vaccination trends |
| AqiChart | Recharts | Bar chart for AQI levels |
| DualAxisChart | Recharts | Combined vaccination + AQI |
| CorrelationChart | Recharts | Scatter plot for correlation |
| GroupedBarChart | Recharts | Multi-metric comparison |
| StackedAreaChart | Recharts | Trend visualization |
| RadarChart | Recharts | Multi-dimensional analysis |
| FunnelChart | Recharts | Vaccination journey |
| GaugeChart | Plotly.js | Key indicators |
| BubbleChart | Recharts | Population-weighted data |
| HeatmapChart | Plotly.js | Temporal patterns |
| HorizontalBarChart | Recharts | Ranking visualization |
| InteractiveMap | Leaflet | 2D map with markers |
| Globe3DMap | react-globe.gl | 3D globe visualization |
| VulnerabilityMap | Leaflet | Risk-colored regions |

## Data Flow

```
User Action → Page Component → DashboardAPI → External API
                    ↓                ↓
              State Update ← Cache Check ← API Response
                    ↓
              Chart Re-render
```

### API Service Pattern
```typescript
class DashboardAPI {
  // Singleton pattern
  private static instance: DashboardAPI;
  
  // Caching with 5-minute TTL
  private covidDataCache: Map<string, {data, timestamp}>;
  private aqiDataCache: Map<string, {data, timestamp}>;
  
  // Methods
  fetchCovidData(countries: string[]): Promise<CovidData[]>
  fetchAqiData(country: string, city?: string): Promise<AqiData[]>
  fetchHistoricalData(...): Promise<any[]>
  clearCache(): void
}
```

## Data Models

### CovidData
```typescript
interface CovidData {
  location: string;
  iso_code: string;
  date: string;
  total_vaccinations?: number;
  people_vaccinated?: number;
  people_fully_vaccinated?: number;
  total_boosters?: number;
  daily_vaccinations?: number;
  total_vaccinations_per_hundred?: number;
}
```

### AqiData
```typescript
interface AqiData {
  locationId: number;
  location: string;
  parameter: string;  // 'aqi', 'pm25', 'pm10', 'no2', 'so2', 'co', 'o3'
  value: number;
  unit: string;
  country: string;
  city: string;
  date: { utc: string; local: string };
  coordinates?: { latitude: number; longitude: number };
}
```

### VulnerabilityScore
```typescript
interface VulnerabilityScore {
  location: string;
  vaccinationRate: number;
  aqiLevel: number;
  populationDensity: number;
  vulnerabilityIndex: number;
  riskCategory: 'low' | 'moderate' | 'high' | 'severe';
}
```

## UI/UX Design

### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  Header (Logo, User Menu, Sign Out)                 │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│  Sidebar │  Main Content Area                       │
│  (Nav)   │  - Page-specific content                │
│          │  - Charts and visualizations            │
│          │  - Filters and controls                 │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### Color Scheme
- Primary: Blue (#3b82f6)
- Success/Low Risk: Green (#22c55e)
- Warning/Moderate: Yellow (#eab308)
- Danger/High Risk: Orange (#f97316)
- Severe: Red (#ef4444)
- Background: Slate (#0f172a to #1e293b)

### Risk Category Colors
| Category | Color | AQI Range |
|----------|-------|-----------|
| Low | Green | 0-50 |
| Moderate | Yellow | 51-100 |
| High | Orange | 101-150 |
| Severe | Red | 151+ |

## Authentication Flow

```
App Load → Check Auth State → Authenticated? 
                                  ↓ No
                            Show Authenticator
                                  ↓
                            Sign In/Sign Up
                                  ↓
                            Cognito Validation
                                  ↓ Success
                            Load Dashboard
```

## Export Functionality

### PDF Export (jsPDF)
- Header with logo and title
- Summary metrics table
- Embedded chart images
- Data tables with pagination

### Excel Export (xlsx)
- Sheet 1: Summary metrics
- Sheet 2: COVID data
- Sheet 3: AQI data
- Sheet 4: Vulnerability scores

### CSV Export
- Raw data export
- Filtered by current selection
- UTF-8 encoding

## Error Handling Strategy

1. **API Errors**: Return cached data if available, show toast notification
2. **Render Errors**: ErrorBoundary catches and displays fallback UI
3. **Missing Data**: Display "Data not available" placeholder
4. **Network Issues**: Retry with exponential backoff (3 attempts)

## Performance Optimizations

1. **Data Caching**: 5-minute TTL for API responses
2. **Lazy Loading**: 3D Globe loaded on-demand
3. **Memoization**: React.memo for chart components
4. **Debouncing**: Filter changes debounced (300ms)
5. **Virtual Scrolling**: For large data tables
