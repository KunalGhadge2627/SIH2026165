import React from 'react';
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  Grid,
  GitMerge,
  TrendingUp,
  ShieldAlert,
  CheckSquare,
  BarChart3,
  UploadCloud,
  Cpu,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  HelpCircle,
  Bell
} from 'lucide-react';
import { useAppState, ViewName } from '../../context/AppStateContext';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    navigateTo,
    isSidebarCollapsed,
    toggleSidebar,
    currentUser,
    logout,
    reports
  } = useAppState();

  const awaitingReviewCount = reports.filter((r) => r.review_status === 'Awaiting HSE Review').length;
  const criticalCount = reports.filter((r) => r.risk_level === 'CRITICAL').length;

  const navItems: Array<{
    id: ViewName;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports', label: 'Safety Reports', icon: FileText },
    { id: 'triage', label: 'AI Triage', icon: BrainCircuit, badge: awaitingReviewCount, badgeColor: 'bg-amber-500 text-oil-navy' },
    { id: 'heatmap', label: 'SIF Precursor Heatmap', icon: Grid },
    { id: 'patterns', label: 'Pattern Explorer', icon: GitMerge },
    { id: 'trend', label: 'Trend & Early Warning', icon: TrendingUp },
    { id: 'rules', label: 'Life-Saving Rules', icon: ShieldAlert },
    { id: 'case-detail', label: 'Case Review', icon: CheckSquare, badge: criticalCount, badgeColor: 'bg-red-600 text-white' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ingestion', label: 'Report Ingestion', icon: UploadCloud },
    { id: 'model-health', label: 'Model & System Health', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <aside
      className={`bg-oil-navy text-slate-200 transition-all duration-300 flex flex-col border-r border-slate-700 select-none z-20 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header Collapse Toggle */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        {!isSidebarCollapsed && (
          <span className="text-xs font-bold text-oil-gold tracking-wider uppercase px-2">
            Navigation Menu
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition mx-auto"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-oil-gold text-oil-navy font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-oil-navy' : 'text-slate-300'}`} />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isSidebarCollapsed && item.badge !== undefined && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Controls */}
      <div className="p-3 border-t border-white/10 bg-oil-navy-dark">
        {!isSidebarCollapsed ? (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Logged in as</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/40">
                ACTIVE
              </span>
            </div>
            <div className="bg-white/5 rounded-md p-2 border border-white/10 mb-3">
              <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[11px] text-oil-gold truncate">{currentUser.role}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser.department}</div>
            </div>

            <div className="grid grid-cols-4 gap-1 pt-1 border-t border-white/10 text-center">
              <button
                onClick={() => navigateTo('settings')}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded flex justify-center"
                title="Profile Settings"
              >
                <User className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo('trend')}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded flex justify-center"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo('model-health')}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded flex justify-center"
                title="Help & System Info"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded flex justify-center"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <button
              onClick={logout}
              className="p-2 text-red-400 hover:bg-red-950/50 rounded"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
