'use client';

import { useAegisStore } from '@/store/useAegisStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

// Fixed rain particle positions generated once – avoids hydration mismatch
const RAIN_PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  startLeft: (i * 2.05 + 1.3) % 100,
  endLeft: ((i * 2.05 + 1.3) + 3.5) % 105,
  duration: 0.6 + (i % 5) * 0.12,
  delay: (i % 10) * 0.2,
}));

export const WeatherBackground = () => {
  const weather = useAegisStore((state) => state.weather);
  const isEmergency = useAegisStore((state) => state.isEmergencyMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!weather) return <div className="fixed inset-0 bg-slate-950" />;

  const getColors = () => {
    if (isEmergency) return 'from-red-950 via-slate-950 to-slate-950';
    switch (weather.condition.toLowerCase()) {
      case 'torrential rain':
      case 'storm':
        return 'from-blue-950 via-slate-950 to-slate-950';
      case 'extreme heat':
        return 'from-orange-950 via-slate-950 to-slate-950';
      case 'category 5 cyclone':
        return 'from-purple-950 via-slate-950 to-slate-950';
      default:
        return 'from-slate-900 via-slate-950 to-slate-950';
    }
  };

  const showRain =
    mounted &&
    (weather.condition.includes('Rain') || weather.condition.includes('Cyclone'));

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br ${getColors()} transition-colors duration-1000`}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="scanline" />
      </div>

      <AnimatePresence>
        {showRain && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            {RAIN_PARTICLES.map((p) => (
              <motion.div
                key={p.id}
                className="absolute bg-blue-400/30 w-0.5 h-10 rounded-full"
                initial={{ top: '-5%', left: `${p.startLeft}%` }}
                animate={{ top: '110%', left: `${p.endLeft}%` }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: p.delay,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05),transparent_70%)]" />
    </div>
  );
};
