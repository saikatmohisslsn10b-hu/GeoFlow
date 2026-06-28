import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStats } from '../context/StatsContext';
import { FileUp, Map, Clock, HardDrive } from 'lucide-react';

function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) { setDisplay(0); return; }
    const step = Math.max(1, Math.ceil(end / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { start = end; clearInterval(timer); }
      setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return <span className="stat-number font-bold text-slate-800">{display}{suffix}</span>;
}

const statItems = [
  { key: 'filesUploaded', label: 'Files Uploaded', icon: FileUp, suffix: '', color: 'blue' },
  { key: 'mapsGenerated', label: 'Maps Generated', icon: Map, suffix: '', color: 'emerald' },
  { key: 'processingTime', label: 'Processing Time', icon: Clock, suffix: 's', color: 'amber' },
  { key: 'outputSize', label: 'Output Size', icon: HardDrive, suffix: ' KB', color: 'violet' },
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  violet: 'bg-violet-50 text-violet-600',
};

export default function StatsSidebar() {
  const { stats } = useStats();

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4 sticky top-24">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Project Statistics</h3>
      <div className="space-y-3">
        {statItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[item.color]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 truncate">{item.label}</p>
                <AnimatedNumber value={stats[item.key]} suffix={item.suffix} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}