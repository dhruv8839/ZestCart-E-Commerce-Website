import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Link,
  NavLink,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { STORE_CATEGORIES } from '../catalog/categories.js';
import { Search, ShoppingCart, Heart, User, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navCls = ({ isActive }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-brand-500/15 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
  ].join(' ');

/** Responsive commerce nav with search + category routing */
export default function Navbar() {
  const { itemCount } = useCart();
  const { count: wlCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [draftSearch, setDraftSearch] = useState(() => params.get('search') ?? '');
  const searchRef = useRef(null);

  useEffect(() => {
    const q = params.get('search');
    setDraftSearch(q ?? '');
  }, [params]);

  const selectableCategories = useMemo(
    () => STORE_CATEGORIES.filter((c) => c !== 'All'),
    []
  );

  function runSearch(extra = {}) {
    const q = new URLSearchParams();
    const trimmed = draftSearch.trim();
    if (trimmed) q.set('search', trimmed);
    Object.entries(extra).forEach(([k, v]) => {
      if (v) q.set(k, v);
    });
    navigate(`/products${q.toString() ? `?${q.toString()}` : ''}`);
    setOpen(false);
    searchRef.current?.blur();
  }

  return (
    <div className="sticky top-0 z-50 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pointer-events-none">
      <header className="pointer-events-auto overflow-hidden rounded-3xl border border-slate-200/50 bg-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 lg:gap-6 lg:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 text-xl font-black text-white shadow-glow hover:scale-105 transition-transform duration-300">
            Z
          </span>
          <div className="hidden sm:flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Zest<span className="text-transparent bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text">Cart</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
              Fresh finds. Smart shopping.
            </span>
          </div>
        </Link>

        <form
          role="search"
          className="order-3 flex min-w-[200px] flex-1 gap-2 md:order-none"
          onSubmit={(e) => {
            e.preventDefault();
            runSearch();
          }}
        >
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <div className="relative flex flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              ref={searchRef}
              id="site-search"
              type="search"
              placeholder="Search brands, gadgets, staples…"
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 shadow-inner outline-none ring-brand-500/30 placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="hidden items-center justify-center rounded-2xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md transition sm:inline-flex dark:bg-brand-600 dark:hover:bg-brand-500"
          >
            Search
          </motion.button>
        </form>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:gap-3">
          <label className="hidden items-center gap-2 lg:flex">
            <span className="sr-only">Jump to category</span>
            <select
              className="rounded-2xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-800 shadow-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              aria-label="Shop by category"
              defaultValue=""
              onChange={(e) => {
                const v = e.target.value;
                e.target.blur();
                if (!v) return;
                navigate(`/products?category=${encodeURIComponent(v)}`);
              }}
            >
              <option value="">Categories</option>
              {selectableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={toggleTheme}
            className="hidden rounded-xl border border-slate-200 p-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </motion.button>

          <Link
            to="/login"
            className="hidden rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 sm:inline-flex dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            aria-label="Login/Account"
          >
            <User className="h-5 w-5" />
          </Link>

          <Link
            to="/wishlist"
            className="relative hidden rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 sm:inline-flex dark:border-slate-700 dark:text-slate-100 dark:hover:border-rose-500/60 dark:hover:bg-rose-950/40"
            aria-label={`Wishlist${wlCount ? `, ${wlCount} saved` : ''}`}
          >
            <Heart className="h-5 w-5" />
            {wlCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                {wlCount}
              </span>
            ) : null}
          </Link>

          <Link
            to="/cart"
            className="relative rounded-xl border border-slate-200 p-2 text-slate-800 transition hover:border-brand-400 hover:bg-brand-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-brand-950/60"
            aria-label={`Shopping cart${itemCount ? `, ${itemCount} items` : ''}`}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white"
              >
                {itemCount}
              </motion.span>
            ) : null}
          </Link>

          <button
            type="button"
            className="inline-flex rounded-xl border border-slate-200 p-2 text-slate-800 md:hidden dark:border-slate-700 dark:text-slate-100"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Toggle menu</span>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="hidden border-t border-slate-100 px-6 py-2 dark:border-slate-800 md:block">
        <nav className="mx-auto flex max-w-7xl flex-wrap gap-2 lg:px-2" aria-label="Popular links">
          <NavLink className={navCls} end to="/">
            Home
          </NavLink>
          <NavLink className={navCls} to="/products">
            Shop All
          </NavLink>
          <NavLink className={navCls} to="/products?sort=newest">
            New arrivals
          </NavLink>
          <NavLink className={navCls} to="/products?sale=true">
            Deals
          </NavLink>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 md:hidden"
            id="mobile-menu"
          >
            <div className="space-y-5 py-5">
              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex-1 rounded-2xl border border-slate-200 py-3 text-center text-sm font-semibold dark:border-slate-700"
                  onClick={toggleTheme}
                >
                  {isDark ? 'Light mode' : 'Dark mode'}
                </button>
                <Link
                  to="/login"
                  className="flex-1 rounded-2xl border border-slate-200 py-3 text-center text-sm font-semibold dark:border-slate-700 flex items-center justify-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <User className="h-4 w-4" /> Login
                </Link>
              </div>
              <NavLink
                to="/wishlist"
                className={(p) => `${navCls(p)} block`}
                onClick={() => setOpen(false)}
              >
                Wishlist ({wlCount})
              </NavLink>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Categories</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {selectableCategories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-100"
                      onClick={() => {
                        navigate(`/products?category=${encodeURIComponent(c)}`);
                        setOpen(false);
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <NavLink to="/" end className={(p) => navCls(p)} onClick={()=>setOpen(false)}>Home</NavLink>
                <NavLink to="/products" className={(p) => navCls(p)} onClick={()=>setOpen(false)}>Shop</NavLink>
                <NavLink to="/cart" className={(p) => navCls(p)} onClick={()=>setOpen(false)}>Cart</NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </div>
  );
}
