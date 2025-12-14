import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface StackedAreaChartProps {
  data: Array<{
    date: string;
    firstDose: number;
    secondDose: number;
    booster: number;
  }>;
  loading?: boolean;
}

const StackedAreaChart: React.FC<StackedAreaChartProps> = ({ data, loading = false }) => {
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
          Vaccination Dose Distribution Over Time
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
      const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {(entry.value / 1000000).toFixed(2)}M
            </p>
          ))}
          <p className="text-sm font-medium text-gray-900 mt-2 pt-2 border-t">
            Total: {(total / 1000000).toFixed(2)}M
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Vaccination Dose Distribution Over Time
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Stacked view of 1st dose, 2nd dose, and booster shots
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="firstDose"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.8}
            name="First Dose"
          />
          <Area
            type="monotone"
            dataKey="secondDose"
            stackId="1"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.8}
            name="Second Dose"
          />
          <Area
            type="monotone"
            dataKey="booster"
            stackId="1"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.8}
            name="Booster"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedAreaChart;