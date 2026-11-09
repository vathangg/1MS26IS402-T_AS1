/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PaperInput } from './components/PaperInput';
import { CoreConceptView } from './components/CoreConceptView';
import { MermaidViewer } from './components/MermaidViewer';
import { StudentOpportunitiesView } from './components/StudentOpportunitiesView';
import { TokenEfficiencyMonitor } from './components/TokenEfficiencyMonitor';
import { DeepDiveModal } from './components/DeepDiveModal';
import { ExportModal } from './components/ExportModal';
import { PaperAnalysis, StudentOpportunity } from './types/research';
import { Loader2, AlertCircle, Sparkles, Layers, GraduationCap, BookOpen, CheckCircle } from 'lucide-react';

export default function App() {
  const [analysis, setAnalysis] = useState<PaperAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>('mamba-selective-state-spaces');
  const [selectedDeepDive, setSelectedDeepDive] = useState<StudentOpportunity | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [viewFilter, setViewFilter] = useState<'all' | 'core' | 'flowchart' | 'opportunities'>('all');

  // Load default preset on initial mount
  useEffect(() => {
    const loadInitialPreset = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/preset/mamba-selective-state-spaces');
        if (res.ok) {
          const json = await res.json();
          setAnalysis(json.data);
          setActivePresetId('mamba-selective-state-spaces');
        }
      } catch (err) {
        console.error('Error fetching initial preset:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialPreset();
  }, []);

  // Handle URL / Paper Analysis request
  const handleAnalyze = async (payload: { url?: string; title?: string; notes?: string }) => {
    setIsLoading(true);
    setError(null);
    setActivePresetId(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to analyze academic paper.');
      }

      setAnalysis(json.data);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err.message || 'An error occurred during paper ingestion.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle 1-click Preset Selection
  const handleSelectPreset = async (presetId: string) => {
    setIsLoading(true);
    setError(null);
    setActivePresetId(presetId);

    try {
      const res = await fetch(`/api/preset/${presetId}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Preset paper not found.');
      }
      setAnalysis(json.data);
    } catch (err: any) {
      console.error('Error loading preset:', err);
      setError(err.message || 'Failed to load preset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        tokenUsage={analysis?.tokenUsage}
        onOpenExport={() => setShowExportModal(true)}
        onReset={() => handleSelectPreset('mamba-selective-state-spaces')}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Paper Ingestion Section */}
        <PaperInput
          onAnalyze={handleAnalyze}
          onSelectPreset={handleSelectPreset}
          isLoading={isLoading}
          activePresetId={activePresetId}
        />

        {/* Error message banner */}
        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-2xl flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-400 hover:text-white font-medium underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Overlay State */}
        {isLoading && (
          <div className="p-12 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-4 text-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Ingesting Academic Research Paper</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Searching abstracts & open-source implementations, distilling core breakthroughs under 300 words, charting Mermaid.js layers, and designing student project opportunities...
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Enforcing Token Budget &lt; 25,000 Tokens</span>
            </div>
          </div>
        )}

        {/* Analysis Results View */}
        {!isLoading && analysis && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Live Token Efficiency Guardrail Monitor */}
            <TokenEfficiencyMonitor tokenUsage={analysis.tokenUsage} />

            {/* View Filter Pills */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setViewFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    viewFilter === 'all'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All 3 Steps Unified
                </button>
                <button
                  onClick={() => setViewFilter('core')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                    viewFilter === 'core'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>1. Core Concept</span>
                </button>
                <button
                  onClick={() => setViewFilter('flowchart')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                    viewFilter === 'flowchart'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>2. Architecture Flowchart</span>
                </button>
                <button
                  onClick={() => setViewFilter('opportunities')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                    viewFilter === 'opportunities'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>3. Student Projects</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                <span>{analysis.paperTitle}</span>
              </div>
            </div>

            {/* STEP 1: CORE CONCEPT EXTRACTION */}
            {(viewFilter === 'all' || viewFilter === 'core') && (
              <section id="step-1" className="space-y-4">
                <CoreConceptView analysis={analysis} />
              </section>
            )}

            {/* STEP 2: ARCHITECTURAL FLOWCHART (Mermaid.js) */}
            {(viewFilter === 'all' || viewFilter === 'flowchart') && (
              <section id="step-2" className="space-y-4 pt-2">
                <MermaidViewer
                  mermaidCode={analysis.flowchart.mermaidCode}
                  rawFlowchartText={analysis.rawFlowchartText}
                  components={analysis.flowchart.components}
                  dataInputs={analysis.flowchart.dataInputs}
                  modelLayers={analysis.flowchart.modelLayers}
                  dataOutputs={analysis.flowchart.dataOutputs}
                />
              </section>
            )}

            {/* STEP 3: FUTURE WORK & INTERNSHIP OPPORTUNITIES */}
            {(viewFilter === 'all' || viewFilter === 'opportunities') && (
              <section id="step-3" className="space-y-4 pt-2">
                <StudentOpportunitiesView
                  opportunities={analysis.studentOpportunities}
                  paperTitle={analysis.paperTitle}
                  onOpenDeepDive={(opp) => setSelectedDeepDive(opp)}
                />
              </section>
            )}
          </div>
        )}
      </main>

      {/* Deep Dive Blueprint Modal */}
      {selectedDeepDive && (
        <DeepDiveModal
          opportunity={selectedDeepDive}
          paperTitle={analysis?.paperTitle || 'Academic Paper'}
          onClose={() => setSelectedDeepDive(null)}
        />
      )}

      {/* Export Report Modal */}
      {showExportModal && analysis && (
        <ExportModal
          analysis={analysis}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>CS Research Agent • Synthesizing System Architectures & Student Opportunities</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Mermaid.js v11</span>
            <span>•</span>
            <span>Token Constrained (&lt; 25,000)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
