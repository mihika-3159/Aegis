'use client';

import { useEffect, useState } from 'react';
import { useAegisStore } from '@/store/useAegisStore';
import { WeatherBackground } from './WeatherBackground';
import { MetricCard } from './MetricCard';
import { RiskPanel } from './RiskPanel';
import { PreparednessAssistant } from './PreparednessAssistant';
import { SimulationControls } from '../simulation/SimulationControls';
import { RiskMap } from '../map/RiskMap';
import { EmergencyOverlay } from '../emergency/EmergencyOverlay';
import { NotificationsPanel } from '../ui/NotificationsPanel';
import {
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  ShieldCheck,
  Menu,
  Cpu,
  MapPin,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Satellite', href: '#risk-map' },
  { label: 'Predictions', href: '#predictions' },
  { label: 'Resilience', href: '#resilience' },
  { label: 'Simulation', href: '#simulation' },
];

export const DashboardLayout = () => {
  const { weather, preparednessScore, setUserCoords, setWeather } = useAegisStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationLabel, setLocationLabel] = useState('Dubai, UAE');
  const [locating, setLocating] = useState(false);

  // Auto-detect location on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        // Reverse geocode
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.state_district ||
            data.address?.state ||
            'Your Location';
          const country = data.address?.country || '';
          setLocationLabel(`${city}${country ? ', ' + country : ''}`);
          setWeather({
            ...(weather ?? {
              temp: 38,
              humidity: 55,
              windSpeed: 22,
              rainfall: 0,
              condition: 'Clear',
            }),
            location: city,
          } as any);
        } catch {
          // keep default
        }
        setLocating(false);
      },
      () => {
        // Permission denied – keep Dubai default
        setLocating(false);
      },
      { timeout: 8000 }
    );
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!weather) return null;

  return (
    <div className="min-h-screen text-slate-100 selection:bg-cyan-neon/30">
      <WeatherBackground />
      <EmergencyOverlay />

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/30 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-neon/20 rounded-xl border border-cyan-neon/50 flex items-center justify-center">
              <Cpu className="text-cyan-neon" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Aegis</h1>
              <p className="text-[10px] font-bold text-cyan-neon uppercase tracking-[0.2em] mt-0.5">
                Climate Intelligence OS
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest opacity-60">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="hover:text-cyan-neon hover:opacity-100 transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <NotificationsPanel />

            <button
              className="md:hidden p-2 glass rounded-lg border border-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-1">
                <MapPin size={12} className="text-cyan-neon" />
                <p className="text-xs font-bold uppercase">{locationLabel}</p>
              </div>
              <p className="text-[10px] opacity-40 uppercase">
                {locating ? 'Detecting location…' : 'Live Monitoring'}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setMobileOpen(false);
                }}
                className="text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-cyan-neon transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── Main Content ───────────────────────────────────── */}
      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* ── Left Column ──────────────────────────────── */}
          <div className="lg:col-span-8 space-y-8">

            {/* Weather Metrics */}
            <section id="predictions" className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

            {/* Risk Map */}
            <section>
              <RiskMap />
            </section>

            {/* Resilience + Simulation */}
            <section className="grid md:grid-cols-2 gap-8">
              {/* Resilience Score */}
              <div id="community" className="glass p-8 rounded-[2rem] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <ShieldCheck className="text-toxic-neon" />
                  Community Resilience
                </h3>
                <div className="flex items-end gap-4 mb-6">
                  <h4 className="text-6xl font-black text-glow text-toxic-neon">
                    {preparednessScore}%
                  </h4>
                  <div className="mb-2">
                    <p className="text-xs font-bold uppercase opacity-40">Resilience Score</p>
                    <p className="text-xs font-bold text-toxic-neon uppercase">Dubai, UAE</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${preparednessScore}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-toxic-neon/50 to-toxic-neon shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    />
                  </div>
                  <p className="text-sm opacity-60">
                    Based on Dubai Civil Defence shelter capacity, drainage infrastructure
                    ratings, and resident preparedness plans.
                  </p>
                </div>
              </div>

              <SimulationControls />
            </section>
          </div>

          {/* ── Right Column ─────────────────────────────── */}
          <div className="lg:col-span-4 space-y-8">
            <RiskPanel />
            <PreparednessAssistant />

            {/* System Status */}
            <div className="glass p-6 rounded-3xl border border-white/5 text-center">
              <p className="text-xs font-bold uppercase opacity-40 mb-2">System Status</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-toxic-neon animate-pulse" />
                <span className="text-sm font-mono uppercase">All Nodes Operational</span>
              </div>
              <p className="text-[10px] opacity-30 mt-2 uppercase font-bold">
                Dubai Civil Defence Integration · Active
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-slate-950/40 backdrop-blur-md py-10 relative z-10 no-print">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs opacity-40 uppercase tracking-widest font-bold">
            &copy; 2026 Aegis Resilience Network | WeatherWise Hack Submission
          </p>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest opacity-40">
            <span>Dubai, UAE</span>
            <span>Lat 25.07 · Long 55.30</span>
            <a href="https://github.com/mihika-3159/Aegis" target="_blank" rel="noreferrer" className="hover:opacity-100">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
