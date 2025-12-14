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
  ReferenceLine
} from 'recharts';
import { AqiData } from '../../types/dashboard';
import { getAqiCategory } from '../../utils/dataProcessing';

interface AqiChartProps {
  data: AqiData[];
  loading?: boolean;
}

const AqiChart: React.FC<AqiChartProps> = ({ data, loading = false }) => {
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
    .filter(item => item.parameter === 'pm25' || item.parameter === 'pm10')
    .sort((a, b) => new Date(a.date.utc).getTime() - new Date(b.date.utc).getTime())
    .reduce((acc: any[], item) => {
      const date = new Date(item.date.utc).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      const existing = acc.find(d => d.date === date);
      if (existing) {
        existing[item.parameter] = item.value;
      } else {
        acc.push({
          date,
          [item.parameter]: item.value,
          city: item.city,
          country: item.country
        });
      }
      return acc;
    }, []);

  if (processedData.length === 0) {
    return (
      <div className="chart-container p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Air Quality Index Over Time
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No air quality data available</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or refresh the data</p>
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
          {payload.map((entry: any, index: number) => {
            const category = getAqiCategory(entry.value);
            return (
              <div key={index} className="text-sm">
                <p style={{ color: entry.color }}>
                  {entry.name}: {entry.value.toFixed(1)} μg/m³
                </p>
                <p className="text-gray-600 text-xs">
                  Category: {category}
                </p>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const aqiThresholds = [
    { value: 50, label: 'Good', color: '#00e400' },
    { value: 100, label: 'Moderate', color: '#ffff00' },
    { value: 150, label: 'Unhealthy for Sensitive', color: '#ff7e00' },
    { value: 200, label: 'Unhealthy', color: '#ff0000' },
    { value: 300, label: 'Very Unhealthy', color: '#8f3f97' }
  ];

  return (
    <div className="chart-container p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Air Quality Index Over Time
        </h3>
        <div className="flex items-center space-x-4 text-xs">
          {aqiThresholds.slice(0, 3).map((threshold) => (
            <div key={threshold.value} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: threshold.color }}
              ></div>
              <span className="text-gray-600">{threshold.label}</span>
            </div>
          ))}
        </div>
      </div>
      
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
            label={{ value: 'AQI Value', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Reference lines for AQI categories */}
          <ReferenceLine y={50} stroke="#00e400" strokeDasharray="2 2" />
          <ReferenceLine y={100} stroke="#ffff00" strokeDasharray="2 2" />
          <ReferenceLine y={150} stroke="#ff7e00" strokeDasharray="2 2" />
          
          <Line
            type="monotone"
            dataKey="pm25"
            stroke="#e11d48"
            strokeWidth={2}
            dot={{ fill: '#e11d48', strokeWidth: 2, r: 3 }}
            name="PM2.5"
          />
          <Line
            type="monotone"
            dataKey="pm10"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={{ fill: '#7c3aed', strokeWidth: 2, r: 3 }}
            name="PM10"
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Reference lines indicate AQI category thresholds</p>
      </div>
    </div>
  );
};

export default AqiChart;