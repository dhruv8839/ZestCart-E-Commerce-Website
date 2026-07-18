/** Accessible read-only rating display (whole + half stars for .5 increments). */

export default function RatingStars({ value = 0, countLabel }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.25 && value - full < 0.75;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  const rounded = Number(value).toFixed(1);

  return (
    <div
      className="flex items-center gap-1.5 text-amber-500"
      aria-label={`Rated ${rounded} out of 5`}
    >
      <span className="flex" role="presentation">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f-${i}`} filled />
        ))}
        {hasHalf ? <Star half /> : null}
        {Array.from({ length: Math.max(0, empty) }).map((_, i) => (
          <Star key={`e-${i}`} />
        ))}
      </span>
      <span className="text-xs font-medium text-slate-600">{rounded}</span>
      {countLabel ? (
        <span className="text-xs text-slate-500">{countLabel}</span>
      ) : null}
    </div>
  );
}

function Star({ filled, half }) {
  if (half) {
    return (
      <span className="relative inline-block h-4 w-4">
        <span className="absolute inset-0 text-slate-300" aria-hidden>
          ★
        </span>
        <span
          className="absolute inset-y-0 left-0 w-1/2 overflow-hidden text-amber-500"
          aria-hidden
        >
          ★
        </span>
      </span>
    );
  }
  return (
    <span className="text-sm leading-none" aria-hidden>
      {filled ? (
        <span className="text-amber-500">★</span>
      ) : (
        <span className="text-slate-300">★</span>
      )}
    </span>
  );
}
