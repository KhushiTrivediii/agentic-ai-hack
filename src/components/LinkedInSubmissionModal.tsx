import React, { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, Sparkles, Award, TrendingUp, Flame } from 'lucide-react';

interface LinkedInSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LinkedInSubmissionModal: React.FC<LinkedInSubmissionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const templates = [
    {
      title: 'Post 1: The Kickoff & Why We Built with Voice (Wispr Flow)',
      hook: 'Voice-first AI is the next leap for Product & Engineering execution.',
      text: `🚀 Excited to compete in the Product Space Agentic AI Hackathon in collaboration with Wispr Flow!

Most AI meeting tools are gloried note-takers. They generate 20 bullet points that nobody reads and completely miss when a team contradicts a decision made two weeks ago.

Today, my team is building SyncPulse AI — an autonomous Meeting-to-Execution agent built entirely with voice using Wispr Flow.

Instead of typing prompts and specs, I've been dictating directly using Wispr Flow. The speed and clarity are wild: it strips conversational disfluencies ("um", "like", "wait strike that") and turns real-time debriefs into structured execution graphs.

Can’t wait to show the Demo! Stay tuned.

#ProductSpace #AgenticAI #WisprFlow #ProductManagement #AIHackathon`,
    },
    {
      title: 'Post 2: Mid-Hackathon Progress — Cross-Meeting Memory & Conflict Detection',
      hook: 'The cross-meeting memory graph is live! Here is how it caught a 13-day SLA drift in real-time.',
      text: `⚡ Hackathon Update: We just cracked the hardest part of Problem Statement 03 — Cross-Meeting Memory & Conflict Intelligence!

Here's the real problem in high-velocity tech teams:
• In Sprint 14, leadership locked PostgreSQL on AWS RDS and a firm Nov 15 launch date.
• In Sprint 16, someone proposes migrating to MongoDB on GCP and casually suggests slipping the deadline to Nov 28.

A standard LLM summarizer just writes: "Team discussed MongoDB and updated launch date." 🤦‍♂️

SyncPulse AI operates on a persistent memory graph. The moment the proposal was spoken via Wispr Flow, SyncPulse flagged:
⚠️ CRITICAL ARCHITECTURAL CONTRADICTION: PostgreSQL vs MongoDB
⚠️ SLA VIOLATION: Nov 15 executive baseline vs Nov 28 drift

It halted automatic ticket generation until the team resolved the contradiction through a human-in-the-loop staging gate!

Building this with Wispr Flow has made rapid iteration 3x faster. Shipping the final demo soon!

#AI #ProductManagement #AgenticWorkflows #ProductSpace #WisprFlow`,
    },
    {
      title: 'Post 3: Final Demo & Submission — Meet SyncPulse AI',
      hook: 'Meet SyncPulse AI: From Spoken Word to Verified Execution.',
      text: `🏆 Final Submission: SyncPulse AI is officially live!

Built for the Product Space Agentic AI Hackathon in collaboration with Wispr Flow.

Here is what we shipped today:
1. 🎙️ Wispr Flow Voice Integration: Dictate post-meeting debriefs with intelligent filler word elimination and self-correction parsing.
2. 🧠 Persistent Cross-Meeting Memory: Connects decisions across sprints instead of treating meetings as isolated silos.
3. 🛡️ Conflict & Contradiction Engine: Detects architectural contradictions, timeline slips, and orphaned ownership in real-time.
4. 📋 Execution Staging Gate: Human-in-the-loop verification before posting tasks directly to Linear, Jira, and Slack.
5. 📊 Personalized Weekly Digests: Generates tailored digests per team member so people only see what matters to them.
6. ⏰ Proactive Deadline Escalation: Calibrated T-48h and T-24h nudges.

Huge shoutout to Product Space and Wispr Flow for hosting this challenge!

Check out the demo video and drop your thoughts below! 👇

#ProductSpace #WisprFlow #AgenticAI #GenerativeAI #ProductLeadership`,
    },
  ];

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-white">LinkedIn Submission & +10 Bonus Point Hub</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  +6 to +10 Bonus Points
                </span>
              </div>
              <p className="text-xs text-slate-400">
                15% of your hackathon score + up to 10 bonus points are awarded for LinkedIn updates and engagement!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Rules Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/30 to-indigo-950/30 border border-sky-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <h4 className="font-bold text-sky-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Score Extra Points on LinkedIn Streak
              </h4>
              <p className="text-slate-300 mt-1">
                Post these updates on LinkedIn, tag <strong>Product Space</strong>, and submit post links + engagement screenshots by <strong>1 Nov, 11:59 PM IST</strong> to lock in top bonus tier (+10 points).
              </p>
            </div>
            <a
              href="https://theproductspace.in/user-dashboard/linkedin-submissions/agentic-ai-hackathons"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold whitespace-nowrap text-xs transition-colors"
            >
              <span>Submit to Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Templates list */}
          <div className="space-y-4">
            {templates.map((tpl, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-indigo-300 font-mono">
                      0{idx + 1}
                    </span>
                    <span>{tpl.title}</span>
                  </h4>
                  <button
                    onClick={() => handleCopy(idx, tpl.text)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy Post Text</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-850 text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto">
                  {tpl.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60 text-xs">
          <span className="text-slate-400">
            Tip: Include a screenshot of the Memory Graph or Conflict Center to maximize likes!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
