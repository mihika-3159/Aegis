'use client';

import { useAegisStore } from '@/store/useAegisStore';
import { getSimulationData } from '@/lib/predictionEngine';
import { motion } from 'framer-motion';
import { Play, RotateCcw, AlertOctagon } from 'lucide-react';

const scenarios = [
  'Great Flood 2026',
  'Hypercane Aegis',
  'Solar Flare Heatwave'
];

export const SimulationControls = () => {
  const { toggleSimulationMode, setWeather, setRisks, isSimulationMode, simulationScenario, toggleEmergencyMode } = useAegisStore();

  const handleScenario = (scenario: string) => {
    const data = getSimulationData(scenario);
    setWeather(data.weather);
    setRisks(data.risks);
    toggleSimulationMode(scenario);
    
    // Automatically trigger emergency mode if risk is extreme
    const isExtreme = data.risks.some(r => r.severity === 'extreme' || r.severity === 'high');
    toggleEmergencyMode(isExtreme);
  };

  const handleReset = () => {
    const data = getSimulationData('default');
    setWeather(data.weather);
    setRisks(data.risks);
    if (isSimulationMode) toggleSimulationMode();
    toggleEmergencyMode(false);
  };

  return (
    <div className="glass p-6 rounded-3xl border-cyan-neon/10 neo-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-neon/10 rounded-lg">
          <AlertOctagon className="text-cyan-neon" size={20} />
        </div>
        <h3 className="font-bold uppercase tracking-tighter">Mission Simulation Control</h3>
      </div>

      <div className="flex flex-col gap-3">
        {scenarios.map((scenario) => (
          <button
            key={scenario}
            onClick={() => handleScenario(scenario)}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
              simulationScenario === scenario 
                ? 'bg-cyan-neon/20 border-cyan-neon text-cyan-neon' 
                : 'bg-white/5 border-white/10 hover:border-cyan-neon/50'
            }`}
          >
            <span className="font-medium">{scenario}</span>
            <Play size={16} fill={simulationScenario === scenario ? 'currentColor' : 'none'} />
          </button>
        ))}

        <button
          onClick={handleReset}
          className="mt-4 flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
        >
          <RotateCcw size={16} />
          Reset to Live Intelligence
        </button>
      </div>

      {isSimulationMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-amber-neon/10 border border-amber-neon/20 rounded-xl"
        >
          <p className="text-xs font-bold text-amber-neon uppercase mb-1">Simulating Scenario</p>
          <p className="text-sm font-medium">{simulationScenario}</p>
        </motion.div>
      )}
    </div>
  );
};
