import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* GIS Illustration */}
      <div className="relative w-48 h-48 mb-6">
        <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
          {/* Grid lines */}
          {[0, 40, 80, 120, 160, 200].map((v) => (
            <g key={v}>
              <line x1={v} y1="0" x2={v} y2="200" stroke="#3b82f6" strokeWidth="0.5" />
              <line x1="0" y1={v} x2="200" y2={v} stroke="#3b82f6" strokeWidth="0.5" />
            </g>
          ))}
          {/* Contour ellipses */}
          <ellipse cx="100" cy="100" rx="80" ry="60" fill="none" stroke="#3b82f6" strokeWidth="1" />
          <ellipse cx="100" cy="100" rx="60" ry="45" fill="none" stroke="#3b82f6" strokeWidth="1" />
          <ellipse cx="100" cy="100" rx="40" ry="30" fill="none" stroke="#3b82f6" strokeWidth="1" />
          <ellipse cx="100" cy="100" rx="20" ry="15" fill="none" stroke="#3b82f6" strokeWidth="1" />
          {/* Land patches */}
          <rect x="20" y="20" width="40" height="30" rx="4" fill="#3b82f6" opacity="0.15" />
          <rect x="140" y="30" width="35" height="45" rx="4" fill="#10b981" opacity="0.15" />
          <rect x="30" y="140" width="50" height="35" rx="4" fill="#f59e0b" opacity="0.15" />
          <circle cx="155" cy="150" r="18" fill="#06b6d4" opacity="0.15" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
            <MapPin className="w-7 h-7 text-slate-300" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-700 mb-2">No Map Generated Yet</h3>
      <p className="text-sm text-slate-400 max-w-xs">
        Upload your data and click Generate to begin analysis.
      </p>
    </motion.div>
  );
}