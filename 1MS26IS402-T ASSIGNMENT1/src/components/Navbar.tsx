import React from 'react';
import { Cpu, ShieldCheck, Download, Share2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { TokenUsage } from '../types/research';

interface NavbarProps {
  tokenUsage?: TokenUsage;
  onOpenExport: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ tokenUsage, onOpenExport, onReset }) => {
  const currentTokens = tokenUsage?.totalTokens || 0;
  const budget = tokenUsage?.budgetLimit || 25000;
  const percentage = Math.min(100, Math.round((currentTokens / budget) * 100));

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                CS Research Agent
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30">
                v3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">Architecture Extraction & Student Project Architect</p>
          </div>
        </div>

        {/* Operational Constraints & Actions */}
        <div className="flex items-center gap-3">
          {/* Token Efficiency Guardrail Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Token Efficiency:</span>
              <span className="font-mono font-medium text-emerald-300">
                {currentTokens.toLocaleString()} / {budget.toLocaleString()} tokens
              </span>
              <span className="text-slate-500 font-mono">({percentage}%)</span>
            </div>
            <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden ml-1">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  percentage > 80 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.max(4, percentage)}%` }}
              />
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition shadow-sm active:scale-95"
            title="Export analysis summary"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
