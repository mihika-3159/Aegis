'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
}

export const MetricCard = ({ label, value, unit, icon: Icon, trend, color = 'cyan' }: MetricCardProps) => {
  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-neon border-cyan-neon/20 shadow-cyan-neon/10',
    amber: 'text-amber-neon border-amber-neon/20 shadow-amber-neon/10',
    danger: 'text-danger-neon border-danger-neon/20 shadow-danger-neon/10',
    toxic: 'text-toxic-neon border-toxic-neon/20 shadow-toxic-neon/10',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, translateY: -5 }}
      className={`glass p-6 rounded-2xl border ${colorMap[color].split(' ')[1]} flex flex-col gap-4 relative overflow-hidden group`}
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl bg-white/5 ${colorMap[color].split(' ')[0]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className="text-xs font-mono opacity-50 uppercase tracking-widest">
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium opacity-60 uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-bold mt-1">
          {value}
          <span className="text-lg ml-1 opacity-40 font-normal">{unit}</span>
        </h3>
      </div>

      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-${color}-neon to-transparent w-full opacity-30`} />
    </motion.div>
  );
};
