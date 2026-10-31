import React, { useState } from 'react';
import { Layers, GitCommit, AlertTriangle, CheckCircle2, Filter, Info, ShieldAlert, Sparkles, ChevronRight, User } from 'lucide-react';
import { Meeting, Decision, Conflict, Speaker } from '../types';

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

  // Flatten all decisions with meeting metadata
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Cross-Meeting Long-Term Memory Graph</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
              Core Hackathon Differentiator
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Decisions don't live in isolated 45-minute silos. SyncPulse maintains persistent semantic memory across all past meetings, enabling automated conflict detection whenever a new proposal contradicts earlier commitments.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Timeline & Knowledge Node Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {meetings.map((meeting, mIdx) => {
          const meetingDecisions = filteredDecisions.filter((d) => d.meetingId === meeting.id);
          const hasConflicts = meeting.detectedConflicts.length > 0;

          return (
            <div
              key={meeting.id}
              className={`rounded-2xl border flex flex-col transition-all ${
                hasConflicts
                  ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/20'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {/* Meeting Header Node */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/40 rounded-t-2xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                    {meeting.sprint}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{meeting.date}</span>
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1">{meeting.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{meeting.summary}</p>
              </div>

              {/* Decision Cards inside this meeting */}
              <div className="p-3.5 space-y-2.5 flex-1">
                {meetingDecisions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-600">
                    No decisions in this category
                  </div>
                ) : (
                  meetingDecisions.map((decision) => {
                    const isDisputed = decision.status === 'disputed';
                    const owner = getSpeaker(decision.ownerId);

                    return (
                      <div
                        key={decision.id}
                        onClick={() => setSelectedDecision(decision)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isDisputed
                            ? 'bg-rose-950/20 border-rose-500/50 hover:border-rose-400 text-slate-200'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              isDisputed
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            }`}
                          >
                            {isDisputed ? '⚠️ Contradicted' : '✓ Active Baseline'}
                          </span>
                          <span className="text-[10px] text-slate-500 capitalize">{decision.category}</span>
                        </div>

                        <h4 className="font-semibold text-white mb-1 line-clamp-1">{decision.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {decision.description}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <img
                              src={owner.avatar}
                              alt={owner.name}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span>{owner.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">
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
                <div className="p-3 bg-rose-950/40 border-t border-rose-500/30 rounded-b-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-300 text-xs">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>Cross-Sprint Contradictions Found!</span>
                  </div>
                  <button
                    onClick={() => onSelectConflict(meeting.detectedConflicts[0])}
                    className="text-[11px] text-rose-400 hover:text-white font-semibold flex items-center gap-1"
                  >
                    <span>View Diff</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Decision Detail Drawer / Inspection Modal */}
      {selectedDecision && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">Decision Memory Record: {selectedDecision.id}</h3>
            </div>
            <button
              onClick={() => setSelectedDecision(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 mb-0.5">Title</p>
              <p className="font-semibold text-white">{selectedDecision.title}</p>
              <p className="text-slate-400 mt-2 mb-0.5">Full Description</p>
              <p className="text-slate-300 leading-relaxed">{selectedDecision.description}</p>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-slate-400">Category & Status</p>
                <p className="text-slate-200 capitalize">
                  {selectedDecision.category} • Status: <strong className="text-indigo-400">{selectedDecision.status}</strong>
                </p>
              </div>
              <div>
                <p className="text-slate-400">Origin Meeting</p>
                <p className="text-slate-200">{selectedDecision.meetingTitle || 'Sprint 14 Baseline'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
