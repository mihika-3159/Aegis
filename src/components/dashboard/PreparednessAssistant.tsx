'use client';

import { motion } from 'framer-motion';
import { Bot, ChevronRight, ClipboardCheck, Zap } from 'lucide-react';
import { useState } from 'react';

const defaultGuides = [
  { title: 'Household Readiness', items: ['Water (3 gal/person)', 'Non-perishable food', 'Flashlight + Batteries'] },
  { title: 'Evacuation Protocol', items: ['Identify high ground', 'Secure windows/doors', 'Check on neighbors'] },
  { title: 'Digital Backup', items: ['Scan vital documents', 'External battery packs', 'Offline maps download'] }
];

export const PreparednessAssistant = () => {
  const [activeGuide, setActiveGuide] = useState<number | null>(null);

  return (
    <div className="glass p-6 rounded-3xl border-cyan-neon/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-neon/10 rounded-lg">
          <Bot className="text-cyan-neon" size={20} />
        </div>
        <div>
          <h3 className="font-bold uppercase tracking-tighter">AI Preparedness Assistant</h3>
          <p className="text-[10px] text-cyan-neon font-bold uppercase tracking-widest">Active: Gemini Core 2.0</p>
        </div>
      </div>

      <div className="space-y-4">
        {defaultGuides.map((guide, i) => (
          <div key={i} className="group">
            <button 
              onClick={() => setActiveGuide(activeGuide === i ? null : i)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-neon/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <ClipboardCheck size={18} className={activeGuide === i ? 'text-cyan-neon' : 'opacity-40'} />
                <span className="font-medium">{guide.title}</span>
              </div>
              <ChevronRight size={16} className={`transition-transform ${activeGuide === i ? 'rotate-90 text-cyan-neon' : 'opacity-40'}`} />
            </button>
            
            {activeGuide === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="overflow-hidden"
              >
                <div className="p-4 mt-2 bg-cyan-neon/5 rounded-xl border border-cyan-neon/10 space-y-2">
                  {guide.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-neon" />
                      {item}
                    </div>
                  ))}
                  <button className="mt-4 w-full py-2 bg-cyan-neon/10 hover:bg-cyan-neon/20 text-cyan-neon text-xs font-bold rounded-lg border border-cyan-neon/20 flex items-center justify-center gap-2 transition-all">
                    <Zap size={14} />
                    Generate Personalized Plan
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-cyan-neon/10 to-transparent border border-cyan-neon/20">
        <p className="text-xs italic opacity-70">
          "Aegis has analyzed your local topography. You are 14m above sea level with a 12% slope. Recommended: Reinforce North-facing windows."
        </p>
      </div>
    </div>
  );
};
