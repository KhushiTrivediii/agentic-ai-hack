import React, { useState } from 'react';
import { Bell, Clock, AlertTriangle, Send, CheckCircle2, ShieldCheck, Calendar, Sparkles } from 'lucide-react';
import { Reminder } from '../types';

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
    setTriggeredId(id);
    onTriggerReminder(id);
    setTimeout(() => setTriggeredId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Proactive Deadline & Escalation Engine</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
              Autonomous Follow-ups
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
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
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                isUrgent
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/20'
                  : isWarning
                  ? 'bg-amber-950/10 border-amber-500/30'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      isUrgent
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    }`}
                  >
                    {reminder.urgency} Escalation
                  </span>

                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>In {reminder.hoursUntilDeadline}h</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-white mb-1">{reminder.actionItemTitle}</h4>
                  <p className="text-[11px] text-slate-400">
                    Target Recipient: <strong className="text-slate-200">{reminder.recipientName}</strong>
                  </p>
                </div>

                {/* Scheduled Slack/Email Message Preview */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
                  "{reminder.messageText}"
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>Scheduled: {reminder.scheduledTime}</span>
                </span>

                <button
                  onClick={() => handleSendNudge(reminder.id)}
                  disabled={isTriggered}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isTriggered
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {isTriggered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sent to Slack!</span>
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
