import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { CorrelationAnalysis } from '../../types/dashboard';

interface CorrelationChartProps {
  analysis: CorrelationAnalysis;
  loading?: boolean;
}

const CorrelationChart: React.FC<CorrelationChartProps> = ({
  analysis,
  loading = false
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

  const { correlation, pValue, significance, dataPoints } = analysis;

  // Check if there's no data
  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div className="chart-container p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Vaccination vs Air Quality Correlation
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

  const processedData = dataPoints.map((point, index) => ({
    x: point.vaccination,
    y: point.aqi,
    name: point.date, // This is actually city/region name
    id: index
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{data.name}</p>
          <p className="text-sm text-blue-600">
            Vaccination Rate: {data.x.toFixed(1)}%
          </p>
          <p className="text-sm text-orange-600">
            AQI: {data.y.toFixed(0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {data.y <= 50 ? '🟢 Good' : data.y <= 100 ? '🟡 Moderate' : data.y <= 150 ? '🟠 Unhealthy for Sensitive' : '🔴 Unhealthy'}
          </p>
        </div>
      );
    }
    return null;
  };

  const getCorrelationColor = (corr: number) => {
    if (Math.abs(corr) < 0.3) return '#6b7280'; // Gray - weak
    if (Math.abs(corr) < 0.7) return '#f59e0b'; // Orange - moderate
    return corr > 0 ? '#ef4444' : '#10b981'; // Red for positive, Green for negative
  };

  const getCorrelationStrength = (corr: number) => {
    const abs = Math.abs(corr);
    if (abs < 0.3) return 'Weak';
    if (abs < 0.7) return 'Moderate';
    return 'Strong';
  };

  return (
    <div className="chart-container p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Vaccination vs Air Quality Correlation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Correlation Coefficient</p>
            <p className={`text-xl font-bold ${
              correlation > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {correlation.toFixed(3)}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Strength</p>
            <p className="text-xl font-bold text-gray-900">
              {getCorrelationStrength(correlation)}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Statistical Significance</p>
            <p className={`text-xl font-bold ${
              significance === 'significant' ? 'text-green-600' : 'text-orange-600'
            }`}>
              {significance === 'significant' ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          <p>
            <strong>Interpretation:</strong> {correlation > 0 ? 'Positive' : 'Negative'} correlation 
            suggests that as vaccination rates {correlation > 0 ? 'increase' : 'decrease'}, 
            AQI levels tend to {correlation > 0 ? 'increase' : 'decrease'}.
            {significance === 'significant' && (
              <span className="text-green-600 ml-1">(Statistically significant)</span>
            )}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="x"
            type="number"
            stroke="#6b7280"
            fontSize={12}
            label={{ value: 'Vaccination Rate (%)', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            dataKey="y"
            type="number"
            stroke="#6b7280"
            fontSize={12}
            label={{ value: 'AQI Level', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Scatter
            dataKey="y"
            fill={getCorrelationColor(correlation)}
            fillOpacity={0.7}
            stroke={getCorrelationColor(correlation)}
            strokeWidth={1}
          />
          
          {/* Trend line (simplified) */}
          {dataPoints.length > 1 && (
            <ReferenceLine
              segment={[
                { x: Math.min(...processedData.map(d => d.x)), y: Math.min(...processedData.map(d => d.y)) },
                { x: Math.max(...processedData.map(d => d.x)), y: Math.max(...processedData.map(d => d.y)) }
              ]}
              stroke={getCorrelationColor(correlation)}
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>

      <div className="mt-4 text-xs text-gray-500">
        <p>Each point represents a city/region. Hover to see details. Dashed line shows the trend.</p>
        <p>P-value: {pValue.toFixed(3)} • {dataPoints.length} locations compared • Significance threshold: 0.05</p>
      </div>
    </div>
  );
};

export default CorrelationChart;