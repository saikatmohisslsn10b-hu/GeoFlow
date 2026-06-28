import { FlaskConical } from 'lucide-react';

export default function SampleDatasetButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 text-sm font-medium hover:bg-blue-50 hover:border-blue-400 transition-all"
    >
      <FlaskConical className="w-4 h-4" />
      Try Sample Dataset
    </button>
  );
}