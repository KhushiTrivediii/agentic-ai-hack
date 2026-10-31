import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, ChevronRight, X, Video } from 'lucide-react';
import { sfx } from '../utils/audio';

interface AutoDemoPresenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
  openVoiceModal: () => void;
  closeVoiceModal: () => void;
  onResolveFirstConflict: () => void;
  onConfirmStagedTasks: () => void;
}

interface Chapter {
  id: number;
  timeRange: string;
  durationSec: number;
  title: string;
  script: string;
  tabTarget: string;
  action?: 'open_voice' | 'resolve_conflict' | 'confirm_tasks';
}

export const AutoDemoPresenter: React.FC<AutoDemoPresenterProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  openVoiceModal,
  closeVoiceModal,
  onResolveFirstConflict,
  onConfirmStagedTasks,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [progressSec, setProgressSec] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const timerRef = useRef<any>(null);

  const chapters: Chapter[] = [
    {
      id: 1,
      timeRange: '0:00 – 0:45',
      durationSec: 45,
      title: 'Act 1: The Problem & Product Thinking',
      script:
        'Welcome to SyncPulse AI. Meeting notes are passive. If an engineer silently shifts the database from Postgres to MongoDB, Jira tickets get filed anyway, SLAs break, and standard AI summarizers fail to catch it. SyncPulse is an autonomous meeting-to-execution agent with persistent cross-sprint memory.',
      tabTarget: 'ingestion',
    },
    {
      id: 2,
      timeRange: '0:45 – 1:30',
      durationSec: 45,
      title: 'Act 2: Wispr Flow Voice Ingestion & Disfluency Normalization',
      script:
        'We dictate our post-meeting updates directly using Wispr Flow. Notice how it strips conversational fillers like um, like, and wait strike that in real time, converting natural spoken stream into verified execution structures.',
      tabTarget: 'ingestion',
      action: 'open_voice',
    },
    {
      id: 3,
      timeRange: '1:30 – 2:15',
      durationSec: 45,
      title: 'Act 3: Memory Graph & Contradiction Resolution',
      script:
        'SyncPulse checks our Sprint 14 baseline. It catches three critical contradictions: Postgres versus MongoDB, a 13-day SLA drift, and orphaned SOC2 compliance. Watch as the PM synthesizes a compromise, decrementing the conflict counter in real time.',
      tabTarget: 'conflicts',
      action: 'resolve_conflict',
    },
    {
      id: 4,
      timeRange: '2:15 – 3:00',
      durationSec: 45,
      title: 'Act 4: Human-in-the-Loop Execution & Live API Dispatch',
      script:
        'Instead of noisy bot spam, our human-in-the-loop staging gate allows PMs to review tasks before publishing. When confirmed, tasks are dispatched with live GraphQL and REST payloads straight to Linear, Jira, and Slack with 200 OK responses.',
      tabTarget: 'staging',
      action: 'confirm_tasks',
    },
  ];

  const currentChapter = chapters[currentChapterIdx];

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (isPlaying) {
      speakText(currentChapter.script);

      // Execute scene action
      onNavigateTab(currentChapter.tabTarget);
      if (currentChapter.action === 'open_voice') {
        setTimeout(() => openVoiceModal(), 1200);
      } else if (currentChapter.action === 'resolve_conflict') {
        closeVoiceModal();
        setTimeout(() => onResolveFirstConflict(), 2000);
      } else if (currentChapter.action === 'confirm_tasks') {
        closeVoiceModal();
        setTimeout(() => onConfirmStagedTasks(), 2500);
      }

      timerRef.current = setInterval(() => {
        setProgressSec((prev) => {
          if (prev >= currentChapter.durationSec) {
            // Next chapter
            if (currentChapterIdx < chapters.length - 1) {
              setCurrentChapterIdx((c) => c + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, currentChapterIdx, isOpen]);

  if (!isOpen) return null;

  const handleTogglePlay = () => {
    sfx.playClick();
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    sfx.playClick();
    setCurrentChapterIdx(0);
    setProgressSec(0);
    setIsPlaying(true);
  };

  const totalProgress = Math.round(
    ((currentChapterIdx * 45 + progressSec) / (chapters.length * 45)) * 100
  );

  return (
    <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none animate-in slide-in-from-bottom-6 duration-300">
      <div className="pointer-events-auto max-w-3xl w-full bg-slate-900/95 border border-indigo-500/50 rounded-3xl shadow-2xl shadow-indigo-950/80 backdrop-blur-2xl p-4 sm:p-5 ring-1 ring-indigo-500/30 space-y-3">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30">
              <Video className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white tracking-tight">
                  3-Minute Hackathon Demo Walkthrough Mode
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentChapter.timeRange}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {currentChapter.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sfx.playClick();
                setVoiceEnabled((v) => !v);
              }}
              className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-white/[0.08] cursor-pointer"
              title={voiceEnabled ? 'Voiceover Active' : 'Voiceover Muted'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-white/[0.08] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Script Teleprompter Card */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/[0.06] text-xs text-slate-200 leading-relaxed font-sans shadow-inner">
          <p className="italic">"{currentChapter.script}"</p>
        </div>

        {/* Timeline Controller & Chapter Steps */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Tour' : 'Resume Tour'}</span>
            </button>

            <button
              onClick={handleRestart}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Restart Tour from 0:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar & Indicators */}
          <div className="flex-1 hidden sm:flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-slate-950 overflow-hidden border border-white/[0.06]">
              <div
                style={{ width: `${totalProgress}%` }}
                className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-400 transition-all duration-300"
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 font-bold whitespace-nowrap">
              {totalProgress}%
            </span>
          </div>

          {/* Chapter Quick Jumps */}
          <div className="flex items-center gap-1">
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  sfx.playClick();
                  setCurrentChapterIdx(idx);
                  setProgressSec(0);
                  setIsPlaying(true);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  currentChapterIdx === idx
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-500 hover:text-slate-300'
                }`}
              >
                0{ch.id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
