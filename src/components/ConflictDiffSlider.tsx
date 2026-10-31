import React, { useState } from 'react';
import { GitCompare, History, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { Conflict } from '../types';

interface ConflictDiffSliderProps {
  conflict: Conflict;
}

export const ConflictDiffSlider: React.FC<ConflictDiffSliderProps> = ({ conflict }) => {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/[0.08] space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-300 flex items-center gap-1.5">
          <GitCompare className="w-4 h-4 text-indigo-400" />
          <span>Interactive Semantic Diff Inspection</span>
        </span>
        <span className="text-[11px] text-slate-500 font-mono">
          Slide to compare baseline vs proposal
        </span>
      </div>

      {/* Slider Bar */}
      <input
        type="range"
        min="10"
        max="90"
        value={sliderPos}
        onChange={(e) => setSliderPos(Number(e.target.value))}
        className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
      />

      {/* Dual Comparative Box */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Left: Sprint 14 Baseline */}
        <div
          style={{ opacity: (100 - sliderPos) / 50 }}
          className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5 transition-opacity"
        >
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
            <History className="w-3.5 h-3.5" />
            <span>Sprint 14 Locked Baseline</span>
          </div>
          <p className="font-mono text-slate-200 text-[11px] leading-relaxed">
            {conflict.conflictingHistoricalStatement}
          </p>
        </div>

        {/* Right: Sprint 16 Proposal */}
        <div
          style={{ opacity: sliderPos / 50 }}
          className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5 transition-opacity"
        >
          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Sprint 16 Unapproved Deviation</span>
          </div>
          <p className="font-mono text-slate-200 text-[11px] leading-relaxed">
            {conflict.currentStatement}
          </p>
        </div>
      </div>
    </div>
  );
};
