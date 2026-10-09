import React from 'react';
import { CHAPTERS_DATA, VideoChapter } from '../data/chaptersData';
import { Play, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface ChapterTimelineProps {
  currentChapterIndex: number;
  onSelectChapter: (index: number) => void;
}

export const ChapterTimeline: React.FC<ChapterTimelineProps> = ({
  currentChapterIndex,
  onSelectChapter,
}) => {
  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Video Chapters & Timeline</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              (8 Chapters · 10m 30s)
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any chapter to jump directly to its animated keyframes and narration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {CHAPTERS_DATA.map((ch, idx) => {
          const isActive = currentChapterIndex === idx;
          const isPassed = currentChapterIndex > idx;

          return (
            <button
              key={ch.id}
              onClick={() => onSelectChapter(idx)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between group ${
                isActive
                  ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500'
                  : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top chapter tag & time */}
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className={isActive ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                    CHAPTER {ch.chapterNumber}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{ch.timestamp}</span>
                  </div>
                </div>

                {/* Chapter Title */}
                <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 mb-1.5 group-hover:text-cyan-300 transition-colors">
                  {ch.title}
                </h4>

                {/* Description */}
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {ch.shortDescription}
                </p>
              </div>

              {/* Status footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="truncate max-w-[120px]">{ch.category}</span>
                {isActive ? (
                  <span className="text-cyan-400 font-medium flex items-center gap-1">
                    <Play className="w-2.5 h-2.5 fill-current" /> Playing
                  </span>
                ) : isPassed ? (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Watched
                  </span>
                ) : (
                  <span className="text-slate-500">Up next</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
