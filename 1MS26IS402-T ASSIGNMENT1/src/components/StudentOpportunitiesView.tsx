import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  CheckCircle,
  Copy,
  Clock,
  Github,
  FileCode2,
  ChevronRight,
  Target,
  FileText
} from 'lucide-react';
import { StudentOpportunity } from '../types/research';

interface StudentOpportunitiesViewProps {
  opportunities: StudentOpportunity[];
  paperTitle: string;
  onOpenDeepDive: (opp: StudentOpportunity) => void;
}

export const StudentOpportunitiesView: React.FC<StudentOpportunitiesViewProps> = ({
  opportunities,
  paperTitle,
  onOpenDeepDive
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyResumeBullet = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner-friendly':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'advanced':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'intermediate':
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0 mt-0.5">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                3. Future Work & Internship Resume Projects
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                3rd-Year CS Level
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Realistic, high-impact extensions engineered to impress tech recruiters and engineering hiring managers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
          <Target className="w-4 h-4 text-amber-400" />
          <span>Tailored for FAANG, AI Labs & Systems Internships</span>
        </div>
      </div>

      {/* 3 Concrete Student Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {opportunities.map((opp, idx) => (
          <div
            key={idx}
            className="bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group relative overflow-hidden"
          >
            {/* Top Accent Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 group-hover:opacity-100 transition" />

            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getDifficultyBadge(opp.difficulty)}`}>
                    {opp.difficulty || 'Intermediate'}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{opp.estimatedWeeks || 3} wks</span>
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-base font-bold text-white mb-3 group-hover:text-indigo-300 transition">
                {opp.title}
              </h4>

              {/* Required Element 1: The Exact Extension */}
              <div className="mb-3.5 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                  The Exact Extension:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {opp.exactExtension}
                </p>
              </div>

              {/* Required Element 2: Targeted Performance Metric */}
              <div className="mb-3.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Targeted Performance Metric:</span>
                </div>
                <p className="text-xs text-emerald-200 font-mono leading-relaxed">
                  {opp.targetMetric}
                </p>
              </div>

              {/* Required Element 3: Recommended Tech Stack */}
              <div className="mb-4 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Recommended Tech Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {opp.recommendedStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Starter Repo */}
              {opp.startingRepoOrLib && (
                <div className="mb-4 flex items-center gap-2 text-[11px] text-slate-400">
                  <Github className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Starter: <span className="font-mono text-slate-300">{opp.startingRepoOrLib}</span></span>
                </div>
              )}

              {/* Action Roadmap steps */}
              {opp.actionPlan && opp.actionPlan.length > 0 && (
                <div className="mb-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Execution Steps:
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                    {opp.actionPlan.slice(0, 3).map((step, sIdx) => (
                      <li key={sIdx} className="line-clamp-2 leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Resume Bullet Point & Deep Dive Button */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 relative group/bullet">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-1">
                  <span>Resume Ready Bullet</span>
                  <button
                    onClick={() => handleCopyResumeBullet(opp.resumeBulletPoint, idx)}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition"
                    title="Copy bullet point"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 italic font-mono leading-relaxed line-clamp-3">
                  "{opp.resumeBulletPoint}"
                </p>
              </div>

              {/* Action Button: Technical Blueprint Modal */}
              <button
                onClick={() => onOpenDeepDive(opp)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 hover:border-indigo-500 text-xs font-semibold transition flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                <FileCode2 className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white" />
                <span>Get PyTorch Boilerplate & Milestones</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
