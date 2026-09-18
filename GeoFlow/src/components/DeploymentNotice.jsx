import { useEffect } from 'react';
import { Info, X } from 'lucide-react';

export default function DeploymentNotice({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="deployment-notice-title"
        className="relative w-full max-w-lg rounded-2xl border border-blue-100 bg-white p-6 shadow-2xl shadow-slate-900/20 sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Close deployment notice"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
          <Info className="h-5 w-5 text-blue-600" aria-hidden="true" />
        </div>

        <h1 id="deployment-notice-title" className="pr-8 text-xl font-bold tracking-tight text-slate-800">
          GeoFlow Deployment Notice
        </h1>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            GeoFlow&apos;s frontend is currently available online. The backend is not deployed to AWS at this time due to cost constraints.
          </p>
          <p>
            The AI chat interface is integrated into frontend only as a proof of concept. AI chatbot backend is currently under development.
          </p>    
        </div>

        <button type="button" onClick={onClose} className="btn-gradient mt-6 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-4 focus:ring-blue-200">
          Continue to GeoFlow
        </button>
      </section>
    </div>
  );
}
