const KEY = 'nw_recent_products_v1';
const MAX = 10;

/**
 * Persist recently viewed PDP snapshots locally (portfolio-friendly, offline safe).
 */

export function readRecentSnapshots() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function pushRecentProduct(product) {
  if (!product?.id) return;
  try {
    const prev = readRecentSnapshots();
    const snap = {
      id: product.id,
      slug: product.slug ?? null,
      title: product.title ?? product.name ?? 'Product',
      price: Number(product.price) || 0,
      thumb: Array.isArray(product.images) ? product.images[0] : product.image,
      category: product.category,
    };
    const next = [snap, ...prev.filter((x) => x.id !== snap.id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
}
