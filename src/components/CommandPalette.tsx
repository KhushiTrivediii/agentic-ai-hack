import React, { useState, useEffect } from 'react';
import { Search, Mic, Layers, ShieldAlert, ListTodo, Workflow, Bell, Share2, Sparkles, X, ArrowRight } from 'lucide-react';
import { sfx } from '../utils/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'voice_modal', title: 'Dictate Voice Memo with Wispr Flow', category: 'Voice Input', icon: Mic, shortcut: 'V' },
    { id: 'tab_conflicts', title: 'Audit Cross-Meeting Contradictions', category: 'Intelligence', icon: ShieldAlert, shortcut: 'C' },
    { id: 'tab_memory', title: 'Explore Long-Term Decision Memory Graph', category: 'Memory Graph', icon: Layers, shortcut: 'M' },
    { id: 'tab_staging', title: 'Execution Staging Gate (Confirm & Sync Tasks)', category: 'Execution', icon: ListTodo, shortcut: 'S' },
    { id: 'tab_digest', title: 'View Personalized Weekly Member Digests', category: 'Team Digest', icon: Workflow, shortcut: 'D' },
    { id: 'tab_reminders', title: 'Inspect Deadline Escalation Reminders', category: 'Reminders', icon: Bell, shortcut: 'R' },
    { id: 'linkedin_modal', title: 'Open LinkedIn Submission & +10 Bonus Hub', category: 'Hackathon Bonus', icon: Share2, shortcut: 'L' },
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: string) => {
    sfx.playClick();
    onSelectAction(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl shadow-indigo-950/50 overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/40">
          <Search className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to screen... (e.g. 'wispr', 'conflict', 'staging')"
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-600/15 hover:border-indigo-500/30 border border-transparent text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-indigo-200">
                        {cmd.title}
                      </p>
                      <p className="text-[10px] text-slate-400">{cmd.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {cmd.shortcut}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with mouse or shortcuts</span>
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};
