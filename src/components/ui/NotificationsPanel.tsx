'use client';

import { useState, useRef, useEffect } from 'react';
import { useAegisStore } from '@/store/useAegisStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, Info, ShieldAlert, X } from 'lucide-react';

export const NotificationsPanel = () => {
  const { notifications, markNotificationRead } = useAegisStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const iconFor = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldAlert size={16} className="text-danger-neon shrink-0" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-neon shrink-0" />;
      default: return <Info size={16} className="text-cyan-neon shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        id="notifications-btn"
        onClick={() => setOpen(!open)}
        className="p-2 glass rounded-lg border border-white/10 relative hover:border-cyan-neon/40 transition-all"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-neon rounded-full flex items-center justify-center text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-96 z-[200] glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <h3 className="font-bold uppercase tracking-tighter">Area Alerts</h3>
                <p className="text-[10px] text-cyan-neon font-bold uppercase tracking-widest">
                  Dubai, UAE · Live Intelligence
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`flex gap-3 p-4 cursor-pointer transition-colors hover:bg-white/5 ${!n.read ? 'bg-white/[0.03]' : ''}`}
                >
                  <div className="mt-0.5">{iconFor(n.severity)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold leading-tight ${!n.read ? '' : 'opacity-60'}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-cyan-neon shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs opacity-60 mt-1 leading-relaxed">{n.body}</p>
                    <p className="text-[10px] opacity-40 mt-2 font-mono">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-white/10 text-center">
              <p className="text-[10px] font-bold uppercase opacity-40">
                Tap any alert to mark as read · Dubai Civil Defence Integration
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
