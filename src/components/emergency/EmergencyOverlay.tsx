'use client';

import { useAegisStore } from '@/store/useAegisStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, MapPin, Phone, ShieldAlert, X, Printer } from 'lucide-react';
import { useRef } from 'react';

export const EmergencyOverlay = () => {
  const { isEmergencyMode, toggleEmergencyMode, risks } = useAegisStore();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isEmergencyMode) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !printRef.current) return;

    const content = printRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Aegis Emergency Protocol – Dubai, UAE</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; color: #000; background: #fff; padding: 32px; font-size: 13px; line-height: 1.5; }
            h1 { font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; margin-bottom: 4px; }
            h2 { font-size: 16px; font-weight: 700; margin: 20px 0 8px; display: flex; align-items: center; gap: 8px; }
            h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; opacity: 0.5; margin-bottom: 8px; }
            p { margin-bottom: 6px; }
            .header { border-bottom: 3px solid #ef4444; padding-bottom: 16px; margin-bottom: 24px; }
            .badge { background: #ef4444; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 900; text-transform: uppercase; display: inline-block; margin-bottom: 6px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
            .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; }
            .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
            .contact-item { border: 1px solid #ddd; border-radius: 8px; padding: 12px; text-align: center; }
            .contact-number { font-size: 28px; font-weight: 900; font-family: monospace; }
            .contact-label { font-size: 10px; text-transform: uppercase; opacity: 0.5; }
            .shelter-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee; }
            .shelter-dist { font-family: monospace; font-weight: bold; color: #ef4444; }
            ol { padding-left: 20px; }
            ol li { margin-bottom: 6px; }
            .risk-item { border-left: 4px solid #ef4444; padding: 10px 12px; margin-bottom: 10px; border-radius: 0 8px 8px 0; background: #fff5f5; }
            .risk-type { font-size: 10px; text-transform: uppercase; font-weight: 900; color: #ef4444; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 11px; opacity: 0.5; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <p class="badge">🚨 Critical Alert – Emergency Protocol</p>
            <h1>Aegis Climate Resilience Platform</h1>
            <p style="font-size:12px;opacity:0.6">Dubai, UAE · Generated: ${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}</p>
          </div>

          <div class="grid">
            <div>
              <h2>⚠️ Immediate Action Required</h2>
              ${risks.map(r => `
                <div class="risk-item">
                  <p class="risk-type">${r.type} emergency</p>
                  <p style="font-weight:700;margin-top:4px">${r.recommendation}</p>
                  <p style="opacity:0.6;font-size:12px;margin-top:4px">${r.impactExplanation}</p>
                </div>
              `).join('')}

              <h2>📍 Nearest Safe Zones</h2>
              <div class="card">
                <div class="shelter-item"><span>Dubai Civil Defence HQ</span><span class="shelter-dist">3.2km</span></div>
                <div class="shelter-item"><span>Rashid Hospital</span><span class="shelter-dist">5.8km</span></div>
                <div class="shelter-item"><span>Dubai World Trade Centre</span><span class="shelter-dist">7.1km</span></div>
                <div class="shelter-item" style="border:none"><span>Dubai Airport Terminal 3</span><span class="shelter-dist">10.4km</span></div>
              </div>
            </div>

            <div>
              <h2>📞 Emergency Contacts</h2>
              <div class="contact-grid">
                <div class="contact-item">
                  <p class="contact-label">Police / Emergency</p>
                  <p class="contact-number">999</p>
                </div>
                <div class="contact-item">
                  <p class="contact-label">Civil Defence</p>
                  <p class="contact-number">997</p>
                </div>
                <div class="contact-item">
                  <p class="contact-label">Ambulance</p>
                  <p class="contact-number">998</p>
                </div>
                <div class="contact-item">
                  <p class="contact-label">Aegis Response</p>
                  <p class="contact-number">#99</p>
                </div>
              </div>

              <h2 style="margin-top:24px">📋 Survival Quick-Guide</h2>
              <div class="card">
                <ol>
                  <li>Gather emergency go-bag with water (3L/person), documents, and medication.</li>
                  <li>Disable gas supply and main power lines before evacuating.</li>
                  <li>Keep mobile charged. Save emergency numbers offline.</li>
                  <li>Follow Dubai Civil Defence evacuation routes — avoid underpasses.</li>
                  <li>Check in with neighbours, especially elderly or isolated residents.</li>
                  <li>Stay tuned to Dubai Media Office and Aegis for live updates.</li>
                </ol>
              </div>
            </div>
          </div>

          <div class="footer">
            Aegis Climate Resilience Platform · WeatherWise Hack 2026 · This document is valid for the emergency period only.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <AnimatePresence>
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
          {/* Header */}
          <div className="bg-danger-neon p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-white animate-pulse" size={32} />
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                  Critical Alert: Emergency Mode Active
                </h2>
                <p className="text-white/80 text-sm font-bold uppercase tracking-widest">
                  Life-Safety Protocols Initiated · Dubai, UAE
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleEmergencyMode(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close emergency overlay"
            >
              <X className="text-white" size={24} />
            </button>
          </div>

          {/* Content */}
          <div ref={printRef} className="p-8 grid md:grid-cols-2 gap-8">
            {/* Left */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="text-danger-neon" />
                  Immediate Action Required
                </h3>
                <div className="space-y-3">
                  {risks.length === 0 ? (
                    <p className="opacity-60 text-sm">No active emergency risks detected. All zones stable.</p>
                  ) : (
                    risks.map((risk, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="font-bold text-danger-neon uppercase text-xs">{risk.type} emergency</p>
                        <p className="text-base font-bold mt-1">{risk.recommendation}</p>
                        <p className="text-sm opacity-60 mt-1">{risk.impactExplanation}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <MapPin className="text-cyan-neon" />
                  Nearest Safe Zones · Dubai
                </h3>
                <ul className="space-y-3">
                  {[
                    { name: 'Dubai Civil Defence HQ', dist: '3.2km' },
                    { name: 'Rashid Hospital', dist: '5.8km' },
                    { name: 'Dubai World Trade Centre', dist: '7.1km' },
                    { name: 'Dubai Airport Terminal 3', dist: '10.4km' },
                  ].map((s) => (
                    <li key={s.name} className="flex justify-between text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <span>{s.name}</span>
                      <span className="font-mono text-cyan-neon">{s.dist}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <div className="p-6 bg-danger-neon/10 rounded-2xl border border-danger-neon/20">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Phone className="text-danger-neon" />
                  Emergency Contacts · UAE
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Police / Emergency', number: '999' },
                    { label: 'Civil Defence', number: '997' },
                    { label: 'Ambulance', number: '998' },
                    { label: 'Aegis Response', number: '#99' },
                  ].map((c) => (
                    <div key={c.label} className="p-3 bg-white/5 rounded-lg text-center">
                      <p className="text-[10px] uppercase opacity-50">{c.label}</p>
                      <p className="text-2xl font-bold font-mono">{c.number}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <h4 className="font-bold mb-4 text-sm uppercase opacity-50">Survival Quick-Guide</h4>
                <ul className="space-y-3 text-sm">
                  {[
                    'Gather go-bag: water (3L/person), documents, medication.',
                    'Disable gas and main power before evacuating.',
                    'Follow Dubai Civil Defence evacuation routes — avoid underpasses.',
                    'Check in on elderly or isolated neighbours.',
                    'Stay tuned to Dubai Media Office for live updates.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-cyan-neon/20 text-cyan-neon flex items-center justify-center text-[10px] font-bold shrink-0">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer with Print button (hidden when printing) */}
          <div className="p-4 bg-white/5 border-t border-white/10 text-center no-print">
            <button
              className="inline-flex items-center gap-2 px-8 py-3 bg-danger-neon text-white font-bold rounded-xl hover:bg-danger-neon/80 transition-colors shadow-lg shadow-danger-neon/20"
              onClick={handlePrint}
            >
              <Printer size={18} />
              Export PDF (Offline Safe)
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
