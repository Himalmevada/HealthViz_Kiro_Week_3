import React from 'react';

interface GaugeChartProps {
  value: number;
  maxValue: number;
  title: string;
  subtitle?: string;
  color?: string;
  loading?: boolean;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  maxValue,
  title,
  subtitle,
  color = '#3b82f6',
  loading = false
}) => {
  if (loading) {
    return (
      <div className="chart-container p-4 h-48">
        <div className="animate-pulse h-full flex flex-col items-center justify-center">
          <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-20 mt-2"></div>
        </div>
      </div>
    );
  }

  // Check if there's no valid data
  if (value === undefined || value === null || isNaN(value) || maxValue === 0) {
    return (
      <div className="chart-container p-4">
        <div className="text-center mb-2">
          <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        </div>
        <div className="h-28 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 text-2xl mb-1">📊</div>
            <p className="text-xs text-gray-500">No data</p>
          </div>
        </div>
      </div>
    );
  }

  const percentage = Math.min((value / maxValue) * 100, 100);

  const getColorByValue = (val: number) => {
    if (val < 30) return '#ef4444';
    if (val < 60) return '#f59e0b';
    if (val < 80) return '#3b82f6';
    return '#10b981';
  };

  const displayColor = color === '#3b82f6' ? getColorByValue(percentage) : color;
  
  // Calculate SVG arc
  const radius = 45;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="chart-container p-4">
      <div className="text-center mb-2">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
      </div>
      <div className="relative h-28 flex items-center justify-center">
        <svg width="120" height="70" viewBox="0 0 120 70">
          {/* Background arc */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke={displayColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <span className="text-2xl font-bold" style={{ color: displayColor }}>
            {percentage.toFixed(1)}%
          </span>
          {subtitle && (
            <span className="text-xs text-gray-500">{subtitle}</span>
          )}
        </div>
      </div>
      <div className="text-center mt-1">
        <span className="text-xs text-gray-500">
          {typeof value === 'number' && !isNaN(value) ? value.toLocaleString() : '0'} / {maxValue.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default GaugeChart;