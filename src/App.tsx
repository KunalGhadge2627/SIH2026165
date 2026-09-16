import React from 'react';
import { useAppState } from './context/AppStateContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';

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
  const { isLoggedIn, activeView } = useAppState();

  if (!isLoggedIn || activeView === 'login') {
    return <LoginView />;
  }

  const renderMainView = () => {
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

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {renderMainView()}
        </main>
      </div>

      <Footer />
    </div>
  );
};
