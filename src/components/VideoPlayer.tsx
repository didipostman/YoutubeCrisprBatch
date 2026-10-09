import React, { useState, useEffect, useRef } from 'react';
import { VideoChapter, CHAPTERS_DATA } from '../data/chaptersData';
import { VisualStage } from './VisualStage';
import { speechEngine, SpeechVoiceOption } from '../utils/speechEngine';
import { 
  Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw, 
  Volume2, VolumeX, Maximize2, Minimize2, Settings, ListVideo,
  Sparkles
} from 'lucide-react';

interface VideoPlayerProps {
  currentChapterIndex: number;
  onSelectChapter: (index: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentChapterIndex,
  onSelectChapter,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0); // seconds in current chapter
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechVoiceOption[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>('');
  const [showVoiceMenu, setShowVoiceMenu] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const chapter = CHAPTERS_DATA[currentChapterIndex];

  // Calculate current active keyframe based on currentTime
  const currentKeyframe = (() => {
    const kfs = chapter.keyframes;
    for (let i = kfs.length - 1; i >= 0; i--) {
      if (currentTime >= kfs[i].timeOffset) {
        return kfs[i];
      }
    }
    return kfs[0];
  })();

  // Total video duration across all chapters
  const totalVideoDuration = CHAPTERS_DATA.reduce((acc, c) => acc + c.duration, 0);

  // Accumulated time up to current chapter
  const accumulatedTimeBefore = CHAPTERS_DATA.slice(0, currentChapterIndex).reduce(
    (acc, c) => acc + c.duration, 
    0
  );
  const globalCurrentTime = accumulatedTimeBefore + currentTime;

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Load available speech voices
  useEffect(() => {
    const available = speechEngine.getAvailableVoices();
    setVoices(available);
    if (available.length > 0) {
      const def = available.find(v => v.default) || available[0];
      setSelectedVoiceUri(def.id);
    }
  }, []);

  // Handle voice narration when keyframe or chapter changes while playing
  useEffect(() => {
    if (isPlaying && !isMuted) {
      speechEngine.speak(currentKeyframe.narrationText);
    } else if (!isPlaying) {
      speechEngine.pause();
    }
  }, [currentKeyframe.title, isPlaying, isMuted]);

  // Main playback timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.25 * playbackSpeed;
          if (next >= chapter.duration) {
            // Advance to next chapter if available
            if (currentChapterIndex < CHAPTERS_DATA.length - 1) {
              onSelectChapter(currentChapterIndex + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return chapter.duration;
            }
          }
          return next;
        });
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, chapter.duration, currentChapterIndex, onSelectChapter]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      speechEngine.pause();
      setIsPlaying(false);
    } else {
      if (currentTime >= chapter.duration) {
        setCurrentTime(0);
      }
      speechEngine.resume();
      if (!isMuted) {
        speechEngine.speak(currentKeyframe.narrationText);
      }
      setIsPlaying(true);
    }
  };

  // Skip back/forward within chapter
  const skipSeconds = (delta: number) => {
    setCurrentTime((prev) => {
      const updated = Math.max(0, Math.min(chapter.duration, prev + delta));
      return updated;
    });
  };

  // Handle Chapter selection
  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      onSelectChapter(currentChapterIndex - 1);
      setCurrentTime(0);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < CHAPTERS_DATA.length - 1) {
      onSelectChapter(currentChapterIndex + 1);
      setCurrentTime(0);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    speechEngine.setMuted(nextState);
    if (!nextState && isPlaying) {
      speechEngine.speak(currentKeyframe.narrationText);
    }
  };

  // Change playback speed
  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    speechEngine.setRate(nextSpeed);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col w-full bg-slate-900 rounded-2xl border border-slate-800 p-3 sm:p-5 shadow-2xl">
      {/* 16:9 Visual Stage */}
      <VisualStage
        chapter={chapter}
        currentKeyframe={currentKeyframe}
        currentTime={currentTime}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
      />

      {/* Scrubber & Timeline Bar */}
      <div className="mt-4 px-1">
        {/* Scrubber Track */}
        <div className="relative w-full h-2.5 bg-slate-800 rounded-full cursor-pointer group flex items-center">
          {/* Progress fill */}
          <div 
            className="h-full bg-cyan-400 rounded-full transition-all duration-150 relative"
            style={{ width: `${(currentTime / chapter.duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-md border-2 border-cyan-500 scale-0 group-hover:scale-100 transition-transform" />
          </div>

          {/* Chapter Keyframe Markers */}
          {chapter.keyframes.map((kf, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-0.5 bg-slate-600 hover:bg-white transition-colors"
              style={{ left: `${(kf.timeOffset / chapter.duration) * 100}%` }}
              title={`${kf.title} (${formatTime(kf.timeOffset)})`}
            />
          ))}

          {/* Click to seek */}
          <input
            type="range"
            min={0}
            max={chapter.duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            aria-label="Seek video position"
          />
        </div>

        {/* Transport Controls Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-slate-300">
          {/* Left Controls: Play, Skips, Chapter Steps */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevChapter}
              disabled={currentChapterIndex === 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Previous Chapter"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => skipSeconds(-10)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              onClick={() => skipSeconds(10)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Forward 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextChapter}
              disabled={currentChapterIndex === CHAPTERS_DATA.length - 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Next Chapter"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Time readout */}
            <div className="ml-2 font-mono text-xs text-slate-400">
              <span className="text-white font-medium">{formatTime(currentTime)}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(chapter.duration)}</span>
              <span className="hidden sm:inline text-slate-500 ml-2">
                (Total: {formatTime(globalCurrentTime)} / {formatTime(totalVideoDuration)})
              </span>
            </div>
          </div>

          {/* Right Controls: Audio Voiceover, Speed, Fullscreen */}
          <div className="flex items-center gap-2 text-xs">
            {/* Audio Voice Narration Toggle */}
            <div className="relative">
              <button
                onClick={toggleMute}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isMuted ? 'text-rose-400 hover:bg-slate-800' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={isMuted ? "Unmute Voice Narration" : "Mute Voice Narration"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-[11px] font-mono hidden md:inline">
                  {isMuted ? "Muted" : "Voice AI"}
                </span>
              </button>
            </div>

            {/* Voice Selector Settings */}
            {voices.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowVoiceMenu(!showVoiceMenu)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Select AI Narrator Voice"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {showVoiceMenu && (
                  <div className="absolute right-0 bottom-full mb-2 w-56 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-50 text-xs">
                    <div className="text-[11px] font-mono text-slate-400 px-2 py-1 mb-1 border-b border-slate-800">
                      SPEECH NARRATOR VOICE
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {voices.slice(0, 8).map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSelectedVoiceUri(v.id);
                            speechEngine.setVoice(v.id);
                            setShowVoiceMenu(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs truncate transition-colors ${
                            selectedVoiceUri === v.id
                              ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {v.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Speed Multiplier Button */}
            <button
              onClick={cycleSpeed}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-semibold transition-colors"
              title="Change Playback Speed"
            >
              {playbackSpeed}x
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
