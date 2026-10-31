import React, { useState } from 'react';
import { Workflow, User, CheckCircle2, AlertTriangle, Copy, Check, Volume2, Calendar, FileText, Send } from 'lucide-react';
import { Speaker, WeeklyDigest, Meeting, ActionItem } from '../types';
import { AiAgentService } from '../services/aiAgent';

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
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Workflow className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Personalized Weekly Execution Digests</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
              Per-Person Synthesis
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            "A weekly digest per person." Rather than dumping a 30-page company summary on everyone, SyncPulse tailors each digest specifically to what each individual committed to and what cross-meeting decisions directly affect their domain.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePlayVoice}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
            <span>{isPlayingAudio ? 'Reading Summary...' : 'Wispr Audio Readout'}</span>
          </button>
          <button
            onClick={handleCopySlackFormat}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Slack Markdown!' : 'Copy Slack Digest'}</span>
          </button>
        </div>
      </div>

      {/* Member Avatar Selector */}
      <div className="flex items-center gap-3 overflow-x-auto p-2 bg-slate-900/60 border border-slate-800 rounded-2xl">
        {speakers.map((spk) => {
          const isSelected = spk.id === selectedMemberId;
          const memberTaskCount = actionItems.filter((a) => a.assigneeId === spk.id).length;

          return (
            <button
              key={spk.id}
              onClick={() => setSelectedMemberId(spk.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-850'
              }`}
            >
              <img
                src={spk.avatar}
                alt={spk.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-xs font-bold leading-none">{spk.name}</p>
                <p className="text-[10px] opacity-80 mt-0.5">{spk.role.split(' ')[0]}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Header Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <img
              src={selectedMember.avatar}
              alt={selectedMember.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{selectedMember.name}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {selectedMember.team}
                </span>
              </div>
              <p className="text-xs text-slate-400">{selectedMember.role} • {selectedMember.email}</p>
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
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <h4 className="text-xs font-semibold text-indigo-300 mb-1">Weekly Executive Focus</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{digest.executiveSummary}</p>
        </div>

        {/* Grid: Committed Action Items & Cross-Meeting Decisions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Committed Tasks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Your Committed Tasks ({digest.committedTasks.length})</span>
              </h4>
            </div>

            <div className="space-y-2">
              {digest.committedTasks.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                  No direct tasks assigned to you this week.
                </div>
              ) : (
                digest.committedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                        {task.priority} • Due {task.deadline}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">{task.targetTracker}</span>
                    </div>
                    <p className="font-semibold text-white">{task.title}</p>
                    <p className="text-[11px] text-slate-400">{task.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Relevant Decisions & Cross-Meeting Risks */}
          <div className="space-y-5">
            {/* Domain Decisions */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Decisions Impacting Your Area ({digest.relevantDecisions.length})</span>
              </h4>

              <div className="space-y-2">
                {digest.relevantDecisions.map((dec) => (
                  <div
                    key={dec.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs"
                  >
                    <p className="font-semibold text-white">{dec.title}</p>
                    <p className="text-[11px] text-slate-400">{dec.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockers & Conflicts */}
            {digest.potentialRisks.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Cross-Sprint Conflicts To Be Aware Of</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {digest.potentialRisks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400">•</span>
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
