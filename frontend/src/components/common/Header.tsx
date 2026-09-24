import React from 'react';
import { Bell, Menu, Search, ShieldCheck } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { UserRole } from '../../types/safety';

export const Header: React.FC = () => {
  const {
    currentUser,
    setUserRole,
    setIsSearchModalOpen,
    alerts,
    navigateTo,
    toggleSidebar,
  } = useAppState();

  const activeAlertsCount = alerts.filter((a) => a.status === 'Active').length;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="h-8 bg-oil-navy px-4 lg:px-6 flex items-center justify-between text-[11px] text-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-oil-gold">GOVERNMENT OF INDIA ENTERPRISE</span>
          <span className="text-slate-500">|</span>
          <span className="hidden sm:inline">Oil India Limited</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Protected safety environment
        </div>
      </div>

      <div className="h-[72px] px-4 lg:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Open menu">
            <Menu className="w-5 h-5 text-oil-navy" />
          </button>

          <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-3 text-left min-w-0">
            <div className="w-10 h-10 rounded-xl border-2 border-oil-gold bg-white flex items-center justify-center shadow-sm shrink-0">
              <div className="text-center font-extrabold leading-none text-oil-navy">
                <div className="text-sm tracking-tight">OIL</div>
                <div className="text-[7px] text-amber-600 uppercase">India</div>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-oil-navy text-base lg:text-lg truncate">OIL Safety Intelligence</span>
                <span className="hidden md:inline-flex rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">AI</span>
              </div>
              <p className="text-xs text-slate-500 truncate">AI-powered SIF precursor detection</p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="hidden md:flex h-10 w-52 lg:w-64 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-500 hover:bg-white hover:border-slate-300"
          >
            <Search className="w-4 h-4" />
            <span>Search reports or sites...</span>
          </button>

          <button
            onClick={() => navigateTo('trend')}
            className="relative h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50"
            title="Safety alerts"
          >
            <Bell className="w-4 h-4 text-oil-navy" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                {activeAlertsCount}
              </span>
            )}
          </button>

          <div className="hidden xl:flex items-center gap-2 h-10 rounded-xl border border-slate-200 bg-slate-50 px-3">
            <ShieldCheck className="w-4 h-4 text-oil-gold" />
            <select
              value={currentUser.role}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-semibold text-oil-navy outline-none"
            >
              <option value="HSE Officer">HSE Officer</option>
              <option value="Site Manager">Site Manager</option>
              <option value="System Administrator">System Administrator</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-oil-navy text-white flex items-center justify-center text-xs font-bold">
              {currentUser.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-oil-navy">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500">{currentUser.role}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
