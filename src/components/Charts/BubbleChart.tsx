import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface BubbleChartProps {
  data: Array<{
    name: string;
    vaccination: number;
    aqi: number;
    population: number;
    gdp: 'high' | 'medium' | 'low';
  }>;
  loading?: boolean;
}

const BubbleChart: React.FC<BubbleChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="chart-container p-6 h-80">
        <div className="animate-pulse h-full">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-full bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Check if there's no data
  if (!data || data.length === 0) {
    return (
      <div className="chart-container p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Economic-Health Nexus Analysis
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-3">📊</div>
            <p className="text-gray-500 font-medium">Data not available</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or date range</p>
          </div>
        </div>
      </div>
    );
  }

  const getGdpColor = (gdp: string) => {
    switch (gdp) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Group data by GDP category
  const highGdp = data.filter(d => d.gdp === 'high');
  const mediumGdp = data.filter(d => d.gdp === 'medium');
  const lowGdp = data.filter(d => d.gdp === 'low');

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{item.name}</p>
          <p className="text-sm text-blue-600">
            Vaccination: {item.vaccination.toFixed(1)}%
          </p>
          <p className="text-sm text-orange-600">
            AQI: {item.aqi.toFixed(0)}
          </p>
          <p className="text-sm text-gray-600">
            Population: {(item.population / 1000000).toFixed(1)}M
          </p>
          <p className="text-sm capitalize" style={{ color: getGdpColor(item.gdp) }}>
            GDP Level: {item.gdp}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Economic-Health Nexus Analysis
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        X: Vaccination % | Y: AQI | Size: Population | Color: GDP
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            type="number" 
            dataKey="vaccination" 
            name="Vaccination"
            unit="%"
            stroke="#6b7280"
            fontSize={12}
            domain={[0, 100]}
            label={{ value: 'Vaccination Rate (%)', position: 'bottom', offset: 0 }}
          />
          <YAxis 
            type="number" 
            dataKey="aqi" 
            name="AQI"
            stroke="#6b7280"
            fontSize={12}
            domain={[0, 'auto']}
            label={{ value: 'AQI Level', angle: -90, position: 'insideLeft' }}
          />
          <ZAxis 
            type="number" 
            dataKey="population" 
            range={[100, 1000]} 
            name="Population"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter 
            name="High GDP" 
            data={highGdp} 
            fill="#10b981"
            fillOpacity={0.7}
          />
          <Scatter 
            name="Medium GDP" 
            data={mediumGdp} 
            fill="#f59e0b"
            fillOpacity={0.7}
          />
          <Scatter 
            name="Low GDP" 
            data={lowGdp} 
            fill="#ef4444"
            fillOpacity={0.7}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BubbleChart;