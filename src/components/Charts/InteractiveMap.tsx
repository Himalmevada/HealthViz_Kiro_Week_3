import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { VulnerabilityScore } from '../../types/dashboard';

interface InteractiveMapProps {
  vulnerabilityData: VulnerabilityScore[];
  loading?: boolean;
}

// City coordinates for major cities
const cityCoordinates: Record<string, [number, number]> = {
  // India
  'Delhi': [28.6139, 77.2090],
  'Mumbai': [19.0760, 72.8777],
  'Kolkata': [22.5726, 88.3639],
  'Chennai': [13.0827, 80.2707],
  'Bangalore': [12.9716, 77.5946],
  'Hyderabad': [17.3850, 78.4867],
  'Pune': [18.5204, 73.8567],
  'Ahmedabad': [23.0225, 72.5714],
  'Jaipur': [26.9124, 75.7873],
  'Lucknow': [26.8467, 80.9462],
  // USA
  'New York': [40.7128, -74.0060],
  'Los Angeles': [34.0522, -118.2437],
  'Chicago': [41.8781, -87.6298],
  'Houston': [29.7604, -95.3698],
  'Phoenix': [33.4484, -112.0740],
  'Philadelphia': [39.9526, -75.1652],
  'San Antonio': [29.4241, -98.4936],
  'San Diego': [32.7157, -117.1611],
  // UK
  'London': [51.5074, -0.1278],
  'Manchester': [53.4808, -2.2426],
  'Birmingham': [52.4862, -1.8904],
  'Leeds': [53.8008, -1.5491],
  'Glasgow': [55.8642, -4.2518],
  'Liverpool': [53.4084, -2.9916],
  // Europe
  'Paris': [48.8566, 2.3522],
  'Berlin': [52.5200, 13.4050],
  'Munich': [48.1351, 11.5820],
  'Frankfurt': [50.1109, 8.6821],
  // Asia
  'Tokyo': [35.6762, 139.6503],
  'Osaka': [34.6937, 135.5023],
  'Sydney': [-33.8688, 151.2093],
  'Melbourne': [-37.8136, 144.9631],
  // South America
  'São Paulo': [-23.5505, -46.6333],
  'Rio de Janeiro': [-22.9068, -43.1729],
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  vulnerabilityData,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="chart-container p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Process data to include coordinates
  const mapData = useMemo(() => {
    return vulnerabilityData
      .filter(v => cityCoordinates[v.location])
      .map(v => ({
        ...v,
        coordinates: cityCoordinates[v.location]
      }));
  }, [vulnerabilityData]);

  // Calculate map center based on data
  const mapCenter = useMemo((): [number, number] => {
    if (mapData.length === 0) return [20.5937, 78.9629]; // Default to India center
    
    const avgLat = mapData.reduce((sum, d) => sum + d.coordinates[0], 0) / mapData.length;
    const avgLng = mapData.reduce((sum, d) => sum + d.coordinates[1], 0) / mapData.length;
    return [avgLat, avgLng];
  }, [mapData]);

  // Determine zoom level based on data spread
  const zoomLevel = useMemo(() => {
    if (mapData.length === 0) return 4;
    if (mapData.length <= 3) return 5;
    
    const lats = mapData.map(d => d.coordinates[0]);
    const lngs = mapData.map(d => d.coordinates[1]);
    const latSpread = Math.max(...lats) - Math.min(...lats);
    const lngSpread = Math.max(...lngs) - Math.min(...lngs);
    const maxSpread = Math.max(latSpread, lngSpread);
    
    if (maxSpread > 100) return 2;
    if (maxSpread > 50) return 3;
    if (maxSpread > 20) return 4;
    return 5;
  }, [mapData]);

  const getRiskColor = (category: VulnerabilityScore['riskCategory']) => {
    switch (category) {
      case 'low': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'high': return '#f97316';
      case 'severe': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getMarkerRadius = (vulnerabilityIndex: number) => {
    // Scale radius based on vulnerability (higher = larger)
    return Math.max(8, Math.min(25, vulnerabilityIndex / 4 + 5));
  };

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return { text: 'Good', color: 'text-green-600' };
    if (aqi <= 100) return { text: 'Moderate', color: 'text-yellow-600' };
    if (aqi <= 150) return { text: 'Unhealthy for Sensitive', color: 'text-orange-600' };
    if (aqi <= 200) return { text: 'Unhealthy', color: 'text-red-600' };
    return { text: 'Very Unhealthy', color: 'text-purple-600' };
  };

  if (mapData.length === 0) {
    return (
      <div className="chart-container p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Interactive Vulnerability Map
        </h3>
        <div className="h-[650px] flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-3">🗺️</div>
            <p className="text-gray-500 font-medium">No location data available</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Interactive Vulnerability Map
          </h3>
          <p className="text-sm text-gray-500">
            Click on markers to see detailed information • {mapData.length} locations
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center space-x-4">
          {(['low', 'moderate', 'high', 'severe'] as const).map((risk) => (
            <div key={risk} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: getRiskColor(risk) }}
              ></div>
              <span className="text-xs text-gray-600 capitalize">{risk}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height: '650px' }}>
        <MapContainer
          center={mapCenter}
          zoom={zoomLevel}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {mapData.map((location) => {
            const aqiStatus = getAqiStatus(location.aqiLevel);
            return (
              <CircleMarker
                key={location.location}
                center={location.coordinates}
                radius={getMarkerRadius(location.vulnerabilityIndex)}
                pathOptions={{
                  color: getRiskColor(location.riskCategory),
                  fillColor: getRiskColor(location.riskCategory),
                  fillOpacity: 0.7,
                  weight: 2
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                  <span className="font-medium">{location.location}</span>
                </Tooltip>
                <Popup>
                  <div className="p-2 min-w-48">
                    <h4 className="font-bold text-gray-900 text-lg mb-2">
                      {location.location}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vaccination:</span>
                        <span className={`font-semibold ${
                          location.vaccinationRate >= 80 ? 'text-green-600' : 
                          location.vaccinationRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {location.vaccinationRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AQI Level:</span>
                        <span className={`font-semibold ${aqiStatus.color}`}>
                          {location.aqiLevel.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Air Quality:</span>
                        <span className={`font-semibold ${aqiStatus.color}`}>
                          {aqiStatus.text}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vulnerability:</span>
                        <span className="font-semibold text-gray-900">
                          {location.vulnerabilityIndex}/100
                        </span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Risk Level:</span>
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-bold text-white capitalize"
                            style={{ backgroundColor: getRiskColor(location.riskCategory) }}
                          >
                            {location.riskCategory}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>
          Marker size indicates vulnerability level (larger = more vulnerable). 
          Color indicates risk category. Zoom and pan to explore different regions.
        </p>
      </div>
    </div>
  );
};

export default InteractiveMap;
