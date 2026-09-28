import React from 'react';
import { LayoutDashboard, FileText, BrainCircuit, Map, GitMerge, TrendingUp, ShieldAlert, UploadCloud, Settings, Activity, LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAppState, ViewName } from '../../context/AppStateContext';
import { isViewAllowed } from '../../utils/rbac';

export const Sidebar: React.FC = () => {
  const { activeView, navigateTo, isSidebarCollapsed, toggleSidebar, logout, reports, currentUser } = useAppState();
  const awaitingReviewCount = reports.filter((r) => r.review_status === 'Awaiting HSE Review').length;
  
  const rawSections: Array<{ title: string; items: Array<{ id: ViewName; label: string; icon: React.ElementType; badge?: number }> }> = [
    { title: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
    { title: 'Analyze', items: [
      { id: 'reports', label: 'Safety Reports', icon: FileText },
      { id: 'triage', label: 'AI Review', icon: BrainCircuit, badge: awaitingReviewCount },
      { id: 'trend', label: 'Risk Alerts', icon: TrendingUp },
    ] },
    { title: 'Understand', items: [
      { id: 'heatmap', label: 'Risk Locations', icon: Map },
      { id: 'patterns', label: 'Risk Patterns', icon: GitMerge },
      { id: 'rules', label: 'Life-Saving Rules', icon: ShieldAlert },
      { id: 'analytics', label: 'Safety Trends', icon: Activity },
    ] },
    { title: 'Manage', items: [
      { id: 'ingestion', label: 'Upload Reports', icon: UploadCloud },
      { id: 'settings', label: 'Settings', icon: Settings },
    ] },
  ];

  // Filter sections and items based on role permissions
  const sections = rawSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => isViewAllowed(currentUser.role, item.id))
    }))
    .filter((section) => section.items.length > 0);

  return <>
    {!isSidebarCollapsed && <div className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={toggleSidebar} />}
    <aside className={`fixed lg:sticky lg:top-[104px] lg:h-[calc(100vh-104px)] self-start z-40 inset-y-0 left-0 shrink-0 bg-oil-navy text-white transition-all duration-300 flex flex-col ${isSidebarCollapsed ? 'w-16 -translate-x-full lg:translate-x-0' : 'w-64 translate-x-0'}`}>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="h-14 px-3 border-b border-white/10 flex items-center justify-between shrink-0">
          {!isSidebarCollapsed && <div><div className="text-xs font-extrabold tracking-wide">SAFETY INTELLIGENCE</div><div className="text-[9px] text-slate-400 mt-0.5">OIL • HSSE</div></div>}
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-white/10" aria-label="Toggle navigation">
            <span className="lg:hidden"><X className="w-4 h-4" /></span>
            <span className="hidden lg:inline">{isSidebarCollapsed ? <ChevronRight className="w-4 h-4"/> : <ChevronLeft className="w-4 h-4"/>}</span>
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-4">
          {sections.map(section => <div key={section.title}>
            {!isSidebarCollapsed && <div className="px-3 mb-1.5 text-[9px] uppercase tracking-[.16em] font-bold text-slate-400">{section.title}</div>}
            <div className="space-y-1">{section.items.map(item => { const Icon=item.icon; const active=activeView===item.id; return <button key={item.id} onClick={()=>{navigateTo(item.id); if(window.innerWidth<1024 && !isSidebarCollapsed) toggleSidebar();}} title={isSidebarCollapsed?item.label:undefined} className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${active?'bg-white text-oil-navy shadow-sm':'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon className="w-4 h-4 shrink-0"/>{!isSidebarCollapsed&&<span className="flex-1 text-left truncate">{item.label}</span>}{!isSidebarCollapsed&&item.badge!==undefined&&item.badge>0&&<span className="rounded-full bg-oil-gold text-oil-navy px-2 py-0.5 text-[9px] font-extrabold">{item.badge}</span>}</button>})}</div>
          </div>)}
          
          {/* Sign Out moved upwards directly into navigation */}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={logout}
              title={isSidebarCollapsed ? 'Sign out' : undefined}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-100 transition"
            >
              <LogOut className="w-4 h-4 shrink-0 text-red-400" />
              {!isSidebarCollapsed && <span>Sign out</span>}
            </button>
          </div>
        </nav>
      </div>
    </aside>
  </>;
};

