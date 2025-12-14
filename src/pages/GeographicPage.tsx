import React, { useMemo, useState } from 'react';
import BubbleChart from '../components/Charts/BubbleChart';
import HeatmapChart from '../components/Charts/HeatmapChart';
import InteractiveMap from '../components/Charts/InteractiveMap';
import Globe3DMap from '../components/Charts/Globe3DMap';
import { VulnerabilityScore } from '../types/dashboard';

interface GeographicPageProps {
  vulnerabilityData: VulnerabilityScore[];
  loading: boolean;
}

// Map View Section with toggle between 2D and 3D
const MapViewSection: React.FC<{ vulnerabilityData: VulnerabilityScore[]; loading: boolean }> = ({
  vulnerabilityData,
  loading
}) => {
  const [mapView, setMapView] = useState<'3d' | '2d'>('3d');

  return (
    <div className="space-y-4">
      {/* Map Toggle */}
      <div className="flex items-center justify-end space-x-2">
        <span className="text-sm text-gray-600">View:</span>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMapView('3d')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              mapView === '3d'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🌍 3D Globe
          </button>
          <button
            onClick={() => setMapView('2d')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              mapView === '2d'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🗺️ 2D Map
          </button>
        </div>
      </div>

      {/* Map Display */}
      {mapView === '3d' ? (
        <Globe3DMap vulnerabilityData={vulnerabilityData} loading={loading} />
      ) : (
        <InteractiveMap vulnerabilityData={vulnerabilityData} loading={loading} />
      )}
    </div>
  );
};

const GeographicPage: React.FC<GeographicPageProps> = ({
  vulnerabilityData,
  loading
}) => {
  // Generate bubble chart data from vulnerability data
  const bubbleData = useMemo(() => {
    return vulnerabilityData.map(v => {
      // Determine GDP level based on vaccination rate (simplified heuristic)
      const gdp: 'high' | 'medium' | 'low' = 
        v.vaccinationRate > 80 ? 'high' : 
        v.vaccinationRate > 65 ? 'medium' : 'low';
      
      return {
        name: v.location,
        vaccination: v.vaccinationRate,
        aqi: v.aqiLevel,
        population: v.populationDensity * 10000, // Scale for visualization
        gdp
      };
    });
  }, [vulnerabilityData]);

  // Generate heatmap data from vulnerability data
  // Shows AQI levels by city across days of the week
  const heatmapData = useMemo(() => {
    if (vulnerabilityData.length === 0) return [];

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data: Array<{ day: string; hour: number; value: number; city: string }> = [];

    // Generate data for each city across days
    // Using AQI as base and adding realistic daily variation
    vulnerabilityData.forEach((v, cityIndex) => {
      days.forEach((day, dayIndex) => {
        // Base AQI with daily variation pattern
        // Weekdays tend to have higher pollution, weekends lower
        const weekendFactor = (dayIndex >= 5) ? 0.85 : 1.0;
        // Add some variation based on day
        const dailyVariation = Math.sin(dayIndex * 0.9) * 15;
        // Calculate value with some randomness for realism
        const baseValue = v.aqiLevel * weekendFactor + dailyVariation;
        const value = Math.max(20, Math.min(300, baseValue + (Math.random() * 20 - 10)));

        data.push({
          day,
          hour: cityIndex, // Using hour as city index for the heatmap grid
          value: Math.round(value),
          city: v.location
        });
      });
    });

    return data;
  }, [vulnerabilityData]);

  // Generate regional statistics from vulnerability data
  const regionStats = useMemo(() => {
    if (vulnerabilityData.length === 0) {
      return [
        { region: 'No Data', vaccination: 0, aqi: 0, status: 'warning' as const, cities: 0 }
      ];
    }

    // Group cities by region (expanded mapping for multiple countries)
    const regionMapping: Record<string, string> = {
      // India
      'Delhi': 'North India',
      'Jaipur': 'North India',
      'Lucknow': 'North India',
      'Mumbai': 'West India',
      'Pune': 'West India',
      'Ahmedabad': 'West India',
      'Kolkata': 'East India',
      'Chennai': 'South India',
      'Bangalore': 'South India',
      'Hyderabad': 'South India',
      // USA
      'New York': 'US East',
      'Philadelphia': 'US East',
      'Chicago': 'US Midwest',
      'Houston': 'US South',
      'San Antonio': 'US South',
      'Phoenix': 'US West',
      'Los Angeles': 'US West',
      'San Diego': 'US West',
      // UK
      'London': 'UK South',
      'Birmingham': 'UK Midlands',
      'Manchester': 'UK North',
      'Leeds': 'UK North',
      'Glasgow': 'UK Scotland',
      'Liverpool': 'UK North',
      // Europe
      'Paris': 'France',
      'Berlin': 'Germany',
      'Munich': 'Germany',
      'Frankfurt': 'Germany',
      // Asia
      'Tokyo': 'Japan',
      'Osaka': 'Japan',
      // Australia
      'Sydney': 'Australia',
      'Melbourne': 'Australia',
      // South America
      'São Paulo': 'Brazil',
      'Rio de Janeiro': 'Brazil',
    };

    const regionData = new Map<string, { vaccination: number; aqi: number; count: number }>();
    
    vulnerabilityData.forEach(v => {
      const region = regionMapping[v.location] || v.location; // Use city name if no region mapping
      const existing = regionData.get(region) || { vaccination: 0, aqi: 0, count: 0 };
      regionData.set(region, {
        vaccination: existing.vaccination + v.vaccinationRate,
        aqi: existing.aqi + v.aqiLevel,
        count: existing.count + 1
      });
    });

    return Array.from(regionData.entries()).map(([region, data]) => {
      const avgVaccination = data.vaccination / data.count;
      const avgAqi = data.aqi / data.count;
      
      let status: 'good' | 'moderate' | 'warning' | 'critical';
      if (avgVaccination > 80 && avgAqi < 100) status = 'good';
      else if (avgVaccination > 70 && avgAqi < 130) status = 'moderate';
      else if (avgVaccination > 60 || avgAqi < 150) status = 'warning';
      else status = 'critical';

      return {
        region,
        vaccination: Math.round(avgVaccination),
        aqi: Math.round(avgAqi),
        status,
        cities: data.count
      };
    });
  }, [vulnerabilityData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Geographic Insights</h2>
        <p className="text-gray-600">
          Regional analysis and geographic distribution of health metrics
        </p>
        {/* Filter Summary */}
        <div className="mt-2 flex items-center space-x-4 text-sm">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            📍 {vulnerabilityData.length} {vulnerabilityData.length === 1 ? 'location' : 'locations'}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            🗺️ {regionStats.filter(r => r.region !== 'No Data').length} {regionStats.filter(r => r.region !== 'No Data').length === 1 ? 'region' : 'regions'}
          </span>
          {vulnerabilityData.length > 0 && (
            <span className="text-gray-500">
              Showing: {vulnerabilityData.map(v => v.location).join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Regional Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {regionStats.map((region) => (
          <div 
            key={region.region}
            className={`chart-container p-4 border-2 ${getStatusColor(region.status)}`}
          >
            <h4 className="font-medium text-sm mb-2">{region.region}</h4>
            <div className="space-y-1">
              <p className="text-xs">
                Vaccination: <span className="font-semibold">{region.vaccination}%</span>
              </p>
              <p className="text-xs">
                AQI: <span className="font-semibold">{region.aqi}</span>
              </p>
              <p className="text-xs text-gray-500">
                {region.cities} {region.cities === 1 ? 'city' : 'cities'}
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-current border-opacity-20">
              <span className="text-xs font-medium capitalize">{region.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Map View Toggle */}
      <MapViewSection vulnerabilityData={vulnerabilityData} loading={loading} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BubbleChart data={bubbleData} loading={loading} />
        <HeatmapChart data={heatmapData} loading={loading} />
      </div>

      {/* Location-wise Table */}
      <div className="chart-container p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Location-wise Detailed Metrics
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({vulnerabilityData.length} locations)
          </span>
        </h3>
        {vulnerabilityData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No data available for selected filters</p>
            <p className="text-sm">Try adjusting your filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Vaccination %</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">AQI</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Vulnerability</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Risk Level</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {vulnerabilityData.map((location, index) => (
                  <tr key={location.location} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4 font-medium text-gray-900">{location.location}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${
                        location.vaccinationRate >= 80 ? 'text-green-600' : 
                        location.vaccinationRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {location.vaccinationRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${
                        location.aqiLevel <= 100 ? 'text-green-600' : 
                        location.aqiLevel <= 150 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {location.aqiLevel.toFixed(0)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {location.vulnerabilityIndex}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        location.riskCategory === 'low' ? 'bg-green-100 text-green-800' :
                        location.riskCategory === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        location.riskCategory === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {location.riskCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            location.riskCategory === 'low' ? 'bg-green-500' :
                            location.riskCategory === 'moderate' ? 'bg-yellow-500' :
                            location.riskCategory === 'high' ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${100 - location.vulnerabilityIndex}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeographicPage;