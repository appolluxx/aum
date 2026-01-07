import React, { useState, useEffect } from 'react';
import { HeartSimulation } from './components/HeartSimulation';
import { Controls } from './components/Controls';
import { Dashboard } from './components/Dashboard';
import { InfoPanel } from './components/InfoPanel';
import { CyclePhase } from './types';

const App: React.FC = () => {
  const [bpm, setBpm] = useState<number>(60);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cyclePhase, setCyclePhase] = useState<CyclePhase>('diastole');

  // Logic to simulate the cardiac cycle (Systole/Diastole) based on BPM
  useEffect(() => {
    if (!isPlaying) return;

    // Standard systole is about 1/3 of the cycle at rest, 
    // but occupies a larger percentage as HR increases.
    // Cycle duration in ms = 60000 / BPM
    const cycleDuration = 60000 / bpm;
    const systoleDuration = Math.max(200, cycleDuration * 0.35); // Approx 35% of cycle
    const diastoleDuration = cycleDuration - systoleDuration;

    let timer: ReturnType<typeof setTimeout>;

    const runCycle = () => {
      setCyclePhase('systole');
      timer = setTimeout(() => {
        setCyclePhase('diastole');
        timer = setTimeout(runCycle, diastoleDuration);
      }, systoleDuration);
    };

    runCycle();

    return () => clearTimeout(timer);
  }, [bpm, isPlaying]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Sidebar: Controls & Info */}
      <aside className="w-full md:w-80 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col gap-6 overflow-y-auto h-screen z-10">
        <header>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-500 bg-clip-text text-transparent">
            Circulatory Sim
          </h1>
          <p className="text-xs text-slate-400 mt-1">Interactive Human Physiology</p>
        </header>

        <Controls 
          bpm={bpm} 
          setBpm={setBpm} 
          isPlaying={isPlaying} 
          setIsPlaying={setIsPlaying} 
        />
        
        <Dashboard 
          bpm={bpm} 
          cyclePhase={cyclePhase} 
        />

        <InfoPanel cyclePhase={cyclePhase} />
      </aside>

      {/* Main Visual Area */}
      <main className="flex-1 relative flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[size:40px_40px] bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)]"></div>
        
        <HeartSimulation 
          bpm={bpm} 
          isPlaying={isPlaying} 
          cyclePhase={cyclePhase}
        />
      </main>
    </div>
  );
};

export default App;