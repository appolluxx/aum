import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CyclePhase } from '../types';

interface HeartSimulationProps {
  bpm: number;
  isPlaying: boolean;
  cyclePhase: CyclePhase;
}

// SVG Path definitions for the circulatory loops
// ViewBox assumed 0 0 600 800
// Body (Bottom) -> Right Heart -> Lungs (Top)
const PATH_DEOXYGENATED = "M 300 750 C 150 750, 220 500, 220 400 L 220 300 C 220 200, 150 100, 300 50";
// Lungs (Top) -> Left Heart -> Body (Bottom)
const PATH_OXYGENATED = "M 300 50 C 450 100, 380 200, 380 300 L 380 400 C 380 500, 450 650, 300 750";

export const HeartSimulation: React.FC<HeartSimulationProps> = ({ bpm, isPlaying, cyclePhase }) => {
  
  // Calculate animation duration based on BPM
  // Higher BPM = Faster speed (lower duration)
  // Base speed factor: at 60 BPM, a particle takes ~4 seconds to complete a half-circuit
  const flowDuration = useMemo(() => {
    if (!isPlaying) return 0;
    return (60 / bpm) * 4; 
  }, [bpm, isPlaying]);

  // Generate particles
  const particleCount = 12;
  const particles = Array.from({ length: particleCount }).map((_, i) => i);

  // Heartbeat animation variants
  const heartVariants = {
    systole: { scale: 0.9, transition: { type: "spring", stiffness: 300, damping: 15 } },
    diastole: { scale: 1.05, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="relative w-full max-w-[500px] aspect-[3/4]">
      
      {/* Labels */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-slate-400 font-bold tracking-widest text-sm">PULMONARY (LUNGS)</div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 text-slate-400 font-bold tracking-widest text-sm">SYSTEMIC (BODY)</div>

      <svg viewBox="0 0 600 800" className="w-full h-full drop-shadow-2xl overflow-visible">
        
        <defs>
          <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* Gradient for lungs */}
          <linearGradient id="lungGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* --- ANATOMY BACKGROUND --- */}

        {/* Lungs (Top) */}
        <path d="M 150 80 Q 300 0 450 80 Q 550 150 450 180 Q 300 150 150 180 Q 50 150 150 80 Z" 
              fill="url(#lungGradient)" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />
        
        {/* Body (Bottom) */}
        <rect x="100" y="650" width="400" height="100" rx="20" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        {/* Capillary Network Representation */}
        <path d="M 150 700 L 450 700 M 150 700 L 150 720 M 450 700 L 450 720 M 200 680 L 200 720 M 250 680 L 250 720 M 300 680 L 300 720 M 350 680 L 350 720 M 400 680 L 400 720" stroke="#334155" strokeWidth="1" />

        {/* Connecting Vessels (Static Background Lines) */}
        {/* Veins from Body to Heart (Blue) */}
        <path d={PATH_DEOXYGENATED} fill="none" stroke="#1e293b" strokeWidth="20" strokeLinecap="round" />
        {/* Arteries from Heart to Body (Red) */}
        <path d={PATH_OXYGENATED} fill="none" stroke="#1e293b" strokeWidth="20" strokeLinecap="round" />


        {/* --- ACTIVE FLUID PATHS (Colored Lines) --- */}
        {/* Deoxygenated Path (Blue) */}
        <path d={PATH_DEOXYGENATED} fill="none" stroke="#1d4ed8" strokeWidth="6" strokeOpacity="0.3" />
        {/* Oxygenated Path (Red) */}
        <path d={PATH_OXYGENATED} fill="none" stroke="#b91c1c" strokeWidth="6" strokeOpacity="0.3" />


        {/* --- PARTICLES --- */}
        {/* We use two groups of particles to simulate the continuous loop and color change */}
        
        {/* Blue Particles (Body -> Lungs) */}
        {particles.map((i) => (
          <motion.circle
            key={`blue-${i}`}
            r="6"
            fill="#3b82f6" // Blue
            filter="url(#glow-blue)"
            style={{ offsetPath: `path("${PATH_DEOXYGENATED}")` }}
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ 
              offsetDistance: "100%",
              opacity: [0, 1, 1, 0] // Fade in at body, fade out at lungs
            }}
            transition={{
              duration: flowDuration,
              repeat: Infinity,
              ease: "linear",
              delay: (flowDuration / particleCount) * i,
            }}
          />
        ))}

        {/* Red Particles (Lungs -> Body) */}
        {particles.map((i) => (
          <motion.circle
            key={`red-${i}`}
            r="6"
            fill="#ef4444" // Red
            filter="url(#glow-red)"
            style={{ offsetPath: `path("${PATH_OXYGENATED}")` }}
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ 
              offsetDistance: "100%",
              opacity: [0, 1, 1, 0] // Fade in at lungs, fade out at body
            }}
            transition={{
              duration: flowDuration,
              repeat: Infinity,
              ease: "linear",
              delay: (flowDuration / particleCount) * i, 
            }}
          />
        ))}

        {/* --- THE HEART (Animated Container) --- */}
        <motion.g 
          variants={heartVariants}
          animate={cyclePhase}
          style={{ originX: "50%", originY: "50%", transformBox: "fill-box" }}
        >
          {/* Heart Shape Background */}
          <path d="M 300 480 L 220 350 C 180 300, 200 250, 300 280 C 400 250, 420 300, 380 350 Z" 
                fill="#334155" stroke="none" />
          
          {/* Right Atrium (Viewer Left, Top) */}
          <path d="M 260 280 Q 300 290 300 330 L 300 350 L 220 350 Q 220 300 260 280" 
                fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
          
          {/* Right Ventricle (Viewer Left, Bottom) */}
          <path d="M 220 350 L 300 350 L 300 450 Q 240 420 220 350" 
                fill="#172554" stroke="#3b82f6" strokeWidth="2" />

          {/* Left Atrium (Viewer Right, Top) */}
          <path d="M 340 280 Q 300 290 300 330 L 300 350 L 380 350 Q 380 300 340 280" 
                fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
          
          {/* Left Ventricle (Viewer Right, Bottom) */}
          <path d="M 380 350 L 300 350 L 300 450 Q 360 420 380 350" 
                fill="#450a0a" stroke="#ef4444" strokeWidth="2" />

          {/* Septum (Middle Line) */}
          <line x1="300" y1="280" x2="300" y2="450" stroke="#0f172a" strokeWidth="4" />

          {/* Labels for Chambers */}
          <text x="245" y="325" fill="#60a5fa" fontSize="12" textAnchor="middle" fontWeight="bold" opacity="0.8">RA</text>
          <text x="255" y="400" fill="#60a5fa" fontSize="12" textAnchor="middle" fontWeight="bold" opacity="0.8">RV</text>
          <text x="355" y="325" fill="#f87171" fontSize="12" textAnchor="middle" fontWeight="bold" opacity="0.8">LA</text>
          <text x="345" y="400" fill="#f87171" fontSize="12" textAnchor="middle" fontWeight="bold" opacity="0.8">LV</text>
        </motion.g>

        {/* Valves (Animated simply by opacity or scale if we wanted, static for now for clarity) */}
        <line x1="230" y1="350" x2="290" y2="350" stroke="white" strokeWidth="2" strokeDasharray="2 2" opacity="0.5" />
        <line x1="310" y1="350" x2="370" y2="350" stroke="white" strokeWidth="2" strokeDasharray="2 2" opacity="0.5" />

      </svg>
    </div>
  );
};