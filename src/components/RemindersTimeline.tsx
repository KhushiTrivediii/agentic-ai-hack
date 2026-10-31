import React, { useState } from 'react';
import { Bell, Clock, Send, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { Reminder } from '../types';
import { sfx } from '../utils/audio';

interface RemindersTimelineProps {
  reminders: Reminder[];
  onTriggerReminder: (reminderId: string) => void;
}

export const RemindersTimeline: React.FC<RemindersTimelineProps> = ({
  reminders,
  onTriggerReminder,
}) => {
  const [triggeredId, setTriggeredId] = useState<string | null>(null);

  const handleSendNudge = (id: string) => {
    sfx.playSuccess();
    setTriggeredId(id);
    onTriggerReminder(id);
    setTimeout(() => setTriggeredId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-slate-900 border border-white/[0.08] shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Proactive Deadline & Escalation Engine</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              Autonomous Follow-ups
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            "Reminders before deadlines." Tasks don't slip because people forgot; they slip because no one checked in until the day of. SyncPulse proactively schedules calibrated reminders (gentle, warning, critical escalation) before deadlines breach.
          </p>
        </div>
      </div>

      {/* Reminder Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reminders.map((reminder) => {
          const isUrgent = reminder.urgency === 'critical';
          const isWarning = reminder.urgency === 'warning';
          const isTriggered = triggeredId === reminder.id;

          return (
            <div
              key={reminder.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all backdrop-blur-md ${
                isUrgent
                  ? 'bg-rose-950/25 border-rose-500/40 shadow-xl shadow-rose-950/20 ring-1 ring-rose-500/20'
                  : isWarning
                  ? 'bg-amber-950/15 border-amber-500/30 shadow-lg'
                  : 'bg-slate-900 border-white/[0.08] shadow-lg'
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${
                      isUrgent
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    }`}
                  >
                    {reminder.urgency} Escalation
                  </span>

                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>In {reminder.hoursUntilDeadline}h</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-1 leading-snug">{reminder.actionItemTitle}</h4>
                  <p className="text-xs text-slate-400">
                    Target Recipient: <strong className="text-slate-200">{reminder.recipientName}</strong>
                  </p>
                </div>

                {/* Scheduled Slack/Email Message Preview */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/[0.06] text-xs text-slate-200 font-mono leading-relaxed">
                  "{reminder.messageText}"
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Scheduled: {reminder.scheduledTime}</span>
                </span>

                <button
                  onClick={() => handleSendNudge(reminder.id)}
                  disabled={isTriggered}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isTriggered
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/[0.08] hover:scale-105'
                  }`}
                >
                  {isTriggered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Dispatched!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Dispatch Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
