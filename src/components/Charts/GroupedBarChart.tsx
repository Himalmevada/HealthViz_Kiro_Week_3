import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface GroupedBarChartProps {
  data: Array<{
    name: string;
    vaccination: number;
    aqi: number;
    turnout: number;
  }>;
  loading?: boolean;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({ data, loading = false }) => {
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
          State-wise Comparison
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}
              {entry.dataKey === 'vaccination' || entry.dataKey === 'turnout' ? '%' : ''}
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
        State-wise Comparison
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Compare vaccination rate, AQI, and turnout across regions
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="vaccination" 
            name="Vaccination %" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="aqi" 
            name="AQI (scaled)" 
            fill="#f59e0b" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="turnout" 
            name="Turnout %" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GroupedBarChart;