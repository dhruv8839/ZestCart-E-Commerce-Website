/** If compare-at is above current price, return whole-number percent savings. */
export function savingsPercent(price, compareAt) {
  const p = Number(price);
  const c = Number(compareAt);
  if (!Number.isFinite(p) || !Number.isFinite(c) || c <= p) return null;
  return Math.round((1 - p / c) * 100);
}

/** Truthy when a product shows a crossed-out comparison price */
export function hasSalePrice(product) {
  return savingsPercent(product?.price, product?.compareAtPrice) != null;
}
