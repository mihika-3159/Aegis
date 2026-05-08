'use client';

import { useAegisStore } from '@/store/useAegisStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, MapPin, Phone, ShieldAlert, X } from 'lucide-react';

export const EmergencyOverlay = () => {
  const { isEmergencyMode, toggleEmergencyMode, risks } = useAegisStore();

  if (!isEmergencyMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/40 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-4xl glass-danger rounded-[2rem] overflow-hidden shadow-2xl border-2 border-danger-neon/50"
      >
        <div className="bg-danger-neon p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-white animate-pulse" size={32} />
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Critical Alert: Emergency Mode Active</h2>
              <p className="text-white/80 text-sm font-bold uppercase tracking-widest">Life-Safety Protocols Initiated</p>
            </div>
          </div>
          <button 
            onClick={() => toggleEmergencyMode(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="text-danger-neon" />
                Immediate Action Required
              </h3>
              <div className="space-y-3">
                {risks.map((risk, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="font-bold text-danger-neon uppercase text-xs">{risk.type} emergency</p>
                    <p className="text-lg font-bold">{risk.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <MapPin className="text-cyan-neon" />
                Nearest Safe Zones
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between text-sm">
                  <span>Coastal Community Shelter</span>
                  <span className="font-mono text-cyan-neon">1.2km</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span>Central Medical Hub</span>
                  <span className="font-mono text-cyan-neon">3.5km</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-danger-neon/10 rounded-2xl border border-danger-neon/20">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Phone className="text-danger-neon" />
                Emergency Contacts
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <p className="text-[10px] uppercase opacity-50">Local Rescue</p>
                  <p className="text-xl font-bold font-mono">911</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <p className="text-[10px] uppercase opacity-50">Aegis Response</p>
                  <p className="text-xl font-bold font-mono">#99</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="font-bold mb-4 text-sm uppercase opacity-50">Survival Quick-Guide</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-cyan-neon/20 text-cyan-neon flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  Gather emergency go-bag with water and documents.
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-cyan-neon/20 text-cyan-neon flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  Disable gas and main power lines if evacuating.
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-cyan-neon/20 text-cyan-neon flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  Stay tuned to Aegis Low-Bandwidth frequency.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white/5 border-t border-white/10 text-center">
          <button 
            className="px-8 py-3 bg-danger-neon text-white font-bold rounded-xl hover:bg-danger-neon/80 transition-colors shadow-lg shadow-danger-neon/20"
            onClick={() => window.print()}
          >
            Offline Export (PDF)
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
