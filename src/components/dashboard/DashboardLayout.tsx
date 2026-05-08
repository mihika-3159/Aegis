'use client';

import { useAegisStore } from '@/store/useAegisStore';
import { WeatherBackground } from './WeatherBackground';
import { MetricCard } from './MetricCard';
import { RiskPanel } from './RiskPanel';
import { PreparednessAssistant } from './PreparednessAssistant';
import { SimulationControls } from '../simulation/SimulationControls';
import { RiskMap } from '../map/RiskMap';
import { EmergencyOverlay } from '../emergency/EmergencyOverlay';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  CloudRain, 
  ShieldCheck, 
  Menu, 
  Bell,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardLayout = () => {
  const { weather, preparednessScore, isSimulationMode } = useAegisStore();

  if (!weather) return null;

  return (
    <div className="min-h-screen text-slate-100 selection:bg-cyan-neon/30">
      <WeatherBackground />
      <EmergencyOverlay />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/20 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-neon/20 rounded-xl border border-cyan-neon/50 flex items-center justify-center">
              <Cpu className="text-cyan-neon" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Aegis</h1>
              <p className="text-[10px] font-bold text-cyan-neon uppercase tracking-[0.2em] mt-1">Climate Intelligence OS</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest opacity-60">
            <a href="#" className="hover:text-cyan-neon hover:opacity-100 transition-all">Satellite</a>
            <a href="#" className="hover:text-cyan-neon hover:opacity-100 transition-all">Predictions</a>
            <a href="#" className="hover:text-cyan-neon hover:opacity-100 transition-all">Resilience</a>
            <a href="#" className="hover:text-cyan-neon hover:opacity-100 transition-all">Community</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 glass rounded-lg border-white/5 relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-danger-neon rounded-full" />
            </button>
            <button className="md:hidden p-2 glass rounded-lg border-white/5">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex flex-col items-end">
              <p className="text-xs font-bold uppercase">{weather.location}</p>
              <p className="text-[10px] opacity-40 uppercase">Sector 7-G</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column - Metrics & Map */}
          <div className="lg:col-span-8 space-y-8">
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard 
                label="Temperature" 
                value={weather.temp} 
                unit="°C" 
                icon={Thermometer} 
                color={weather.temp > 35 ? 'amber' : 'cyan'}
                trend="up"
              />
              <MetricCard 
                label="Humidity" 
                value={weather.humidity} 
                unit="%" 
                icon={Droplets} 
                color="cyan"
                trend="stable"
              />
              <MetricCard 
                label="Wind Speed" 
                value={weather.windSpeed} 
                unit="km/h" 
                icon={Wind} 
                color={weather.windSpeed > 50 ? 'amber' : 'cyan'}
                trend="up"
              />
              <MetricCard 
                label="Rainfall" 
                value={weather.rainfall} 
                unit="mm" 
                icon={CloudRain} 
                color={weather.rainfall > 20 ? 'danger' : 'cyan'}
                trend="stable"
              />
            </section>

            <section>
              <RiskMap />
            </section>

            <section className="grid md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-[2rem] border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <ShieldCheck className="text-toxic-neon" />
                  Community Resilience
                </h3>
                <div className="flex items-end gap-4 mb-6">
                  <h4 className="text-6xl font-black text-glow text-toxic-neon">{preparednessScore}%</h4>
                  <div className="mb-2">
                    <p className="text-xs font-bold uppercase opacity-40">Resilience Score</p>
                    <p className="text-xs font-bold text-toxic-neon uppercase">Optimal Readiness</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${preparednessScore}%` }}
                      className="h-full bg-gradient-to-r from-toxic-neon/50 to-toxic-neon shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                    />
                  </div>
                  <p className="text-sm opacity-60">
                    Based on local shelter capacity, drainage efficiency, and individual preparedness plans.
                  </p>
                </div>
              </div>

              <SimulationControls />
            </section>
          </div>

          {/* Right Column - Risks & Assistant */}
          <div className="lg:col-span-4 space-y-8">
            <RiskPanel />
            <PreparednessAssistant />
            
            <div className="glass p-6 rounded-3xl border-white/5 text-center">
              <p className="text-xs font-bold uppercase opacity-40 mb-2">System Status</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-toxic-neon animate-pulse" />
                <span className="text-sm font-mono uppercase">All Nodes Operational</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="border-t border-white/5 bg-slate-950/40 backdrop-blur-md py-10 relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs opacity-40 uppercase tracking-widest font-bold">
            &copy; 2026 Aegis Resilience Network | WeatherWise Hack Submission
          </p>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest opacity-40">
            <a href="#" className="hover:opacity-100">Privacy</a>
            <a href="#" className="hover:opacity-100">Protocols</a>
            <a href="#" className="hover:opacity-100">API Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
