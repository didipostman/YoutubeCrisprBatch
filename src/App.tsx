import React, { useState } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { ChapterTimeline } from './components/ChapterTimeline';
import { InteractiveBatchSimulator } from './components/InteractiveBatchSimulator';
import { RosettaStone } from './components/RosettaStone';
import { YouTubeStudioExport } from './components/YouTubeStudioExport';
import { CHAPTERS_DATA } from './data/chaptersData';
import { 
  Play, Dna, Cpu, Layers, Video, ExternalLink, 
  Sparkles, Download, HeartHandshake, BookOpen
} from 'lucide-react';

export default function App() {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'chapters' | 'simulator' | 'rosetta' | 'studio'>('chapters');

  const scrollToSection = (tab: 'chapters' | 'simulator' | 'rosetta' | 'studio') => {
    setActiveWorkspaceTab(tab);
    const element = document.getElementById('workspace-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a 
          href="/" 
          className="text-base sm:text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="text-cyan-400">CRISPR</span>
          <span className="text-slate-500 font-light">/</span>
          <span>Batch Studio</span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => scrollToSection('chapters')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeWorkspaceTab === 'chapters' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Video Chapters
          </button>
          <button
            onClick={() => scrollToSection('simulator')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeWorkspaceTab === 'simulator' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Batch Simulator
          </button>
          <button
            onClick={() => scrollToSection('rosetta')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeWorkspaceTab === 'rosetta' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Rosetta Matrix
          </button>
          <button
            onClick={() => scrollToSection('studio')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeWorkspaceTab === 'studio' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Creator Studio
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => scrollToSection('studio')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all shadow-sm shadow-cyan-400/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Production Kit</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Header Kicker & Title */}
        <section className="text-center max-w-3xl mx-auto space-y-2">
          {/* Metadata kicker */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <span>Zenodo Record 22955647</span>
            <span aria-hidden="true">·</span>
            <span>Wadï Mami</span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-400 flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5" />
              Breast Cancer Awareness Month
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            CRISPR-Batch: Spring Batch as a CRISPR-Cas9 Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            An interactive educational video presentation and production studio exploring the conceptual alignment between enterprise batch data processing and molecular genome editing.
          </p>
        </section>

        {/* 16:9 Interactive Video Player */}
        <section aria-label="Interactive Video Stage">
          <VideoPlayer
            currentChapterIndex={currentChapterIndex}
            onSelectChapter={(idx) => setCurrentChapterIndex(idx)}
          />
        </section>

        {/* Workspace Segmented Switcher */}
        <div id="workspace-section" className="pt-2">
          <div className="flex items-center justify-center">
            <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
              <button
                onClick={() => setActiveWorkspaceTab('chapters')}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 ${
                  activeWorkspaceTab === 'chapters'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Video Chapters (8)</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('simulator')}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 ${
                  activeWorkspaceTab === 'simulator'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Live Batch Simulator</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('rosetta')}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 ${
                  activeWorkspaceTab === 'rosetta'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Rosetta Matrix</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('studio')}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 ${
                  activeWorkspaceTab === 'studio'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>YouTube Creator Studio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Workspace Tab Content */}
        <section>
          {activeWorkspaceTab === 'chapters' && (
            <ChapterTimeline
              currentChapterIndex={currentChapterIndex}
              onSelectChapter={(idx) => {
                setCurrentChapterIndex(idx);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
            />
          )}

          {activeWorkspaceTab === 'simulator' && (
            <InteractiveBatchSimulator />
          )}

          {activeWorkspaceTab === 'rosetta' && (
            <RosettaStone />
          )}

          {activeWorkspaceTab === 'studio' && (
            <YouTubeStudioExport />
          )}
        </section>

        {/* Grounding & Citation Card */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white">
                Academic & Computational Grounding: Zenodo Record 22955647
              </div>
              <p className="text-slate-400 mt-0.5">
                Mami, W. (2024). <em>Spring batch model for CRISPR-Cas9</em>. Zenodo repository. Highlighting breast cancer oncogene targets (BRCA1/2).
              </p>
            </div>
          </div>

          <a
            href="https://zenodo.org/records/22955647"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500 text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Open Zenodo Record</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            CRISPR-Batch Video Studio · Based on research by Wadï Mami (Zenodo 22955647)
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Spring Batch 5.x</span>
            <span>·</span>
            <span>CRISPR-SpCas9</span>
            <span>·</span>
            <span>BRCA1/BRCA2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
