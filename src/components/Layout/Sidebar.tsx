import React from 'react';
import {
  LayoutDashboard,
  GitCompare,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Activity,
  Map,
  TrendingUp,
} from 'lucide-react';

export type PageType = 'dashboard' | 'comparison' | 'reports' | 'geographic' | 'analysis';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  collapsed,
  onToggleCollapse,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as PageType,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Executive Summary'
    },
    {
      id: 'analysis' as PageType,
      label: 'Deep Analysis',
      icon: TrendingUp,
      description: 'Correlation & Trends'
    },
    {
      id: 'geographic' as PageType,
      label: 'Geographic',
      icon: Map,
      description: 'Regional Insights'
    },
    {
      id: 'comparison' as PageType,
      label: 'Comparison',
      icon: GitCompare,
      description: 'Compare Regions'
    },
    {
      id: 'reports' as PageType,
      label: 'Reports',
      icon: FileDown,
      description: 'Download Reports'
    }
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-400" />
            <span className="font-bold text-lg">HealthViz</span>
          </div>
        )}
        {collapsed && <Activity className="h-8 w-8 text-blue-400 mx-auto" />}
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''}`} />
                  {!collapsed && (
                    <div className="ml-3 text-left">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.description}</p>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

    </aside>
  );
};

export default Sidebar;
