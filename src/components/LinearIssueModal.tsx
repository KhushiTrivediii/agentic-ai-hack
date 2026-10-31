import React from 'react';
import { X, ExternalLink, GitBranch, MessageSquare, Clock, Tag, User, CheckCircle2, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ActionItem, Speaker } from '../types';
import { sfx } from '../utils/audio';

interface LinearIssueModalProps {
  issue: ActionItem | null;
  assignee: Speaker | null;
  onClose: () => void;
}

export const LinearIssueModal: React.FC<LinearIssueModalProps> = ({
  issue,
  assignee,
  onClose,
}) => {
  if (!issue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0f1117] border border-[#232738] rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col font-sans text-slate-200">
        {/* Linear Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#232738] bg-[#141724]">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
              L
            </div>
            <span className="text-xs font-mono font-bold text-slate-300">{issue.trackerTicketKey || 'LIN-412'}</span>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400">Core Platform Sprint 16</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Synced to Linear API
            </span>
            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Issue Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Title */}
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
              {issue.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Created autonomously by <strong className="text-indigo-400">SyncPulse AI</strong> via verified human staging gate.
            </p>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#141724] border border-[#232738] text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Status</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                In Progress
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Priority</span>
              <span className="inline-flex items-center gap-1 font-bold text-rose-400">
                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px]">
                  {issue.priority}
                </span>
                <span>Urgent</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Assignee</span>
              <div className="flex items-center gap-1.5">
                {assignee && (
                  <img src={assignee.avatar} alt={assignee.name} className="w-4 h-4 rounded-full object-cover" />
                )}
                <span className="font-semibold text-slate-200 line-clamp-1">{assignee?.name || 'Rohit Mehta'}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Due Date</span>
              <span className="font-mono text-slate-200 font-semibold">{issue.deadline}</span>
            </div>
          </div>

          {/* Issue Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description & Context</h4>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-[#232738] text-xs text-slate-300 leading-relaxed font-sans space-y-2">
              <p>{issue.description}</p>
              <div className="pt-2 border-t border-[#232738] flex flex-wrap gap-1.5">
                {issue.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Activity / Audit History */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Audit & Decision Lineage</h4>
            <div className="p-3.5 rounded-xl bg-[#141724]/60 border border-[#232738] space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />
                <span>Verified in <strong>Sprint 16 Execution Staging Gate</strong> after resolving conflict against Sprint 14 baseline.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-indigo-400 mt-0.5" />
                <span>Automated pre-deadline reminders scheduled for T-48h and T-24h to prevent SLA breach.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#232738] bg-[#141724] text-xs">
          <span className="text-slate-500">Linear Workspace: pulsecorp.linear.app</span>
          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
