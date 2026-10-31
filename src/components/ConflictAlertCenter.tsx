import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2, History, Scale, Sparkles, XCircle, RotateCcw } from 'lucide-react';
import { Conflict } from '../types';

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
    onResolveConflict(activeConflict.id, resolution, note);
  };

  const unresolvedCount = conflicts.filter((c) => c.resolutionState === 'unresolved').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            <h2 className="text-lg font-bold text-white">Cross-Meeting Conflict & Contradiction Center</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              {unresolvedCount} Active Contradictions
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            SyncPulse acts as an executive guardian: when current discussions drift off earlier agreements, it blocks unvetted ticket generation until humans decide whether to override, revert, or synthesize a compromise.
          </p>
        </div>

        <button
          onClick={goToStaging}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer self-start md:self-auto"
        >
          <span>Proceed to Staging Gate</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {conflicts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Zero Memory Conflicts Detected</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All current meeting proposals, timelines, and architectural choices align perfectly with the historical decision graph.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Conflict List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Detected Inconsistencies ({conflicts.length})
            </h3>
            <div className="space-y-2.5">
              {conflicts.map((conflict) => {
                const isSelected = activeConflict && activeConflict.id === conflict.id;
                const isResolved = conflict.resolutionState !== 'unresolved';

                return (
                  <div
                    key={conflict.id}
                    onClick={() => setSelectedConflictId(conflict.id)}
                    className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-950/30 border-rose-500 text-white shadow-md shadow-rose-950/40'
                        : isResolved
                        ? 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-75 hover:opacity-100'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          conflict.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {conflict.severity} • {conflict.type.replace('_', ' ')}
                      </span>
                      {isResolved && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Resolved
                        </span>
                      )}
                    </div>

                    <p className="font-semibold text-white line-clamp-2 mt-1">{conflict.currentStatement}</p>
                    <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                      <History className="w-3 h-3 text-indigo-400" />
                      <span>Conflicts with: {conflict.conflictingMeetingTitle}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conflict Inspection & Human-in-the-Loop Resolution Cockpit (8 cols) */}
          {activeConflict && (
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                        activeConflict.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {activeConflict.severity.toUpperCase()} CONTRADICTION
                    </span>
                    <span className="text-xs text-slate-400">ID: {activeConflict.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{activeConflict.currentStatement}</h3>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Status</span>
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
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                    <History className="w-4 h-4 text-indigo-400" />
                    <span>Historical Memory Baseline</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Established in <strong className="text-white">{activeConflict.conflictingMeetingTitle}</strong> on{' '}
                    <span className="font-mono text-slate-300">{activeConflict.conflictingMeetingDate}</span>
                  </p>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-mono">
                    "{activeConflict.conflictingHistoricalStatement}"
                  </div>
                </div>

                {/* Current Proposed Statement */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Today's Proposed Statement</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Captured from current Sprint 16 discussion / voice debrief
                  </p>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-rose-500/30 text-xs text-slate-200 leading-relaxed font-mono">
                    "{activeConflict.currentStatement}"
                  </div>
                </div>
              </div>

              {/* AI Semantic Rationale & Risk Assessment */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Cognitive Agent Risk Assessment & Rationale</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeConflict.analysisRationale}
                </p>
              </div>

              {/* Human Decision Resolver Actions */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-indigo-400" />
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
                    className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800/70 hover:border-slate-700 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1 rounded bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-xs text-white">Override Past Baseline</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Accept today's new direction and formally deprecate the Sprint 14 decision.
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
                    className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800/70 hover:border-slate-700 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1 rounded bg-rose-500/20 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-xs text-white">Revert & Enforce Baseline</span>
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
                    className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800/70 hover:border-slate-700 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Scale className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-xs text-white">Synthesize Compromise</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Bridge both requirements with an objective benchmarking gate.
                    </p>
                  </button>
                </div>

                {activeConflict.resolutionNotes && (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                    <strong>Logged Resolution:</strong> {activeConflict.resolutionNotes}
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
