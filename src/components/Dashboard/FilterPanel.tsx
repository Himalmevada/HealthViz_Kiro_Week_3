import React, { useMemo } from 'react';
import { Calendar, MapPin, Filter, X, Wind, Clock } from 'lucide-react';
import { FilterState } from '../../types/dashboard';
import { getCountryList } from '../../utils/countryMapping';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
  availableCities?: string[]; // Cities from actual AQI data
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
  availableCities = []
}) => {
  const countries = useMemo(() => {
    return getCountryList().map(name => ({ code: name, name }));
  }, []);

  const pollutants = ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3'];

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const handleCountryChange = (countryCode: string) => {
    const newCountries = toggleArrayItem(filters.countries, countryCode);
    // Ensure at least one country is selected
    if (newCountries.length > 0) {
      // Reset cities when country changes
      onFiltersChange({
        ...filters,
        countries: newCountries,
        cities: []
      });
    }
  };

  const handleCityChange = (city: string) => {
    const newCities = toggleArrayItem(filters.cities, city);
    updateFilter('cities', newCities);
  };

  const handlePollutantChange = (pollutant: string) => {
    const newPollutants = toggleArrayItem(filters.pollutants, pollutant);
    if (newPollutants.length > 0) {
      updateFilter('pollutants', newPollutants);
    }
  };

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    updateFilter('dateRange', {
      ...filters.dateRange,
      [field]: value
    });
  };

  const handleTimeAggregationChange = (period: 'daily' | 'weekly' | 'monthly') => {
    updateFilter('timeAggregation', period);
  };

  const resetFilters = () => {
    onFiltersChange({
      dateRange: { start: '2021-01-01', end: '2024-12-31' },
      countries: ['India'],
      cities: [],
      pollutants: ['PM2.5'],
      timeAggregation: 'monthly'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.countries.length > 1) count++;
    if (filters.cities.length > 0) count++;
    if (filters.pollutants.length > 1) count++;
    if (filters.timeAggregation !== 'monthly') count++;
    return count;
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-full px-6 py-4">
        {/* Header with Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {getActiveFilterCount() > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                {getActiveFilterCount()} active
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className={`flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
              isOpen 
                ? 'bg-gray-600 text-white hover:bg-gray-700' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 animate-pulse hover:animate-none'
            }`}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            <span>{isOpen ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        {/* Collapsible Filters Section */}
        {isOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">

            {/* Date Range */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Start</label>
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">End</label>
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                COVID vaccination data only (AQI shows current data)
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  { label: '2021', start: '2021-01-01', end: '2021-12-31' },
                  { label: '2022', start: '2022-01-01', end: '2022-12-31' },
                  { label: '2023', start: '2023-01-01', end: '2023-12-31' },
                  { label: '2024', start: '2024-01-01', end: '2024-12-31' },
                  { label: 'All', start: '2021-01-01', end: '2024-12-31' }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => updateFilter('dateRange', { start: preset.start, end: preset.end })}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      filters.dateRange.start === preset.start && filters.dateRange.end === preset.end
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Aggregation */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4 mr-2 text-purple-500" />
                Time Period
              </label>
              <div className="flex gap-1.5">
                {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => handleTimeAggregationChange(period)}
                    className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors capitalize ${
                      filters.timeAggregation === period
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 mr-2 text-green-500" />
                Countries ({filters.countries.length})
              </label>
              <p className="text-xs text-gray-500">
                Affects both COVID and AQI data
              </p>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                {countries.map((country) => (
                  <label
                    key={country.code}
                    className={`flex items-center p-1.5 rounded-md cursor-pointer transition-colors text-xs ${
                      filters.countries.includes(country.code)
                        ? 'bg-green-50 border border-green-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.countries.includes(country.code)}
                      onChange={() => handleCountryChange(country.code)}
                      className="h-3 w-3 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className={`ml-1.5 ${
                      filters.countries.includes(country.code) ? 'text-green-800 font-medium' : 'text-gray-700'
                    }`}>
                      {country.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cities (AQI data only) */}
            {availableCities.length > 0 && (
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                  Cities ({filters.cities.length || 'All'})
                </label>
                <p className="text-xs text-gray-500">
                  For AQI data only (COVID is country-level) • {availableCities.length} cities available
                </p>
                <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
                  {availableCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCityChange(city)}
                      className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${
                        filters.cities.includes(city)
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
                {filters.cities.length > 0 && (
                  <button
                    onClick={() => updateFilter('cities', [])}
                    className="text-xs text-orange-600 hover:text-orange-700 underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}

            {/* Pollutants */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Wind className="h-4 w-4 mr-2 text-red-500" />
                Pollutants ({filters.pollutants.length})
              </label>
              <p className="text-xs text-gray-500">
                For AQI data only
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {pollutants.map((pollutant) => (
                  <button
                    key={pollutant}
                    onClick={() => handlePollutantChange(pollutant)}
                    className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${
                      filters.pollutants.includes(pollutant)
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pollutant}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters Button */}
            <div className="space-y-2">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                Reset All Filters
              </button>
              <p className="text-xs text-center text-gray-500">
                Filters apply automatically
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;