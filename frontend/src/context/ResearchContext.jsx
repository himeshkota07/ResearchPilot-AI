import { createContext, useContext, useState, useEffect } from "react";

const ResearchContext = createContext();

const HISTORY_STORAGE_KEY = "rp_paper_history";

// Pre-seeded sample papers so the user sees a rich history immediately
const DEFAULT_HISTORY = [
  {
    id: "paper_energies_sample",
    fileName: "energies-11-02869-v2.pdf",
    fileSize: 2621440,
    title: "Deep Reinforcement Learning for Smart Grid Energy Management and Load Forecasting",
    analyzedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    summary: {
      title: "Deep Reinforcement Learning for Smart Grid Energy Management and Load Forecasting",
      summary: "This research investigates the integration of deep reinforcement learning (DRL) algorithms to optimize energy dispatch and load forecasting within distributed smart grid architectures. The empirical analysis demonstrates an 18.4% reduction in peak-hour transmission losses.",
      methodology: "Employed Deep Q-Networks (DQN) combined with temporal convolutional networks (TCN) trained across 12 months of high-resolution SCADA telemetry data.",
      datasets: ["IEEE 33-bus Distribution System", "NYISO Hourly Telemetry Dataset"],
      key_points: [
        "Formulated multi-agent coordination scheme for decentralized grid edge nodes.",
        "Demonstrated 18.4% reduction in peak operational energy dissipation.",
        "Proved convergence bounds under stochastic renewable generation conditions.",
      ],
      limitations: ["High computational overhead during training phase", "Sensitivity to unexpected grid topology shifts"],
      future_work: ["Zero-shot domain adaptation to microgrid environments", "Hardware-accelerated edge inference"],
    },
    gaps: {
      research_gaps: [
        { gap: "Lack of evaluation under adversarial sensor cyber-attacks and packet latency." },
        { gap: "Absence of real-time thermal constraint profiling during rapid battery discharging." },
      ],
      possible_improvements: [
        { improvement: "Integrate model-predictive control (MPC) safety filters into the policy network." },
        { improvement: "Utilize quantized INT8 models for sub-millisecond edge substation deployment." },
      ],
      future_research_directions: [
        { direction: "Federated multi-agent learning across privacy-preserving municipal utilities." },
      ],
      novel_project_ideas: [
        {
          idea: "Fault-Resilient Grid Edge Co-Pilot",
          description: "An autonomous agent that reroutes microgrid energy feeds within 5 milliseconds of transmission fault detection.",
        },
      ],
    },
    report: {
      title: "Comprehensive Synthesis: Deep Reinforcement Learning in Modern Smart Grids",
      abstract: "This report synthesizes the multi-agent optimization framework for smart grid energy dispatch, examining convergence stability and real-world efficiency gains.",
      literature_review: "Existing smart grid dispatch relies on legacy quadratic programming. This paper pioneers reinforcement learning to handle stochastic renewable variability.",
      research_gaps: "Identified critical vulnerabilities in cybersecurity robustness and battery thermal lifecycle management.",
      proposed_future_work: "Recommend implementing distributed federated reinforcement learning policies with hardware verification.",
      conclusion: "A transformative approach providing empirical validation for machine learning in municipal-scale energy infrastructure.",
    },
  },
  {
    id: "paper_attention_sample",
    fileName: "attention-is-all-you-need.pdf",
    fileSize: 2202000,
    title: "Attention Is All You Need: Architectural Analysis of Self-Attention Mechanisms",
    analyzedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    summary: {
      title: "Attention Is All You Need: Architectural Analysis of Self-Attention Mechanisms",
      summary: "Introduces the Transformer architecture, dispensing entirely with recurrence and convolutions, relying solely on multi-head self-attention mechanisms for sequence modeling.",
      methodology: "Multi-head scaled dot-product attention combined with sinusoidal positional encodings and layer normalization.",
      datasets: ["WMT 2014 English-to-German", "WMT 2014 English-to-French"],
      key_points: [
        "Eliminates sequential computation enabling massive parallelization during training.",
        "Achieves state-of-the-art BLEU scores on translation tasks with significantly reduced training cost.",
      ],
      limitations: ["Quadratic computational complexity with respect to sequence length O(N^2)"],
      future_work: ["Linear attention approximations", "Extension to image and speech modalities"],
    },
    gaps: {
      research_gaps: [
        { gap: "Quadratic memory scaling prevents efficient scaling to million-token contexts." },
      ],
      possible_improvements: [
        { improvement: "Employ sparse or flash attention kernels to bound memory complexity." },
      ],
      future_research_directions: [
        { direction: "Hierarchical attention representations for multi-modal reasoning." },
      ],
      novel_project_ideas: [
        {
          idea: "Linear-Time Recurrent Attention Hybrid",
          description: "Combining constant-memory recurrent state spaces with selective attention matrices.",
        },
      ],
    },
    report: {
      title: "Foundational Review: The Transformer Architecture",
      abstract: "A synthesis of the self-attention mechanism and its implications across modern deep learning paradigms.",
      literature_review: "Surpasses recurrent and convolutional sequence architectures through global context window attention.",
      research_gaps: "Memory bottleneck remains a key research frontier for extended context lengths.",
      proposed_future_work: "Explore state-space models and kernel-based approximations.",
      conclusion: "The foundational paradigm enabling modern large language models and multi-modal intelligence.",
    },
  },
];

export function ResearchProvider({ children }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [gaps, setGaps] = useState(null);
  const [report, setReport] = useState(null);
  const [messages, setMessages] = useState([]);

  // Paper History
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(DEFAULT_HISTORY));
      return DEFAULT_HISTORY;
    } catch {
      return DEFAULT_HISTORY;
    }
  });

  // Save or update paper in history
  const saveToHistory = ({ file, summary: s, gaps: g, report: r }) => {
    if (!s && !file) return;

    const paperTitle = s?.title || file?.name || "Untitled Research Paper";
    const recordId = "paper_" + Date.now();

    const record = {
      id: recordId,
      fileName: file?.name || "research_paper.pdf",
      fileSize: file?.size || 1024 * 1024,
      title: paperTitle,
      analyzedAt: new Date().toISOString(),
      summary: s,
      gaps: g,
      report: r,
    };

    setHistory((prev) => {
      // Remove any prior entry with identical title to avoid clutter
      const filtered = prev.filter(
        (item) => item.title.toLowerCase() !== paperTitle.toLowerCase()
      );
      const updated = [record, ...filtered];
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not save history to localStorage:", err);
      }
      return updated;
    });

    return record;
  };

  // Load a paper from history into active state
  const loadPaperFromHistory = (id) => {
    const found = history.find((p) => p.id === id);
    if (!found) return false;

    setUploadedFile({
      name: found.fileName,
      size: found.fileSize,
    });
    setSummary(found.summary);
    setGaps(found.gaps);
    setReport(found.report);
    setMessages([]); // Reset chat for loaded paper

    return found;
  };

  // Delete a paper from history
  const deleteFromHistory = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn(err);
      }
      return updated;
    });
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <ResearchContext.Provider
      value={{
        uploadedFile,
        setUploadedFile,
        summary,
        setSummary,
        gaps,
        setGaps,
        report,
        setReport,
        messages,
        setMessages,
        history,
        saveToHistory,
        loadPaperFromHistory,
        deleteFromHistory,
        clearHistory,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  return useContext(ResearchContext);
}
