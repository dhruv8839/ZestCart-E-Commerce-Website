import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { STORE_CATEGORIES } from '../catalog/categories.js';
import { fetchProducts } from '../api/client.js';
import SEO from '../components/SEO.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductGridSkeleton from '../components/ProductGridSkeleton.jsx';
import { PRODUCT_GRID_CLASS } from '../constants/productGrid.js';
import { readRecentSnapshots } from '../utils/recentStorage.js';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Marketing-forward landing with modular storytelling blocks.
 */

export default function Home() {
  const location = useLocation();
  const { showToast } = useToast();
  const [featured, setFeatured] = useState([]);
  const [deals, setDeals] = useState([]);
  const [fresh, setFresh] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [a, b, c] = await Promise.all([
          fetchProducts({ featured: true, sort: 'rating_desc' }),
          fetchProducts({ sale: true, sort: 'rating_desc' }),
          fetchProducts({ newOnly: true, sort: 'newest' }),
        ]);
        if (!cancelled) {
          setFeatured((a.products || []).slice(0, 4));
          setDeals((b.products || []).slice(0, 4));
          setFresh((c.products || []).slice(0, 4));
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load showcase modules.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const recentSnaps = useMemo(() => readRecentSnapshots(), [location.pathname]);

  function demoNewsletter(ev) {
    ev.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      showToast('Please enter a valid demo email.', 'error');
      return;
    }
    showToast(`You're on the imaginary list: ${trimmed}`, 'info');
    setEmail('');
  }

  const shopCats = STORE_CATEGORIES.filter((c) => c !== 'All');

  return (
    <div className="bg-white dark:bg-slate-950">
      <SEO
        title="Modern Commerce Demo"
        description="Shop curated demo inventory with wishlists, filters, coupons, simulated checkout, and deployment-ready architecture."
        path="/"
      />

      {/* Ultra-Premium Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[95vh] flex items-center">
        {/* Animated Background Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.15)_0%,transparent_60%)] blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="pointer-events-none absolute top-[30%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.15)_0%,transparent_60%)] blur-3xl" 
        />
        
        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.2 }}
            className="max-w-3xl space-y-8 z-10"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500"></span>
              </span>
              Next-Gen E-Commerce
            </motion.div>
            <h1 className="text-5xl font-black leading-[1.1] md:text-7xl lg:text-[5.5rem] tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500">
              Retail experiences <br /> beyond imagination.
            </h1>
            <p className="max-w-xl text-lg text-slate-400 font-medium leading-relaxed">
              Step into the future of shopping. Curated luxury, breathtaking aesthetics, and seamless performance, engineered to redefine perfection.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white px-10 py-5 text-base font-black text-slate-900 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]"
                to="/products"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                Enter the Catalog
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105"
                to="/products?sale=true"
              >
                Exclusive Deals
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
            className="relative w-full max-w-xl lg:flex-1"
          >
            <motion.div 
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="aspect-[4/3] overflow-hidden rounded-[40px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md ring-1 ring-white/20"
            >
              <img
                src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1200&h=900&q=85"
                alt="Sony Headphones"
                className="h-full w-full object-cover opacity-90 transition-transform duration-1000 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -bottom-10 lg:-left-10 right-0 rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow text-white text-xl">
                  ✨
                </div>
                <div>
                  <p className="font-bold text-white text-base">Sonic Perfection</p>
                  <p className="text-slate-300">Industry-leading noise cancellation.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category rail */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600 dark:text-brand-400">
              Discover by lifestyle
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              Shop by category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-brand-700 hover:text-brand-500 dark:text-brand-300"
          >
            View all categories →
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shopCats.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-brand-500 hover:shadow-elevated dark:border-slate-800 dark:bg-slate-900/60 dark:backdrop-blur-xl"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl transition-all duration-500 group-hover:bg-brand-500/30" />
              <p className="text-xl font-black text-slate-900 dark:text-white">{cat}</p>
              <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                Explore the collection
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand-600 transition-all duration-300 group-hover:translate-x-2 dark:text-brand-400">
                Shop now <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <ProductGridSkeleton count={4} />
        </div>
      ) : null}

      {!loading && error ? (
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-3xl border border-amber-300 bg-amber-50 p-6 text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100">
            {error}
          </div>
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <ProductShowcase
            eyebrow="Editor’s desk"
            title="Featured products"
            subtitle="High-signal SKUs we’d merchandise above the fold."
            products={featured}
            action={{ label: 'See every highlight', to: '/products?featured=true' }}
          />
          <ProductShowcase
            eyebrow="Limited-time"
            title="Deals & discounts"
            subtitle="Automatic compare-at math + bold sale badges."
            products={deals}
            tone="rose"
            action={{ label: 'Browse sale rack', to: '/products?sale=true' }}
          />
          <ProductShowcase
            eyebrow="Fresh drops"
            title="New arrivals"
            subtitle="Sorted by release metadata for true “new” storytelling."
            products={fresh}
            tone="emerald"
            action={{ label: 'Sort by newest', to: '/products?sort=newest' }}
          />
        </>
      ) : null}

      {/* Recently viewed */}
      {recentSnaps.length > 0 ? (
        <section className="border-y border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Recently viewed</h2>
              <Link to="/products" className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                Keep exploring →
              </Link>
            </div>
            <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
              {recentSnaps.map((snap) => (
                <Link
                  key={snap.id}
                  to={`/products/${encodeURIComponent(snap.slug || snap.id)}`}
                  className="w-44 shrink-0 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <img src={snap.thumb} alt="" className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">{snap.title}</p>
                  <p className="mt-1 text-xs font-semibold text-brand-600">${Number(snap.price).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Trust */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:px-8">
        {[
          ['Secure simulated checkout', 'PCI-style field validation — no gateways attached.'],
          ['Transparent totals', 'Tax, coupons, thresholds, shipping — computed client + server-side.'],
          ['Wishlist & memory', 'localStorage-backed lists + recently viewed personalization.'],
        ].map(([t, d]) => (
          <div key={t} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-lg font-bold text-slate-900 dark:text-white">{t}</p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{d}</p>
          </div>
        ))}
      </section>

      {/* Newsletter */}
      <section className="border-y border-slate-200 bg-gradient-to-br from-brand-50 via-white to-emerald-50 py-14 dark:border-slate-800 dark:from-brand-950/40 dark:via-slate-950 dark:to-emerald-950/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 lg:flex-row lg:items-center lg:justify-between sm:px-6 lg:px-8">
          <div className="max-w-xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.45em] text-brand-700 dark:text-brand-300">
              Signals list
            </p>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Weekly drops • zero spam promises</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Simulated signup field — emits a toast, does not ping Mailchimp. Perfect for recruiter demos needing “real” funnel copy.
            </p>
          </div>
          <form
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={demoNewsletter}
          >
            <label htmlFor="home-newsletter" className="sr-only">
              Email
            </label>
            <input
              id="home-newsletter"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white dark:bg-brand-600"
            >
              Join demo
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function ProductShowcase({ eyebrow, title, subtitle, products, tone, action }) {
  const toneClass =
    tone === 'rose'
      ? 'text-rose-500 dark:text-rose-400'
      : tone === 'emerald'
        ? 'text-emerald-500 dark:text-emerald-400'
        : 'text-brand-600 dark:text-brand-400';

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className={`text-sm font-black uppercase tracking-[0.4em] ${toneClass} drop-shadow-sm`}>{eyebrow}</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">{title}</h2>
          <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">{subtitle}</p>
        </div>
        {action ? (
          <Link
            className="group inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-3 text-sm font-bold text-slate-900 transition-all duration-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 hover:scale-105"
            to={action.to}
          >
            {action.label} <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        ) : null}
      </div>
      <div className={`mt-12 ${PRODUCT_GRID_CLASS} items-stretch`}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
