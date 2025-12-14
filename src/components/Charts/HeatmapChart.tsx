import React, { useMemo } from 'react';

interface HeatmapChartProps {
  data: Array<{
    day: string;
    hour: number;
    value: number;
    city?: string;
  }>;
  loading?: boolean;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ data, loading = false }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Process data to get unique cities and organize by city/day
  const { cities, heatmapGrid } = useMemo(() => {
    if (!data || data.length === 0) {
      return { cities: [], heatmapGrid: new Map() };
    }

    // Get unique cities from data
    const citySet = new Set<string>();
    data.forEach(d => {
      if (d.city) citySet.add(d.city);
    });
    const cityList = Array.from(citySet);

    // Create grid: city -> day -> value
    const grid = new Map<string, Map<string, number>>();
    data.forEach(d => {
      if (d.city) {
        if (!grid.has(d.city)) {
          grid.set(d.city, new Map());
        }
        grid.get(d.city)!.set(d.day, d.value);
      }
    });

    return { cities: cityList, heatmapGrid: grid };
  }, [data]);

  if (loading) {
    return (
      <div className="chart-container p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-7 gap-1">
            {Array(35).fill(0).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Check if there's no data provided
  if (!data || data.length === 0 || cities.length === 0) {
    return (
      <div className="chart-container p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          City AQI Levels by Day of Week
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-3">📊</div>
            <p className="text-gray-500 font-medium">Data not available</p>
            <p className="text-sm text-gray-400 mt-1">Select cities to see AQI patterns</p>
          </div>
        </div>
      </div>
    );
  }

  // AQI color scale
  const getColor = (value: number) => {
    if (value <= 50) return '#10b981'; // Good - green
    if (value <= 100) return '#84cc16'; // Moderate - lime
    if (value <= 150) return '#eab308'; // Unhealthy for sensitive - yellow
    if (value <= 200) return '#f97316'; // Unhealthy - orange
    if (value <= 300) return '#ef4444'; // Very unhealthy - red
    return '#7c3aed'; // Hazardous - purple
  };

  const getTextColor = (value: number) => {
    if (value <= 100) return '#1f2937'; // Dark text for light backgrounds
    return '#ffffff'; // White text for dark backgrounds
  };

  const getAqiLabel = (value: number) => {
    if (value <= 50) return 'Good';
    if (value <= 100) return 'Moderate';
    if (value <= 150) return 'Sensitive';
    if (value <= 200) return 'Unhealthy';
    if (value <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  return (
    <div className="chart-container p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        City AQI Levels by Day of Week
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Air quality patterns across {cities.length} {cities.length === 1 ? 'city' : 'cities'} • Hover for details
      </p>
      
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Header - Days */}
          <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `100px repeat(7, 1fr)` }}>
            <div className="text-xs text-gray-500 font-medium">City</div>
            {days.map((day) => (
              <div key={day} className="text-xs text-gray-500 text-center font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap Grid - Cities as rows */}
          {cities.map((city) => (
            <div 
              key={city} 
              className="grid gap-1 mb-1" 
              style={{ gridTemplateColumns: `100px repeat(7, 1fr)` }}
            >
              <div className="text-xs text-gray-700 font-medium flex items-center truncate pr-2" title={city}>
                {city}
              </div>
              {days.map((day) => {
                const value = heatmapGrid.get(city)?.get(day) || 0;
                const bgColor = getColor(value);
                const textColor = getTextColor(value);
                
                return (
                  <div
                    key={`${city}-${day}`}
                    className="h-10 rounded flex items-center justify-center text-xs font-bold cursor-pointer hover:ring-2 hover:ring-blue-400 hover:scale-105 transition-all"
                    style={{ backgroundColor: bgColor, color: textColor }}
                    title={`${city} - ${day}: AQI ${value} (${getAqiLabel(value)})`}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2 text-center">AQI Scale</p>
        <div className="flex items-center justify-center space-x-1">
          {[
            { color: '#10b981', label: '0-50', name: 'Good' },
            { color: '#84cc16', label: '51-100', name: 'Moderate' },
            { color: '#eab308', label: '101-150', name: 'Sensitive' },
            { color: '#f97316', label: '151-200', name: 'Unhealthy' },
            { color: '#ef4444', label: '201-300', name: 'Very Unhealthy' },
            { color: '#7c3aed', label: '300+', name: 'Hazardous' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div
                className="w-8 h-4 rounded"
                style={{ backgroundColor: item.color }}
                title={item.name}
              ></div>
              <span className="text-[10px] text-gray-400 mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatmapChart;