import React, { useState } from 'react';
import { Layers, GitCommit, ShieldAlert, ChevronRight, X, Sparkles, History, ArrowRight } from 'lucide-react';
import { Meeting, Decision, Conflict, Speaker } from '../types';
import { sfx } from '../utils/audio';

interface CrossMeetingMemoryGraphProps {
  meetings: Meeting[];
  speakers: Speaker[];
  onSelectConflict: (conflict: Conflict) => void;
}

export const CrossMeetingMemoryGraph: React.FC<CrossMeetingMemoryGraphProps> = ({
  meetings,
  speakers,
  onSelectConflict,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  const getSpeaker = (id: string) => speakers.find((s) => s.id === id) || speakers[0];

  const categories = [
    { id: 'all', label: 'All Decisions' },
    { id: 'architecture', label: 'Architecture & Stack' },
    { id: 'timeline', label: 'Timeline & SLAs' },
    { id: 'security', label: 'Security & Compliance' },
    { id: 'pricing', label: 'Pricing & Billing' },
  ];

  const allDecisions: Array<Decision & { meetingTitle: string; meetingSprint: string; meetingDate: string }> = [];
  meetings.forEach((m) => {
    m.extractedDecisions.forEach((d) => {
      allDecisions.push({
        ...d,
        meetingTitle: m.title,
        meetingSprint: m.sprint,
        meetingDate: m.date,
      });
    });
  });

  const filteredDecisions = selectedCategory === 'all'
    ? allDecisions
    : allDecisions.filter((d) => d.category === selectedCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header explanation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-white/[0.08] shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Cross-Meeting Long-Term Memory Graph</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold">
              Core Hackathon Differentiator
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Decisions don't live in isolated 45-minute silos. SyncPulse maintains persistent semantic memory across past meetings, connecting Sprint 14, 15, and 16 to detect broken commitments and architectural drift.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sfx.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950/60 border border-white/[0.06] text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Timeline & Knowledge Node Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {meetings.map((meeting) => {
          const meetingDecisions = filteredDecisions.filter((d) => d.meetingId === meeting.id);
          const hasConflicts = meeting.detectedConflicts.length > 0;

          return (
            <div
              key={meeting.id}
              className={`rounded-3xl border flex flex-col transition-all backdrop-blur-md overflow-hidden ${
                hasConflicts
                  ? 'bg-slate-900/90 border-rose-500/40 shadow-xl shadow-rose-950/30 ring-1 ring-rose-500/20'
                  : 'bg-slate-900/70 border-white/[0.08] shadow-lg'
              }`}
            >
              {/* Meeting Header Node */}
              <div className="p-5 border-b border-white/[0.08] bg-slate-950/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-white/[0.04]">
                    {meeting.sprint}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{meeting.date}</span>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-1">{meeting.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{meeting.summary}</p>
              </div>

              {/* Decision Cards inside this meeting */}
              <div className="p-4 space-y-3 flex-1">
                {meetingDecisions.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-600">
                    No decisions recorded in this category
                  </div>
                ) : (
                  meetingDecisions.map((decision) => {
                    const isDisputed = decision.status === 'disputed';
                    const owner = getSpeaker(decision.ownerId);

                    return (
                      <div
                        key={decision.id}
                        onClick={() => {
                          sfx.playClick();
                          setSelectedDecision(decision);
                        }}
                        className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                          isDisputed
                            ? 'bg-rose-950/30 border-rose-500/50 hover:border-rose-400 text-slate-200 shadow-md shadow-rose-950/20'
                            : 'bg-slate-950/60 border-white/[0.06] hover:border-indigo-500/40 text-slate-300 hover:bg-slate-950/90'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              isDisputed
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            }`}
                          >
                            {isDisputed ? '⚠️ Contradicted' : '✓ Active Baseline'}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize font-medium">{decision.category}</span>
                        </div>

                        <h4 className="font-bold text-white mb-1 line-clamp-1">{decision.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {decision.description}
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <img
                              src={owner.avatar}
                              alt={owner.name}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="font-medium text-slate-300">{owner.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                            {Math.round(decision.confidenceScore * 100)}% Conf
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Edge Connection Alert to Past Sprint */}
              {hasConflicts && (
                <div className="p-3.5 bg-rose-950/50 border-t border-rose-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                    <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span>Contradicts Sprint 14 Baseline!</span>
                  </div>
                  <button
                    onClick={() => {
                      sfx.playClick();
                      onSelectConflict(meeting.detectedConflicts[0]);
                    }}
                    className="text-[11px] text-rose-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Diff</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Decision Detail Drawer */}
      {selectedDecision && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <GitCommit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Decision Memory Record: {selectedDecision.id}</h3>
                <p className="text-xs text-slate-400">Persistent Graph Hash • Verified State</p>
              </div>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                setSelectedDecision(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-2">
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-[11px] font-medium mb-1">Decision Title</p>
                <p className="font-bold text-white text-sm">{selectedDecision.title}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px] font-medium mb-1">Detailed Architectural Rationale</p>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-white/[0.06]">
                  {selectedDecision.description}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-white/[0.06]">
                  <p className="text-slate-400 text-[11px]">Domain Category</p>
                  <p className="font-bold text-white capitalize mt-0.5">{selectedDecision.category}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-white/[0.06]">
                  <p className="text-slate-400 text-[11px]">Current Status</p>
                  <p className="font-bold text-indigo-400 uppercase mt-0.5">{selectedDecision.status}</p>
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-white/[0.06]">
                <p className="text-slate-400 text-[11px]">Session Origin</p>
                <p className="font-bold text-slate-200 mt-0.5">{selectedDecision.meetingTitle || 'Sprint 14 Baseline'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
