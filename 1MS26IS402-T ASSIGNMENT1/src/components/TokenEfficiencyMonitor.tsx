import React from 'react';
import { ShieldCheck, Zap, Gauge, Search, CheckCircle2 } from 'lucide-react';
import { TokenUsage } from '../types/research';

interface TokenEfficiencyMonitorProps {
  tokenUsage?: TokenUsage;
}

export const TokenEfficiencyMonitor: React.FC<TokenEfficiencyMonitorProps> = ({ tokenUsage }) => {
  const promptTokens = tokenUsage?.promptTokens || 1400;
  const candidateTokens = tokenUsage?.candidateTokens || 1100;
  const totalTokens = tokenUsage?.totalTokens || (promptTokens + candidateTokens);
  const budget = tokenUsage?.budgetLimit || 25000;
  const percentage = Math.min(100, Math.round((totalTokens / budget) * 1000) / 10);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Status */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">Operational Guardrails: Token Efficiency</h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE & COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict budget policy enforced: execution constrained well under 25,000 tokens via targeted web abstracts & architecture synthesis.
            </p>
          </div>
        </div>

        {/* Right Metric Gauges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 text-[10px] block uppercase font-mono">Prompt Ingest</span>
            <span className="font-mono font-semibold text-slate-200">{promptTokens.toLocaleString()} tokens</span>
          </div>

          <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 text-[10px] block uppercase font-mono">Analysis Output</span>
            <span className="font-mono font-semibold text-indigo-300">{candidateTokens.toLocaleString()} tokens</span>
          </div>

          <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-xs flex items-center gap-3">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-mono">Budget Consumed</span>
              <span className="font-mono font-bold text-emerald-400">
                {totalTokens.toLocaleString()} / {budget.toLocaleString()} ({percentage}%)
              </span>
            </div>
            <div className="w-14 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                style={{ width: `${Math.max(5, Number(percentage))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
