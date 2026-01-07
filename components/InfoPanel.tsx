import React from 'react';
import { Info, ArrowRight } from 'lucide-react';
import { CyclePhase } from '../types';

interface InfoPanelProps {
  cyclePhase: CyclePhase;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ cyclePhase }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex-1 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4 text-slate-300">
        <Info size={16} className="text-blue-400" />
        <h3 className="font-semibold text-sm uppercase tracking-wider">Physiology Guide</h3>
      </div>

      <div className="space-y-4 text-sm text-slate-400">
        
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
          <h4 className="text-slate-200 font-semibold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Pulmonary Circuit
          </h4>
          <p className="leading-relaxed text-xs">
            Deoxygenated blood returns from the body via the Vena Cava into the <strong className="text-blue-400">Right Atrium</strong>. It is pumped into the <strong className="text-blue-400">Right Ventricle</strong>, then pushed to the Lungs to pick up oxygen.
          </p>
        </div>

        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
          <h4 className="text-slate-200 font-semibold mb-2 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-red-500"></span>
             Systemic Circuit
          </h4>
          <p className="leading-relaxed text-xs">
            Oxygen-rich blood returns from the Lungs into the <strong className="text-red-400">Left Atrium</strong>. It moves to the powerful <strong className="text-red-400">Left Ventricle</strong>, which pumps it out through the Aorta to the rest of the Body.
          </p>
        </div>

        <div className={`p-3 rounded-lg border transition-colors duration-300 ${
            cyclePhase === 'systole' 
            ? 'bg-red-950/20 border-red-900/50' 
            : 'bg-blue-950/20 border-blue-900/50'
          }`}>
          <h4 className="font-semibold mb-1 flex items-center gap-2">
            Current Phase: <span className={cyclePhase === 'systole' ? 'text-red-400' : 'text-blue-400'}>
              {cyclePhase === 'systole' ? 'Systole' : 'Diastole'}
            </span>
          </h4>
          <p className="text-xs opacity-80">
            {cyclePhase === 'systole' 
              ? "The heart muscle contracts, pumping blood out of the ventricles into the arteries." 
              : "The heart muscle relaxes and the chambers fill with blood."}
          </p>
        </div>

      </div>
    </div>
  );
};