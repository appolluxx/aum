import React from 'react';
import { Activity, Play, Pause } from 'lucide-react';

interface ControlsProps {
  bpm: number;
  setBpm: (val: number) => void;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = ({ bpm, setBpm, isPlaying, setIsPlaying }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Activity size={16} className="text-blue-400" />
          Simulation Controls
        </h2>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`p-2 rounded-full transition-colors ${
            isPlaying ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
          }`}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <label htmlFor="bpm-slider" className="text-sm text-slate-400">Heart Rate</label>
            <span className="text-2xl font-mono font-bold text-white">{bpm} <span className="text-xs font-sans font-normal text-slate-500">BPM</span></span>
          </div>
          <input
            id="bpm-slider"
            type="range"
            min="40"
            max="180"
            step="1"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
            disabled={!isPlaying}
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
            <span>Bradycardia</span>
            <span>Normal</span>
            <span>Tachycardia</span>
          </div>
        </div>
      </div>
    </div>
  );
};