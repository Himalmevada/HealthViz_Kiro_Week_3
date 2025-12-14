import React, { useState, useMemo } from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import VaccinationChart from '../components/Charts/VaccinationChart';
import AqiChart from '../components/Charts/AqiChart';
import { CovidData, AqiData } from '../types/dashboard';

interface ComparisonPageProps {
  covidData: CovidData[];
  aqiData: AqiData[];
  loading: boolean;
}

const ComparisonPage: React.FC<ComparisonPageProps> = ({
  covidData,
  aqiData,
  loading
}) => {
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    aqiData.forEach(item => {
      if (item.city) cities.add(item.city);
    });
    return Array.from(cities).sort();
  }, [aqiData]);

  const [region1, setRegion1] = useState(availableCities[0] || 'Delhi');
  const [region2, setRegion2] = useState(availableCities[1] || 'Mumbai');

  const cityData: Record<string, { population: number; healthcareAccess: number; urbanization: number; gdpPerCapita: number }> = {
    'Delhi': { population: 32.9, healthcareAccess: 78, urbanization: 97, gdpPerCapita: 4100 },
    'Mumbai': { population: 21.3, healthcareAccess: 85, urbanization: 100, gdpPerCapita: 5200 },
    'Kolkata': { population: 15.1, healthcareAccess: 72, urbanization: 95, gdpPerCapita: 2800 },
    'Chennai': { population: 11.5, healthcareAccess: 82, urbanization: 93, gdpPerCapita: 4500 },
    'Bangalore': { population: 13.2, healthcareAccess: 88, urbanization: 91, gdpPerCapita: 5800 },
    'Hyderabad': { population: 10.5, healthcareAccess: 80, urbanization: 89, gdpPerCapita: 4800 },
    'Pune': { population: 7.4, healthcareAccess: 84, urbanization: 87, gdpPerCapita: 4200 },
    'Ahmedabad': { population: 8.6, healthcareAccess: 76, urbanization: 92, gdpPerCapita: 3800 },
    'Jaipur': { population: 4.1, healthcareAccess: 70, urbanization: 85, gdpPerCapita: 3200 },
    'Lucknow': { population: 3.7, healthcareAccess: 68, urbanization: 82, gdpPerCapita: 2600 },
    'New York': { population: 8.3, healthcareAccess: 92, urbanization: 100, gdpPerCapita: 85000 },
    'Los Angeles': { population: 3.9, healthcareAccess: 88, urbanization: 99, gdpPerCapita: 75000 },
    'London': { population: 9.0, healthcareAccess: 95, urbanization: 100, gdpPerCapita: 72000 },
    'Tokyo': { population: 13.9, healthcareAccess: 98, urbanization: 100, gdpPerCapita: 68000 },
    'Sydney': { population: 5.3, healthcareAccess: 94, urbanization: 98, gdpPerCapita: 65000 },
  };

  const comparisonMetrics = useMemo(() => {
    const getRegionMetrics = (regionName: string) => {
      const regionAqi = aqiData.filter(item => item.city === regionName);
      const avgAqi = regionAqi.length > 0 
        ? regionAqi.reduce((sum, item) => sum + item.value, 0) / regionAqi.length 
        : 100;

      const latestCovid = covidData.length > 0 
        ? covidData.reduce((latest, item) => 
            !latest || item.date > latest.date ? item : latest, covidData[0])
        : null;
      
      const baseVaccination = latestCovid?.people_vaccinated_per_hundred || 70;
      
      const cityVariation: Record<string, number> = {
        'Delhi': -5, 'Mumbai': 8, 'Kolkata': -3, 'Chennai': 5,
        'Bangalore': 7, 'Hyderabad': 3, 'Pune': 6, 'Ahmedabad': -2,
        'Jaipur': -4, 'Lucknow': -6, 'New York': 15, 'Los Angeles': 12,
        'London': 18, 'Tokyo': 20, 'Sydney': 16
      };

      const cityInfo = cityData[regionName] || {
        population: 5 + Math.random() * 10,
        healthcareAccess: 70 + Math.random() * 20,
        urbanization: 80 + Math.random() * 15,
        gdpPerCapita: 3000 + Math.random() * 5000
      };

      return {
        vaccination: Math.min(100, baseVaccination + (cityVariation[regionName] || 0)),
        aqi: avgAqi,
        population: cityInfo.population,
        healthcareAccess: cityInfo.healthcareAccess,
        urbanization: cityInfo.urbanization,
        gdpPerCapita: cityInfo.gdpPerCapita
      };
    };

    return {
      [region1]: getRegionMetrics(region1),
      [region2]: getRegionMetrics(region2)
    };
  }, [region1, region2, covidData, aqiData]);

  const radarData = useMemo(() => {
    const m1 = comparisonMetrics[region1];
    const m2 = comparisonMetrics[region2];
    
    return [
      { metric: 'Vaccination', [region1]: m1.vaccination, [region2]: m2.vaccination, fullMark: 100 },
      { metric: 'Air Quality', [region1]: Math.max(0, 100 - m1.aqi/3), [region2]: Math.max(0, 100 - m2.aqi/3), fullMark: 100 },
      { metric: 'Healthcare', [region1]: m1.healthcareAccess, [region2]: m2.healthcareAccess, fullMark: 100 },
      { metric: 'Urbanization', [region1]: m1.urbanization, [region2]: m2.urbanization, fullMark: 100 },
      { metric: 'GDP Score', [region1]: Math.min(100, m1.gdpPerCapita / 1000), [region2]: Math.min(100, m2.gdpPerCapita / 1000), fullMark: 100 },
    ];
  }, [comparisonMetrics, region1, region2]);

  const swapRegions = () => {
    setRegion1(region2);
    setRegion2(region1);
  };

  const region1AqiData = useMemo(() => 
    aqiData.filter(item => item.city === region1), [aqiData, region1]);
  
  const region2AqiData = useMemo(() => 
    aqiData.filter(item => item.city === region2), [aqiData, region2]);

  const regions = availableCities.length > 0 ? availableCities : 
    ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad'];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Region Comparison</h2>
        <p className="text-gray-600">
          Comprehensive comparison of health, economic, and environmental metrics
        </p>
      </div>

      <div className="chart-container p-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">Region 1</label>
            <select
              value={region1}
              onChange={(e) => setRegion1(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            >
              {regions.map((r) => (
                <option key={r} value={r} disabled={r === region2}>{r}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">{region1AqiData.length} data points</p>
          </div>

          <button onClick={swapRegions} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full" title="Swap">
            <ArrowUpDown className="h-6 w-6 text-gray-600" />
          </button>

          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">Region 2</label>
            <select
              value={region2}
              onChange={(e) => setRegion2(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            >
              {regions.map((r) => (
                <option key={r} value={r} disabled={r === region1}>{r}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">{region2AqiData.length} data points</p>
          </div>
        </div>
      </div>

      <div className="chart-container p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Dimensional Comparison</h3>
        <p className="text-sm text-gray-500 mb-4">Normalized scores (0-100) for easy comparison</p>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar name={region1} dataKey={region1} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} strokeWidth={2} />
            <Radar name={region2} dataKey={region2} stroke="#10b981" fill="#10b981" fillOpacity={0.4} strokeWidth={2} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VaccinationChart data={covidData} loading={loading} />
        <AqiChart data={aqiData} loading={loading} />
      </div>

      <div className="chart-container p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What-If Analysis</h3>
        <p className="text-gray-600 mb-4">
          If <strong>{region1}</strong> achieved <strong>{region2}</strong>'s metrics:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Vaccination Gap</p>
            <p className={`text-2xl font-bold ${comparisonMetrics[region2].vaccination > comparisonMetrics[region1].vaccination ? 'text-red-600' : 'text-green-600'}`}>
              {(comparisonMetrics[region2].vaccination - comparisonMetrics[region1].vaccination).toFixed(1)}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">AQI Difference</p>
            <p className={`text-2xl font-bold ${comparisonMetrics[region1].aqi > comparisonMetrics[region2].aqi ? 'text-red-600' : 'text-green-600'}`}>
              {(comparisonMetrics[region1].aqi - comparisonMetrics[region2].aqi).toFixed(0)} points
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">GDP Gap</p>
            <p className={`text-2xl font-bold ${comparisonMetrics[region2].gdpPerCapita > comparisonMetrics[region1].gdpPerCapita ? 'text-red-600' : 'text-green-600'}`}>
              ${Math.abs(comparisonMetrics[region2].gdpPerCapita - comparisonMetrics[region1].gdpPerCapita).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
