import React from 'react';
import { TrendingUp, TrendingDown, Users, Wind, AlertTriangle } from 'lucide-react';
import { DashboardMetrics } from '../../types/dashboard';

interface MetricsCardsProps {
  metrics: DashboardMetrics;
  loading?: boolean;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics, loading = false }) => {
  const cards = [
    {
      title: 'Total Vaccinations',
      value: metrics.totalVaccinations?.toLocaleString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: 'Vaccination Rate',
      value: `${metrics.vaccinationRate?.toFixed(1) || '0'}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+2.3%',
      trendUp: true
    },
    {
      title: 'Average AQI',
      value: Math.round(metrics.averageAqi || 0).toString(),
      icon: Wind,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '-5.1%',
      trendUp: false
    },
    {
      title: 'Vulnerable Locations',
      value: metrics.vulnerableLocations?.toString() || '0',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: '-8.2%',
      trendUp: false
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="metric-card animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className={`flex items-center text-sm ${
                card.trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.trendUp ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="font-medium">{card.trend}</span>
              </div>
              <span className="text-gray-500 text-sm ml-2">vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsCards;