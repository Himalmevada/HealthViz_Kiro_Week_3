import axios from 'axios';
import { CovidData, AqiData } from '../types/dashboard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const AQICN_API_TOKEN = import.meta.env.VITE_AQICN_API_TOKEN || 'demo';

export class DashboardAPI {
    private static instance: DashboardAPI;
    private covidDataCache: Map<string, { data: CovidData[]; timestamp: number }> = new Map();
    private aqiDataCache: Map<string, { data: AqiData[]; timestamp: number }> = new Map();
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    static getInstance(): DashboardAPI {
        if (!DashboardAPI.instance) {
            DashboardAPI.instance = new DashboardAPI();
        }
        return DashboardAPI.instance;
    }

    private isCacheValid(timestamp: number): boolean {
        return Date.now() - timestamp < this.CACHE_DURATION;
    }

    async fetchCovidData(countries: string[] = ['India']): Promise<CovidData[]> {
        const cacheKey = countries.sort().join(',');
        const cached = this.covidDataCache.get(cacheKey);

        if (cached && this.isCacheValid(cached.timestamp)) {
            return cached.data;
        }

        try {
            // In development, use the direct API
            if (!import.meta.env.VITE_API_BASE_URL) {
                const response = await axios.get(
                    'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.json'
                );

                // The data structure is: [{country, iso_code, data: [...]}, ...]
                // We need to extract the nested data arrays and flatten them
                const filteredData: CovidData[] = [];

                response.data.forEach((countryObj: any) => {
                    // Check if this country is in our filter list
                    const matchesFilter = countries.includes(countryObj.country) ||
                        countries.includes(countryObj.iso_code);

                    if (matchesFilter && countryObj.data && Array.isArray(countryObj.data)) {
                        // Add location information to each time series record
                        countryObj.data.forEach((record: any) => {
                            filteredData.push({
                                ...record,
                                location: countryObj.country,
                                iso_code: countryObj.iso_code
                            });
                        });
                    }
                });

                this.covidDataCache.set(cacheKey, {
                    data: filteredData,
                    timestamp: Date.now()
                });

                return filteredData;
            } else {
                // In production, use Lambda function
                const response = await axios.get(`${API_BASE_URL}/covid-data`, {
                    params: { countries: countries.join(',') }
                });

                const data = response.data.data;
                this.covidDataCache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });

                return data;
            }
        } catch (error) {
            console.error('Error fetching COVID data:', error);
            // Return cached data if available, even if expired
            const cached = this.covidDataCache.get(cacheKey);
            return cached?.data || [];
        }
    }

    async fetchAqiData(country: string = 'India', city?: string): Promise<AqiData[]> {
        const cacheKey = `${country}-${city || 'all'}`;
        const cached = this.aqiDataCache.get(cacheKey);

        if (cached && this.isCacheValid(cached.timestamp)) {
            return cached.data;
        }

        try {
            // Use AQICN (World Air Quality Index) API - much simpler and more reliable
            console.log(`Fetching AQI data from AQICN for ${country}${city ? `, city: ${city}` : ''}`);

            // Define major cities with alternative search terms for better API matching
            // Format: { displayName: [searchTerms] } - first term is primary, others are fallbacks
            const countryCities: Record<string, Record<string, string[]>> = {
                'India': {
                    'Delhi': ['delhi', 'new delhi', 'india/delhi'],
                    'Mumbai': ['mumbai', 'india/mumbai', 'bombay'],
                    'Kolkata': ['kolkata', 'india/kolkata', 'calcutta'],
                    'Chennai': ['chennai', 'india/chennai', 'madras'],
                    'Bangalore': ['bangalore', 'bengaluru', 'india/bangalore'],
                    'Hyderabad': ['hyderabad', 'india/hyderabad'],
                    'Pune': ['pune', 'india/pune'],
                    'Ahmedabad': ['ahmedabad', 'india/ahmedabad'],
                    'Jaipur': ['jaipur', 'india/jaipur'],
                    'Lucknow': ['lucknow', 'india/lucknow']
                },
                'United States': {
                    'New York': ['new york', 'usa/newyork', 'nyc'],
                    'Los Angeles': ['los angeles', 'usa/losangeles', 'la'],
                    'Chicago': ['chicago', 'usa/chicago'],
                    'Houston': ['houston', 'usa/houston'],
                    'Phoenix': ['phoenix', 'usa/phoenix'],
                    'Philadelphia': ['philadelphia', 'usa/philadelphia'],
                    'San Antonio': ['san antonio', 'usa/sanantonio'],
                    'San Diego': ['san diego', 'usa/sandiego']
                },
                'United Kingdom': {
                    'London': ['london', 'uk/london'],
                    'Manchester': ['manchester', 'uk/manchester'],
                    'Birmingham': ['birmingham', 'uk/birmingham'],
                    'Leeds': ['leeds', 'uk/leeds'],
                    'Glasgow': ['glasgow', 'uk/glasgow'],
                    'Liverpool': ['liverpool', 'uk/liverpool'],
                    'Newcastle': ['newcastle', 'uk/newcastle'],
                    'Sheffield': ['sheffield', 'uk/sheffield']
                },
                'Brazil': {
                    'São Paulo': ['sao paulo', 'brazil/saopaulo'],
                    'Rio de Janeiro': ['rio de janeiro', 'brazil/rio'],
                    'Brasília': ['brasilia', 'brazil/brasilia'],
                    'Salvador': ['salvador', 'brazil/salvador'],
                    'Fortaleza': ['fortaleza', 'brazil/fortaleza'],
                    'Belo Horizonte': ['belo horizonte', 'brazil/belohorizonte'],
                    'Curitiba': ['curitiba', 'brazil/curitiba']
                },
                'Germany': {
                    'Berlin': ['berlin', 'germany/berlin'],
                    'Hamburg': ['hamburg', 'germany/hamburg'],
                    'Munich': ['munich', 'germany/munich', 'münchen'],
                    'Cologne': ['cologne', 'germany/cologne', 'köln'],
                    'Frankfurt': ['frankfurt', 'germany/frankfurt'],
                    'Stuttgart': ['stuttgart', 'germany/stuttgart'],
                    'Düsseldorf': ['dusseldorf', 'germany/dusseldorf']
                },
                'France': {
                    'Paris': ['paris', 'france/paris'],
                    'Marseille': ['marseille', 'france/marseille'],
                    'Lyon': ['lyon', 'france/lyon'],
                    'Toulouse': ['toulouse', 'france/toulouse'],
                    'Nice': ['nice', 'france/nice'],
                    'Nantes': ['nantes', 'france/nantes'],
                    'Strasbourg': ['strasbourg', 'france/strasbourg']
                },
                'Japan': {
                    'Tokyo': ['tokyo', 'japan/tokyo'],
                    'Osaka': ['osaka', 'japan/osaka'],
                    'Yokohama': ['yokohama', 'japan/yokohama'],
                    'Nagoya': ['nagoya', 'japan/nagoya'],
                    'Sapporo': ['sapporo', 'japan/sapporo'],
                    'Fukuoka': ['fukuoka', 'japan/fukuoka'],
                    'Kobe': ['kobe', 'japan/kobe']
                },
                'Australia': {
                    'Sydney': ['sydney', 'australia/sydney'],
                    'Melbourne': ['melbourne', 'australia/melbourne'],
                    'Brisbane': ['brisbane', 'australia/brisbane'],
                    'Perth': ['perth', 'australia/perth'],
                    'Adelaide': ['adelaide', 'australia/adelaide'],
                    'Gold Coast': ['gold coast', 'australia/goldcoast'],
                    'Canberra': ['canberra', 'australia/canberra']
                }
            };

            // Get cities to fetch
            const cityConfig = countryCities[country] || {};
            const citiesToFetch = city
                ? { [city]: [city.toLowerCase()] }
                : cityConfig;

            const allData: AqiData[] = [];

            // Helper function to try fetching with multiple search terms
            const fetchCityData = async (displayName: string, searchTerms: string[]): Promise<boolean> => {
                for (const searchTerm of searchTerms) {
                    try {
                        const url = `https://api.waqi.info/feed/${encodeURIComponent(searchTerm)}/?token=${AQICN_API_TOKEN}`;
                        const response = await axios.get(url);

                        if (response.data.status === 'ok' && response.data.data) {
                            const stationData = response.data.data;

                            // Use the overall AQI value if available
                            if (stationData.aqi && typeof stationData.aqi === 'number') {
                                allData.push({
                                    locationId: stationData.idx,
                                    location: stationData.city?.name || displayName,
                                    parameter: 'aqi',
                                    value: stationData.aqi,
                                    unit: 'AQI',
                                    country: stationData.city?.country || country,
                                    city: displayName,
                                    date: {
                                        utc: stationData.time?.iso || new Date().toISOString(),
                                        local: stationData.time?.iso || new Date().toISOString()
                                    },
                                    coordinates: stationData.city?.geo ? {
                                        latitude: stationData.city.geo[0],
                                        longitude: stationData.city.geo[1]
                                    } : undefined
                                });
                            }

                            // Extract PM2.5, PM10, NO2, SO2, CO, O3 from iaqi (individual air quality index)
                            const parameters = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3'];

                            for (const param of parameters) {
                                if (stationData.iaqi && stationData.iaqi[param]) {
                                    allData.push({
                                        locationId: stationData.idx,
                                        location: stationData.city?.name || displayName,
                                        parameter: param,
                                        value: stationData.iaqi[param].v,
                                        unit: 'µg/m³',
                                        country: stationData.city?.country || country,
                                        city: displayName,
                                        date: {
                                            utc: stationData.time?.iso || new Date().toISOString(),
                                            local: stationData.time?.iso || new Date().toISOString()
                                        },
                                        coordinates: stationData.city?.geo ? {
                                            latitude: stationData.city.geo[0],
                                            longitude: stationData.city.geo[1]
                                        } : undefined
                                    });
                                }
                            }

                            console.log(`✓ Got AQI data for ${displayName} using "${searchTerm}"`);
                            return true; // Success, no need to try other terms
                        }
                    } catch (err) {
                        // Try next search term
                    }
                }
                console.warn(`✗ No AQI data found for ${displayName}`);
                return false;
            };

            // Fetch data for each city with fallback search terms
            for (const [displayName, searchTerms] of Object.entries(citiesToFetch)) {
                await fetchCityData(displayName, searchTerms);
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 150));
            }

            console.log(`AQICN API returned ${allData.length} measurements for ${Object.keys(citiesToFetch).length} cities`);

            this.aqiDataCache.set(cacheKey, {
                data: allData,
                timestamp: Date.now()
            });

            return allData;
        } catch (error) {
            console.error('Error fetching AQI data from AQICN:', error);
            const cached = this.aqiDataCache.get(cacheKey);
            return cached?.data || [];
        }
    }

    async fetchHistoricalData(
        dataType: 'covid' | 'aqi',
        location: string,
        startDate: string,
        endDate: string
    ): Promise<any[]> {
        // This would typically call a more sophisticated backend API
        // For now, we'll filter existing data by date range
        if (dataType === 'covid') {
            const data = await this.fetchCovidData([location]);
            return data.filter(item =>
                item.date >= startDate && item.date <= endDate
            );
        } else {
            const data = await this.fetchAqiData('IN', location);
            return data.filter(item => {
                const itemDate = item.date.utc.split('T')[0];
                return itemDate >= startDate && itemDate <= endDate;
            });
        }
    }

    clearCache(): void {
        this.covidDataCache.clear();
        this.aqiDataCache.clear();
    }
}

export const dashboardAPI = DashboardAPI.getInstance();