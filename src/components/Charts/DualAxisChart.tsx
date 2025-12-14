import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DualAxisChartProps {
  data: Array<{
    date: string;
    vaccination: number;
    aqi?: number;
    [key: string]: any; // For dynamic city AQI data
  }>;
  loading?: boolean;
}

const DualAxisChart: React.FC<DualAxisChartProps> = ({ data, loading = false }) => {
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

  if (!data || data.length === 0) {
    return (
      <div className="chart-container p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vaccination Rate vs Air Quality Index
        </h3>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No data available for comparison</p>
            <p className="text-sm text-gray-400">Try adjusting your date range or filters</p>
          </div>
        </div>
      </div>
    );
  }

  // Detect city columns (any key that's not 'date' or 'vaccination' or 'aqi')
  const cityColumns = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    const sampleRow = data[0];
    return Object.keys(sampleRow).filter(
      key => key !== 'date' && key !== 'vaccination' && key !== 'aqi'
    );
  }, [data]);

  // Color palette for multiple cities
  const cityColors = [
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#10b981', // emerald
    '#f97316', // orange
    '#6366f1', // indigo
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toFixed(1)}
              {entry.name === 'Vaccination Rate' ? '%' : ''}
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
        Vaccination Rate vs Air Quality Index
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {cityColumns.length > 0
          ? `Comparing ${cityColumns.length} ${cityColumns.length === 1 ? 'city' : 'cities'}`
          : 'Dual-axis comparison showing temporal correlation'}
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            stroke="#3b82f6"
            fontSize={12}
            tickLine={false}
            label={{
              value: 'Vaccination %',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#3b82f6' }
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#f59e0b"
            fontSize={12}
            tickLine={false}
            label={{
              value: 'AQI Level',
              angle: 90,
              position: 'insideRight',
              style: { fill: '#f59e0b' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="vaccination"
            fill="#3b82f6"
            fillOpacity={0.2}
            stroke="#3b82f6"
            strokeWidth={2}
            name="Vaccination Rate"
          />
          {/* Render AQI line for single city or aggregate */}
          {!cityColumns.length && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="aqi"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              name="AQI Level"
            />
          )}
          {/* Render multiple lines for multiple cities */}
          {cityColumns.map((city, index) => (
            <Line
              key={city}
              yAxisId="right"
              type="monotone"
              dataKey={city}
              stroke={cityColors[index % cityColors.length]}
              strokeWidth={2}
              dot={{ fill: cityColors[index % cityColors.length], strokeWidth: 2, r: 3 }}
              name={`${city} AQI`}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DualAxisChart;