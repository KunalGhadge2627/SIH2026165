import React from 'react';
import { Search, Bell, Shield, UserCheck, RefreshCw } from 'lucide-react';
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
    isSidebarCollapsed
  } = useAppState();

  const activeAlertsCount = alerts.filter((a) => a.status === 'Active').length;

  return (
    <header className="bg-oil-navy text-white sticky top-0 z-30 shadow-md border-b-2 border-oil-gold">
      {/* Top Govt Bar */}
      <div className="bg-oil-navy-dark px-4 py-1 flex items-center justify-between text-[11px] text-slate-300 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-oil-gold uppercase tracking-wider">Government of India Enterprise</span>
          <span className="text-slate-500">|</span>
          <span className="hidden md:inline">Oil India Limited (A Navratna PSE)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Protected HSSE Environment
          </span>
          <span className="hidden sm:inline text-slate-400">
            Last Sync: 31 Aug 2026, 08:42 PM
          </span>
        </div>
      </div>

      {/* Main Corporate Header */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded text-slate-200 hover:text-white hover:bg-white/10 transition lg:hidden"
            title="Toggle Sidebar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('dashboard')}>
            {/* OIL Logo Emblem */}
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-oil-gold p-1 shadow-inner">
              <div className="text-center font-extrabold text-oil-navy text-xs leading-none">
                <span className="block text-[14px] text-oil-navy tracking-tighter">OIL</span>
                <span className="text-[7px] text-amber-600 block uppercase font-bold">India</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base lg:text-lg tracking-tight text-white leading-none">
                  OIL INDIA LIMITED
                </h1>
                <span className="bg-amber-400/20 text-oil-gold text-[10px] font-bold px-1.5 py-0.5 rounded border border-oil-gold/40">
                  HSSE AI
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium tracking-wide">
                SIF Precursor Intelligence Platform
              </p>
            </div>
          </div>
        </div>

        {/* Right side widgets */}
        <div className="flex items-center gap-3">
          {/* Global Search Bar */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/15 text-slate-200 px-3 py-1.5 rounded-md text-xs border border-white/20 transition w-56 justify-between"
          >
            <span className="flex items-center gap-2 text-slate-300">
              <Search className="w-3.5 h-3.5" />
              Search Report ID, Site, Rule...
            </span>
            <kbd className="bg-slate-800 text-[10px] text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">⌘K</kbd>
          </button>

          {/* Alert Center Trigger */}
          <button
            onClick={() => navigateTo('trend')}
            className="relative p-2 rounded-md bg-white/10 hover:bg-white/15 text-white transition border border-white/20"
            title="Early Warning Alert Center"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white animate-bounce">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Role Switcher for Demo */}
          <div className="hidden lg:flex items-center bg-white/10 rounded-md border border-white/20 px-2 py-1 text-xs">
            <Shield className="w-3.5 h-3.5 text-oil-gold mr-1.5" />
            <span className="text-slate-300 mr-1.5 font-medium">Role:</span>
            <select
              value={currentUser.role}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-oil-navy text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="HSE Officer">HSE Officer (Corporate)</option>
              <option value="Site Manager">Site Manager (Field)</option>
              <option value="System Administrator">System Administrator</option>
            </select>
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 bg-white/10 border border-white/20 pl-2.5 pr-3 py-1 rounded-md">
            <div className="w-7 h-7 bg-amber-500 text-oil-navy rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
              {currentUser.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-oil-gold font-medium leading-tight">{currentUser.role}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
