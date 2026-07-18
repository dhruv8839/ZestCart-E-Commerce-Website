/**
 * Lightweight toast stack — no external UI library (Tailwind-only).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const ToastContext = createContext(null);

const MAX_VISIBLE = 3;
const AUTO_DISMISS_MS = 4200;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
  }, []);

  /** Show a short-lived message banner (portfolio-friendly feedback). */
  const showToast = useCallback((message, variant = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((list) =>
      [...list, { id, message: String(message), variant }].slice(-MAX_VISIBLE)
    );
    const timeoutId = window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    timers.current.set(id, timeoutId);
    return id;
  }, [dismiss]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
    },
    []
  );

  const value = useMemo(() => ({ showToast, dismiss }), [showToast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 left-0 right-0 z-[100] flex flex-col items-center gap-3 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((t, i) => (
          <div
            key={t.id}
            className="pointer-events-auto w-full max-w-sm animate-[fade-slide-in_220ms_ease-out_forwards]"
            style={{ opacity: 0, animationDelay: `${i * 60}ms` }}
          >
            <div
              className={[
                'flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-elevated backdrop-blur-md',
                t.variant === 'error'
                  ? 'border-red-200 bg-red-50/95 text-red-950 dark:border-red-500/30 dark:bg-red-950/80 dark:text-red-100'
                  : t.variant === 'info'
                    ? 'border-slate-200 bg-white/95 text-slate-900 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100'
                    : 'border-brand-200 bg-brand-50/95 text-brand-950 dark:border-brand-500/30 dark:bg-brand-950/80 dark:text-brand-100',
              ].join(' ')}
            >
              <p className="flex-1 text-sm font-medium leading-snug">{t.message}</p>
              <button
                type="button"
                className="-m-1 rounded-lg p-1 text-xs font-semibold opacity-70 transition hover:opacity-100"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fade-slide-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
