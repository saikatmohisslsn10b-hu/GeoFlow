import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Send, X } from 'lucide-react';

const welcomeMessage = {
  id: 0,
  role: 'assistant',
  content: 'Demo mode: GeoFlow AI is a frontend interface for now. Its AI backend is not connected in the production deployment.',
};

// Keep the temporary response in one place so it can later be replaced by an API request.
function createDemoResponse() {
  return {
    role: 'assistant',
    content: 'Demo response: The GeoFlow AI backend is not connected in production yet, so this is not a live AI-generated answer.',
  };
}

function DishaMascot({ className = '', animate = true }) {
  const prefersReducedMotion = useReducedMotion();
  const floatAnimation = animate && !prefersReducedMotion
    ? {
        x: [0, -18, 20, 0, 0, 0, 0, 0, 18, -20, 0],
        y: [0, 0, 0, 0, -12, 12, -24, 8, 0, 0, 0],
      }
    : undefined;
  const blinkAnimation = animate ? { ry: [4.5, 4.5, 0.7, 4.5, 4.5] } : undefined;

  return (
    <motion.svg
      viewBox="0 0 84 94"
      className={className}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
      focusable="false"
    >
      <motion.g animate={floatAnimation} transition={{ duration: 9, ease: 'easeInOut', times: [0, 0.1, 0.2, 0.3, 0.42, 0.52, 0.62, 0.68, 0.78, 0.88, 1], repeat: Infinity }}>
        <ellipse cx="42" cy="88" rx="23" ry="4" fill="#bfdbfe" opacity="0.65" />

        <path d="M27 75 L21 82" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
        <path d="M57 75 L63 82" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
        <path d="M18 56 C10 57, 10 66, 16 68" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
        <circle cx="16" cy="68" r="3.5" fill="#fbbf24" />
        <path d="M66 56 C74 55, 75 47, 70 44" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
        <path d="M70 44 L75 40 M70 44 L75 47" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />

        <rect x="18" y="43" width="48" height="37" rx="16" fill="#2563eb" />
        <path d="M22 61 C31 57, 38 65, 47 60 C54 56, 59 58, 62 60 L62 68 C54 66, 51 70, 44 71 C35 73, 30 66, 22 70 Z" fill="#38bdf8" opacity="0.85" />
        <rect x="28" y="54" width="28" height="17" rx="5" fill="#eff6ff" />
        <path d="M32 57 L38 57 L42 63 L47 58 L52 58" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M34 67 L34 61 M42 68 L42 63 M50 67 L50 61" stroke="#93c5fd" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="47" cy="58" r="2" fill="#10b981" />

        <path d="M42 12 L42 7" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
        <circle cx="42" cy="5" r="3.5" fill="#fbbf24" />
        <rect x="12" y="12" width="60" height="39" rx="20" fill="#3b82f6" />
        <rect x="17" y="17" width="50" height="29" rx="15" fill="#dbeafe" />
        <circle cx="25" cy="35" r="3.5" fill="#93c5fd" opacity="0.65" />
        <circle cx="59" cy="35" r="3.5" fill="#93c5fd" opacity="0.65" />
        <motion.ellipse cx="32" cy="30" rx="4.5" ry="4.5" fill="#1e3a8a" animate={blinkAnimation} transition={{ duration: 5.5, times: [0, 0.44, 0.5, 0.56, 1], repeat: Infinity }} />
        <motion.ellipse cx="52" cy="30" rx="4.5" ry="4.5" fill="#1e3a8a" animate={blinkAnimation} transition={{ duration: 5.5, times: [0, 0.44, 0.5, 0.56, 1], repeat: Infinity }} />
        <circle cx="33.5" cy="28.5" r="1.2" fill="white" />
        <circle cx="53.5" cy="28.5" r="1.2" fill="white" />
        <path d="M35 38 C39 42, 45 42, 49 38" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" />
      </motion.g>
    </motion.svg>
  );
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([welcomeMessage]);
  const messageId = useRef(1);
  const conversationEndRef = useRef(null);
  const chatbotRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      conversationEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!chatbotRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const content = draft.trim();

    if (!content) return;

    const userMessage = { id: messageId.current++, role: 'user', content };
    const demoReply = { id: messageId.current++, ...createDemoResponse() };

    setMessages((currentMessages) => [...currentMessages, userMessage, demoReply]);
    setDraft('');
  };

  return (
    <div ref={chatbotRef} className="fixed bottom-4 right-4 z-[110] flex flex-col items-end gap-2">
      {isOpen && (
        <section
          aria-label="GeoFlow AI demo chat"
          className="absolute bottom-16 right-0 flex h-[26rem] max-h-[calc(100dvh-6.5rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl shadow-slate-900/15 sm:w-96"
        >
          <header className="flex items-center justify-between border-b border-blue-100 bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-8 items-center justify-center">
                <DishaMascot className="h-10 w-9" animate={false} />
              </div>
              <div>
                <h2 className="text-sm font-bold">Disha</h2>
                <p className="text-[11px] text-blue-100">Your AI Assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-white/85 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
              aria-label="Close GeoFlow AI chat"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </header>

          <div className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-[11px] leading-relaxed text-amber-800">
            Demo mode — the AI backend is not connected in production.
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-blue-600 text-white'
                      : 'rounded-bl-md border border-slate-200 bg-white text-slate-600 shadow-sm'
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
            <div ref={conversationEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
            <label className="sr-only" htmlFor="geoflow-ai-message">Message GeoFlow AI</label>
            <input
              id="geoflow-ai-message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a message..."
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!draft.trim()}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      {!isOpen && (
        <div className="relative max-w-[calc(100vw-2rem)] rounded-xl border border-blue-100 bg-white/95 px-3 py-2 text-right shadow-md shadow-slate-900/5 backdrop-blur-sm">
          <p className="text-xs font-semibold text-slate-700">Hi! I&apos;m Disha 👋</p>
          <p className="mt-0.5 text-[11px] font-medium text-blue-600">Your AI Assistant</p>
          <span className="absolute -bottom-1 right-6 h-2 w-2 rotate-45 border-b border-r border-blue-100 bg-white" aria-hidden="true" />
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`flex items-center justify-center ${
          isOpen
            ? 'h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/35 focus:outline-none focus:ring-4 focus:ring-blue-200'
            : 'group h-[64px] w-[58px] cursor-pointer border-0 bg-transparent p-0 outline-none transition duration-300 hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-0 focus:shadow-none sm:h-[76px] sm:w-[68px]'
        }`}
        aria-label={isOpen ? 'Close GeoFlow AI chat' : 'Open GeoFlow AI chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <DishaMascot className="h-full w-full drop-shadow-[0_8px_8px_rgba(37,99,235,0.2)]" />}
      </button>
    </div>
  );
}
