import type { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const response = await fetch('https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.json');
        const data = await response.json();

        // Filter for specific countries or process data as needed
        const countries = event.queryStringParameters?.countries?.split(',') || [];
        let filteredData = data;

        if (countries.length > 0) {
            filteredData = data.filter((item: any) =>
                countries.includes(item.location) || countries.includes(item.iso_code)
            );
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                data: filteredData,
                timestamp: new Date().toISOString(),
                source: 'Our World in Data'
            }),
        };
    } catch (error) {
        console.error('Error fetching COVID data:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to fetch COVID vaccination data',
                message: error instanceof Error ? error.message : 'Unknown error'
            }),
        };
    }
};