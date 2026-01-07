import React, { useMemo } from 'react';
import { HeartPulse, Droplets, Timer } from 'lucide-react';
import { CyclePhase } from '../types';

interface DashboardProps {
  bpm: number;
  cyclePhase: CyclePhase;
}

export const Dashboard: React.FC<DashboardProps> = ({ bpm, cyclePhase }) => {
  
  // Mock Calculation: Stroke Volume typically ~70ml for average adult
  // Cardiac Output (L/min) = (BPM * SV) / 1000
  const cardiacOutput = useMemo(() => {
    return ((bpm * 70) / 1000).toFixed(1);
  }, [bpm]);

  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold">Cardiac Cycle</p>
          <p className={`text-lg font-bold mt-1 transition-colors duration-200 ${cyclePhase === 'systole' ? 'text-red-400' : 'text-blue-400'}`}>
            {cyclePhase === 'systole' ? 'Systole' : 'Diastole'}
          </p>
          <p className="text-[10px] text-slate-600">
            {cyclePhase === 'systole' ? 'Contraction (Pumping)' : 'Relaxation (Filling)'}
          </p>
        </div>
        <Timer className={`text-slate-600 ${cyclePhase === 'systole' ? 'animate-pulse text-red-500/50' : ''}`} size={24} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold">Cardiac Output</p>
          <p className="text-lg font-bold mt-1 text-emerald-400">{cardiacOutput} <span className="text-sm font-normal text-slate-500">L/min</span></p>
          <p className="text-[10px] text-slate-600">@ 70mL stroke vol</p>
        </div>
        <Droplets className="text-emerald-500/50" size={24} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold">Cycle Duration</p>
          <p className="text-lg font-bold mt-1 text-purple-400">{(60/bpm).toFixed(2)} <span className="text-sm font-normal text-slate-500">sec</span></p>
        </div>
        <HeartPulse className="text-purple-500/50" size={24} />
      </div>
    </div>
  );
};