import React, { useState } from 'react';
import { Layers, GitCommit, ShieldAlert, ChevronRight, X, Sparkles, History, ArrowRight, Network, CheckCircle2, AlertTriangle } from 'lucide-react';
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
  const [viewStyle, setViewStyle] = useState<'canvas' | 'columns'>('canvas');

  const getSpeaker = (id: string) => speakers.find((s) => s.id === id) || speakers[0];

  const categories = [
    { id: 'all', label: 'All Decisions' },
    { id: 'architecture', label: 'Architecture & Stack' },
    { id: 'timeline', label: 'Timeline & SLAs' },
    { id: 'security', label: 'Security & Compliance' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-white/[0.08] shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Network className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Interactive Cross-Sprint Memory Canvas
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold">
              Visual Semantic Topology
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Decisions don't live in isolated 45-minute silos. SyncPulse maintains persistent semantic memory across past meetings, connecting Sprint 14, 15, and 16 to detect broken commitments and architectural drift.
          </p>
        </div>

        {/* View Style Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => {
                sfx.playClick();
                setViewStyle('canvas');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewStyle === 'canvas' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Node Map
            </button>
            <button
              onClick={() => {
                sfx.playClick();
                setViewStyle('columns');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewStyle === 'columns' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sprint Columns
            </button>
          </div>
        </div>
      </div>

      {/* Visual Mode 1: Interactive SVG Node Graph */}
      {viewStyle === 'canvas' ? (
        <div className="relative rounded-3xl bg-slate-950 border border-white/[0.1] p-6 shadow-2xl overflow-hidden min-h-[520px]">
          {/* Background Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* SVG Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>

              <linearGradient id="lineageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>

            {/* Lineage curve: Sprint 14 to Sprint 15 */}
            <path
              d="M 280 140 C 420 140, 420 180, 560 180"
              fill="none"
              stroke="url(#lineageGrad)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              className="opacity-60"
            />

            {/* Lineage curve: Sprint 15 to Sprint 16 */}
            <path
              d="M 680 180 C 800 180, 800 360, 920 360"
              fill="none"
              stroke="url(#lineageGrad)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              className="opacity-60"
            />

            {/* Pulsing Red Laser Line: Sprint 16 MongoDB -> Sprint 14 Postgres RDS Conflict */}
            <path
              d="M 920 140 C 600 80, 500 80, 280 140"
              fill="none"
              stroke="url(#laserGrad)"
              strokeWidth="3.5"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          {/* Milestone Columns Legend */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Column 1: Sprint 14 Baseline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20"></span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Sprint 14 Baseline</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Oct 10, 2026</span>
              </div>

              {/* Node 1: Postgres locked */}
              <div
                onClick={() => {
                  sfx.playClick();
                  setSelectedDecision(meetings[0].extractedDecisions[0]);
                }}
                className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer shadow-lg shadow-emerald-950/20 hover:scale-[1.02] relative group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Locked Baseline
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">dec_14_01</span>
                </div>
                <h4 className="font-bold text-xs text-white">Database locked to AWS RDS PostgreSQL</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  Strict ACID transaction safety locked as non-negotiable architectural foundation.
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
                  <span>Vikram Rao (Architect)</span>
                  <span className="text-emerald-400 font-mono font-bold">98% Conf</span>
                </div>
              </div>

              {/* Node 2: Launch SLA */}
              <div
                onClick={() => {
                  sfx.playClick();
                  setSelectedDecision(meetings[0].extractedDecisions[1]);
                }}
                className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ SLA Locked
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">dec_14_02</span>
                </div>
                <h4 className="font-bold text-xs text-white">Public Launch Date: Nov 15, 2026</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  Contractual enterprise pilot SLA date committed to leadership.
                </p>
              </div>
            </div>

            {/* Column 2: Sprint 15 Mid-Cycle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 ring-4 ring-indigo-500/20"></span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Sprint 15 Evolution</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Oct 22, 2026</span>
              </div>

              {/* Node 3: Redis Cache */}
              <div
                onClick={() => {
                  sfx.playClick();
                  setSelectedDecision(meetings[1].extractedDecisions[0]);
                }}
                className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    ✓ Cache Tier
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">dec_15_01</span>
                </div>
                <h4 className="font-bold text-xs text-white">Redis ElastiCache for Sub-50ms Reads</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  Adopted Redis layer in front of Postgres to avoid changing database schemas.
                </p>
              </div>
            </div>

            {/* Column 3: Sprint 16 Conflict Zone */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-500/30 animate-ping"></span>
                  <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider">Sprint 16 Active Conflicts</span>
                </div>
                <span className="text-[10px] font-mono text-rose-400">Oct 31, 2026</span>
              </div>

              {/* Node 4: Disputed MongoDB Migration */}
              <div
                onClick={() => {
                  sfx.playWarning();
                  setSelectedDecision(meetings[2].extractedDecisions[0]);
                }}
                className="p-4 rounded-2xl bg-rose-950/40 border-2 border-rose-500 hover:border-rose-400 transition-all cursor-pointer shadow-xl shadow-rose-950/50 hover:scale-[1.02] ring-2 ring-rose-500/30 relative"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                    ⚠️ CONTRADICTION DETECTED
                  </span>
                  <span className="text-[10px] text-rose-300 font-mono">dec_16_01</span>
                </div>
                <h4 className="font-bold text-xs text-white">Migrate Store to MongoDB Atlas on GCP</h4>
                <p className="text-[11px] text-rose-200 mt-1 line-clamp-2">
                  Contradicts Sprint 14 baseline locked to PostgreSQL on AWS RDS!
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sfx.playClick();
                    onSelectConflict(meetings[2].detectedConflicts[0]);
                  }}
                  className="mt-3 w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Audit Contradiction</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Node 5: Disputed Date Slip */}
              <div
                onClick={() => {
                  sfx.playWarning();
                  setSelectedDecision(meetings[2].extractedDecisions[1]);
                }}
                className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 hover:border-rose-400 transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    ⚠️ SLA DRIFT
                  </span>
                  <span className="text-[10px] text-rose-300 font-mono">dec_16_02</span>
                </div>
                <h4 className="font-bold text-xs text-white">Delay Launch SLA to Nov 28 (13-day slip)</h4>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                  Breaches Nov 15 contractual pilot delivery commitment!
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Standard Columns View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="p-5 rounded-3xl bg-slate-900 border border-white/[0.08] space-y-3">
              <h3 className="font-bold text-sm text-white">{meeting.title}</h3>
              <p className="text-xs text-slate-400">{meeting.summary}</p>
              <div className="space-y-2 pt-2">
                {meeting.extractedDecisions.map((d) => (
                  <div key={d.id} className="p-3 rounded-xl bg-slate-950 border border-white/[0.06] text-xs">
                    <p className="font-bold text-white">{d.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{d.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decision Inspection Drawer */}
      {selectedDecision && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/50 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <GitCommit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Decision Memory Record: {selectedDecision.id}</h3>
                <p className="text-xs text-slate-400">Graph Hash ID • Verified Node</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="space-y-2">
              <p className="text-slate-400 font-medium">Title</p>
              <p className="font-bold text-white text-sm">{selectedDecision.title}</p>
              <p className="text-slate-400 font-medium mt-2">Description</p>
              <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-white/[0.06]">
                {selectedDecision.description}
              </p>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-white/[0.06]">
                <p className="text-slate-400 font-medium">Status & Confidence</p>
                <p className="font-bold text-indigo-400 uppercase mt-0.5">
                  {selectedDecision.status} • {Math.round(selectedDecision.confidenceScore * 100)}% Match
                </p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-white/[0.06]">
                <p className="text-slate-400 font-medium">Session Origin</p>
                <p className="font-bold text-slate-200 mt-0.5">{selectedDecision.meetingTitle || 'Sprint 14 Baseline'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
