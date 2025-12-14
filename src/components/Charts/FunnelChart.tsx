import React from 'react';

interface FunnelChartProps {
  data: Array<{
    stage: string;
    value: number;
    percentage: number;
  }>;
  loading?: boolean;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="chart-container p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-2">
            {[100, 85, 70, 55, 40].map((width, i) => (
              <div 
                key={i} 
                className="h-12 bg-gray-200 rounded mx-auto"
                style={{ width: `${width}%` }}
              ></div>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vaccination Journey Funnel
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

  const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="chart-container p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Vaccination Journey Funnel
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Track drop-off points in the vaccination process
      </p>

      <div className="space-y-3 overflow-hidden">
        {data.map((item, index) => {
          const widthPercentage = (item.value / maxValue) * 100;
          const dropOff = index > 0 
            ? ((data[index - 1].value - item.value) / data[index - 1].value * 100).toFixed(1)
            : null;

          return (
            <div key={item.stage} className="flex items-center gap-2">
              <div 
                className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer flex-shrink-0"
                style={{ 
                  width: `${Math.max(widthPercentage, 35)}%`,
                  backgroundColor: colors[index % colors.length]
                }}
              >
                <div className="px-3 py-2 text-white">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-xs truncate">{item.stage}</span>
                    <span className="text-xs opacity-90 flex-shrink-0">
                      {(item.value / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="text-xs opacity-75">
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {/* Drop-off indicator */}
              {dropOff && (
                <span className="text-xs text-red-500 font-medium whitespace-nowrap flex-shrink-0">
                  ↓ {dropOff}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {data[0]?.value ? (data[0].value / 1000000).toFixed(1) : 0}M
            </p>
            <p className="text-xs text-gray-500">Eligible Population</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {data[data.length - 1]?.percentage?.toFixed(1) || 0}%
            </p>
            <p className="text-xs text-gray-500">Completion Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">
              {data.length > 1 
                ? ((1 - data[data.length - 1].value / data[0].value) * 100).toFixed(1)
                : 0}%
            </p>
            <p className="text-xs text-gray-500">Total Drop-off</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;