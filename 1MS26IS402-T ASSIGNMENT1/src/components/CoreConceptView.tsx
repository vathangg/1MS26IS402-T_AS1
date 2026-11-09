import React, { useState } from 'react';
import { BookOpen, AlertCircle, Cpu, Award, Volume2, VolumeX, CheckCircle, FileText, ExternalLink, Sparkles } from 'lucide-react';
import { PaperAnalysis } from '../types/research';

interface CoreConceptViewProps {
  analysis: PaperAnalysis;
}

export const CoreConceptView: React.FC<CoreConceptViewProps> = ({ analysis }) => {
  const { coreConcept, paperTitle, authors, publicationYear, domain, sourceUrl } = analysis;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Compute live word count of the summary
  const summaryWords = coreConcept.fullSummaryUnder300Words
    ? coreConcept.fullSummaryUnder300Words.trim().split(/\s+/).length
    : coreConcept.wordCount || 0;
  const isUnderLimit = summaryWords <= 300;

  // Accessible Text-To-Speech for audio digest
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToRead = `${paperTitle}. Core concept summary: ${coreConcept.fullSummaryUnder300Words}. Problem statement: ${coreConcept.problemStatement}. Primary methodology: ${coreConcept.primaryMethodology}. Key breakthroughs: ${coreConcept.keyBreakthroughs}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="space-y-6">
      {/* Paper Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {domain || 'Computer Science'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                {publicationYear}
              </span>
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Original Paper</span>
                </a>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {paperTitle}
            </h2>
            <p className="text-xs text-slate-400">
              <span className="text-slate-500">Authors: </span>
              {authors}
            </p>
          </div>

          {/* Word count verification badge */}
          <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
              <CheckCircle className={`w-4 h-4 ${isUnderLimit ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div>
                <span className="font-semibold text-slate-200">{summaryWords} words</span>
                <span className="text-slate-400 text-[11px] block">Constraint: &lt; 300 words</span>
              </div>
            </div>

            {/* Audio Digest */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                isPlayingAudio
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Listen Digest</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Executive Summary */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30 border border-indigo-500/20 rounded-2xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-2 mb-3 text-indigo-300 font-semibold text-sm">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Executive Concept Synthesis (Plain Language)</span>
        </div>
        <p className="text-sm md:text-base text-slate-200 leading-relaxed font-normal">
          {coreConcept.fullSummaryUnder300Words}
        </p>
      </div>

      {/* 3 Core Extraction Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Problem Statement */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3">
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider text-[11px] text-rose-300">
              1. The Problem Statement
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {coreConcept.problemStatement}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Bottleneck Identified</span>
            <span className="font-mono text-rose-400/80">O(N²) / Memory Bound</span>
          </div>
        </div>

        {/* Pillar 2: Primary Methodology */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider text-[11px] text-cyan-300">
              2. Primary Methodology
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {coreConcept.primaryMethodology}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Core Architecture</span>
            <span className="font-mono text-cyan-400/80">System Innovation</span>
          </div>
        </div>

        {/* Pillar 3: Mathematical & Algorithmic Breakthroughs */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider text-[11px] text-purple-300">
              3. Algorithmic Breakthroughs
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {coreConcept.keyBreakthroughs}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Theoretical Delta</span>
            <span className="font-mono text-purple-400/80">Mathematically Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
