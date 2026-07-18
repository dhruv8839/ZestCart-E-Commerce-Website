import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import { Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

/** Storefront footer */

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  function handleSubscribe(ev) {
    ev.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast(`Thanks for subscribing! We'll stay in touch.`, 'info');
    setEmail('');
  }

  return (
    <footer className="relative mt-auto border-t border-white/10 bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(167,139,250,0.1),transparent_50%)] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl lg:col-span-5">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-300">
                  Stay in the loop
                </p>
              </div>
              <p className="mt-6 text-base font-medium leading-relaxed text-slate-300">
                Get exclusive drops, behind-the-scenes content, and ultra-premium offers straight to your inbox.
              </p>
              <form
                className="mt-8 flex flex-col gap-3 sm:flex-row"
                onSubmit={handleSubscribe}
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email
                </label>
                <input
                  id="footer-email"
                  name="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full flex-1 rounded-2xl border border-white/20 bg-black/20 px-5 py-4 text-sm text-white shadow-inner outline-none placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/50 backdrop-blur-md transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 px-8 py-4 text-sm font-bold text-white shadow-[0_0_30px_-5px_rgba(56,189,248,0.5)] transition-all hover:shadow-[0_0_50px_-10px_rgba(56,189,248,0.7)]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  Subscribe <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </form>
            </div>
          </div>
          <div className="grid flex-1 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-brand-400 to-brand-600 text-lg font-black text-white shadow-glow hover:scale-105 transition-transform">
                  Z
                </span>
                <span className="text-2xl font-black tracking-tight text-white">
                  Zest<span className="text-transparent bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text">Cart</span>
                </span>
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-slate-400">
                A premium commerce experience beyond imagination. Hand-selected for the finest taste.
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Explore</p>
              <ul className="mt-5 space-y-4 text-sm text-slate-400">
                <li>
                  <Link className="transition-all hover:text-brand-400 hover:tracking-wide" to="/products">
                    The Catalog
                  </Link>
                </li>
                <li>
                  <Link className="transition-all hover:text-brand-400 hover:tracking-wide" to="/products?sort=newest">
                    Latest Drops
                  </Link>
                </li>
                <li>
                  <Link className="transition-all hover:text-brand-400 hover:tracking-wide" to="/products?sale=true">
                    Exclusive Deals
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Client Care</p>
              <ul className="mt-5 space-y-4 text-sm text-slate-400">
                <li><Link className="transition-all hover:text-brand-400 hover:tracking-wide" to="/help">Concierge</Link></li>
                <li><Link className="transition-all hover:text-brand-400 hover:tracking-wide" to="/returns">Returns</Link></li>
                <li><Link className="transition-all hover:text-brand-400 hover:tracking-wide" to="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} ZestCart. Engineered for perfection.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-brand-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-brand-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
