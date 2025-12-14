import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { VulnerabilityScore } from '../../types/dashboard';

interface Globe3DMapProps {
  vulnerabilityData: VulnerabilityScore[];
  loading?: boolean;
}

// City coordinates for major cities
const cityCoordinates: Record<string, { lat: number; lng: number; country: string }> = {
  // India
  'Delhi': { lat: 28.6139, lng: 77.2090, country: 'India' },
  'Mumbai': { lat: 19.0760, lng: 72.8777, country: 'India' },
  'Kolkata': { lat: 22.5726, lng: 88.3639, country: 'India' },
  'Chennai': { lat: 13.0827, lng: 80.2707, country: 'India' },
  'Bangalore': { lat: 12.9716, lng: 77.5946, country: 'India' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, country: 'India' },
  'Pune': { lat: 18.5204, lng: 73.8567, country: 'India' },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, country: 'India' },
  'Jaipur': { lat: 26.9124, lng: 75.7873, country: 'India' },
  'Lucknow': { lat: 26.8467, lng: 80.9462, country: 'India' },
  // USA
  'New York': { lat: 40.7128, lng: -74.0060, country: 'USA' },
  'Los Angeles': { lat: 34.0522, lng: -118.2437, country: 'USA' },
  'Chicago': { lat: 41.8781, lng: -87.6298, country: 'USA' },
  'Houston': { lat: 29.7604, lng: -95.3698, country: 'USA' },
  'Phoenix': { lat: 33.4484, lng: -112.0740, country: 'USA' },
  'Philadelphia': { lat: 39.9526, lng: -75.1652, country: 'USA' },
  'San Antonio': { lat: 29.4241, lng: -98.4936, country: 'USA' },
  'San Diego': { lat: 32.7157, lng: -117.1611, country: 'USA' },
  // UK
  'London': { lat: 51.5074, lng: -0.1278, country: 'UK' },
  'Manchester': { lat: 53.4808, lng: -2.2426, country: 'UK' },
  'Birmingham': { lat: 52.4862, lng: -1.8904, country: 'UK' },
  'Leeds': { lat: 53.8008, lng: -1.5491, country: 'UK' },
  'Glasgow': { lat: 55.8642, lng: -4.2518, country: 'UK' },
  'Liverpool': { lat: 53.4084, lng: -2.9916, country: 'UK' },
  // Europe
  'Paris': { lat: 48.8566, lng: 2.3522, country: 'France' },
  'Berlin': { lat: 52.5200, lng: 13.4050, country: 'Germany' },
  'Munich': { lat: 48.1351, lng: 11.5820, country: 'Germany' },
  'Frankfurt': { lat: 50.1109, lng: 8.6821, country: 'Germany' },
  // Asia
  'Tokyo': { lat: 35.6762, lng: 139.6503, country: 'Japan' },
  'Osaka': { lat: 34.6937, lng: 135.5023, country: 'Japan' },
  'Sydney': { lat: -33.8688, lng: 151.2093, country: 'Australia' },
  'Melbourne': { lat: -37.8136, lng: 144.9631, country: 'Australia' },
  // South America
  'São Paulo': { lat: -23.5505, lng: -46.6333, country: 'Brazil' },
  'Rio de Janeiro': { lat: -22.9068, lng: -43.1729, country: 'Brazil' },
};

const Globe3DMap: React.FC<Globe3DMapProps> = ({
  vulnerabilityData,
  loading = false
}) => {
  const globeRef = useRef<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 650 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 650
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Process data to include coordinates
  const mapData = useMemo(() => {
    return vulnerabilityData
      .filter(v => cityCoordinates[v.location])
      .map(v => ({
        ...v,
        lat: cityCoordinates[v.location].lat,
        lng: cityCoordinates[v.location].lng,
        country: cityCoordinates[v.location].country,
        size: Math.max(0.3, v.vulnerabilityIndex / 100), // Scale for visualization
        color: getRiskColor(v.riskCategory)
      }));
  }, [vulnerabilityData]);

  // Position globe (no auto-rotation)
  useEffect(() => {
    if (globeRef.current && mapData.length > 0) {
      // Calculate center point
      const avgLat = mapData.reduce((sum, d) => sum + d.lat, 0) / mapData.length;
      const avgLng = mapData.reduce((sum, d) => sum + d.lng, 0) / mapData.length;
      
      // Point of view - slightly zoomed out for better overview
      globeRef.current.pointOfView({ lat: avgLat, lng: avgLng, altitude: 2.0 }, 1000);
      
      // Disable auto-rotation for stable viewing
      globeRef.current.controls().autoRotate = false;
      globeRef.current.controls().enableZoom = true;
    }
  }, [mapData]);

  const handlePointClick = useCallback((point: any) => {
    setSelectedCity(point);
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.5 }, 1000);
      globeRef.current.controls().autoRotate = false;
    }
  }, []);

  const handleClosePopup = () => {
    setSelectedCity(null);
  };

  if (loading) {
    return (
      <div className="chart-container p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-[650px] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (mapData.length === 0) {
    return (
      <div className="chart-container p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          3D Global Vulnerability Map
        </h3>
        <div className="h-[650px] flex items-center justify-center bg-gray-900 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-3">🌍</div>
            <p className="text-gray-300 font-medium">No location data available</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
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
            3D Global Vulnerability Map
          </h3>
          <p className="text-sm text-gray-500">
            Click on points to see details • Drag to rotate • Scroll to zoom • {mapData.length} locations
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

      <div 
        ref={containerRef}
        className="relative rounded-lg overflow-hidden bg-gray-900"
        style={{ height: '650px' }}
      >
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          
          // Points layer - smaller, cleaner markers
          pointsData={mapData}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude={(d: any) => 0.01 + (d.vulnerabilityIndex / 100) * 0.03}
          pointRadius={(d: any) => 0.3 + (d.vulnerabilityIndex / 100) * 0.4}
          pointLabel={(d: any) => `
            <div style="background: rgba(0,0,0,0.8); padding: 8px 12px; border-radius: 8px; color: white; font-size: 12px;">
              <strong style="font-size: 14px;">${d.location}</strong><br/>
              <span style="color: #93c5fd;">Vaccination: ${d.vaccinationRate.toFixed(1)}%</span><br/>
              <span style="color: #fcd34d;">AQI: ${d.aqiLevel.toFixed(0)}</span><br/>
              <span style="color: ${d.color};">Risk: ${d.riskCategory}</span>
            </div>
          `}
          onPointClick={handlePointClick}
          
          // Arcs between high-risk cities - subtle connections
          arcsData={generateArcs(mapData)}
          arcColor={() => ['rgba(255,100,100,0.3)', 'rgba(255,200,100,0.3)']}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={2000}
          arcStroke={0.3}
          
          // Atmosphere
          atmosphereColor="#3a82f7"
          atmosphereAltitude={0.25}
        />

        {/* Selected City Popup */}
        {selectedCity && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-xs z-10">
            <button 
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h4 className="font-bold text-gray-900 text-lg mb-2">
              {selectedCity.location}
            </h4>
            <p className="text-xs text-gray-500 mb-3">{selectedCity.country}</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Vaccination:</span>
                <span className={`font-semibold ${
                  selectedCity.vaccinationRate >= 80 ? 'text-green-600' : 
                  selectedCity.vaccinationRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {selectedCity.vaccinationRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">AQI Level:</span>
                <span className={`font-semibold ${
                  selectedCity.aqiLevel <= 50 ? 'text-green-600' :
                  selectedCity.aqiLevel <= 100 ? 'text-yellow-600' :
                  selectedCity.aqiLevel <= 150 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {selectedCity.aqiLevel.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vulnerability:</span>
                <span className="font-semibold text-gray-900">
                  {selectedCity.vulnerabilityIndex}/100
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Risk Level:</span>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-bold text-white capitalize"
                    style={{ backgroundColor: selectedCity.color }}
                  >
                    {selectedCity.riskCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls hint */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-2 rounded-lg">
          🖱️ Drag to rotate • 🔍 Scroll to zoom • 👆 Click markers for details
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>
          Marker size indicates vulnerability level (larger = more vulnerable). 
          Subtle arcs connect high-risk locations. Drag to explore different regions.
        </p>
      </div>
    </div>
  );
};

// Helper function to get risk color
function getRiskColor(category: VulnerabilityScore['riskCategory']): string {
  switch (category) {
    case 'low': return '#10b981';
    case 'moderate': return '#f59e0b';
    case 'high': return '#f97316';
    case 'severe': return '#ef4444';
    default: return '#6b7280';
  }
}

// Generate arcs between high-risk cities
function generateArcs(data: any[]): any[] {
  const highRiskCities = data.filter(d => 
    d.riskCategory === 'high' || d.riskCategory === 'severe'
  );
  
  const arcs: any[] = [];
  for (let i = 0; i < highRiskCities.length - 1; i++) {
    for (let j = i + 1; j < highRiskCities.length; j++) {
      // Only create arcs between nearby cities (same region)
      const dist = Math.sqrt(
        Math.pow(highRiskCities[i].lat - highRiskCities[j].lat, 2) +
        Math.pow(highRiskCities[i].lng - highRiskCities[j].lng, 2)
      );
      if (dist < 30) { // Only connect cities within ~30 degrees
        arcs.push({
          startLat: highRiskCities[i].lat,
          startLng: highRiskCities[i].lng,
          endLat: highRiskCities[j].lat,
          endLng: highRiskCities[j].lng
        });
      }
    }
  }
  return arcs.slice(0, 10); // Limit to 10 arcs for performance
}

export default Globe3DMap;
