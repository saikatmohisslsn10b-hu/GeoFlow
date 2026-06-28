import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

export default function HelpSection({ title, steps, infoBox, onShowSample }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card-blue rounded-2xl overflow-hidden mb-6">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-blue-50/30 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-semibold text-blue-800 text-sm">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-blue-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-400" />
        )}
      </button>

      {/* Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 space-y-4">
              {/* Steps */}
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed">
                      {step.text}
                      {step.example && (
                        <div className="mt-1.5 bg-white/60 rounded-lg px-3 py-2 text-xs font-mono text-slate-500 border border-blue-100">
                          {step.example}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Info box */}
              {infoBox && (
                <div className="flex gap-3 bg-amber-50/80 border border-amber-200/60 rounded-xl px-4 py-3">
                  <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700 leading-relaxed">{infoBox}</p>
                </div>
              )}

              {/* Sample dataset button */}
              {onShowSample && (
                <button
                  onClick={onShowSample}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2 transition"
                >
                  <span className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center text-xs">📦</span>
                  Show Example Dataset
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}