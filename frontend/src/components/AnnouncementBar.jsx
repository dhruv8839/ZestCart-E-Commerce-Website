import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'nw_announce_bar_dismiss';

/** Slim promo strip — dismiss hides until the tab is reopened (session). */

export default function AnnouncementBar() {
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const dismiss = useCallback(() => {
    setHidden(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  if (hidden) return null;

  return (
    <div className="relative z-50 border-b border-brand-900/20 bg-gradient-to-r from-brand-900 to-brand-700 px-4 py-2 pr-11 text-center text-xs font-medium text-brand-50 sm:pr-14 sm:text-sm">
      <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <strong className="font-semibold tracking-wide uppercase text-brand-100">
          Spring demo drop
        </strong>
        <span aria-hidden>|</span>
        <Link
          to="/products?sale=true"
          className="underline decoration-brand-300 underline-offset-2 transition hover:text-white"
        >
          Shop sale picks
        </Link>
      </span>
      <button
        type="button"
        className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 rounded-md px-2 py-1 text-lg leading-none text-brand-50 opacity-80 transition hover:bg-white/10 hover:opacity-100 sm:right-3"
        onClick={dismiss}
        aria-label="Close announcement"
      >
        ×
      </button>
    </div>
  );
}
