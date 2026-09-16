import React from 'react';
import { useAppState } from '../../context/AppStateContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useAppState();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left branding */}
        <div>
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <span className="text-oil-gold">OIL INDIA LIMITED</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-normal">SIF Precursor Intelligence Platform</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            AI-assisted HSSE decision support system for Serious Injury & Fatality prevention.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-[11px]">
          <button onClick={() => navigateTo('settings')} className="hover:text-white transition">
            Privacy Policy
          </button>
          <button onClick={() => navigateTo('settings')} className="hover:text-white transition">
            Security Directives
          </button>
          <button onClick={() => navigateTo('model-health')} className="hover:text-white transition">
            System Status
          </button>
          <button onClick={() => navigateTo('model-health')} className="hover:text-white transition">
            Help & Documentation
          </button>
        </div>

        {/* Version & Demo notice */}
        <div className="text-right text-[11px]">
          <div className="font-semibold text-slate-300">Prototype v1.0</div>
          <div className="text-amber-400/90 font-medium">DEMO DATA — FOR DEMONSTRATION PURPOSES ONLY</div>
        </div>
      </div>
    </footer>
  );
};
