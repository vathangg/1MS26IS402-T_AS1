import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Check,
  Download,
  Code,
  Eye,
  Maximize2,
  Minimize2,
  Layers,
  ArrowRight,
  Database,
  Sliders
} from 'lucide-react';
import { FlowchartComponent } from '../types/research';

interface MermaidViewerProps {
  mermaidCode: string;
  rawFlowchartText?: string;
  components?: FlowchartComponent[];
  dataInputs?: string[];
  modelLayers?: string[];
  dataOutputs?: string[];
}

// Initialize mermaid once
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#090d16',
    primaryColor: '#6366f1',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#818cf8',
    lineColor: '#38bdf8',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a',
    mainBkg: '#1e293b',
    nodeBorder: '#475569',
    clusterBkg: '#0f172a80',
    clusterBorder: '#334155'
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    useMaxWidth: false
  },
  securityLevel: 'loose'
});

export const MermaidViewer: React.FC<MermaidViewerProps> = ({
  mermaidCode,
  rawFlowchartText,
  components = [],
  dataInputs = [],
  modelLayers = [],
  dataOutputs = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'diagram' | 'raw'>('diagram');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<FlowchartComponent | null>(null);
  const [activeTab, setActiveTab] = useState<'layers' | 'inputs' | 'outputs' | 'components'>('components');

  // Sanitize mermaid code for bulletproof rendering
  const sanitizeMermaid = (code: string): string => {
    let clean = code.trim();
    // Remove [FLOWCHART] label if present
    clean = clean.replace(/^\[FLOWCHART\]\s*/i, '');
    // Remove markdown code fences if any
    clean = clean.replace(/^```mermaid\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '');
    
    // Ensure it starts with graph TD or flowchart TD
    if (!clean.startsWith('graph') && !clean.startsWith('flowchart')) {
      clean = `graph TD\n${clean}`;
    }
    return clean.trim();
  };

  const currentMermaid = sanitizeMermaid(mermaidCode);
  const currentRawText = rawFlowchartText || `[FLOWCHART]\n${currentMermaid}`;

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      try {
        setRenderError(null);
        const uniqueId = `mermaid-svg-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, currentMermaid);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setRenderError(err.message || 'Syntax error in generated Mermaid diagram.');
        }
      }
    };

    renderDiagram();
    return () => {
      isMounted = false;
    };
  }, [currentMermaid]);

  // Zoom and pan handlers
  const handleZoomIn = () => setScale((s) => Math.min(2.5, s + 0.2));
  const handleZoomOut = () => setScale((s) => Math.max(0.4, s - 0.2));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode !== 'diagram') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(currentRawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `architecture-flowchart-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 bg-slate-950/95 border-indigo-500/50 backdrop-blur-xl' : ''
      }`}
    >
      {/* Flowchart Header Bar */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                2. Architectural Flowchart
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                [FLOWCHART]
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Mermaid.js System Architecture (graph TD)</p>
          </div>
        </div>

        {/* View Mode & Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setViewMode('diagram')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
                viewMode === 'diagram'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visual</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
                viewMode === 'raw'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Raw [FLOWCHART]</span>
            </button>
          </div>

          {/* Diagram Canvas Controls */}
          {viewMode === 'diagram' && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-slate-300">
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-slate-800 rounded transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-slate-800 rounded transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 hover:bg-slate-800 rounded transition"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1 text-slate-500">
                {Math.round(scale * 100)}%
              </span>
            </div>
          )}

          {/* Action buttons */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs transition"
            title="Copy raw Mermaid string"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadSvg}
            disabled={!svgContent}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 rounded-lg text-xs transition"
            title="Download SVG"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">SVG</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Flowchart Viewer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[480px] max-h-[720px] divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* Canvas / Raw Viewer (Takes 3 columns) */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`lg:col-span-3 bg-slate-950 relative overflow-hidden flex items-center justify-center p-6 ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ minHeight: isFullscreen ? '75vh' : '480px' }}
        >
          {viewMode === 'diagram' ? (
            renderError ? (
              <div className="max-w-md p-5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-center space-y-2">
                <p className="text-sm font-semibold text-rose-300">Mermaid Render Error</p>
                <p className="text-xs text-rose-400 font-mono">{renderError}</p>
                <button
                  onClick={() => setViewMode('raw')}
                  className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg transition"
                >
                  Inspect Raw Code
                </button>
              </div>
            ) : svgContent ? (
              <div
                className="transition-transform duration-75 select-none origin-center"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <div className="text-xs text-slate-500 animate-pulse font-mono">
                Synthesizing architectural graph...
              </div>
            )
          ) : (
            <div className="w-full h-full p-4 overflow-auto font-mono text-xs text-slate-300 bg-slate-950 rounded-xl">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-[11px] font-semibold text-cyan-400 tracking-wider">
                  RAW TEXT SEGMENT (OUTPUT AS REQUIRED)
                </span>
                <span className="text-[11px] text-slate-500">graph TD format</span>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed text-indigo-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {currentRawText}
              </pre>
            </div>
          )}

          {/* Interactive Legend in Visual Mode */}
          {viewMode === 'diagram' && (
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-3 pointer-events-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                <span>Layers / Operations</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span>Inputs / Tensors</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span>Outputs / Losses</span>
              </span>
            </div>
          )}
        </div>

        {/* System Architecture Inspector Sidebar (1 column) */}
        <div className="lg:col-span-1 bg-slate-900/50 flex flex-col h-full overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-4 p-2 bg-slate-900 border-b border-slate-800 text-[11px]">
            <button
              onClick={() => setActiveTab('components')}
              className={`py-1.5 text-center rounded-md font-medium transition ${
                activeTab === 'components'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Modules
            </button>
            <button
              onClick={() => setActiveTab('layers')}
              className={`py-1.5 text-center rounded-md font-medium transition ${
                activeTab === 'layers'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Layers
            </button>
            <button
              onClick={() => setActiveTab('inputs')}
              className={`py-1.5 text-center rounded-md font-medium transition ${
                activeTab === 'inputs'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Inputs
            </button>
            <button
              onClick={() => setActiveTab('outputs')}
              className={`py-1.5 text-center rounded-md font-medium transition ${
                activeTab === 'outputs'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Outputs
            </button>
          </div>

          {/* Tab Content List */}
          <div className="p-3 overflow-y-auto space-y-2 flex-1">
            {activeTab === 'components' && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Core Components ({components.length})</span>
                  <span className="text-[10px] text-indigo-400">Click to inspect</span>
                </div>
                {components.map((comp, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedComponent(comp)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      selectedComponent?.name === comp.name
                        ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                        : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1 text-slate-100">
                      <span>{comp.name}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-indigo-400 border border-slate-800">
                        {comp.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">
                      {comp.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'layers' && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Model Layers Stack
                </div>
                {modelLayers.map((layer, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs">
                    <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-1">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </span>
                      <span>{layer}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'inputs' && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Data Inputs & Dimensions
                </div>
                {dataInputs.map((input, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs">
                    <div className="flex items-start gap-2">
                      <Database className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200">{input}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'outputs' && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  System Data Outputs
                </div>
                {dataOutputs.map((output, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs">
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200">{output}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Component Detail Box */}
            {selectedComponent && (
              <div className="mt-4 p-3 bg-indigo-950/50 border border-indigo-500/40 rounded-xl space-y-1.5">
                <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                  Inspected Module
                </div>
                <div className="text-xs font-bold text-white">{selectedComponent.name}</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedComponent.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
