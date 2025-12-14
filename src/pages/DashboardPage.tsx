import React, { useMemo } from 'react';
import MetricsCards from '../components/Dashboard/MetricsCards';
import GaugeChart from '../components/Charts/GaugeChart';
import DualAxisChart from '../components/Charts/DualAxisChart';
import VulnerabilityMap from '../components/Charts/VulnerabilityMap';
import { DashboardMetrics, VulnerabilityScore } from '../types/dashboard';

interface DashboardPageProps {
  metrics: DashboardMetrics;
  dualAxisData: Array<{ date: string; vaccination: number; aqi: number }>;
  vulnerabilityData: VulnerabilityScore[];
  loading: boolean;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  metrics,
  dualAxisData,
  vulnerabilityData,
  loading
}) => {
  // Calculate dynamic insights based on current data
  const insights = useMemo(() => {
    const highRiskCount = vulnerabilityData.filter(v => 
      v.riskCategory === 'severe' || v.riskCategory === 'high'
    ).length;
    
    const avgVulnerability = vulnerabilityData.length > 0
      ? vulnerabilityData.reduce((sum, v) => sum + v.vulnerabilityIndex, 0) / vulnerabilityData.length
      : 0;

    return {
      highRiskCount,
      avgVulnerability,
      vaccinationStatus: metrics.vaccinationRate > 70 ? 'strong' : metrics.vaccinationRate > 50 ? 'moderate' : 'low',
      aqiStatus: metrics.averageAqi > 150 ? 'unhealthy' : metrics.averageAqi > 100 ? 'moderate' : 'good'
    };
  }, [metrics, vulnerabilityData]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
        <p className="text-gray-600">
          Real-time overview based on selected filters • {vulnerabilityData.length} locations analyzed
        </p>
      </div>

      {/* KPI Metrics */}
      <MetricsCards metrics={metrics} loading={loading} />

      {/* Gauge Charts Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GaugeChart
          value={metrics.vaccinationRate}
          maxValue={100}
          title="National Vaccination"
          subtitle="of population"
          loading={loading}
        />
        <GaugeChart
          value={100 - (metrics.averageAqi / 5)}
          maxValue={100}
          title="Air Quality Score"
          subtitle="inverse of AQI"
          color="#10b981"
          loading={loading}
        />
        <GaugeChart
          value={75}
          maxValue={100}
          title="Target Achievement"
          subtitle="vaccination goal"
          color="#8b5cf6"
          loading={loading}
        />
        <GaugeChart
          value={100 - metrics.vulnerableLocations}
          maxValue={100}
          title="Health Coverage"
          subtitle="protected areas"
          color="#f59e0b"
          loading={loading}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DualAxisChart data={dualAxisData} loading={loading} />
        <VulnerabilityMap vulnerabilityData={vulnerabilityData} loading={loading} />
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`chart-container p-6 bg-gradient-to-br ${
          insights.vaccinationStatus === 'strong' 
            ? 'from-green-50 to-green-100 border-green-200' 
            : insights.vaccinationStatus === 'moderate'
            ? 'from-blue-50 to-blue-100 border-blue-200'
            : 'from-red-50 to-red-100 border-red-200'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <h4 className={`font-semibold ${
                insights.vaccinationStatus === 'strong' ? 'text-green-900' :
                insights.vaccinationStatus === 'moderate' ? 'text-blue-900' : 'text-red-900'
              }`}>Vaccination Progress</h4>
              <p className={`text-sm mt-2 ${
                insights.vaccinationStatus === 'strong' ? 'text-green-700' :
                insights.vaccinationStatus === 'moderate' ? 'text-blue-700' : 'text-red-700'
              }`}>
                {insights.vaccinationStatus === 'strong' 
                  ? 'Strong coverage achieved. Focus on booster campaigns.'
                  : insights.vaccinationStatus === 'moderate'
                  ? 'Moderate coverage. Increase outreach in underserved areas.'
                  : 'Low coverage detected. Urgent intervention needed.'}
              </p>
            </div>
            <span className="text-3xl">💉</span>
          </div>
          <div className={`mt-4 pt-4 border-t ${
            insights.vaccinationStatus === 'strong' ? 'border-green-200' :
            insights.vaccinationStatus === 'moderate' ? 'border-blue-200' : 'border-red-200'
          }`}>
            <span className={`text-xs ${
              insights.vaccinationStatus === 'strong' ? 'text-green-600' :
              insights.vaccinationStatus === 'moderate' ? 'text-blue-600' : 'text-red-600'
            }`}>
              {metrics.totalVaccinations.toLocaleString()} total doses • {metrics.vaccinationRate.toFixed(1)}% coverage
            </span>
          </div>
        </div>

        <div className={`chart-container p-6 bg-gradient-to-br ${
          insights.aqiStatus === 'good' 
            ? 'from-green-50 to-green-100 border-green-200' 
            : insights.aqiStatus === 'moderate'
            ? 'from-yellow-50 to-yellow-100 border-yellow-200'
            : 'from-orange-50 to-orange-100 border-orange-200'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <h4 className={`font-semibold ${
                insights.aqiStatus === 'good' ? 'text-green-900' :
                insights.aqiStatus === 'moderate' ? 'text-yellow-900' : 'text-orange-900'
              }`}>Air Quality Status</h4>
              <p className={`text-sm mt-2 ${
                insights.aqiStatus === 'good' ? 'text-green-700' :
                insights.aqiStatus === 'moderate' ? 'text-yellow-700' : 'text-orange-700'
              }`}>
                {insights.aqiStatus === 'good' 
                  ? 'Good air quality. Conditions favorable for outdoor activities.'
                  : insights.aqiStatus === 'moderate'
                  ? 'Moderate air quality. Sensitive groups should limit exposure.'
                  : 'Unhealthy levels detected. Issue health advisories.'}
              </p>
            </div>
            <span className="text-3xl">🌫️</span>
          </div>
          <div className={`mt-4 pt-4 border-t ${
            insights.aqiStatus === 'good' ? 'border-green-200' :
            insights.aqiStatus === 'moderate' ? 'border-yellow-200' : 'border-orange-200'
          }`}>
            <span className={`text-xs ${
              insights.aqiStatus === 'good' ? 'text-green-600' :
              insights.aqiStatus === 'moderate' ? 'text-yellow-600' : 'text-orange-600'
            }`}>
              Average AQI: {Math.round(metrics.averageAqi)} • {vulnerabilityData.length} locations monitored
            </span>
          </div>
        </div>

        <div className={`chart-container p-6 bg-gradient-to-br ${
          insights.highRiskCount === 0 
            ? 'from-green-50 to-green-100 border-green-200' 
            : insights.highRiskCount <= 2
            ? 'from-yellow-50 to-yellow-100 border-yellow-200'
            : 'from-red-50 to-red-100 border-red-200'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <h4 className={`font-semibold ${
                insights.highRiskCount === 0 ? 'text-green-900' :
                insights.highRiskCount <= 2 ? 'text-yellow-900' : 'text-red-900'
              }`}>Priority Action</h4>
              <p className={`text-sm mt-2 ${
                insights.highRiskCount === 0 ? 'text-green-700' :
                insights.highRiskCount <= 2 ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {insights.highRiskCount === 0 
                  ? 'No high-risk zones. Continue monitoring and prevention.'
                  : `${insights.highRiskCount} high-risk zone${insights.highRiskCount > 1 ? 's' : ''} identified. Deploy mobile vaccination units.`}
              </p>
            </div>
            <span className="text-3xl">{insights.highRiskCount === 0 ? '✅' : '⚠️'}</span>
          </div>
          <div className={`mt-4 pt-4 border-t ${
            insights.highRiskCount === 0 ? 'border-green-200' :
            insights.highRiskCount <= 2 ? 'border-yellow-200' : 'border-red-200'
          }`}>
            <span className={`text-xs ${
              insights.highRiskCount === 0 ? 'text-green-600' :
              insights.highRiskCount <= 2 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              Avg vulnerability score: {insights.avgVulnerability.toFixed(1)} • {insights.highRiskCount} critical areas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;