import React, { useState } from 'react';
import { Workflow, CheckCircle2, AlertTriangle, Copy, Check, Volume2, VolumeX, Calendar, FileText } from 'lucide-react';
import { Speaker, WeeklyDigest, Meeting, ActionItem } from '../types';
import { AiAgentService } from '../services/aiAgent';
import { sfx } from '../utils/audio';

interface WeeklyDigestViewProps {
  speakers: Speaker[];
  meetings: Meeting[];
  actionItems: ActionItem[];
}

export const WeeklyDigestView: React.FC<WeeklyDigestViewProps> = ({
  speakers,
  meetings,
  actionItems,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(speakers[0].id);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const selectedMember = speakers.find((s) => s.id === selectedMemberId) || speakers[0];

  const digest: WeeklyDigest = AiAgentService.generateWeeklyDigest(
    selectedMember,
    meetings,
    actionItems
  );

  const handleCopySlackFormat = () => {
    sfx.playSuccess();
    const slackText = `*Weekly Executive Digest for ${digest.memberName} (${digest.memberRole})*\n` +
      `📅 *${digest.weekLabel}*\n\n` +
      `*Summary:* ${digest.executiveSummary}\n\n` +
      `*Committed Action Items (${digest.committedTasks.length}):*\n` +
      digest.committedTasks.map((t) => `• [${t.priority}] ${t.title} (Due: ${t.deadline})`).join('\n') +
      `\n\n*Key Domain Decisions (${digest.relevantDecisions.length}):*\n` +
      digest.relevantDecisions.map((d) => `• ${d.title}`).join('\n') +
      `\n\n*Cross-Meeting Conflict Risks (${digest.potentialRisks.length}):*\n` +
      digest.potentialRisks.map((r) => `⚠️ ${r}`).join('\n');

    navigator.clipboard.writeText(slackText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayVoice = () => {
    sfx.playClick();
    if (typeof window === 'undefined') return;

    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utteranceText = `Weekly executive briefing for ${digest.memberName}. ${digest.executiveSummary}. You have ${digest.committedTasks.length} commitments tracked this week.`;
        const utterance = new SpeechSynthesisUtterance(utteranceText);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;

        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);

        setIsPlayingAudio(true);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingAudio(true);
        setTimeout(() => setIsPlayingAudio(false), 3000);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-slate-900 border border-white/[0.08] shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Workflow className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Personalized Weekly Execution Digests</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
              Per-Person Synthesis
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            "A weekly digest per person." Rather than dumping a 30-page company summary on everyone, SyncPulse tailors each digest specifically to what each individual committed to and what cross-meeting decisions directly affect their domain.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePlayVoice}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/[0.08]'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
            <span>{isPlayingAudio ? 'Stop Speech' : 'Wispr Audio Readout'}</span>
          </button>
          <button
            onClick={handleCopySlackFormat}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Slack Markdown!' : 'Copy Slack Digest'}</span>
          </button>
        </div>
      </div>

      {/* Member Avatar Selector */}
      <div className="flex items-center gap-3 overflow-x-auto p-2.5 bg-slate-900/70 border border-white/[0.08] rounded-3xl shadow-inner">
        {speakers.map((spk) => {
          const isSelected = spk.id === selectedMemberId;
          const memberTaskCount = actionItems.filter((a) => a.assigneeId === spk.id).length;

          return (
            <button
              key={spk.id}
              onClick={() => {
                sfx.playClick();
                setSelectedMemberId(spk.id);
              }}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/50'
                  : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/[0.04]'
              }`}
            >
              <img
                src={spk.avatar}
                alt={spk.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-700"
              />
              <div className="text-left">
                <p className="text-xs font-bold leading-none">{spk.name}</p>
                <p className="text-[10px] opacity-75 mt-0.5">{spk.role.split(' ')[0]}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-indigo-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {memberTaskCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Digest Card */}
      <div className="bg-slate-900 border border-white/[0.08] rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-md">
        {/* Header Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            <img
              src={selectedMember.avatar}
              alt={selectedMember.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedMember.name}</h3>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/[0.04]">
                  {selectedMember.team}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedMember.role} • {selectedMember.email}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 justify-end">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{digest.weekLabel}</span>
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/[0.06]">
          <h4 className="text-xs font-bold text-indigo-300 mb-1">Weekly Executive Focus</h4>
          <p className="text-xs text-slate-200 leading-relaxed">{digest.executiveSummary}</p>
        </div>

        {/* Grid: Committed Action Items & Cross-Meeting Decisions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Committed Tasks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Your Committed Tasks ({digest.committedTasks.length})</span>
            </h4>

            <div className="space-y-2.5">
              {digest.committedTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-white/[0.06]">
                  No direct tasks assigned to you this week.
                </div>
              ) : (
                digest.committedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06] space-y-1.5 text-xs hover:border-indigo-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {task.priority} • Due {task.deadline}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">{task.targetTracker}</span>
                    </div>
                    <p className="font-bold text-white">{task.title}</p>
                    <p className="text-[11px] text-slate-400">{task.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Relevant Decisions & Cross-Meeting Risks */}
          <div className="space-y-5">
            {/* Domain Decisions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Decisions Impacting Your Area ({digest.relevantDecisions.length})</span>
              </h4>

              <div className="space-y-2.5">
                {digest.relevantDecisions.map((dec) => (
                  <div
                    key={dec.id}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06] space-y-1 text-xs"
                  >
                    <p className="font-bold text-white">{dec.title}</p>
                    <p className="text-[11px] text-slate-400">{dec.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockers & Conflicts */}
            {digest.potentialRisks.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Cross-Sprint Conflicts To Be Aware Of</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {digest.potentialRisks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
