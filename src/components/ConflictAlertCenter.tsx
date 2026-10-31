import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, CheckCircle2, History, Scale, Sparkles, RotateCcw, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { Conflict } from '../types';
import { sfx } from '../utils/audio';

interface ConflictAlertCenterProps {
  conflicts: Conflict[];
  onResolveConflict: (conflictId: string, resolutionState: Conflict['resolutionState'], notes: string) => void;
  goToStaging: () => void;
}

export const ConflictAlertCenter: React.FC<ConflictAlertCenterProps> = ({
  conflicts,
  onResolveConflict,
  goToStaging,
}) => {
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(
    conflicts.length > 0 ? conflicts[0].id : null
  );

  const activeConflict = conflicts.find((c) => c.id === selectedConflictId) || conflicts[0];

  const handleResolve = (resolution: Conflict['resolutionState'], note: string) => {
    if (!activeConflict) return;
    sfx.playSuccess();
    onResolveConflict(activeConflict.id, resolution, note);
  };

  const unresolvedCount = conflicts.filter((c) => c.resolutionState === 'unresolved').length;
  const healthScore = Math.max(50, Math.round(((conflicts.length - unresolvedCount) / Math.max(conflicts.length, 1)) * 100));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-gradient-to-r from-rose-950/50 via-slate-900 to-slate-900 border border-rose-500/30 shadow-2xl shadow-rose-950/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Cross-Meeting Conflict & Contradiction Center</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              {unresolvedCount} Active Inconsistencies
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            SyncPulse acts as an executive guardian: when current discussions drift off earlier agreements, it halts unvetted ticket generation until humans decide whether to override, revert, or synthesize a compromise.
          </p>
        </div>

        {/* System Alignment Health Metric */}
        <div className="flex items-center gap-4 self-start md:self-auto bg-slate-950/60 p-3.5 rounded-2xl border border-white/[0.08]">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Memory Alignment Score</p>
            <p className={`text-xl font-extrabold ${healthScore > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {healthScore}% In Sync
            </p>
          </div>

          <button
            onClick={() => {
              sfx.playClick();
              goToStaging();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/[0.08] transition-all cursor-pointer hover:scale-105"
          >
            <span>Proceed to Staging</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {conflicts.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900 border border-white/[0.08] space-y-3">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Zero Memory Conflicts Detected</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All current meeting proposals, timelines, and architectural choices align perfectly with the historical decision graph.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Conflict List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Detected Inconsistencies ({conflicts.length})
            </h3>
            <div className="space-y-3">
              {conflicts.map((conflict) => {
                const isSelected = activeConflict && activeConflict.id === conflict.id;
                const isResolved = conflict.resolutionState !== 'unresolved';

                return (
                  <div
                    key={conflict.id}
                    onClick={() => {
                      sfx.playClick();
                      setSelectedConflictId(conflict.id);
                    }}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500 text-white shadow-xl shadow-rose-950/40 ring-1 ring-rose-500/40'
                        : isResolved
                        ? 'bg-slate-900/60 border-white/[0.06] text-slate-400 opacity-80 hover:opacity-100'
                        : 'bg-slate-900 border-white/[0.08] hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                          conflict.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {conflict.severity} • {conflict.type.replace('_', ' ')}
                      </span>
                      {isResolved && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Resolved
                        </span>
                      )}
                    </div>

                    <p className="font-bold text-white line-clamp-2 mt-1 leading-snug">{conflict.currentStatement}</p>
                    <p className="text-[11px] text-slate-400 mt-2.5 flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="line-clamp-1">Conflicts with: {conflict.conflictingMeetingTitle}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conflict Inspection & Human-in-the-Loop Resolution Cockpit (8 cols) */}
          {activeConflict && (
            <div className="lg:col-span-8 bg-slate-900 border border-white/[0.08] rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-md">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        activeConflict.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {activeConflict.severity.toUpperCase()} CONTRADICTION
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {activeConflict.id}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white">{activeConflict.currentStatement}</h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Status</span>
                  <span
                    className={`text-xs font-bold uppercase ${
                      activeConflict.resolutionState === 'unresolved' ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {activeConflict.resolutionState.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Side-by-side Historical vs Current comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Historical Baseline */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/[0.06] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                    <span className="flex items-center gap-1.5">
                      <History className="w-4 h-4 text-indigo-400" />
                      <span>Historical Baseline (Sprint 14)</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{activeConflict.conflictingMeetingDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Locked in <strong className="text-slate-200">{activeConflict.conflictingMeetingTitle}</strong>
                  </p>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/[0.04] text-xs text-slate-200 leading-relaxed font-mono">
                    "{activeConflict.conflictingHistoricalStatement}"
                  </div>
                </div>

                {/* Current Proposed Statement */}
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Today's Proposed Statement</span>
                    </span>
                    <span className="text-[10px] font-mono text-rose-400">Sprint 16</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Captured from current Sprint 16 discussion / voice debrief
                  </p>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 text-xs text-slate-200 leading-relaxed font-mono">
                    "{activeConflict.currentStatement}"
                  </div>
                </div>
              </div>

              {/* AI Semantic Rationale & Risk Assessment */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/[0.06] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Cognitive Agent Risk Assessment & Rationale</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeConflict.analysisRationale}
                </p>
              </div>

              {/* Human Decision Resolver Actions */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-indigo-400" />
                  Select Resolution Action (Human-in-the-Loop)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: Override */}
                  <button
                    onClick={() =>
                      handleResolve(
                        'override_past',
                        'Overrode historical Sprint 14 baseline with unanimous team signoff. Updated architecture registry.'
                      )
                    }
                    className="p-4 rounded-2xl border border-white/[0.08] bg-slate-950/50 hover:bg-slate-800/80 hover:border-indigo-500/40 text-left transition-all cursor-pointer group hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-white">Override Past Baseline</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Accept today's new direction and formally supersede the Sprint 14 decision.
                    </p>
                  </button>

                  {/* Option 2: Revert to past */}
                  <button
                    onClick={() =>
                      handleResolve(
                        'revert_to_past',
                        'Reverted proposed deviation. Re-affirmed original Sprint 14 baseline as non-negotiable.'
                      )
                    }
                    className="p-4 rounded-2xl border border-white/[0.08] bg-slate-950/50 hover:bg-slate-800/80 hover:border-rose-500/40 text-left transition-all cursor-pointer group hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1 rounded-lg bg-rose-500/20 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-white">Revert & Enforce Baseline</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Reject the change. Block MongoDB / launch slip and hold engineering to commitments.
                    </p>
                  </button>

                  {/* Option 3: Compromise */}
                  <button
                    onClick={() =>
                      handleResolve(
                        'compromise_accepted',
                        'Synthesized Compromise: Retain Postgres AWS RDS for ACID data + add MongoDB Atlas sandbox for vector metadata with strict 60ms latency gate.'
                      )
                    }
                    className="p-4 rounded-2xl border border-white/[0.08] bg-slate-950/50 hover:bg-slate-800/80 hover:border-emerald-500/40 text-left transition-all cursor-pointer group hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Scale className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-white">Synthesize Compromise</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Bridge requirements with an objective benchmarking gate.
                    </p>
                  </button>
                </div>

                {activeConflict.resolutionNotes && (
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>Logged Resolution:</strong> {activeConflict.resolutionNotes}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
