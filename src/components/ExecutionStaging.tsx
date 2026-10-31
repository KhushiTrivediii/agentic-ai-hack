import React, { useState } from 'react';
import { ListTodo, CheckCircle2, Send, ExternalLink, Calendar, Kanban, ListFilter, Sparkles, Filter, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActionItem, Speaker } from '../types';
import { sfx } from '../utils/audio';

interface ExecutionStagingProps {
  actionItems: ActionItem[];
  speakers: Speaker[];
  onConfirmTasks: (taskIds: string[]) => void;
  onUpdateTask?: (task: ActionItem) => void;
}

export const ExecutionStaging: React.FC<ExecutionStagingProps> = ({
  actionItems,
  speakers,
  onConfirmTasks,
}) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(
    actionItems.filter((a) => a.status === 'pending_confirmation').map((a) => a.id)
  );
  const [activeTab, setActiveTab] = useState<'pending' | 'synced' | 'all'>('pending');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const getSpeaker = (id: string) => speakers.find((s) => s.id === id) || speakers[0];

  const handleToggleSelectAll = () => {
    sfx.playClick();
    const pendingIds = actionItems.filter((a) => a.status === 'pending_confirmation').map((a) => a.id);
    if (selectedTaskIds.length === pendingIds.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(pendingIds);
    }
  };

  const handleToggleTask = (id: string) => {
    sfx.playClick();
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleConfirmSync = () => {
    if (selectedTaskIds.length === 0) return;

    sfx.playSuccess();

    // Multi-stage celebratory confetti explosion
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 200);

    onConfirmTasks(selectedTaskIds);
    setSelectedTaskIds([]);
  };

  const filteredTasks = actionItems.filter((task) => {
    if (activeTab === 'pending') return task.status === 'pending_confirmation';
    if (activeTab === 'synced') return task.status === 'synced_to_tracker';
    return true;
  });

  const trackerColors: Record<string, string> = {
    linear: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    jira: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    slack: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    github: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-slate-900 border border-white/[0.08] shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <ListTodo className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Execution Staging & Approval Gate</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              Mandatory Human-in-the-Loop Confirmation
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            "A confirmation step before anything gets posted." SyncPulse prevents noisy or erroneous bot spam. Review, adjust assignees and priorities, and publish verified tasks into Linear, Jira, and Slack in one click.
          </p>
        </div>

        {/* Sync Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleConfirmSync}
            disabled={selectedTaskIds.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed pulse-glow hover:scale-105"
          >
            <Send className="w-4 h-4" />
            <span>Confirm & Sync ({selectedTaskIds.length}) to Trackers</span>
          </button>
        </div>
      </div>

      {/* Tabs & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sfx.playClick();
              setActiveTab('pending');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Pending Confirmation ({actionItems.filter((a) => a.status === 'pending_confirmation').length})
          </button>
          <button
            onClick={() => {
              sfx.playClick();
              setActiveTab('synced');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'synced'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Synced to Trackers ({actionItems.filter((a) => a.status === 'synced_to_tracker').length})
          </button>
          <button
            onClick={() => {
              sfx.playClick();
              setActiveTab('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            All Action Items ({actionItems.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => {
                sfx.playClick();
                setViewMode('list');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => {
                sfx.playClick();
                setViewMode('kanban');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'kanban' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Linear Board</span>
            </button>
          </div>

          {activeTab === 'pending' && viewMode === 'list' && (
            <button
              onClick={handleToggleSelectAll}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer"
            >
              {selectedTaskIds.length === actionItems.filter((a) => a.status === 'pending_confirmation').length
                ? 'Deselect All'
                : 'Select All Pending'}
            </button>
          )}
        </div>
      </div>

      {/* View Mode 1: Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Pending Staging */}
          <div className="bg-slate-900/80 border border-white/[0.08] rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Staged for Review ({actionItems.filter((a) => a.status === 'pending_confirmation').length})
              </span>
            </div>

            <div className="space-y-3">
              {actionItems
                .filter((a) => a.status === 'pending_confirmation')
                .map((task) => {
                  const assignee = getSpeaker(task.assigneeId);
                  return (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-white/[0.06] space-y-2 hover:border-indigo-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {task.priority}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                          {task.targetTracker}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white">{task.title}</h4>
                      <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="text-[11px] text-slate-300">{assignee.name.split(' ')[0]}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">Due {task.deadline}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Column 2: Published to Linear / Jira */}
          <div className="bg-slate-900/80 border border-white/[0.08] rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Published to Trackers ({actionItems.filter((a) => a.status === 'synced_to_tracker').length})
              </span>
            </div>

            <div className="space-y-3">
              {actionItems
                .filter((a) => a.status === 'synced_to_tracker')
                .map((task) => {
                  const assignee = getSpeaker(task.assigneeId);
                  return (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.04] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                          <span>{task.trackerTicketKey}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                          {task.targetTracker}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white">{task.title}</h4>
                      <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="text-[11px] text-slate-300">{assignee.name.split(' ')[0]}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-semibold">Synced</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        /* View Mode 2: Table List View */
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-slate-900 border border-white/[0.08] text-xs text-slate-500">
              No action items matching this filter.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isSelected = selectedTaskIds.includes(task.id);
              const isSynced = task.status === 'synced_to_tracker';
              const assignee = getSpeaker(task.assigneeId);

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSynced
                      ? 'bg-slate-900/60 border-white/[0.04]'
                      : isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-950/30 ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/90 border-white/[0.08] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox (if pending) */}
                    {!isSynced ? (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleTask(task.id)}
                        className="mt-1 w-4 h-4 rounded-md text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                      />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    )}

                    {/* Task details */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${
                              task.priority === 'P0'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {task.priority}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                              trackerColors[task.targetTracker]
                            }`}
                          >
                            {task.targetTracker}
                          </span>

                          {isSynced && task.trackerTicketKey && (
                            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 font-bold">
                              <span>{task.trackerTicketKey}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>Due: <strong className="text-slate-200">{task.deadline}</strong></span>
                          </span>
                          {task.estimatedHours && (
                            <span className="text-[11px] text-slate-500 font-mono">
                              ~{task.estimatedHours}h
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white">{task.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{task.description}</p>

                      {/* Footer Assignee & Tags */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500">Assignee:</span>
                          <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-xl border border-white/[0.08]">
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="text-xs font-semibold text-slate-200">{assignee.name}</span>
                            <span className="text-[10px] text-slate-500">({assignee.role})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
