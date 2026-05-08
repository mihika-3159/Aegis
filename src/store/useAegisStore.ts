import { create } from 'zustand';
import { AegisState, WeatherData, RiskAssessment } from '@/types';

export const useAegisStore = create<AegisState>((set) => ({
  weather: {
    temp: 24,
    humidity: 65,
    windSpeed: 12,
    rainfall: 0,
    condition: 'Clear',
    location: 'Veridian Coast',
  },
  risks: [
    {
      type: 'flood',
      probability: 0.12,
      severity: 'low',
      impactExplanation: 'Low risk due to stable precipitation levels.',
      recommendation: 'Monitor local drainage systems.',
    },
    {
      type: 'heatwave',
      probability: 0.45,
      severity: 'moderate',
      impactExplanation: 'Rising temperatures expected over the next 48 hours.',
      recommendation: 'Stay hydrated and limit outdoor activity.',
    }
  ],
  isSimulationMode: false,
  isEmergencyMode: false,
  simulationScenario: null,
  preparednessScore: 78,

  setWeather: (weather) => set({ weather }),
  setRisks: (risks) => set({ risks }),
  toggleSimulationMode: (scenario) => set((state) => ({ 
    isSimulationMode: !state.isSimulationMode,
    simulationScenario: scenario || null,
    // When simulation starts, we often want to reset or set specific risk states
  })),
  toggleEmergencyMode: (active) => set({ isEmergencyMode: active }),
  updatePreparednessScore: (score) => set({ preparednessScore: score }),
}));
