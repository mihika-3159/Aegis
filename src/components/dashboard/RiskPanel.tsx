'use client';

import { useAegisStore } from '@/store/useAegisStore';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export const RiskPanel = () => {
  const risks = useAegisStore((state) => state.risks);
  const isEmergency = useAegisStore((state) => state.isEmergencyMode);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tighter">
          <Activity className="text-cyan-neon" />
          Active Risk Intelligence
        </h2>
        {risks.length === 0 && (
          <div className="flex items-center gap-2 text-toxic-neon text-sm font-medium px-3 py-1 bg-toxic-neon/10 rounded-full border border-toxic-neon/20">
            <ShieldCheck size={16} />
            System Secure
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {risks.map((risk, index) => (
          <motion.div
            key={risk.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass p-5 rounded-2xl border-l-4 ${
              risk.severity === 'extreme' || risk.severity === 'high' 
                ? 'border-l-danger-neon' 
                : 'border-l-amber-neon'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                  risk.severity === 'extreme' || risk.severity === 'high' 
                    ? 'bg-danger-neon/20 text-danger-neon' 
                    : 'bg-amber-neon/20 text-amber-neon'
                }`}>
                  {risk.severity} risk
                </span>
                <h4 className="text-lg font-bold mt-1 capitalize">{risk.type} Potential</h4>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-50 uppercase">Probability</p>
                <p className="text-xl font-mono font-bold text-glow">
                  {(risk.probability * 100).toFixed(0)}%
                </p>
              </div>
            </div>
            
            <p className="text-sm opacity-70 mb-4">{risk.impactExplanation}</p>
            
            <div className="bg-white/5 p-3 rounded-xl flex items-start gap-3 border border-white/5">
              <AlertTriangle className="text-amber-neon shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-bold uppercase opacity-50">Aegis Recommendation</p>
                <p className="text-sm">{risk.recommendation}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
