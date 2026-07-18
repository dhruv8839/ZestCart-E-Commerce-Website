import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO.jsx';

/** Friendly 404 with clear recovery paths */

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
      <SEO title="Page not found" description="The page you're looking for doesn't exist." />
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white px-8 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <p className="text-8xl leading-none opacity-90" aria-hidden>
          404
        </p>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          This page floated away
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 dark:text-slate-300">
          The URL may be mistyped or the page no longer exists. Head back or browse our products.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700"
          >
            ← Go Back
          </button>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            Browse Products
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-transparent px-6 py-3 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline dark:text-brand-400"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}