export interface CovidData {
    location: string;
    iso_code: string;
    date: string;
    total_vaccinations?: number;
    people_vaccinated?: number;
    people_fully_vaccinated?: number;
    total_boosters?: number;
    daily_vaccinations?: number;
    total_vaccinations_per_hundred?: number;
    people_vaccinated_per_hundred?: number;
    people_fully_vaccinated_per_hundred?: number;
}

export interface AqiData {
    locationId: number;
    location: string;
    parameter: string;
    value: number;
    unit: string;
    country: string;
    city: string;
    date: {
        utc: string;
        local: string;
    };
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

export interface FilterState {
    dateRange: {
        start: string;
        end: string;
    };
    countries: string[]; // Affects both COVID and AQI data
    cities: string[];    // Only affects AQI data (COVID is country-level only)
    pollutants: string[]; // Only affects AQI data
    timeAggregation: 'daily' | 'weekly' | 'monthly';
}

export interface VulnerabilityScore {
    location: string;
    vaccinationRate: number;
    aqiLevel: number;
    populationDensity: number;
    vulnerabilityIndex: number;
    riskCategory: 'low' | 'moderate' | 'high' | 'severe';
}

export interface CorrelationAnalysis {
    correlation: number;
    pValue: number;
    significance: 'significant' | 'not_significant';
    dataPoints: Array<{
        date: string;
        vaccination: number;
        aqi: number;
    }>;
}

export interface DashboardMetrics {
    totalVaccinations: number;
    vaccinationRate: number;
    averageAqi: number;
    vulnerableLocations: number;
    lastUpdated: string;
}