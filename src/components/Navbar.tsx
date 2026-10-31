import React from 'react';
import { Mic, ShieldAlert, Cpu, Sparkles, Share2, Workflow, Bell, ListTodo, Layers, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openVoiceModal: () => void;
  openLinkedInModal: () => void;
  unresolvedConflictCount: number;
  pendingTaskCount: number;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openVoiceModal,
  openLinkedInModal,
  unresolvedConflictCount,
  pendingTaskCount,
  onResetDemo,
}) => {
  const navTabs = [
    { id: 'ingestion', label: 'Ingestion & Voice', icon: Mic },
    { id: 'memory', label: 'Memory Graph', icon: Layers },
    {
      id: 'conflicts',
      label: 'Conflict Intelligence',
      icon: ShieldAlert,
      badge: unresolvedConflictCount > 0 ? unresolvedConflictCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'staging',
      label: 'Execution Staging',
      icon: ListTodo,
      badge: pendingTaskCount > 0 ? pendingTaskCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950',
    },
    { id: 'digest', label: 'Weekly Digests', icon: Workflow },
    { id: 'reminders', label: 'Reminders', icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Space / Wispr badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    SyncPulse
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Agentic AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Meeting-to-Execution Engine
                </p>
              </div>
            </div>

            {/* Hackathon badging */}
            <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                Product Space Hackathon
              </span>
              <span className="px-2 py-0.5 rounded-full bg-violet-950/60 border border-violet-800/40 text-violet-300 font-medium flex items-center gap-1">
                <Mic className="w-3 h-3 text-violet-400" />
                Wispr Flow Native (20% Score)
              </span>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/70 p-1 rounded-xl border border-slate-800/80">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        tab.badgeColor || 'bg-indigo-400 text-slate-950'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick Wispr Voice trigger */}
            <button
              onClick={openVoiceModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer pulse-glow"
            >
              <Mic className="w-4 h-4 animate-pulse text-amber-300" />
              <span className="hidden sm:inline">Wispr Voice Input</span>
            </button>

            {/* LinkedIn +10 Bonus points button */}
            <button
              onClick={openLinkedInModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-750 text-sky-400 transition-colors cursor-pointer"
              title="Get up to +10 Hackathon Bonus Points on LinkedIn"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-semibold">+10 Bonus</span>
            </button>

            {/* Reset demo scenario */}
            <button
              onClick={onResetDemo}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset Demo Scenario"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-between gap-1 overflow-x-auto py-2 border-t border-slate-800/50">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-1 rounded-full ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
