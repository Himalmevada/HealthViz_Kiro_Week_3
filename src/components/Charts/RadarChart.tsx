import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface RadarChartProps {
  data: Array<{
    metric: string;
    current: number;
    previous: number;
    fullMark: number;
  }>;
  loading?: boolean;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="chart-container p-6 h-80">
        <div className="animate-pulse h-full flex items-center justify-center">
          <div className="h-48 w-48 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Check if there's no meaningful data (all zeros)
  const hasData = data && data.length > 0 && data.some(d => d.current > 0 || d.previous > 0);
  
  if (!hasData) {
    return (
      <div className="chart-container p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Seasonal Performance Comparison
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{payload[0]?.payload?.metric}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Seasonal Performance Comparison
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Multi-dimensional analysis across key metrics
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="metric" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar
            name="Current Period"
            dataKey="current"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.5}
            strokeWidth={2}
          />
          <Radar
            name="Previous Period"
            dataKey="previous"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Legend />
          <Tooltip content={<CustomTooltip />} />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;