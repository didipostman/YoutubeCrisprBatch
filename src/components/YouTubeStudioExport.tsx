import React, { useState, useEffect, useRef } from 'react';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { 
  Copy, Check, Download, Video, FileText, Hash, 
  Sparkles, ExternalLink, Play, Pause, RotateCcw, Image
} from 'lucide-react';

export const YouTubeStudioExport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'script' | 'teleprompter' | 'metadata' | 'assets'>('script');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Teleprompter state
  const [isPrompterRunning, setIsPrompterRunning] = useState<boolean>(false);
  const [prompterSpeed, setPrompterSpeed] = useState<number>(2); // 1-5
  const [prompterFontSize, setPrompterFontSize] = useState<number>(20); // 16-32px
  const prompterRef = useRef<HTMLDivElement>(null);

  const coverImage = "/src/assets/images/crispr_batch_cover_1791578142910.jpg";

  // Teleprompter smooth auto-scroll effect
  useEffect(() => {
    let animId: number;
    const scrollStep = () => {
      if (prompterRef.current && isPrompterRunning) {
        prompterRef.current.scrollTop += prompterSpeed * 0.5;
      }
      if (isPrompterRunning) {
        animId = requestAnimationFrame(scrollStep);
      }
    };
    if (isPrompterRunning) {
      animId = requestAnimationFrame(scrollStep);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPrompterRunning, prompterSpeed]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Compile full YouTube Description text
  const fullDescription = `CRISPR-Batch: Spring Batch as a CRISPR-Cas9 Engine [Zenodo 22955647]

In this deep dive, we explore an unprecedented conceptual crossover between distributed enterprise software architecture and cutting-edge molecular biology: viewing the Spring Batch framework as an execution engine for CRISPR-Cas9 gene editing, based on the published model by researcher Wadï Mami (Zenodo record 22955647).

Shared in honor of Breast Cancer Awareness Month, this model demonstrates how targeting mutation hotspots in oncogenes like BRCA1 and BRCA2 can be formulated as a high-throughput, chunk-oriented batch processing pipeline.

TIMESTAMPS:
${CHAPTERS_DATA.map(c => `${c.timestamp} - ${c.title}`).join('\n')}

KEY REFERENCES & CITATIONS:
• Zenodo Record: https://zenodo.org/records/22955647
• Author: Wadï Mami
• DOI: 10.5281/zenodo.22955647
• Target Genes: BRCA1 (Chr17), BRCA2 (Chr13)
• Frameworks: Spring Batch 5.x, Java 21, CRISPR-SpCas9

TAGS:
#CRISPR #SpringBatch #Bioinformatics #BRCA1 #GeneEditing #Java #Biotech #ComputationalBiology #BreastCancerAwareness #SoftwareEngineering`;

  // Compile Full Script
  const fullScript = CHAPTERS_DATA.map(c => (
`=============================================================
CHAPTER ${c.chapterNumber}: ${c.title}
TIMECODE: ${c.timestamp} | DURATION: ${c.duration}s
DIRECTOR NOTE: ${c.directorNotes}
=============================================================

${c.fullTranscript}
`)).join('\n\n');

  // Download export package
  const handleDownloadPackage = () => {
    const exportData = {
      title: "CRISPR-Batch: Spring Batch as a CRISPR-Cas9 Engine",
      zenodoRecord: "https://zenodo.org/records/22955647",
      author: "Wadï Mami",
      chapters: CHAPTERS_DATA,
      youtubeDescription: fullDescription,
      script: fullScript,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crispr-batch-youtube-kit-zenodo-22955647.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold mb-1">
            <Video className="w-4 h-4" />
            <span>YOUTUBE CREATOR STUDIO & PRODUCTION SUITE</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            YouTube Video Production Kit (Zenodo 22955647)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Full broadcast script, teleprompter, metadata, chapter timestamps, and download tools.
          </p>
        </div>

        {/* Global Export Download */}
        <button
          onClick={handleDownloadPackage}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
        >
          <Download className="w-4 h-4" />
          <span>Export Production Kit (JSON)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mt-4 p-1 bg-slate-950 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('script')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'script' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Complete Video Script</span>
        </button>
        <button
          onClick={() => setActiveTab('teleprompter')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'teleprompter' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Teleprompter Mode</span>
        </button>
        <button
          onClick={() => setActiveTab('metadata')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'metadata' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>YouTube Description & SEO</span>
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'assets' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>Thumbnail & Assets</span>
        </button>
      </div>

      {/* Tab 1: Video Script */}
      {activeTab === 'script' && (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Total Chapters: {CHAPTERS_DATA.length} · Total Estimated Duration: ~10:30
            </span>
            <button
              onClick={() => copyToClipboard(fullScript, 'script')}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copiedKey === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'script' ? "Copied Script!" : "Copy Full Script"}</span>
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {CHAPTERS_DATA.map((ch) => (
              <div key={ch.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400">CH {ch.chapterNumber}</span>
                    <span className="font-semibold text-white">{ch.title}</span>
                  </div>
                  <span className="font-mono text-slate-400">{ch.timestamp} ({ch.duration}s)</span>
                </div>
                <div className="text-[11px] text-amber-400/90 font-mono mb-2">
                  [DIRECTOR CUE: {ch.directorNotes}]
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ch.fullTranscript}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Teleprompter Mode */}
      {activeTab === 'teleprompter' && (
        <div className="mt-5 space-y-4">
          {/* Teleprompter controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPrompterRunning(!isPrompterRunning)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                {isPrompterRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPrompterRunning ? "Pause Prompter" : "Start Prompter"}</span>
              </button>

              <button
                onClick={() => {
                  if (prompterRef.current) prompterRef.current.scrollTop = 0;
                  setIsPrompterRunning(false);
                }}
                className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white"
                title="Rewind to Top"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>Speed:</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={prompterSpeed}
                  onChange={(e) => setPrompterSpeed(Number(e.target.value))}
                  className="w-20 cursor-pointer"
                />
                <span className="font-mono text-white">{prompterSpeed}x</span>
              </div>

              <div className="flex items-center gap-2">
                <span>Font Size:</span>
                <button
                  onClick={() => setPrompterFontSize(prev => Math.max(14, prev - 2))}
                  className="px-2 py-0.5 bg-slate-800 rounded hover:bg-slate-700 text-white"
                >
                  A-
                </button>
                <span className="font-mono text-white">{prompterFontSize}px</span>
                <button
                  onClick={() => setPrompterFontSize(prev => Math.min(32, prev + 2))}
                  className="px-2 py-0.5 bg-slate-800 rounded hover:bg-slate-700 text-white"
                >
                  A+
                </button>
              </div>
            </div>
          </div>

          {/* Teleprompter Display Box */}
          <div
            ref={prompterRef}
            className="w-full h-96 bg-black rounded-xl border border-slate-800 p-8 overflow-y-auto font-sans leading-relaxed text-slate-100 scroll-smooth relative"
            style={{ fontSize: `${prompterFontSize}px` }}
          >
            <div className="max-w-2xl mx-auto space-y-12 pb-48 pt-6">
              {CHAPTERS_DATA.map((ch) => (
                <div key={ch.id} className="space-y-4">
                  <div className="text-cyan-400 font-mono text-sm tracking-wider font-bold uppercase border-b border-slate-800 pb-2">
                    --- CHAPTER {ch.chapterNumber}: {ch.title} [{ch.timestamp}] ---
                  </div>
                  <p className="leading-loose font-medium text-slate-200">
                    {ch.fullTranscript}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Metadata & SEO */}
      {activeTab === 'metadata' && (
        <div className="mt-5 space-y-4">
          {/* Suggested Titles */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300 block mb-2">
              High-CTR YouTube Title Suggestions:
            </span>
            <div className="space-y-2">
              {[
                "CRISPR-Batch: Spring Batch as a CRISPR-Cas9 Engine Explained [Zenodo 22955647]",
                "Why Spring Batch is the Perfect Model for Gene Editing (CRISPR-Cas9)",
                "How Java Enterprise Architecture Explains Molecular CRISPR-Cas9 Genetics",
                "CRISPR-Batch & Breast Cancer Awareness: Modeling BRCA1 Edits with Spring Batch",
              ].map((title, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg text-xs text-white">
                  <span>{title}</span>
                  <button
                    onClick={() => copyToClipboard(title, `title-${i}`)}
                    className="p-1 text-slate-400 hover:text-cyan-300 transition-colors ml-2"
                  >
                    {copiedKey === `title-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Formatted Description */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">
                Ready-to-Paste YouTube Video Description:
              </span>
              <button
                onClick={() => copyToClipboard(fullDescription, 'description')}
                className="px-3 py-1 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {copiedKey === 'description' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'description' ? "Copied!" : "Copy Description"}</span>
              </button>
            </div>
            <textarea
              readOnly
              value={fullDescription}
              rows={12}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Tab 4: Assets & Thumbnail */}
      {activeTab === 'assets' && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 16:9 Thumbnail Preview */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-white block mb-2">
                  Official YouTube Video Cover / Thumbnail (16:9):
                </span>
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-700 shadow-xl relative group">
                  <img
                    src={coverImage}
                    alt="YouTube Video Thumbnail"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href={coverImage}
                      download="crispr-batch-youtube-thumbnail.jpg"
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download 1080p Image</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Aspect Ratio: 16:9 (1920x1080)</span>
                <span className="text-cyan-400">High-Resolution Production Asset</span>
              </div>
            </div>

            {/* Citations & Citation Badge */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-white block mb-2">
                  Zenodo Research Citation & Link:
                </span>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 space-y-2 mb-3">
                  <div><span className="text-slate-500">Record:</span> Zenodo 22955647</div>
                  <div><span className="text-slate-500">Title:</span> Spring batch model for CRISPR-Cas9</div>
                  <div><span className="text-slate-500">Author:</span> Wadï Mami</div>
                  <div><span className="text-slate-500">DOI:</span> 10.5281/zenodo.22955647</div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Published in the context of Breast Cancer Awareness Month, proposing Spring Batch as a model for computational gene editing pipelines.
                </p>
              </div>

              <a
                href="https://zenodo.org/records/22955647"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>View Original Record on Zenodo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
