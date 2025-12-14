import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface HorizontalBarChartProps {
  data: Array<{
    name: string;
    value: number;
    category: 'low' | 'moderate' | 'high' | 'severe';
  }>;
  loading?: boolean;
  title?: string;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ 
  data, 
  loading = false,
  title = "Vulnerability Index by Region"
}) => {
  if (loading) {
    return (
      <div className="chart-container p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Check if there's no data
  if (!data || data.length === 0) {
    return (
      <div className="chart-container p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
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

  const getBarColor = (category: string) => {
    switch (category) {
      case 'low': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'high': return '#f97316';
      case 'severe': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 10);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-600">
            Vulnerability Score: <span className="font-semibold">{item.value}</span>
          </p>
          <p className="text-sm capitalize" style={{ color: getBarColor(item.category) }}>
            Risk Level: {item.category}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">
        Top 10 regions ranked by vulnerability score
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            stroke="#6b7280"
            fontSize={12}
            domain={[0, 100]}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#6b7280"
            fontSize={12}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            radius={[0, 4, 4, 0]}
            barSize={20}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.category)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        {['low', 'moderate', 'high', 'severe'].map((category) => (
          <div key={category} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: getBarColor(category) }}
            ></div>
            <span className="text-xs text-gray-600 capitalize">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalBarChart;