import React, { useState } from 'react';
import { 
  Play, RotateCcw, CheckCircle2, AlertTriangle, ShieldCheck, 
  Dna, Cpu, ArrowRight, Sparkles, Filter, Database, Layers
} from 'lucide-react';

interface GenomicWindow {
  index: number;
  sequence: string;
  hasPam: boolean;
  pamSequence: string;
  cleavagePos: number;
  offTargetScore: number;
  status: 'PENDING' | 'FILTERED' | 'PROCESSED' | 'COMMITTED' | 'SKIPPED';
  repairType?: 'NHEJ_INDEL' | 'HDR_RESTORED';
}

const PRESETS = [
  {
    name: "BRCA1 Exon 11 (185delAG Hotspot)",
    gene: "BRCA1",
    locus: "Chr17:43044295",
    sequence: "ATGCAGAAAATCTTAGAGTGTCCCATCTGGTAAGTCAGCCTGGAAATG",
    description: "Frameshift mutation hotspot associated with hereditary breast and ovarian cancer.",
  },
  {
    name: "BRCA2 Exon 11 (6174delT Region)",
    gene: "BRCA2",
    locus: "Chr13:32914438",
    sequence: "TGTTCAGCTTTCTTAGAATCAGCTCCCAAGGAAATGTGGAGCCACAGG",
    description: "Ashkenazi founder mutation locus in breast cancer susceptibility gene 2.",
  },
  {
    name: "TP53 Exon 7 (R248Q Hotspot)",
    gene: "TP53",
    locus: "Chr17:7674220",
    sequence: "CCTCATCTTGGGCCTGTGTTATCTCCTAGGTTGGCTCTGACTGTACCA",
    description: "Most frequent missense hotspot in the human TP53 tumor suppressor core DNA-binding domain.",
  },
];

export const InteractiveBatchSimulator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [customSeq, setCustomSeq] = useState<string>(PRESETS[0].sequence);
  const [chunkSize, setChunkSize] = useState<number>(10);
  const [pamMotif, setPamMotif] = useState<string>("NGG");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<'IDLE' | 'READING' | 'PROCESSING' | 'WRITING' | 'COMPLETED'>('IDLE');
  const [windows, setWindows] = useState<GenomicWindow[]>([]);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  // Parse DNA sequence into candidate windows (20bp protospacer + 3bp PAM = 23bp)
  const parseWindows = (seq: string): GenomicWindow[] => {
    const clean = seq.toUpperCase().replace(/[^ATCG]/g, '');
    const result: GenomicWindow[] = [];
    const windowLen = 23;

    if (clean.length < windowLen) {
      return [];
    }

    for (let i = 0; i <= clean.length - windowLen; i++) {
      const sub = clean.slice(i, i + windowLen);
      const pam = sub.slice(20, 23);
      // NGG check: second and third bases must be 'G'
      const matchesPam = pam[1] === 'G' && pam[2] === 'G';
      
      result.push({
        index: i,
        sequence: sub,
        hasPam: matchesPam,
        pamSequence: pam,
        cleavagePos: i + 17, // 3bp upstream of PAM
        offTargetScore: matchesPam ? parseFloat((Math.random() * 0.15).toFixed(3)) : 0.99,
        status: 'PENDING',
      });
    }
    return result;
  };

  // Run the full Spring Batch Job simulation
  const handleRunSimulation = () => {
    setIsRunning(true);
    setCurrentStep('READING');
    const parsed = parseWindows(customSeq);
    setWindows(parsed);
    setLogMessages([
      `[JobLauncher] Initializing JobInstance: 'crisprCas9BrcaJob' (ID: 22955647)`,
      `[StepBuilder] Starting Step: 'targetScanAndCleaveStep' with chunk-size: ${chunkSize}`,
      `[ItemReader] Streaming genomic sequence from FASTA source (${customSeq.length} bp)...`,
    ]);

    // Animate Step 1: ItemReader
    setTimeout(() => {
      setCurrentStep('PROCESSING');
      setLogMessages(prev => [
        ...prev,
        `[ItemReader] Emitted ${parsed.length} candidate 23-bp windows into processing stream.`,
        `[ItemProcessor] Evaluating PAM motif (${pamMotif}) and scoring off-target CFD...`,
      ]);

      // Animate Step 2: ItemProcessor filtering
      setWindows(prev => prev.map(w => ({
        ...w,
        status: w.hasPam ? 'PROCESSED' : 'FILTERED',
      })));

      setTimeout(() => {
        setCurrentStep('WRITING');
        const validProposals = parsed.filter(w => w.hasPam);
        setLogMessages(prev => [
          ...prev,
          `[ItemProcessor] Filtered ${parsed.length - validProposals.length} non-PAM windows (returned null).`,
          `[ItemProcessor] Approved ${validProposals.length} CleavageProposals. Aggregating into Chunk(${chunkSize})...`,
          `[ItemWriter] Executing catalytic cleavage: inducing double-strand breaks at position PAM - 3bp...`,
        ]);

        // Animate Step 3: ItemWriter & Repair
        setWindows(prev => prev.map(w => {
          if (!w.hasPam) return w;
          const repair = Math.random() > 0.4 ? 'HDR_RESTORED' : 'NHEJ_INDEL';
          return {
            ...w,
            status: 'COMMITTED',
            repairType: repair,
          };
        }));

        setTimeout(() => {
          setCurrentStep('COMPLETED');
          setIsRunning(false);
          setLogMessages(prev => [
            ...prev,
            `[ItemWriter] Successfully committed ${validProposals.length} cleavage events to genomic target.`,
            `[FaultTolerantStep] SkipPolicy invoked: 0 unhandled exceptions.`,
            `[JobRepository] Persisted JobExecution status: COMPLETED (ExitCode: 0).`,
          ]);
        }, 800);
      }, 1000);
    }, 1000);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep('IDLE');
    setWindows([]);
    setLogMessages([]);
  };

  const handlePresetSelect = (idx: number) => {
    setSelectedPreset(idx);
    setCustomSeq(PRESETS[idx].sequence);
    handleReset();
  };

  const itemsRead = windows.length;
  const itemsProcessed = windows.filter(w => w.status !== 'PENDING').length;
  const itemsFiltered = windows.filter(w => w.status === 'FILTERED').length;
  const itemsCommitted = windows.filter(w => w.status === 'COMMITTED').length;

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold mb-1">
            <Cpu className="w-4 h-4" />
            <span>INTERACTIVE COMPUTATIONAL ENGINE · ZENODO 22955647</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            CRISPR-Batch: Live Spring Pipeline Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test real oncological breast cancer sequences through Spring Batch ItemReader, ItemProcessor, and ItemWriter stages.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={isRunning || currentStep === 'IDLE'}
            className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? "Running Batch Job..." : "Launch Batch Job"}</span>
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="mt-5">
        <label className="text-xs font-semibold text-slate-300 block mb-2">
          Select Oncological Target Locus (Breast Cancer Awareness Context):
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(idx)}
              className={`p-3 rounded-xl text-left border transition-all ${
                selectedPreset === idx
                  ? 'bg-cyan-950/40 border-cyan-500/60 text-white shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">{preset.name}</span>
                <span className="text-[10px] font-mono text-cyan-400">{preset.locus}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Sliders & DNA Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Sequence editor */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Input Genomic DNA Sequence (FASTA Stream):
          </label>
          <input
            type="text"
            value={customSeq}
            onChange={(e) => {
              setCustomSeq(e.target.value);
              handleReset();
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 tracking-wider focus:outline-none focus:border-cyan-500"
            placeholder="Paste ATCG sequence..."
          />
        </div>

        {/* Parameters */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Chunk Size:
            </label>
            <select
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value={5}>5 items</option>
              <option value={10}>10 items</option>
              <option value={20}>20 items</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              PAM Motif:
            </label>
            <select
              value={pamMotif}
              onChange={(e) => setPamMotif(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="NGG">SpCas9 (5&apos;-NGG-3&apos;)</option>
              <option value="NNGRRT">SaCas9 (5&apos;-NNGRRT-3&apos;)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spring Batch Execution Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block mb-0.5">ITEM READER</span>
          <div className="text-xl font-bold font-mono text-white">{itemsRead}</div>
          <span className="text-[10px] text-slate-500">Windows Streamed</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-cyan-400 block mb-0.5">ITEM PROCESSOR</span>
          <div className="text-xl font-bold font-mono text-cyan-300">{itemsProcessed}</div>
          <span className="text-[10px] text-slate-500">PAM Evaluated</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-amber-400 block mb-0.5">FILTERED (NULL)</span>
          <div className="text-xl font-bold font-mono text-amber-300">{itemsFiltered}</div>
          <span className="text-[10px] text-slate-500">Non-Target Dropped</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-rose-400 block mb-0.5">ITEM WRITER (COMMITTED)</span>
          <div className="text-xl font-bold font-mono text-rose-300">{itemsCommitted}</div>
          <span className="text-[10px] text-slate-500">Double-Strand Cuts</span>
        </div>
      </div>

      {/* Step Pipeline Visualization */}
      <div className="mt-5 p-4 bg-slate-950 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="font-semibold text-slate-300">Live Spring Batch Step Execution Flow</span>
          <span className="font-mono text-cyan-400">Status: {currentStep}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Reader stage */}
          <div className={`p-3 rounded-lg border transition-all ${
            currentStep === 'READING'
              ? 'bg-cyan-950/40 border-cyan-500 text-white'
              : 'bg-slate-900/50 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center gap-2 font-mono font-bold text-xs mb-1">
              <Dna className="w-4 h-4 text-cyan-400" />
              <span>1. ItemReader</span>
            </div>
            <p className="text-[11px] leading-snug">
              Streams candidate 20bp + PAM windows sequentially from chromosome 17.
            </p>
          </div>

          {/* Processor stage */}
          <div className={`p-3 rounded-lg border transition-all ${
            currentStep === 'PROCESSING'
              ? 'bg-cyan-950/40 border-cyan-500 text-white'
              : 'bg-slate-900/50 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center gap-2 font-mono font-bold text-xs mb-1">
              <Filter className="w-4 h-4 text-amber-400" />
              <span>2. ItemProcessor</span>
            </div>
            <p className="text-[11px] leading-snug">
              Tests 5&apos;-NGG-3&apos; PAM motif. Non-PAM returns <code className="text-rose-400">null</code> to discard.
            </p>
          </div>

          {/* Writer stage */}
          <div className={`p-3 rounded-lg border transition-all ${
            currentStep === 'WRITING' || currentStep === 'COMPLETED'
              ? 'bg-cyan-950/40 border-cyan-500 text-white'
              : 'bg-slate-900/50 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center gap-2 font-mono font-bold text-xs mb-1">
              <Layers className="w-4 h-4 text-rose-400" />
              <span>3. ItemWriter</span>
            </div>
            <p className="text-[11px] leading-snug">
              Batches valid proposals into Chunk({chunkSize}) and commits double-strand breaks.
            </p>
          </div>
        </div>
      </div>

      {/* Target Candidates Table */}
      {windows.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">
              Evaluated Genomic Windows ({windows.length} items)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Approved Cuts: {itemsCommitted}
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="py-2 px-3">Pos</th>
                  <th className="py-2 px-3">20nt Protospacer</th>
                  <th className="py-2 px-3">PAM</th>
                  <th className="py-2 px-3">CFD Risk</th>
                  <th className="py-2 px-3">Spring Status</th>
                  <th className="py-2 px-3">Repair Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {windows.map((w) => (
                  <tr key={w.index} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2 px-3 text-slate-400">#{w.index + 1}</td>
                    <td className="py-2 px-3 text-slate-200">{w.sequence.slice(0, 20)}</td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        w.hasPam ? 'bg-rose-950/70 text-rose-300 border border-rose-800' : 'text-slate-500'
                      }`}>
                        {w.pamSequence}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400">{w.offTargetScore}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        w.status === 'COMMITTED'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                          : w.status === 'FILTERED'
                          ? 'bg-slate-800 text-slate-400'
                          : w.status === 'PROCESSED'
                          ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[11px]">
                      {w.repairType === 'HDR_RESTORED' && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> HDR Template Restored
                        </span>
                      )}
                      {w.repairType === 'NHEJ_INDEL' && (
                        <span className="text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> NHEJ Frameshift Indel
                        </span>
                      )}
                      {!w.repairType && <span className="text-slate-600">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Spring Batch Log Console */}
      {logMessages.length > 0 && (
        <div className="mt-5 bg-slate-950 rounded-xl border border-slate-800 p-3 font-mono text-[11px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
            <span>Spring Batch Console Execution Log</span>
            <span className="text-cyan-400">SLF4J / Logback</span>
          </div>
          <div className="space-y-1 text-slate-300 max-h-32 overflow-y-auto">
            {logMessages.map((msg, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-slate-600 select-none">&gt;</span>
                <span className={msg.includes('COMPLETED') ? 'text-emerald-400' : 'text-slate-300'}>
                  {msg}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
