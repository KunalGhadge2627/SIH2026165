import React from 'react';
import { useAppState } from './context/AppStateContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { ShieldAlert, X } from 'lucide-react';
import { isViewAllowed } from './utils/rbac';

import { DashboardView } from './components/views/DashboardView';
import { SafetyReportsView } from './components/views/SafetyReportsView';
import { AiTriageView } from './components/views/AiTriageView';
import { CaseDetailView } from './components/views/CaseDetailView';
import { HeatmapView } from './components/views/HeatmapView';
import { PatternExplorerView } from './components/views/PatternExplorerView';
import { TrendEarlyWarningView } from './components/views/TrendEarlyWarningView';
import { LifeSavingRulesView } from './components/views/LifeSavingRulesView';
import { ReportIngestionView } from './components/views/ReportIngestionView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ModelHealthView } from './components/views/ModelHealthView';
import { SettingsView } from './components/views/SettingsView';
import { LoginView } from './components/views/LoginView';

export const AppContent: React.FC = () => {
  const { isLoggedIn, activeView, currentUser, unauthorizedNotice, dismissUnauthorizedNotice } = useAppState();

  if (!isLoggedIn || activeView === 'login') {
    return <LoginView />;
  }

  const renderMainView = () => {
    // Route-level protection check
    if (!isViewAllowed(currentUser.role, activeView)) {
      return <DashboardView />;
    }

    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'reports':
        return <SafetyReportsView />;
      case 'triage':
        return <AiTriageView />;
      case 'case-detail':
        return <CaseDetailView />;
      case 'heatmap':
        return <HeatmapView />;
      case 'patterns':
        return <PatternExplorerView />;
      case 'trend':
        return <TrendEarlyWarningView />;
      case 'rules':
        return <LifeSavingRulesView />;
      case 'ingestion':
        return <ReportIngestionView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'model-health':
        return <ModelHealthView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-oil-bg flex flex-col font-sans">
      <Header />
      <SearchModal />

      <div className="flex-1 flex relative">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-5 lg:p-7">
          {unauthorizedNotice && (
            <div className="mb-5 bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-3 text-amber-900 text-xs font-bold">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{unauthorizedNotice}</span>
              </div>
              <button
                onClick={dismissUnauthorizedNotice}
                className="p-1 rounded-lg text-amber-700 hover:bg-amber-100"
                aria-label="Dismiss message"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {renderMainView()}
        </main>
      </div>

      <Footer />
    </div>
  );
};

