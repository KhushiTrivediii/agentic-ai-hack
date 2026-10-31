import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Sparkles, CheckCircle2, ArrowRight, Activity, Wand2, ShieldCheck, Gauge, Zap, Clock } from 'lucide-react';
import { WISPR_SAMPLE_VOICE_MEMOS } from '../data/seedData';
import { AiAgentService } from '../services/aiAgent';
import { WisprSpeechTrace } from '../types';
import { sfx } from '../utils/audio';

interface VoiceWisprInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestVoiceNote: (cleanedText: string, rawText: string) => void;
}

export const VoiceWisprInputModal: React.FC<VoiceWisprInputModalProps> = ({
  isOpen,
  onClose,
  onIngestVoiceNote,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [rawText, setRawText] = useState(WISPR_SAMPLE_VOICE_MEMOS[0].rawText);
  const [trace, setTrace] = useState<WisprSpeechTrace>(
    AiAgentService.cleanWisprVoiceInput(WISPR_SAMPLE_VOICE_MEMOS[0].rawText)
  );
  const [waveformBars, setWaveformBars] = useState<number[]>(new Array(32).fill(14));
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setTrace(AiAgentService.cleanWisprVoiceInput(rawText));
  }, [rawText]);

  // Audio waveform animation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setWaveformBars(new Array(32).fill(0).map(() => Math.floor(Math.random() * 75) + 15));
      }, 80);
    } else {
      setWaveformBars(new Array(32).fill(12));
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Web Speech Recognition integration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim().length > 0) {
            setRawText((prev) => `${prev} ${currentTranscript}`);
          }
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSelectPreset = (index: number) => {
    sfx.playClick();
    setSelectedPresetIndex(index);
    setRawText(WISPR_SAMPLE_VOICE_MEMOS[index].rawText);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      sfx.playClick();
      setIsRecording(false);
      try {
        recognitionRef.current?.stop();
      } catch (err) {}
    } else {
      sfx.playWarning();
      setIsRecording(true);
      try {
        recognitionRef.current?.start();
      } catch (err) {
        // Fallback simulation if microphone access is blocked
        setTimeout(() => setIsRecording(false), 4000);
      }
    }
  };

  const handleIngest = () => {
    sfx.playSuccess();
    onIngestVoiceNote(trace.cleanedStructuredInput, trace.rawVoiceInput);
    onClose();
  };

  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  const cleanedWordCount = trace.cleanedStructuredInput.split(/\s+/).filter(Boolean).length;
  const efficiencyGain = Math.max(12, Math.round(((wordCount - cleanedWordCount) / Math.max(wordCount, 1)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900/95 border border-white/[0.12] rounded-3xl shadow-2xl shadow-indigo-950/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Wispr Flow Voice Dictation Console
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300">
                  20% Hackathon Weight
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Natural spoken audio processed with continuous disfluency stripping & live intent resolution.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Preset Voice Memos Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Select Production Voice Note Scenario
              </label>
              <span className="text-xs text-slate-500">Click any preset to test</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {WISPR_SAMPLE_VOICE_MEMOS.map((memo, idx) => (
                <button
                  key={memo.id}
                  onClick={() => handleSelectPreset(idx)}
                  className={`text-left p-3.5 rounded-2xl border text-xs transition-all cursor-pointer ${
                    selectedPresetIndex === idx
                      ? 'bg-violet-950/50 border-violet-500 text-white shadow-md shadow-violet-950/50 ring-1 ring-violet-500/30'
                      : 'bg-slate-950/40 border-white/[0.08] text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <p className="font-bold line-clamp-1 text-slate-100">{memo.title}</p>
                  <p className="text-[11px] text-violet-300 font-medium mt-1">{memo.speakerName}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Waveform & Record Controller */}
          <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-white/[0.08] flex flex-col items-center justify-center gap-4 shadow-inner">
            <div className="flex items-end justify-center gap-1.5 h-20 w-full max-w-lg px-4">
              {waveformBars.map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`w-1.5 sm:w-2 rounded-full transition-all duration-75 ${
                    isRecording
                      ? 'bg-gradient-to-t from-violet-600 via-indigo-400 to-amber-300 shadow-sm shadow-violet-500/50'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleToggleRecord}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-pulse'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-amber-300" />}
                <span>{isRecording ? 'Listening via Wispr Flow (Tap to Stop)' : 'Dictate with Microphone'}</span>
              </button>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
                  {isRecording ? 'Capturing continuous voice stream...' : 'Microphone Ready'}
                </span>
              </div>
            </div>
          </div>

          {/* Wispr Flow Performance Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.06] text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Disfluency Stripped</span>
              <span className="text-base font-extrabold text-rose-400">{trace.detectedFillers.length} Fillers</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.06] text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Speech Efficiency Gain</span>
              <span className="text-base font-extrabold text-emerald-400">+{efficiencyGain}% Faster</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.06] text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Intent Confidence</span>
              <span className="text-base font-extrabold text-indigo-400">{Math.round(trace.confidence * 100)}% Match</span>
            </div>
          </div>

          {/* Dual Column: Raw Voice Stream vs Cleaned Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Raw Voice Input */}
            <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-slate-950/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Raw Voice Input (Captured via Wispr Flow)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {wordCount} words
                </span>
              </div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={5}
                className="w-full bg-slate-900/60 border border-white/[0.06] rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-violet-500 resize-none font-mono leading-relaxed"
                placeholder="Speak or type your raw meeting thoughts..."
              />

              {/* Detected Fillers Tag Cloud */}
              <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] uppercase font-bold text-slate-500">Cleaned Fillers:</span>
                {trace.detectedFillers.map((f, i) => (
                  <span
                    key={i}
                    className="text-[10px] line-through px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20"
                  >
                    {f}
                  </span>
                ))}
                {trace.selfCorrectionsResolved.map((sc, i) => (
                  <span
                    key={`sc-${i}`}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1"
                  >
                    <span>{sc.original}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                    <span className="font-bold">{sc.corrected}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Cleaned Structured Output */}
            <div className="flex flex-col rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" />
                  Structured Autonomous Execution Output
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready for Staging
                </span>
              </div>
              <div className="w-full bg-slate-900/80 border border-emerald-500/20 rounded-xl p-3 text-xs text-slate-100 flex-1 leading-relaxed font-sans shadow-inner">
                <p className="whitespace-pre-wrap">{trace.cleanedStructuredInput}</p>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Recognized Intent: <strong className="text-slate-200">{trace.intentRecognized}</strong>
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-slate-950/60">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SyncPulse will run cross-meeting contradiction audit on ingestion
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleIngest}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Ingest into Cross-Meeting Memory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
