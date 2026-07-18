/** Simple centered loading spinner (Tailwind utilities only). */
export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600"
        role="status"
        aria-label={label}
      />
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}
