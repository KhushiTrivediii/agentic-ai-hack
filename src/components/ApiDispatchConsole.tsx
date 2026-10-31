import React, { useState } from 'react';
import { Terminal, CheckCircle2, Copy, Check, ChevronDown, ChevronUp, ExternalLink, Zap } from 'lucide-react';
import { sfx } from '../utils/audio';

export interface ApiLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: 'POST' | 'GET';
  targetService: 'Linear' | 'Jira' | 'Slack' | 'GitHub';
  status: 200;
  latencyMs: number;
  payload: any;
  response: any;
}

interface ApiDispatchConsoleProps {
  logs: ApiLog[];
  isOpen: boolean;
  onToggle: () => void;
  onClear: () => void;
}

export const ApiDispatchConsole: React.FC<ApiDispatchConsoleProps> = ({
  logs,
  isOpen,
  onToggle,
  onClear,
}) => {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (logs.length === 0) return null;

  const activeLog = logs.find((l) => l.id === selectedLogId) || logs[0];

  const handleCopy = (text: string) => {
    sfx.playClick();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-xl w-full px-2 sm:px-0">
      <div className="bg-slate-900/95 border border-indigo-500/40 rounded-2xl shadow-2xl shadow-slate-950/80 backdrop-blur-xl overflow-hidden ring-1 ring-indigo-500/30">
        {/* Toggle Bar */}
        <div
          onClick={onToggle}
          className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-white/[0.08] cursor-pointer hover:bg-slate-950 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">Live Agent Action Engine</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {logs.length} API Calls Executed
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {activeLog.method} {activeLog.endpoint} • {activeLog.status} OK ({activeLog.latencyMs}ms)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-indigo-400 font-medium hidden sm:inline">
              {isOpen ? 'Minimize Console' : 'View Payloads'}
            </span>
            {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {/* Expanded Console View */}
        {isOpen && (
          <div className="p-4 space-y-3 bg-slate-950/90 text-xs animate-in fade-in max-h-96 overflow-y-auto">
            {/* Log Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {logs.map((log) => {
                const isSelected = activeLog.id === log.id;
                return (
                  <button
                    key={log.id}
                    onClick={() => {
                      sfx.playClick();
                      setSelectedLogId(log.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {log.targetService} ({log.latencyMs}ms)
                  </button>
                );
              })}
            </div>

            {/* Selected Log Inspector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono text-emerald-400 font-bold">
                  HTTP {activeLog.status} OK • {activeLog.endpoint}
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(activeLog.payload, null, 2))}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              {/* JSON Payload View */}
              <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06] font-mono text-[11px] text-slate-200 overflow-x-auto max-h-48">
                <p className="text-[10px] text-slate-500 font-sans font-bold uppercase mb-1">Outbound Webhook Payload:</p>
                <pre className="text-emerald-300 whitespace-pre">
                  {JSON.stringify(activeLog.payload, null, 2)}
                </pre>
                <p className="text-[10px] text-slate-500 font-sans font-bold uppercase mt-2 mb-1">Server Response:</p>
                <pre className="text-indigo-300 whitespace-pre">
                  {JSON.stringify(activeLog.response, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
