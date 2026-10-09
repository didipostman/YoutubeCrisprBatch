import React, { useState } from 'react';
import { VideoChapter, ChapterKeyframe } from '../data/chaptersData';
import { 
  Play, Pause, Code2, Dna, Database, Sparkles, AlertCircle, 
  CheckCircle2, ArrowRight, Layers, Cpu, Flame, ExternalLink,
  ShieldAlert, Activity
} from 'lucide-react';

interface VisualStageProps {
  chapter: VideoChapter;
  currentKeyframe: ChapterKeyframe;
  currentTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const VisualStage: React.FC<VisualStageProps> = ({
  chapter,
  currentKeyframe,
  currentTime,
  isPlaying,
  onTogglePlay,
}) => {
  const [activeTab, setActiveTab] = useState<'animated' | 'code' | 'molecular'>('animated');
  const [interactivePamFound, setInteractivePamFound] = useState<boolean>(true);

  // Fallback / image assets
  const coverImage = "/src/assets/images/crispr_batch_cover_1791578142910.jpg";
  const cas9Image = "/src/assets/images/cas9_dna_complex_1791578153428.jpg";
  const springImage = "/src/assets/images/spring_batch_flow_1791578163875.jpg";

  return (
    <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col group select-none">
      {/* Top Overlay Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded">
            CHAPTER {chapter.chapterNumber}
          </span>
          <span className="text-xs text-slate-300 font-medium truncate max-w-md">
            {chapter.title}
          </span>
        </div>

        {/* Stage View Mode Toggles */}
        <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('animated')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'animated' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dual Architecture
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'code' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3 h-3" />
            Spring Code
          </button>
          <button
            onClick={() => setActiveTab('molecular')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'molecular' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dna className="w-3 h-3" />
            Cas9 Biology
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Background artwork or grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        {/* View Mode: Molecular Photo Reference */}
        {activeTab === 'molecular' && (
          <div className="relative w-full h-full flex flex-col justify-end p-6 bg-slate-950">
            <img 
              src={cas9Image} 
              alt="CRISPR Cas9 endonuclease molecular architecture" 
              className="absolute inset-0 w-full h-full object-cover opacity-85"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="relative z-10 max-w-2xl bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-semibold mb-1">
                <Dna className="w-4 h-4" />
                <span>MOLECULAR COMPLEX: SpCas9 ENDONUCLEASE</span>
              </div>
              <h4 className="text-white text-base font-semibold mb-1">
                Catalytic Cleavage by HNH & RuvC Domains
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Notice the R-loop binding groove and the dual catalytic centers: the HNH domain hydrolyzes the target strand complementary to crRNA, while RuvC hydrolyzes the displaced non-target strand, resulting in a blunt double-strand break (DSB) 3 nucleotides upstream of the 5&apos;-NGG PAM motif.
              </p>
            </div>
          </div>
        )}

        {/* View Mode: Spring Code */}
        {activeTab === 'code' && (
          <div className="relative w-full h-full flex flex-col justify-center p-8 bg-slate-950 font-mono">
            <div className="max-w-3xl mx-auto w-full bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-medium text-slate-300">CrisprBatchConfiguration.java</span>
                </div>
                <span>Spring Batch 5.x / Java 21</span>
              </div>
              <pre className="text-xs text-cyan-300/90 leading-relaxed overflow-x-auto whitespace-pre font-mono p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                {currentKeyframe.codeSnippet || `// Spring Batch 5.x Pipeline Definition
@Bean
public Step crisprCleavageStep(JobRepository jobRepository,
                              PlatformTransactionManager txManager,
                              ItemReader<DnaWindow> fastaReader,
                              ItemProcessor<DnaWindow, CleavageProposal> pamProcessor,
                              ItemWriter<CleavageProposal> cas9Cleaver) {
    return new StepBuilder("crisprStep", jobRepository)
        .<DnaWindow, CleavageProposal>chunk(50, txManager)
        .reader(fastaReader)
        .processor(pamProcessor)
        .writer(cas9Cleaver)
        .faultTolerant()
        .skip(OffTargetBindingException.class)
        .skipLimit(10)
        .retry(ChromatinInaccessibleException.class)
        .maxRetryAttempts(3)
        .build();
}`}
              </pre>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                <span>Chunk Size: 50 items</span>
                <span className="text-cyan-400">Target Locus: BRCA1 (Exon 11 Hotspot)</span>
              </div>
            </div>
          </div>
        )}

        {/* View Mode: Animated Architecture Stage */}
        {activeTab === 'animated' && (
          <div className="relative w-full h-full flex items-center justify-center p-6">
            {/* Chapter 1: Cover / Introduction */}
            {chapter.id === 1 && (
              <div className="relative w-full h-full flex flex-col justify-center items-center text-center px-4">
                <img 
                  src={coverImage} 
                  alt="CRISPR-Batch Video Cover" 
                  className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
                  referrerPolicy="no-referrer"
                />
                <div className="relative z-10 max-w-2xl bg-slate-950/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-950/50 border border-rose-800/50 rounded-full text-rose-300 text-xs font-semibold mb-3">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>Zenodo Record 22955647 · Wadï Mami</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
                    CRISPR-Batch: Spring Batch as a CRISPR-Cas9 Engine
                  </h2>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
                    A computational paradigm mapping enterprise batch transaction architecture to molecular gene editing, highlighted for Breast Cancer Awareness Month.
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-left pt-3 border-t border-slate-800">
                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] uppercase font-mono text-cyan-400 block mb-0.5">Software</span>
                      <span className="text-xs font-semibold text-white">Spring Batch Framework</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] uppercase font-mono text-rose-400 block mb-0.5">Biology</span>
                      <span className="text-xs font-semibold text-white">CRISPR-Cas9 Endonuclease</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] uppercase font-mono text-amber-400 block mb-0.5">Target Gene</span>
                      <span className="text-xs font-semibold text-white">BRCA1 / BRCA2 Hotspots</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 2: The Job & Step Lifecycle */}
            {chapter.id === 2 && (
              <div className="w-full h-full max-w-4xl flex flex-col justify-center">
                <div className="text-center mb-6">
                  <span className="text-xs font-mono text-cyan-400">ORCHESTRATION PIPELINE</span>
                  <h3 className="text-lg font-bold text-white">Spring JobExecution ↔ Clinical Gene Therapy Campaign</h3>
                </div>
                <div className="grid grid-cols-4 gap-3 relative">
                  {/* Step 1 */}
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl relative hover:border-cyan-500/50 transition-all">
                    <div className="text-[10px] font-mono text-cyan-400 mb-1">STEP 01</div>
                    <div className="text-xs font-bold text-white mb-2">Target Selection</div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      Scan chromosome 17 for target exon loci and mutations.
                    </div>
                    <div className="mt-3 text-[10px] font-mono bg-slate-950 px-2 py-1 rounded text-emerald-400 border border-slate-800">
                      Status: COMPLETED
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-slate-900/90 border border-cyan-500/60 p-4 rounded-xl relative shadow-lg shadow-cyan-950/40">
                    <div className="text-[10px] font-mono text-cyan-300 mb-1 flex items-center justify-between">
                      <span>STEP 02</span>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    </div>
                    <div className="text-xs font-bold text-white mb-2">gRNA Design & PAM</div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      Algorithmically verify 5&apos;-NGG PAM and synthesize 20nt crRNA.
                    </div>
                    <div className="mt-3 text-[10px] font-mono bg-cyan-950/60 px-2 py-1 rounded text-cyan-300 border border-cyan-800">
                      Status: ACTIVE STEP
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl relative">
                    <div className="text-[10px] font-mono text-slate-500 mb-1">STEP 03</div>
                    <div className="text-xs font-bold text-slate-300 mb-2">Cellular Delivery</div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      Electroporate Cas9-RNP complex into target cell lines.
                    </div>
                    <div className="mt-3 text-[10px] font-mono bg-slate-950 px-2 py-1 rounded text-slate-500 border border-slate-800">
                      Status: QUEUED
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl relative">
                    <div className="text-[10px] font-mono text-slate-500 mb-1">STEP 04</div>
                    <div className="text-xs font-bold text-slate-300 mb-2">Cleavage & Repair</div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      Hydrolyze DNA backbone and monitor NHEJ / HDR repair outcomes.
                    </div>
                    <div className="mt-3 text-[10px] font-mono bg-slate-950 px-2 py-1 rounded text-slate-500 border border-slate-800">
                      Status: QUEUED
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span>Spring JobRepository keeps audit logs of every nucleotide mutation and exit status</span>
                  </div>
                  <span className="font-mono text-cyan-400">JobExecutionId: 22955647</span>
                </div>
              </div>
            )}

            {/* Chapter 3: ItemReader */}
            {chapter.id === 3 && (
              <div className="w-full max-w-4xl flex flex-col justify-center">
                <div className="text-center mb-5">
                  <span className="text-xs font-mono text-cyan-400">DATA STREAMING STAGE</span>
                  <h3 className="text-lg font-bold text-white">ItemReader: Streaming Chromosome 17 (BRCA1)</h3>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                    <span>Genomic Coordinate: Chr17:43044295-43044340</span>
                    <span className="text-cyan-400 font-mono">Cursor Position: 185delAG Hotspot</span>
                  </div>

                  {/* DNA Sequence Stream Visualizer */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto font-mono text-sm tracking-wider flex items-center gap-1.5 justify-center py-4">
                    {['A','T','G','C','A','G','A','A','A','A','T','C','T','T','A','G','A','G','T','G','T','C','C','C','A','T','C','T','G','G','T','A','A'].map((base, idx) => {
                      const isWindow = idx >= 10 && idx <= 30;
                      const isPam = idx >= 28 && idx <= 30;
                      return (
                        <div 
                          key={idx}
                          className={`flex flex-col items-center px-1 py-1 rounded transition-all ${
                            isPam 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/60 scale-110 font-bold' 
                              : isWindow 
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                              : 'text-slate-600'
                          }`}
                        >
                          <span>{base}</span>
                          <span className="text-[8px] text-slate-500">{idx + 1}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-cyan-400 font-mono block mb-1">ItemReader Behavior</span>
                      <p className="text-slate-300">
                        Extracts sliding 20-bp windows + flanking PAM context. Returns <code className="text-rose-400">null</code> at EOF to close chromosome stream.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-rose-400 font-mono block mb-1">Memory Efficiency</span>
                      <p className="text-slate-300">
                        Zero JVM heap overflow: Reads 3.2 billion bases sequentially with fixed 50-item chunk memory footprint.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 4: ItemProcessor */}
            {chapter.id === 4 && (
              <div className="w-full max-w-4xl flex flex-col justify-center">
                <div className="text-center mb-5">
                  <span className="text-xs font-mono text-cyan-400">BIOLOGICAL COMPUTATION</span>
                  <h3 className="text-lg font-bold text-white">ItemProcessor: PAM Recognition (5&apos;-NGG-3&apos;) & Filtering</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Left: Input Window Evaluator */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-slate-300 font-semibold">DNA Window Candidate</span>
                      <span className="text-cyan-400 font-mono">Length: 23 bp</span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs mb-3">
                      <div className="text-slate-400 mb-1">Protospacer (20nt) + PAM (3nt):</div>
                      <div className="text-sm tracking-wide">
                        <span className="text-cyan-300">ACGTGTCAGACCTACGATCG</span>
                        <span className="text-rose-400 font-bold bg-rose-950/60 px-1 py-0.5 rounded border border-rose-800 ml-1">
                          TGG
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                        <span className="text-slate-400">PAM Motif Match (NGG):</span>
                        <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> FOUND (TGG)
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                        <span className="text-slate-400">Off-Target CFD Score:</span>
                        <span className="text-cyan-300 font-mono font-bold">0.032 (Low Risk)</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                        <span className="text-slate-400">GC Content:</span>
                        <span className="text-cyan-300 font-mono font-bold">52.4 % (Optimal)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Spring ItemProcessor Filter Action */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-300 mb-2">ItemProcessor Logic</div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed mb-3">
                        <span className="text-rose-400">if</span> (!window.hasPam(&quot;NGG&quot;)) &#123;<br />
                        &nbsp;&nbsp;<span className="text-cyan-400">return null;</span> <span className="text-slate-500">// Filter item!</span><br />
                        &#125; <span className="text-rose-400">else</span> &#123;<br />
                        &nbsp;&nbsp;<span className="text-cyan-400">return</span> new CleavageProposal(window);<br />
                        &#125;
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        In Spring Batch, returning <code className="text-cyan-400">null</code> drops the item from the chunk. In biology, SpCas9 rapidly dissociates from non-PAM loci without burning cellular ATP.
                      </p>
                    </div>

                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                      <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>CleavageProposal emitted to Chunk buffer</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 5: ItemWriter */}
            {chapter.id === 5 && (
              <div className="w-full max-w-4xl flex flex-col justify-center">
                <div className="text-center mb-5">
                  <span className="text-xs font-mono text-rose-400">COMMIT BOUNDARY EXECUTION</span>
                  <h3 className="text-lg font-bold text-white">ItemWriter: Double-Strand Break (DSB) Catalysis</h3>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="grid grid-cols-2 gap-5 items-center">
                    <div>
                      <div className="text-xs font-mono text-rose-400 mb-1">CLEAVAGE REACTION</div>
                      <h4 className="text-white text-base font-bold mb-2">Physical DNA Backbone Cleavage</h4>
                      <p className="text-slate-300 text-xs leading-relaxed mb-4">
                        The Cas9 endonuclease hydrolyzes both phosphodiester backbones exactly 3 base pairs upstream of the PAM motif.
                      </p>

                      <div className="space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                          <span className="text-cyan-300">Target Strand Cut:</span>
                          <span className="text-slate-300">HNH Domain (Mg2+ cofactor)</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                          <span className="text-rose-300">Non-Target Strand Cut:</span>
                          <span className="text-slate-300">RuvC Domain (Mg2+ cofactor)</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                          <span className="text-amber-300">Cut Geometry:</span>
                          <span className="text-slate-300">Blunt Double-Strand Break (DSB)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/60 flex items-center justify-center text-rose-400 mb-3 shadow-lg shadow-rose-950/50">
                        <Flame className="w-6 h-6 animate-pulse" />
                      </div>
                      <span className="text-xs font-mono text-rose-400 font-bold mb-1">TRANSACTION COMMIT</span>
                      <span className="text-sm font-semibold text-white mb-2">Double-Strand Break Induced</span>
                      <p className="text-[11px] text-slate-400 max-w-xs">
                        Like an atomic database transaction commit, once phosphodiester bonds hydrolyze, the cell must execute a DNA repair mechanism (NHEJ or HDR).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 6: Chunking */}
            {chapter.id === 6 && (
              <div className="w-full max-w-4xl flex flex-col justify-center">
                <div className="text-center mb-5">
                  <span className="text-xs font-mono text-cyan-400">BATCH BUFFERING & PARALLELISM</span>
                  <h3 className="text-lg font-bold text-white">Chunking: Microplate Batch Transactions</h3>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-slate-300 font-semibold">Chunk Buffer Status: 10 / 10 Items</span>
                    <span className="text-xs font-mono text-cyan-400">commit-interval = 10</span>
                  </div>

                  {/* 10 Items Grid */}
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div 
                        key={i}
                        className="bg-slate-950 border border-cyan-500/40 p-2 rounded text-center font-mono text-xs text-cyan-300"
                      >
                        <span className="text-[10px] text-slate-500 block">Item #{i + 1}</span>
                        <span className="font-bold">gRNA-{i + 1}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-lg text-xs">
                    <div className="flex items-center gap-2 text-cyan-300">
                      <Layers className="w-4 h-4" />
                      <span>Chunk full $\rightarrow$ Delegating batch to ItemWriter inside single transaction</span>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold">ATOMIC BATCH WRITE</span>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 7: Fault Tolerance */}
            {chapter.id === 7 && (
              <div className="w-full max-w-4xl flex flex-col justify-center">
                <div className="text-center mb-5">
                  <span className="text-xs font-mono text-amber-400">RESILIENCE & ERROR HANDLING</span>
                  <h3 className="text-lg font-bold text-white">SkipPolicy & RetryPolicy in Cellular Repair</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold mb-2">
                      <ShieldAlert className="w-4 h-4" />
                      <span>SPRING SKIP POLICY ↔ NHEJ REPAIR</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      When an exception occurs (e.g. slight off-target mismatch), Spring SkipPolicy records the event without crashing the entire job.
                    </p>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[11px] text-slate-400">
                      <span className="text-rose-400 font-semibold">Non-Homologous End Joining:</span><br />
                      Ligation introduces 1-2bp indels. Cell survives with gene knockout; pipeline continues.
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold mb-2">
                      <Activity className="w-4 h-4" />
                      <span>SPRING RETRY POLICY ↔ HDR REPAIR</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      When transient failures occur, Spring RetryPolicy re-attempts execution with clean donor templates.
                    </p>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[11px] text-slate-400">
                      <span className="text-emerald-400 font-semibold">Homology-Directed Repair:</span><br />
                      Exogenous donor ssODN reconstructs wild-type BRCA1 sequence with zero indel error.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 8: Future & Oncology */}
            {chapter.id === 8 && (
              <div className="w-full max-w-4xl flex flex-col justify-center text-center">
                <img 
                  src={springImage} 
                  alt="Spring Batch Flow" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xs"
                  referrerPolicy="no-referrer"
                />
                <div className="relative z-10 max-w-2xl mx-auto bg-slate-950/85 backdrop-blur-md p-6 rounded-2xl border border-slate-800">
                  <span className="text-xs font-mono text-cyan-400 mb-1 block">ZENODO RECORD 22955647 CONCLUSION</span>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Deterministic Software-Defined Medicine
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed mb-4">
                    Wadï Mami&apos;s conceptual breakthrough demonstrates that biological complexity can be framed using proven enterprise software patterns: streaming readers, filtering processors, transactional writers, and fault-tolerant repair policies.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-950/50 border border-cyan-800/60 rounded-xl text-cyan-300 text-xs font-medium">
                    <span>Explore paper on Zenodo:</span>
                    <a 
                      href="https://zenodo.org/records/22955647" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="underline font-mono flex items-center gap-1 hover:text-cyan-200"
                    >
                      doi:10.5281/zenodo.22955647
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subtitles Overlay Bar */}
      <div className="relative z-20 px-6 py-3 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent border-t border-slate-900/60 flex items-center justify-between min-h-[58px]">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mb-0.5">
            <span>KEYFRAME NARRATION</span>
            <span>·</span>
            <span>{currentKeyframe.title}</span>
          </div>
          <p className="text-xs md:text-sm text-slate-100 font-medium leading-snug line-clamp-2">
            &ldquo;{currentKeyframe.narrationText}&rdquo;
          </p>
        </div>

        <button
          onClick={onTogglePlay}
          className="shrink-0 w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20"
          title={isPlaying ? "Pause Video" : "Play Video"}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>
      </div>
    </div>
  );
};
