'use client';

import { useAegisStore } from '@/store/useAegisStore';
import { getSimulationData } from '@/lib/predictionEngine';
import { motion } from 'framer-motion';
import { Play, RotateCcw, AlertOctagon } from 'lucide-react';

const scenarios = [
  'Dubai Flash Flood',
  'Hypercane Aegis',
  'Gulf Heatwave Extreme',
  'Haboob Dust Storm',
];

const scenarioDescriptions: Record<string, string> = {
  'Dubai Flash Flood': '130mm rainfall · Wadi flooding risk',
  'Hypercane Aegis': 'Cat 5 · 195km/h winds · Coastal surge',
  'Gulf Heatwave Extreme': '50°C · Life-threatening conditions',
  'Haboob Dust Storm': '65km/h · Near-zero visibility',
};

export const SimulationControls = () => {
  const {
    toggleSimulationMode,
    setWeather,
    setRisks,
    isSimulationMode,
    simulationScenario,
    toggleEmergencyMode,
  } = useAegisStore();

  const handleScenario = (scenario: string) => {
    // If same scenario already active, deactivate
    if (simulationScenario === scenario && isSimulationMode) {
      handleReset();
      return;
    }
    const data = getSimulationData(scenario);
    setWeather(data.weather);
    setRisks(data.risks);
    // Reset previous sim state first
    if (isSimulationMode) toggleSimulationMode();
    toggleSimulationMode(scenario);
    const isExtreme = data.risks.some(
      (r) => r.severity === 'extreme' || r.severity === 'high'
    );
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
    <div id="simulation" className="glass p-6 rounded-3xl border border-white/10 neo-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-neon/10 rounded-lg">
          <AlertOctagon className="text-cyan-neon" size={20} />
        </div>
        <div>
          <h3 className="font-bold uppercase tracking-tighter">Mission Simulation</h3>
          <p className="text-[10px] text-cyan-neon font-bold uppercase tracking-widest">
            Dubai, UAE · Live Scenarios
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {scenarios.map((scenario) => {
          const isActive = simulationScenario === scenario && isSimulationMode;
          return (
            <button
              key={scenario}
              onClick={() => handleScenario(scenario)}
              className={`flex items-start justify-between p-4 rounded-xl border transition-all duration-300 text-left ${
                isActive
                  ? 'bg-cyan-neon/20 border-cyan-neon text-cyan-neon'
                  : 'bg-white/5 border-white/10 hover:border-cyan-neon/50'
              }`}
            >
              <div>
                <p className="font-semibold text-sm">{scenario}</p>
                <p className={`text-[11px] mt-0.5 ${isActive ? 'opacity-80' : 'opacity-40'}`}>
                  {scenarioDescriptions[scenario]}
                </p>
              </div>
              <Play
                size={16}
                className="shrink-0 mt-0.5"
                fill={isActive ? 'currentColor' : 'none'}
              />
            </button>
          );
        })}

        <button
          onClick={handleReset}
          className="mt-2 flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-sm"
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
          <p className="text-xs font-bold text-amber-neon uppercase mb-1">
            ⚡ Simulation Active
          </p>
          <p className="text-sm font-medium">{simulationScenario}</p>
          <p className="text-[11px] opacity-60 mt-1">
            Risk map, metrics and alerts updated. Click again to stop.
          </p>
        </motion.div>
      )}
    </div>
  );
};
