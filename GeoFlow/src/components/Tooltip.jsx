import { Info } from 'lucide-react';

export default function Tooltip({ text }) {
  if (!text) return null;
  return (
    <span className="tooltip-container ml-1.5">
      <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-help transition" />
      <span className="tooltip-content">{text}</span>
    </span>
  );
}