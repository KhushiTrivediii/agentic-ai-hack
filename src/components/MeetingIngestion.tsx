import React, { useState } from 'react';
import { Mic, Upload, Play, Sparkles, FileText, CheckCircle2, AlertTriangle, ArrowRight, Clock, Users, ArrowUpRight } from 'lucide-react';
import { Meeting, Speaker } from '../types';

interface MeetingIngestionProps {
  currentMeeting: Meeting;
  speakers: Speaker[];
  onAnalyzeMeeting: (transcript: string, title: string) => void;
  openVoiceModal: () => void;
  goToConflicts: () => void;
  goToStaging: () => void;
  isAnalyzing: boolean;
}

export const MeetingIngestion: React.FC<MeetingIngestionProps> = ({
  currentMeeting,
  speakers,
  onAnalyzeMeeting,
  openVoiceModal,
  goToConflicts,
  goToStaging,
  isAnalyzing,
}) => {
  const [customTranscript, setCustomTranscript] = useState(currentMeeting.rawTranscript);
  const [meetingTitle, setMeetingTitle] = useState(currentMeeting.title);
  const [selectedSprint, setSelectedSprint] = useState('Sprint 16');

  const handleRunAnalysis = () => {
    onAnalyzeMeeting(customTranscript, meetingTitle);
  };

  const getSpeaker = (id: string) => speakers.find((s) => s.id === id) || speakers[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Banner for Hackathon Judges */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-800/40 p-6 md:p-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Problem Statement 03: Meeting-to-Execution Agent
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              From Spoken Word to Verified Execution.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Standard summarizers regurgitate bullet points and miss broken commitments.
              SyncPulse ingests meetings, builds <strong className="text-indigo-300 font-semibold">cross-meeting memory</strong>, catches <strong className="text-rose-400 font-semibold">architectural contradictions</strong> against past sprints, and stages tasks for Linear & Jira with human confirmation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch md:items-center">
            <button
              onClick={openVoiceModal}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all cursor-pointer pulse-glow"
            >
              <Mic className="w-4 h-4 text-amber-300" />
              <span>Dictate with Wispr Flow</span>
            </button>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing Memory Graph...' : 'Run Cognitive Agent'}</span>
            </button>
          </div>
        </div>

        {/* Live Metrics bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Attributed Speakers</p>
              <p className="text-sm font-bold text-white">{currentMeeting.participants.length} Team Members</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Extracted Decisions</p>
              <p className="text-sm font-bold text-white">{currentMeeting.extractedDecisions.length} Active Decisions</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Cross-Sprint Conflicts</p>
              <p className="text-sm font-bold text-rose-400">
                {currentMeeting.detectedConflicts.length} Flagged Contradictions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Execution Items</p>
              <p className="text-sm font-bold text-amber-400">
                {currentMeeting.extractedActionItems.length} Pending Approval
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Transcript vs Extracted Diarization View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Transcript Ingestion Box (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold text-sm text-white">Meeting Ingestion Stream</h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {selectedSprint}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Meeting Subject / Session Title</label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-400">Raw Meeting Audio Transcript</label>
                  <span className="text-[10px] text-slate-500">Supports speaker tags & timestamps</span>
                </div>
                <textarea
                  value={customTranscript}
                  onChange={(e) => setCustomTranscript(e.target.value)}
                  rows={14}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Paste meeting transcript or use Wispr Flow voice dictation..."
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={openVoiceModal}
                  className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Insert Wispr Voice Note</span>
                </button>
                <button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAnalyzing ? 'Processing...' : 'Run Agent Analysis'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts to Review Flagged Contradictions */}
          {currentMeeting.detectedConflicts.length > 0 && (
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-300">
                    {currentMeeting.detectedConflicts.length} Contradictions Detected in Memory!
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Violates decisions previously locked in Sprint 14 baseline.
                  </p>
                </div>
              </div>
              <button
                onClick={goToConflicts}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Speaker Diarization & Conversational Flow (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-semibold text-sm text-white">Speaker Attribution & Diarization</h3>
                <p className="text-xs text-slate-400">
                  Natural conversation mapped with speaker role context and intent tracking.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {currentMeeting.participants.map((pid) => {
                  const spk = getSpeaker(pid);
                  return (
                    <img
                      key={pid}
                      src={spk.avatar}
                      alt={spk.name}
                      title={`${spk.name} (${spk.role})`}
                      className="w-7 h-7 rounded-full border border-slate-700 object-cover"
                    />
                  );
                })}
              </div>
            </div>

            {/* Conversation Flow Stream */}
            <div className="space-y-3.5 overflow-y-auto max-h-[520px] pr-2">
              {currentMeeting.utterances.map((ut, idx) => {
                const speaker = getSpeaker(ut.speakerId);
                const isConflictLine =
                  ut.text.toLowerCase().includes('mongodb') ||
                  ut.text.toLowerCase().includes('november 28') ||
                  ut.text.toLowerCase().includes('who is currently managing the soc2');

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isConflictLine
                        ? 'bg-rose-950/20 border-rose-500/40 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={speaker.avatar}
                          alt={speaker.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-white">{speaker.name}</span>
                        <span className="text-[10px] text-slate-500 px-1.5 py-0.2 rounded bg-slate-800">
                          {speaker.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isConflictLine && (
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Conflict Trigger
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-500">{ut.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-200">{ut.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Summary generated & verified by SyncPulse
              </span>
              <button
                onClick={goToStaging}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                <span>View Staged Execution Tasks ({currentMeeting.extractedActionItems.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
