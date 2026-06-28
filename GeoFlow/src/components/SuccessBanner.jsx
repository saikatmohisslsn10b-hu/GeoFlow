import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessBanner({ message = 'Map Generated Successfully', sub = 'Processing Completed' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="success-banner rounded-xl px-5 py-3.5 flex items-center gap-3 mb-5"
    >
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-emerald-800">{message}</p>
        <p className="text-xs text-emerald-600">{sub} — Ready for Download</p>
      </div>
    </motion.div>
  );
}