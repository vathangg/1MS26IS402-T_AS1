export interface FlowchartComponent {
  name: string;
  type: 'input' | 'layer' | 'component' | 'output' | string;
  description: string;
}

export interface StudentOpportunity {
  title: string;
  exactExtension: string;
  targetMetric: string;
  recommendedStack: string[];
  difficulty: 'Beginner-Friendly' | 'Intermediate' | 'Advanced';
  estimatedWeeks: number;
  startingRepoOrLib: string;
  resumeBulletPoint: string;
  actionPlan: string[];
}

export interface TokenUsage {
  promptTokens: number;
  candidateTokens: number;
  totalTokens: number;
  budgetLimit: number;
}

export interface PaperAnalysis {
  paperTitle: string;
  authors: string;
  publicationYear: string;
  domain: string;
  sourceUrl?: string;
  rawFlowchartText: string;
  tokenUsage?: TokenUsage;
  coreConcept: {
    problemStatement: string;
    primaryMethodology: string;
    keyBreakthroughs: string;
    fullSummaryUnder300Words: string;
    wordCount: number;
  };
  flowchart: {
    mermaidCode: string;
    components: FlowchartComponent[];
    dataInputs: string[];
    modelLayers: string[];
    dataOutputs: string[];
  };
  studentOpportunities: StudentOpportunity[];
}

export interface DeepDiveData {
  starterCodeSnippet: string;
  fourWeekMilestones: { week: number; title: string; tasks: string[] }[] | string[];
  baselineDatasets: { name: string; url?: string; description?: string }[] | string[];
  interviewPrep: { question: string; answer: string }[];
  commonPitfalls: string[];
}
