import { defineFunction } from '@aws-amplify/backend';

export const covidDataFunction = defineFunction({
    name: 'covid-data',
    entry: './handler.ts'
});