import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  SafetyReport,
  EarlyWarningAlert,
  ModelHealthStats,
  UserProfile,
  UserRole,
  ReviewStatus,
  LifeSavingRuleName
} from '../types/safety';
import { MOCK_SAFETY_REPORTS } from '../data/mockReports';
import { MOCK_EARLY_WARNING_ALERTS } from '../data/mockAlerts';
import { INITIAL_MODEL_HEALTH } from '../data/mockModelHealth';
import { isViewAllowed, getAccessDeniedReason } from '../utils/rbac';

export type ViewName =
  | 'dashboard'
  | 'reports'
  | 'triage'
  | 'case-detail'
  | 'heatmap'
  | 'patterns'
  | 'trend'
  | 'rules'
  | 'ingestion'
  | 'analytics'
  | 'model-health'
  | 'settings'
  | 'login';

interface NavigateOptions {
  reportId?: string;
  ruleName?: LifeSavingRuleName;
  site?: string;
  statusFilter?: string;
  riskFilter?: string;
}

interface AppStateContextType {
  isLoggedIn: boolean;
  activeView: ViewName;
  selectedReportId: string | null;
  selectedRuleName: LifeSavingRuleName | null;
  selectedSiteFilter: string;
  selectedTimeFilter: string;
  selectedRiskFilter: string;
  selectedRuleFilter: string;
  selectedStatusFilter: string;
  searchQuery: string;
  isSearchModalOpen: boolean;
  isSidebarCollapsed: boolean;
  currentUser: UserProfile;
  reports: SafetyReport[];
  alerts: EarlyWarningAlert[];
  modelHealth: ModelHealthStats;
  unauthorizedNotice: string | null;
  
  // Actions
  navigateTo: (view: ViewName, options?: NavigateOptions) => void;
  dismissUnauthorizedNotice: () => void;
  updateReportStatus: (
    reportId: string,
    decision: 'Confirmed PSIF' | 'Rejected PSIF' | 'Further Review',
    comment: string
  ) => void;
  addReport: (report: SafetyReport) => void;
  addBatchReports: (newReports: SafetyReport[]) => void;
  setSiteFilter: (site: string) => void;
  setTimeFilter: (time: string) => void;
  setRiskFilter: (risk: string) => void;
  setRuleFilter: (rule: string) => void;
  setStatusFilter: (status: string) => void;
  setSearchQuery: (query: string) => void;
  setIsSearchModalOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setUserRole: (role: UserRole) => void;
  login: () => void;
  logout: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<ViewName>('dashboard');
  const [selectedReportId, setSelectedReportId] = useState<string | null>('OIL-INC-2026-00482');
  const [selectedRuleName, setSelectedRuleName] = useState<LifeSavingRuleName | null>(null);
  
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('All OIL Sites');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('30 Days');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All');
  const [selectedRuleFilter, setSelectedRuleFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [unauthorizedNotice, setUnauthorizedNotice] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: 'Rajesh Sharma',
    employee_id: 'OIL-HSE-84920',
    role: 'HSE Officer',
    department: 'Corporate HSSE Division',
    site_scope: 'All Assam Operational Sites'
  });

  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [reports, setReports] = useState<SafetyReport[]>(MOCK_SAFETY_REPORTS);
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(MOCK_EARLY_WARNING_ALERTS);
  const [modelHealth, setModelHealth] = useState<ModelHealthStats>(INITIAL_MODEL_HEALTH);

  React.useEffect(() => {
    let isMounted = true;
    import('../services/api').then(({ api }) => {
      api.checkHealth().then((connected) => {
        if (isMounted) setIsBackendConnected(connected);
        if (connected) {
          api.getReports().then((data) => {
            if (isMounted && data && data.length > 0) {
              // Backend is available — use backend reports as the primary source.
              // Backend records take priority; any locally-submitted reports
              // not yet persisted to backend are appended so nothing is lost.
              setReports((prev) => {
                const map = new Map<string, SafetyReport>();
                // Backend records first (authoritative)
                data.forEach((r) => map.set(r.report_id, r));
                // Keep session-only records not yet in backend
                prev.forEach((r) => {
                  if (!map.has(r.report_id)) map.set(r.report_id, r);
                });
                return Array.from(map.values());
              });
            }
          }).catch(() => {});
        }
      });
    });
    return () => { isMounted = false; };
  }, []);

  const refreshBackendData = async () => {
    try {
      const { api } = await import('../services/api');
      const data = await api.getReports();
      if (data && data.length > 0) {
        setReports((prev) => {
          const map = new Map();
          data.forEach((r) => map.set(r.report_id, r));
          prev.forEach((r) => { if (!map.has(r.report_id)) map.set(r.report_id, r); });
          return Array.from(map.values());
        });
      }
    } catch {}
  };

  const dismissUnauthorizedNotice = () => setUnauthorizedNotice(null);

  const navigateTo = (view: ViewName, options?: NavigateOptions) => {
    if (!isViewAllowed(currentUser.role, view)) {
      setUnauthorizedNotice(`Access Denied: ${getAccessDeniedReason(currentUser.role, view)} Redirected to Dashboard.`);
      setActiveView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setUnauthorizedNotice(null);
    setActiveView(view);
    if (options?.reportId) setSelectedReportId(options.reportId);
    if (options?.ruleName) setSelectedRuleName(options.ruleName);
    if (options?.site) setSelectedSiteFilter(options.site);
    if (options?.statusFilter) setSelectedStatusFilter(options.statusFilter);
    if (options?.riskFilter) setSelectedRiskFilter(options.riskFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateReportStatus = (
    reportId: string,
    decision: 'Confirmed PSIF' | 'Rejected PSIF' | 'Further Review',
    comment: string
  ) => {
    const newStatus: ReviewStatus =
      decision === 'Confirmed PSIF'
        ? 'Confirmed PSIF'
        : decision === 'Rejected PSIF'
        ? 'Rejected PSIF'
        : 'Under Investigation';

    setReports((prev) =>
      prev.map((rep) => {
        if (rep.report_id === reportId) {
          return {
            ...rep,
            review_status: newStatus,
            hse_feedback: {
              confirmed_by: `${currentUser.name} (${currentUser.role})`,
              confirmed_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
              comment,
              decision
            }
          };
        }
        return rep;
      })
    );

    // Update continuous learning feedback stats
    setModelHealth((prev) => ({
      ...prev,
      reviewed_reports_count: prev.reviewed_reports_count + 1,
      new_training_labels: prev.new_training_labels + 1,
      corrections_count: decision === 'Rejected PSIF' ? prev.corrections_count + 1 : prev.corrections_count
    }));
  };

  const addReport = (newReport: SafetyReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const addBatchReports = (newReports: SafetyReport[]) => {
    setReports((prev) => [...newReports, ...prev]);
  };

  const setUserRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
      department:
        role === 'HSE Officer'
          ? 'Corporate HSSE Division'
          : role === 'Site Manager'
          ? 'Duliajan Field Operations'
          : 'IT & Safety Systems'
    }));

    if (role === 'Site Manager') {
      setSelectedSiteFilter('Duliajan');
    }

    if (!isViewAllowed(role, activeView)) {
      setActiveView('dashboard');
      setUnauthorizedNotice(`Access Denied: ${getAccessDeniedReason(role, activeView)} Redirected to Dashboard.`);
    } else {
      setUnauthorizedNotice(null);
    }
  };

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
  const login = () => {
    setIsLoggedIn(true);
    setActiveView('dashboard');
  };
  const logout = () => {
    setIsLoggedIn(false);
    setActiveView('login');
  };

  const value = useMemo(
    () => ({
      isLoggedIn,
      activeView,
      selectedReportId,
      selectedRuleName,
      selectedSiteFilter,
      selectedTimeFilter,
      selectedRiskFilter,
      selectedRuleFilter,
      selectedStatusFilter,
      searchQuery,
      isSearchModalOpen,
      isSidebarCollapsed,
      currentUser,
      reports,
      alerts,
      modelHealth,
      unauthorizedNotice,
      navigateTo,
      dismissUnauthorizedNotice,
      updateReportStatus,
      addReport,
      addBatchReports,
      setSiteFilter: setSelectedSiteFilter,
      setTimeFilter: setSelectedTimeFilter,
      setRiskFilter: setSelectedRiskFilter,
      setRuleFilter: setSelectedRuleFilter,
      setStatusFilter: setSelectedStatusFilter,
      setSearchQuery,
      setIsSearchModalOpen,
      toggleSidebar,
      setUserRole,
      login,
      logout
    }),
    [
      isLoggedIn,
      activeView,
      selectedReportId,
      selectedRuleName,
      selectedSiteFilter,
      selectedTimeFilter,
      selectedRiskFilter,
      selectedRuleFilter,
      selectedStatusFilter,
      searchQuery,
      isSearchModalOpen,
      isSidebarCollapsed,
      currentUser,
      reports,
      alerts,
      modelHealth,
      unauthorizedNotice
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
