# HealthViz Requirements

## Overview
HealthViz is a real-time health and environment analytics dashboard that correlates COVID-19 vaccination data with air quality metrics across multiple regions.

## Functional Requirements

### FR-1: Authentication & Authorization
- FR-1.1: Users must authenticate via AWS Cognito before accessing the dashboard
- FR-1.2: Support email/password sign-up and sign-in flows
- FR-1.3: Session management with secure token handling

### FR-2: Executive Dashboard
- FR-2.1: Display real-time metrics cards (Total Vaccinations, Average AQI, Regions Covered, High-Risk Areas)
- FR-2.2: Dual-axis charts comparing vaccination trends with AQI levels
- FR-2.3: Health vulnerability assessment with risk categorization (low, moderate, high, severe)
- FR-2.4: Auto-refresh data every 5 minutes with caching

### FR-3: Deep Analysis
- FR-3.1: Vaccination vs Air Quality correlation scatter plots
- FR-3.2: Grouped bar charts for multi-metric comparison
- FR-3.3: Stacked area charts for trend visualization
- FR-3.4: Radar charts for multi-dimensional analysis
- FR-3.5: Funnel charts for vaccination journey tracking
- FR-3.6: Gauge charts for key indicators
- FR-3.7: Bubble charts for population-weighted analysis
- FR-3.8: Heatmaps for temporal patterns

### FR-4: Geographic Insights
- FR-4.1: Interactive 2D maps with Leaflet showing city markers
- FR-4.2: 3D Globe visualization with react-globe.gl
- FR-4.3: City markers sized by vulnerability index
- FR-4.4: Color-coded risk categories on maps
- FR-4.5: Heatmaps showing daily AQI variations by location

### FR-5: Region Comparison
- FR-5.1: Side-by-side city/country comparison
- FR-5.2: Compare metrics: Vaccination Rate, AQI, Population, Healthcare Access
- FR-5.3: What-If analysis for policy planning scenarios

### FR-6: Reports & Export
- FR-6.1: Export to PDF with formatted tables and charts
- FR-6.2: Export to Excel with multiple sheets (summary, raw data)
- FR-6.3: Export to CSV for data analysis
- FR-6.4: Generate complete reports with all metrics

### FR-7: Data Filtering
- FR-7.1: Filter by date range
- FR-7.2: Filter by countries (multi-select)
- FR-7.3: Filter by cities (multi-select)
- FR-7.4: Filter by pollutant types (PM2.5, PM10, NO2, SO2, CO, O3)
- FR-7.5: Time aggregation options (daily, weekly, monthly)

## Non-Functional Requirements

### NFR-1: Performance
- NFR-1.1: Initial page load under 3 seconds
- NFR-1.2: Chart rendering under 500ms
- NFR-1.3: API response caching (5-minute TTL)
- NFR-1.4: Lazy loading for heavy visualizations (3D globe)

### NFR-2: Reliability
- NFR-2.1: Graceful degradation when APIs are unavailable
- NFR-2.2: Display "Data not available" message when no data
- NFR-2.3: Error boundaries to prevent full app crashes
- NFR-2.4: Fallback to cached data on API failures

### NFR-3: Usability
- NFR-3.1: Responsive design (mobile, tablet, desktop)
- NFR-3.2: Intuitive navigation with sidebar
- NFR-3.3: Loading states for all async operations
- NFR-3.4: Tooltips on charts for detailed information

### NFR-4: Security
- NFR-4.1: All API calls authenticated
- NFR-4.2: Environment variables for sensitive keys
- NFR-4.3: HTTPS for all external API calls
- NFR-4.4: No PII stored in frontend

### NFR-5: Maintainability
- NFR-5.1: TypeScript for type safety
- NFR-5.2: Component-based architecture
- NFR-5.3: Centralized API service layer
- NFR-5.4: Consistent code style (ESLint)

## Data Requirements

### DR-1: COVID-19 Data (Our World in Data)
- Vaccination totals and rates by country
- Daily vaccination numbers
- Booster dose statistics
- Historical time series data

### DR-2: Air Quality Data (AQICN API)
- Real-time AQI by city
- Individual pollutant readings (PM2.5, PM10, NO2, SO2, CO, O3)
- Geographic coordinates for mapping
- Supported countries: India, USA, UK, Brazil, Germany, France, Japan, Australia

## Constraints
- C-1: Free tier API limits (AQICN demo token)
- C-2: COVID data is country-level only (no city granularity)
- C-3: AQI data is city-level only (no country aggregation)
- C-4: Browser-based application (no native features)
