import { PRODUCT_GRID_CLASS } from '../constants/productGrid.js';

/** Skeleton grid matching catalog breakpoints (2 / 3 / 4 columns). */

export default function ProductGridSkeleton({
  count = 8,
  className = '',
}) {
  return (
    <div
      className={[PRODUCT_GRID_CLASS, 'items-stretch', className].filter(Boolean).join(' ')}
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="h-60 shrink-0 animate-pulse bg-slate-200 dark:bg-slate-800" />
          <div className="flex flex-1 flex-col space-y-3 p-5">
            <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-[80%] animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-auto h-12 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
