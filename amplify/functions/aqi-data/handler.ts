import type { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { country = 'IN', city, state, limit = '100' } = event.queryStringParameters || {};

        // Get API key from environment variable
        const apiKey = process.env.OPENAQ_API_KEY || '';

        // Map country codes to OpenAQ country IDs
        const countryIdMap: Record<string, number> = {
            'IN': 9,    // India
            'US': 232,  // United States
            'GB': 229,  // United Kingdom
            'BR': 33,   // Brazil
            'DE': 67,   // Germany
            'FR': 79,   // France
            'JP': 110,  // Japan
            'AU': 14    // Australia
        };

        const countryId = countryIdMap[country];

        // OpenAQ API v3: First fetch locations using countries_id parameter
        let locationsUrl = `https://api.openaq.org/v3/locations?${countryId ? `countries_id=${countryId}` : ''}&limit=${limit}`;

        if (city) {
            locationsUrl += `&city=${encodeURIComponent(city)}`;
        }

        const requestHeaders: HeadersInit = {
            'Accept': 'application/json'
        };

        if (apiKey) {
            requestHeaders['X-API-Key'] = apiKey;
        }

        const locationsResponse = await fetch(locationsUrl, {
            headers: requestHeaders
        });

        if (!locationsResponse.ok) {
            throw new Error(`OpenAQ API error: ${locationsResponse.status} ${locationsResponse.statusText}`);
        }

        const locationsData = await locationsResponse.json();
        const locations = locationsData.results || [];

        // Fetch measurements for each location (limit to first 10 to avoid timeouts)
        const measurementsPromises = locations.slice(0, 10).map(async (location: any) => {
            const measurementsUrl = `https://api.openaq.org/v3/locations/${location.id}/measurements?limit=100`;
            try {
                const response = await fetch(measurementsUrl, { headers: requestHeaders });
                if (!response.ok) {
                    console.warn(`Failed to fetch measurements for location ${location.id}`);
                    return [];
                }
                const measurements = await response.json();
                const results = measurements.results || [];

                // Transform v3 data to match expected interface
                return results.map((m: any) => ({
                    locationId: location.id,
                    location: location.name,
                    parameter: m.parameter,
                    value: m.value,
                    unit: m.unit,
                    country: country,
                    city: location.city || city || '',
                    date: {
                        utc: m.datetime || new Date().toISOString(),
                        local: m.datetime || new Date().toISOString()
                    },
                    coordinates: location.coordinates
                }));
            } catch (err) {
                console.warn(`Error fetching measurements for location ${location.id}:`, err);
                return [];
            }
        });

        const allMeasurements = await Promise.all(measurementsPromises);
        const flattenedData = allMeasurements.flat();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                data: flattenedData,
                meta: {
                    found: flattenedData.length,
                    locations: locations.length
                },
                timestamp: new Date().toISOString(),
                source: 'OpenAQ v3',
                apiKeyUsed: !!apiKey
            }),
        };
    } catch (error) {
        console.error('Error fetching AQI data:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to fetch AQI data',
                message: error instanceof Error ? error.message : 'Unknown error',
                note: 'OpenAQ v3 requires an API key. Get one at https://explore.openaq.org/register'
            }),
        };
    }
};