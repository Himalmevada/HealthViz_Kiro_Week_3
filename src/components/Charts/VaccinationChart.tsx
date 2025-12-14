import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { CovidData } from '../../types/dashboard';

interface VaccinationChartProps {
  data: CovidData[];
  loading?: boolean;
  chartType?: 'line' | 'area';
}

const VaccinationChart: React.FC<VaccinationChartProps> = ({
  data,
  loading = false,
  chartType = 'area'
}) => {
  if (loading) {
    return (
      <div className="chart-container p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const processedData = data
    .filter(item => item.people_vaccinated_per_hundred || item.people_fully_vaccinated_per_hundred)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      firstDose: item.people_vaccinated_per_hundred || 0,
      fullyVaccinated: item.people_fully_vaccinated_per_hundred || 0,
      boosters: item.total_boosters || 0,
      location: item.location
    }));

  if (processedData.length === 0) {
    return (
      <div className="chart-container p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vaccination Progress Over Time
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No vaccination data available</p>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
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
              {entry.name}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartType === 'area') {
    return (
      <div className="chart-container p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vaccination Progress Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="firstDose"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="First Dose"
            />
            <Area
              type="monotone"
              dataKey="fullyVaccinated"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Fully Vaccinated"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="chart-container p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Vaccination Progress Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="firstDose"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            name="First Dose"
          />
          <Line
            type="monotone"
            dataKey="fullyVaccinated"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            name="Fully Vaccinated"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VaccinationChart;