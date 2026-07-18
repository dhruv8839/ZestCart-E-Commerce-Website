import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import SEO from '../components/SEO.jsx';
import { motion } from 'framer-motion';

/** Frontend-only Login page — no backend auth yet. */

export default function Login() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    showToast('Login is a demo feature — no backend auth yet.', 'info');
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <SEO title="Login" description="Sign in to your ZestCart account." path="/login" />

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-black text-white shadow-soft">
              Z
            </span>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Zest<span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">Cart</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-brand-500/30 focus:border-brand-500 focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-brand-500/30 focus:border-brand-500 focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-3.5 text-sm font-bold text-white shadow-elevated transition hover:brightness-110"
          >
            Sign in
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
