import React, { useState } from 'react';
import { Search, Link as LinkIcon, Sparkles, ArrowRight, Loader2, BookOpen, Zap, CheckCircle2 } from 'lucide-react';

interface PaperInputProps {
  onAnalyze: (payload: { url?: string; title?: string; notes?: string }) => void;
  onSelectPreset: (presetId: string) => void;
  isLoading: boolean;
  activePresetId?: string | null;
}

const PRESET_PAPERS = [
  {
    id: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    tag: 'Transformers',
    sub: 'Vaswani et al. (arXiv:1706.03762)',
    badgeColor: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30'
  },
  {
    id: 'mamba-selective-state-spaces',
    title: 'Mamba: Selective State Spaces',
    tag: 'SSMs & Linear O(N)',
    sub: 'Gu & Dao (arXiv:2312.00752)',
    badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30'
  },
  {
    id: 'deepseek-r1-reasoning',
    title: 'DeepSeek-R1: RL Reasoning',
    tag: 'GRPO & Self-Reflection',
    sub: 'DeepSeek-AI (arXiv:2501.12948)',
    badgeColor: 'from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30'
  },
  {
    id: 'lora-low-rank-adaptation',
    title: 'LoRA: Low-Rank Adaptation',
    tag: 'PEFT & Weight Bottleneck',
    sub: 'Hu et al. (arXiv:2106.09685)',
    badgeColor: 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30'
  }
];

export const PaperInput: React.FC<PaperInputProps> = ({
  onAnalyze,
  onSelectPreset,
  isLoading,
  activePresetId
}) => {
  const [urlOrTitle, setUrlOrTitle] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlOrTitle.trim() || isLoading) return;

    const trimmed = urlOrTitle.trim();
    const isUrl = /^https?:\/\//i.test(trimmed);

    onAnalyze({
      url: isUrl ? trimmed : undefined,
      title: !isUrl ? trimmed : undefined,
      notes: notes.trim() || undefined
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <span>Academic Paper Architecture Agent</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Token-Efficient
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Provide any arXiv link, DOI, or paper title to extract core concepts, render a Mermaid.js architecture flowchart, and uncover 3rd-year CS student resume extensions.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <LinkIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <input
              type="text"
              value={urlOrTitle}
              onChange={(e) => setUrlOrTitle(e.target.value)}
              placeholder="Paste arXiv URL (e.g. https://arxiv.org/abs/2312.00752) or enter Paper Title..."
              disabled={isLoading}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-11 pr-32 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner transition"
            />
            <button
              type="submit"
              disabled={isLoading || !urlOrTitle.trim()}
              className="absolute right-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white rounded-lg text-xs font-semibold shadow-md transition flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing...</span>
                </>
              ) : (
                <>
                  <span>Ingest & Parse</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Quick presets pills */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Or explore iconic foundation papers:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {PRESET_PAPERS.map((preset) => {
                const isActive = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setUrlOrTitle(preset.title);
                      onSelectPreset(preset.id);
                    }}
                    disabled={isLoading}
                    className={`text-left p-2.5 rounded-xl border text-xs transition duration-150 flex flex-col justify-between ${
                      isActive
                        ? 'bg-indigo-950/50 border-indigo-500/60 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold text-slate-200 line-clamp-1">{preset.title}</span>
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className={`px-1.5 py-0.5 rounded border text-[10px] font-medium bg-gradient-to-r ${preset.badgeColor}`}>
                        {preset.tag}
                      </span>
                      <span className="text-[10px] text-slate-500">{preset.sub.split(' ')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
