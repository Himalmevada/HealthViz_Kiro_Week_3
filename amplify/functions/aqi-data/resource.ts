import { defineFunction } from '@aws-amplify/backend';

export const aqiDataFunction = defineFunction({
    name: 'aqi-data',
    entry: './handler.ts'
});