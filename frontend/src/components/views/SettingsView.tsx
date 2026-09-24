import React from 'react';
import { Settings as SettingsIcon, Shield, Sliders, Lock, Database, UserCheck } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { UserRole } from '../../types/safety';

export const SettingsView: React.FC = () => {
  const { currentUser, setUserRole } = useAppState();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-oil-navy" />
            <h1 className="text-xl font-extrabold text-oil-navy tracking-tight">
              System Settings & Configuration
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Role-based access control, AI classification threshold parameters, and site configurations.
          </p>
        </div>
      </div>

      {/* Role Switcher Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-oil-navy border-b border-slate-100 pb-3 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-oil-gold" />
          Active User Profile & Role Switcher
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {(['HSE Officer', 'Site Manager', 'System Administrator'] as UserRole[]).map((role) => (
            <div
              key={role}
              onClick={() => setUserRole(role)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                currentUser.role === role
                  ? 'bg-oil-navy text-white border-oil-navy shadow-md font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold">{role}</span>
                {currentUser.role === role && (
                  <span className="bg-oil-gold text-oil-navy text-[10px] font-bold px-1.5 py-0.5 rounded">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] opacity-80">
                {role === 'HSE Officer'
                  ? 'Full review workbench access, AI label confirmation, global analytics.'
                  : role === 'Site Manager'
                  ? 'Site-specific dashboard, trend alerts, and action item tracking.'
                  : 'Model retraining parameters, API keys, system logs, user administration.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Threshold Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
        <h2 className="text-base font-bold text-oil-navy border-b border-slate-100 pb-3 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-oil-blue" />
          AI Triage Threshold Configurations
        </h2>

        <div className="space-y-4 max-w-lg">
          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>PSIF High-Recall Threshold Score:</span>
              <span className="font-mono text-oil-navy">0.55 (55.0%)</span>
            </div>
            <input type="range" min="30" max="80" defaultValue="55" className="w-full cursor-pointer" />
            <span className="text-[10px] text-slate-400">Reports with score &gt; 55% are flagged into PSIF Triage Queue.</span>
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>Critical Severity Alert Trigger Score:</span>
              <span className="font-mono text-red-600">0.85 (85.0%)</span>
            </div>
            <input type="range" min="70" max="95" defaultValue="85" className="w-full cursor-pointer" />
            <span className="text-[10px] text-slate-400">Triggers immediate SMS/Email alert to Corporate HSE Head.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
