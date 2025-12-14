import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { covidDataFunction } from './functions/covid-data/resource';
import { aqiDataFunction } from './functions/aqi-data/resource';

defineBackend({
  auth,
  data,
  covidDataFunction,
  aqiDataFunction,
});
