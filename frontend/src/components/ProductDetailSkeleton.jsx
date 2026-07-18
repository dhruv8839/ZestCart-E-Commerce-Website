/** PDP layout skeleton */

export default function ProductDetailSkeleton() {
  return (
    <div
      className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading product details"
    >
      <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="aspect-square rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-5">
          <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 w-[90%] max-w-xl rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-4">
            <div className="h-10 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-6 w-40 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-2 pt-4">
            <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800/50" />
            <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800/50" />
            <div className="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-800/50" />
          </div>
          <div className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-6 border-t border-slate-200 pt-10 dark:border-slate-800">
            <div className="h-14 flex-1 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
            <div className="h-14 flex-1 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
