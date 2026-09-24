import React, { useState } from 'react';
import { Lock, Shield, ArrowRight, UserCheck } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { UserRole } from '../../types/safety';

export const LoginView: React.FC = () => {
  const { login, setUserRole } = useAppState();

  const [employeeId, setEmployeeId] = useState('OIL-HSE-84920');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('HSE Officer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(selectedRole);
    login();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: OIL Branding & Govt Visual */}
        <div className="bg-oil-navy text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-oil-gold/10 pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 border-oil-gold p-1 shadow-md">
                <div className="text-center font-extrabold text-oil-navy leading-none">
                  <span className="block text-base text-oil-navy tracking-tighter">OIL</span>
                  <span className="text-[8px] text-amber-600 block uppercase font-bold">India</span>
                </div>
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white leading-tight">OIL INDIA LIMITED</h1>
                <p className="text-xs text-oil-gold font-bold">A Navratna Public Sector Enterprise</p>
              </div>
            </div>

            <div className="space-y-4 my-8">
              <span className="bg-amber-400/20 text-oil-gold text-xs font-bold px-2.5 py-1 rounded border border-oil-gold/30">
                HSSE AI PLATFORM
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
                SIF PRECURSOR INTELLIGENCE
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                “AI-powered safety intelligence for proactive Serious Injury & Fatality prevention across all OIL operational fields.”
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Corporate HSSE Division</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Secure Portal
            </span>
          </div>
        </div>

        {/* Right Side: Enterprise Login Form */}
        <div className="p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-oil-navy">Authorized Officer Access</h3>
              <Lock className="w-5 h-5 text-oil-gold" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">OIL Employee ID / User Name:</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-oil-blue"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-oil-blue"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Access Role Scope:</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-oil-navy focus:outline-none"
                >
                  <option value="HSE Officer">HSE Officer (Corporate)</option>
                  <option value="Site Manager">Site Manager (Duliajan Field)</option>
                  <option value="System Administrator">System Administrator</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-oil-navy hover:bg-oil-navy-dark text-white font-extrabold py-3 px-4 rounded-lg transition shadow-md flex items-center justify-center gap-2 text-xs"
              >
                Secure Login <ArrowRight className="w-4 h-4 text-oil-gold" />
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400">
            <p className="font-bold text-slate-600">Authorized Oil India Limited personnel only.</p>
            <p className="mt-0.5">Protected HSSE Environment • Official Govt Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
};
