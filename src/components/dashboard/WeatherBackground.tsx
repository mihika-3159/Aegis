'use client';

import { useAegisStore } from '@/store/useAegisStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const WeatherBackground = () => {
  const weather = useAegisStore((state) => state.weather);
  const isEmergency = useAegisStore((state) => state.isEmergencyMode);

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

  return (
    <div className={`fixed inset-0 bg-gradient-to-br ${getColors()} transition-colors duration-1000`}>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="scanline" />
      </div>
      
      {/* Dynamic Weather Particles (Simplified Mock) */}
      <AnimatePresence>
        {(weather.condition.includes('Rain') || weather.condition.includes('Cyclone')) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 overflow-hidden"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-blue-400/30 w-0.5 h-10 rounded-full"
                initial={{ top: -100, left: `${Math.random() * 100}%` }}
                animate={{ 
                  top: '120%', 
                  left: `${(Math.random() * 100) + (weather.windSpeed / 5)}%` 
                }}
                transition={{ 
                  duration: Math.random() * 0.5 + 0.5, 
                  repeat: Infinity, 
                  ease: 'linear',
                  delay: Math.random() * 2
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
