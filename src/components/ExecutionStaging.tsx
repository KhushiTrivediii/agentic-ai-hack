import React, { useState } from 'react';
import { ListTodo, CheckCircle2, Send, ExternalLink, Calendar, AlertCircle, Sparkles, Filter, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActionItem, Speaker } from '../types';

interface ExecutionStagingProps {
  actionItems: ActionItem[];
  speakers: Speaker[];
  onConfirmTasks: (taskIds: string[]) => void;
  onUpdateTask: (task: ActionItem) => void;
}

export const ExecutionStaging: React.FC<ExecutionStagingProps> = ({
  actionItems,
  speakers,
  onConfirmTasks,
  onUpdateTask,
}) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(
    actionItems.filter((a) => a.status === 'pending_confirmation').map((a) => a.id)
  );
  const [activeTab, setActiveTab] = useState<'pending' | 'synced' | 'all'>('pending');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const getSpeaker = (id: string) => speakers.find((s) => s.id === id) || speakers[0];

  const handleToggleSelectAll = () => {
    const pendingIds = actionItems.filter((a) => a.status === 'pending_confirmation').map((a) => a.id);
    if (selectedTaskIds.length === pendingIds.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(pendingIds);
    }
  };

  const handleToggleTask = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleConfirmSync = () => {
    if (selectedTaskIds.length === 0) return;

    // Trigger hackathon celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    onConfirmTasks(selectedTaskIds);
    setSelectedTaskIds([]);
  };

  const filteredTasks = actionItems.filter((task) => {
    if (activeTab === 'pending') return task.status === 'pending_confirmation';
    if (activeTab === 'synced') return task.status === 'synced_to_tracker';
    return true;
  });

  const trackerColors: Record<string, string> = {
    linear: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    jira: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    slack: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    github: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ListTodo className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Execution Staging & Approval Gate</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              Mandatory Human-in-the-Loop Confirmation
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            "A confirmation step before anything gets posted." SyncPulse prevents noisy or erroneous bot spam. Review, adjust assignees and priorities, and publish verified tasks into Linear, Jira, and Slack in one click.
          </p>
        </div>

        {/* Sync Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleConfirmSync}
            disabled={selectedTaskIds.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed pulse-glow"
          >
            <Send className="w-4 h-4" />
            <span>Confirm & Sync ({selectedTaskIds.length}) to Trackers</span>
          </button>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Pending Confirmation ({actionItems.filter((a) => a.status === 'pending_confirmation').length})
          </button>
          <button
            onClick={() => setActiveTab('synced')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'synced'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Synced to Trackers ({actionItems.filter((a) => a.status === 'synced_to_tracker').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            All Action Items ({actionItems.length})
          </button>
        </div>

        {activeTab === 'pending' && (
          <button
            onClick={handleToggleSelectAll}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            {selectedTaskIds.length === actionItems.filter((a) => a.status === 'pending_confirmation').length
              ? 'Deselect All'
              : 'Select All Pending'}
          </button>
        )}
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-500">
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
                className={`p-4 rounded-xl border transition-all ${
                  isSynced
                    ? 'bg-slate-900/50 border-slate-800'
                    : isSelected
                    ? 'bg-slate-900 border-indigo-500/60 shadow-md shadow-indigo-950/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Checkbox (if pending) */}
                  {!isSynced ? (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleTask(task.id)}
                      className="mt-1 w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                    />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                  )}

                  {/* Task details */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
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
                          <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                            <span>{task.trackerTicketKey}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>Due: <strong className="text-slate-200">{task.deadline}</strong></span>
                        </span>
                        {task.estimatedHours && (
                          <span className="text-[11px] text-slate-500">
                            ~{task.estimatedHours}h est
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-sm font-semibold text-white">{task.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>

                    {/* Footer Assignee & Tags */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">Assignee:</span>
                        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                          <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="text-xs font-medium text-slate-200">{assignee.name}</span>
                          <span className="text-[10px] text-slate-500">({assignee.role})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400"
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
    </div>
  );
};
