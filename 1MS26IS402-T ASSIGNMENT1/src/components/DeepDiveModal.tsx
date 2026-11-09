import React, { useState, useEffect } from 'react';
import {
  X,
  FileCode2,
  Calendar,
  Database,
  HelpCircle,
  AlertTriangle,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Terminal
} from 'lucide-react';
import { StudentOpportunity, DeepDiveData } from '../types/research';

interface DeepDiveModalProps {
  opportunity: StudentOpportunity | null;
  paperTitle: string;
  onClose: () => void;
}

export const DeepDiveModal: React.FC<DeepDiveModalProps> = ({
  opportunity,
  paperTitle,
  onClose
}) => {
  const [data, setData] = useState<DeepDiveData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'milestones' | 'interview' | 'datasets'>('code');

  useEffect(() => {
    if (!opportunity) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchDeepDive = async () => {
      try {
        const res = await fetch('/api/deepdive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paperTitle,
            opportunity
          })
        });

        if (!res.ok) {
          throw new Error('Failed to generate technical blueprint.');
        }

        const json = await res.json();
        if (isMounted) {
          setData(json.data);
        }
      } catch (err: any) {
        console.warn('Using client-side fallback deepdive blueprint:', err);
        // Fallback default blueprint tailored for the extension
        if (isMounted) {
          setData({
            starterCodeSnippet: `import torch\nimport torch.nn as nn\n\nclass CustomExtensionModule(nn.Module):\n    """\n    Extension: ${opportunity.exactExtension}\n    Target Metric: ${opportunity.targetMetric}\n    """\n    def __init__(self, d_model=512, expansion_factor=2):\n        super().__init__()\n        self.d_model = d_model\n        self.in_proj = nn.Linear(d_model, d_model * expansion_factor)\n        self.activation = nn.SiLU()\n        self.out_proj = nn.Linear(d_model * expansion_factor, d_model)\n        self.norm = nn.LayerNorm(d_model)\n\n    def forward(self, x):\n        # x shape: [batch_size, seq_len, d_model]\n        residual = x\n        h = self.activation(self.in_proj(x))\n        out = self.out_proj(h)\n        return self.norm(out + residual)\n\n# Benchmark harness\nif __name__ == '__main__':\n    model = CustomExtensionModule()\n    inputs = torch.randn(8, 1024, 512)\n    with torch.no_grad():\n        outputs = model(inputs)\n    print("Output Tensor Shape:", outputs.shape)\n`,
            fourWeekMilestones: [
              {
                week: 1,
                title: "Literature Review & Baseline Setup",
                tasks: [
                  "Fork official repository from " + (opportunity.startingRepoOrLib || "GitHub"),
                  "Establish baseline benchmarks on single consumer GPU measuring VRAM, latency, and accuracy",
                  "Create synthetic test harness replicating paper's evaluation protocol"
                ]
              },
              {
                week: 2,
                title: "Core Architectural Delta Implementation",
                tasks: [
                  "Implement the exact extension layer in PyTorch",
                  "Validate gradient flow with unit tests and gradient-check assertions",
                  "Integrate custom layer into model forward pass with ablation toggles"
                ]
              },
              {
                week: 3,
                title: "Ablation Studies & Metric Profiling",
                tasks: [
                  "Run controlled experiments against baseline model checkpoints",
                  "Measure targeted metric (" + opportunity.targetMetric + ") using PyTorch Profiler / Triton",
                  "Record training curves and validation loss across multiple random seeds"
                ]
              },
              {
                week: 4,
                title: "Packaging, Resume Documentation & GitHub Release",
                tasks: [
                  "Package implementation with clean README, reproducible Dockerfile, and pre-trained weights",
                  "Draft technical blog post / arXiv report with benchmark plots",
                  "Add quantifiable achievements to resume and prepare portfolio demo"
                ]
              }
            ],
            baselineDatasets: [
              {
                name: "Hugging Face Benchmarks (GLUE / GSM8K / HumanEval)",
                description: "Standardized evaluation splits for zero-shot and fine-tuned comparisons."
              },
              {
                name: "Synthetic Long-Context Evaluation Suite",
                description: "Needle-in-a-Haystack and Passkey retrieval benchmarks to evaluate context window scalability."
              }
            ],
            interviewPrep: [
              {
                question: "Why did you choose this specific extension over alternative optimizations?",
                answer: "Explain the theoretical trade-off between algorithmic complexity (e.g. O(N) vs O(N^2)) and hardware implementation efficiency (e.g. SRAM memory bandwidth vs FLOP count)."
              },
              {
                question: "How did you guarantee that your optimization didn't degrade model generalization?",
                answer: "Describe your rigorous ablation pipeline: keeping hyper-parameters constant, reporting standard deviation over 3 runs, and testing on out-of-domain evaluation splits."
              },
              {
                question: "What was the biggest engineering obstacle when deploying this model?",
                answer: "Discuss CUDA kernel synchronization, memory alignment issues, or quantization precision loss and how you debugged it using PyTorch profiler."
              }
            ],
            commonPitfalls: [
              "Failing to pin random seeds and establish a strict baseline before modifying the architecture.",
              "Ignoring memory access cost (memory bandwidth bound vs compute bound operations)."
            ]
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDeepDive();
    return () => {
      isMounted = false;
    };
  }, [opportunity, paperTitle]);

  if (!opportunity) return null;

  const handleCopyCode = async () => {
    if (!data?.starterCodeSnippet) return;
    await navigator.clipboard.writeText(data.starterCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {opportunity.title}
              </h3>
              <p className="text-xs text-slate-400">
                Technical Implementation Blueprint & 4-Week Milestone Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="px-6 bg-slate-950/60 border-b border-slate-800 flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'code'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>PyTorch Starter Skeleton</span>
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'milestones'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>4-Week Milestones</span>
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`py-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'interview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Interview Defense Q&A</span>
          </button>
          <button
            onClick={() => setActiveTab('datasets')}
            className={`py-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'datasets'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Benchmark Datasets</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-xs text-slate-400 font-mono">
                Architecting PyTorch boilerplate, benchmarks & interview defense...
              </p>
            </div>
          ) : data ? (
            <>
              {/* Tab 1: PyTorch Starter Skeleton */}
              {activeTab === 'code' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                      <FileCode2 className="w-4 h-4 text-indigo-400" />
                      <span>starter_extension.py</span>
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs transition"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto leading-relaxed max-h-[380px]">
                    {data.starterCodeSnippet}
                  </pre>
                  {data.commonPitfalls && (
                    <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Common Engineering Gotchas</span>
                      </div>
                      <ul className="text-xs text-amber-200/90 list-disc list-inside space-y-1">
                        {data.commonPitfalls.map((pit, idx) => (
                          <li key={idx}>{pit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: 4-Week Milestones */}
              {activeTab === 'milestones' && (
                <div className="space-y-4">
                  {Array.isArray(data.fourWeekMilestones) &&
                    data.fourWeekMilestones.map((m: any, idx: number) => {
                      const isObj = typeof m === 'object' && m !== null;
                      const weekNum = isObj ? m.week : idx + 1;
                      const title = isObj ? m.title : `Week ${idx + 1} Deliverables`;
                      const tasks = isObj ? m.tasks : [m];

                      return (
                        <div
                          key={idx}
                          className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                              W{weekNum}
                            </span>
                            <h4 className="text-sm font-bold text-white">{title}</h4>
                          </div>
                          <ul className="space-y-1 pl-8 text-xs text-slate-300 list-disc">
                            {tasks.map((task: string, tIdx: number) => (
                              <li key={tIdx} className="leading-relaxed">
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Tab 3: Interview Defense Q&A */}
              {activeTab === 'interview' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Prepare for technical interviews at top AI labs and systems companies:
                  </p>
                  {data.interviewPrep.map((qa, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2"
                    >
                      <div className="text-xs font-bold text-indigo-300 flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 text-[10px]">
                          Q{idx + 1}
                        </span>
                        <span>{qa.question}</span>
                      </div>
                      <div className="pl-7 text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="font-semibold text-slate-400 block mb-0.5 text-[11px]">
                          Model Candidate Response:
                        </span>
                        {qa.answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Benchmark Datasets */}
              {activeTab === 'datasets' && (
                <div className="space-y-3">
                  {Array.isArray(data.baselineDatasets) &&
                    data.baselineDatasets.map((ds: any, idx: number) => {
                      const name = typeof ds === 'object' ? ds.name : ds;
                      const desc = typeof ds === 'object' ? ds.description : '';
                      return (
                        <div
                          key={idx}
                          className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3"
                        >
                          <Database className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-bold text-white">{name}</div>
                            {desc && <p className="text-xs text-slate-400 mt-1">{desc}</p>}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-rose-400">Unable to load deep-dive details.</p>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Target Metric: <strong className="text-emerald-400 font-mono">{opportunity.targetMetric}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
