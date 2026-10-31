import React, { useState, useEffect } from 'react';
import { X, Mic, Volume2, Sparkles, CheckCircle2, ArrowRight, Activity, Wand2, ShieldCheck, Play } from 'lucide-react';
import { WISPR_SAMPLE_VOICE_MEMOS } from '../data/seedData';
import { AiAgentService } from '../services/aiAgent';
import { WisprSpeechTrace } from '../types';

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
  const [waveformBars, setWaveformBars] = useState<number[]>(new Array(24).fill(15));

  // Update trace when text changes
  useEffect(() => {
    setTrace(AiAgentService.cleanWisprVoiceInput(rawText));
  }, [rawText]);

  // Audio waveform animation when "recording"
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setWaveformBars(new Array(24).fill(0).map(() => Math.floor(Math.random() * 65) + 15));
      }, 100);
    } else {
      setWaveformBars(new Array(24).fill(12));
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isOpen) return null;

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setRawText(WISPR_SAMPLE_VOICE_MEMOS[index].rawText);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // Simulate live speech accumulation
      setTimeout(() => {
        setIsRecording(false);
      }, 3500);
    }
  };

  const handleIngest = () => {
    onIngestVoiceNote(trace.cleanedStructuredInput, trace.rawVoiceInput);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-white">Wispr Flow Voice Dictation Console</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300">
                  20% Score Criteria
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dictate post-meeting debriefs, action items, and decisions. Natural speech is automatically parsed into clean structured intelligence.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Preset Voice Memos Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Select High-Context Voice Memo Demo
              </label>
              <span className="text-xs text-slate-500">Or type / dictate below</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {WISPR_SAMPLE_VOICE_MEMOS.map((memo, idx) => (
                <button
                  key={memo.id}
                  onClick={() => handleSelectPreset(idx)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                    selectedPresetIndex === idx
                      ? 'bg-violet-950/40 border-violet-500/50 text-white shadow-sm shadow-violet-500/20'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <p className="font-semibold line-clamp-1 text-slate-200">{memo.title}</p>
                  <p className="text-[11px] text-violet-300 mt-1">{memo.speakerName}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Waveform & Record Controller */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center gap-3">
            <div className="flex items-end justify-center gap-1 h-16 w-full max-w-md px-4">
              {waveformBars.map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`w-2 rounded-full transition-all duration-100 ${
                    isRecording
                      ? 'bg-gradient-to-t from-violet-600 via-indigo-500 to-amber-300'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleRecord}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-xs transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse'
                    : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isRecording ? 'Listening (Wispr Flow Active)...' : 'Start Voice Dictation'}</span>
              </button>
              <span className="text-xs text-slate-400">
                {isRecording ? 'Capturing continuous voice stream...' : 'Microphone connected and ready'}
              </span>
            </div>
          </div>

          {/* Dual Column: Raw Voice Stream vs Cleaned Structured Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Raw Voice Input with Highlighted Fillers */}
            <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Raw Voice Input (Captured via Wispr Flow)
                </span>
                <span className="text-[11px] text-slate-500">
                  {trace.detectedFillers.length} filler words detected
                </span>
              </div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={6}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-violet-500 resize-none font-mono leading-relaxed"
                placeholder="Speak or type your raw meeting thoughts..."
              />

              {/* Detected Fillers Pill Cloud */}
              <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] uppercase font-bold text-slate-500">Disfluencies removed:</span>
                {trace.detectedFillers.map((f, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20"
                  >
                    "{f}"
                  </span>
                ))}
                {trace.selfCorrectionsResolved.map((sc, i) => (
                  <span
                    key={`sc-${i}`}
                    className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1"
                  >
                    <span>{sc.original}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                    <span>{sc.corrected}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Cleaned Structured Output */}
            <div className="flex flex-col rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" />
                  Structured Autonomous Execution Output
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {Math.round(trace.confidence * 100)}% Confidence
                </span>
              </div>
              <div className="w-full bg-slate-900/80 border border-emerald-500/20 rounded-lg p-3 text-xs text-slate-100 flex-1 leading-relaxed">
                <p className="font-sans whitespace-pre-wrap">{trace.cleanedStructuredInput}</p>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Intent: <strong className="text-slate-200">{trace.intentRecognized}</strong>
                </span>
                <span className="text-[11px] text-slate-500">Ready for Cross-Meeting Audit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Cross-Meeting Memory Graph will evaluate against Sprint 14 & 15 decisions
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleIngest}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
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
