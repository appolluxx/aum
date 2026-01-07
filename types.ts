export interface SimulationState {
  bpm: number;
  isPlaying: boolean;
}

export type CyclePhase = 'systole' | 'diastole';

export interface ParticleConfig {
  id: number;
  delay: number;
}