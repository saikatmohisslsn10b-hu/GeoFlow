import { motion } from 'framer-motion';
import { Map } from 'lucide-react';

export default function LoadingScreen({ message = 'Generating Map...', waterTheme = false }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-md"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Loader */}
        <div className="relative">
          <div className="gis-loader" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Map className={`w-6 h-6 ${waterTheme ? 'text-cyan-500' : 'text-blue-500'}`} />
          </div>
          {/* Pulsing rings */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-blue-300"
          />
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 rounded-full border-2 border-cyan-300"
          />
        </div>

        {/* Water waves for hydrograph */}
        {waterTheme && (
          <div className="flex gap-2 w-48 h-3 overflow-hidden rounded-full bg-cyan-50">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="water-wave h-full w-full rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
              />
            ))}
          </div>
        )}

        {/* Text */}
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-700 mb-1">{message}</p>
          <p className="text-sm text-slate-400">GIS Processing in Progress</p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full progress-bar rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '90%' }}
            transition={{ duration: 8, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}