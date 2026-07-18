/**
 * Fetch wrapper · `VITE_API_URL` overrides base (Render/Railway in production).
 * Dev server proxies `/api` → Express unless `VITE_API_URL` is set.
 */

const BASE =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : '';

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { ok: false, message: text || 'Invalid JSON from server.' };
  }
  if (!res.ok) {
    const message =
      data?.message || data?.error || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

function serializeProductQuery(params = {}) {
  const q = new URLSearchParams();
  if (params.search) q.set('search', params.search);
  if (params.category && params.category !== 'All') q.set('category', params.category);
  if (params.minPrice !== undefined && params.minPrice !== '')
    q.set('minPrice', String(params.minPrice));
  if (params.maxPrice !== undefined && params.maxPrice !== '')
    q.set('maxPrice', String(params.maxPrice));
  if (params.minRating !== undefined && params.minRating !== '')
    q.set('minRating', String(params.minRating));
  if (params.featured) q.set('featured', 'true');
  if (params.newOnly) q.set('newOnly', 'true');
  if (params.sale) q.set('sale', 'true');

  if (params.sort) {
    q.set('sort', params.sort);
  } else if (params.sortBy) {
    q.set('sortBy', params.sortBy);
    if (params.order) q.set('order', params.order);
  }

  return q.toString();
}

export function fetchProducts(params = {}) {
  const qs = serializeProductQuery(params);
  return request(`/api/products${qs ? `?${qs}` : ''}`);
}

export function fetchProductSearch(query) {
  const q = new URLSearchParams();
  q.set('q', query);
  return request(`/api/products/search?${q.toString()}`);
}

export function fetchProductsByCategory(category) {
  return request(`/api/products/category/${encodeURIComponent(category)}`);
}

export function fetchProduct(slugOrId) {
  return request(`/api/products/${encodeURIComponent(slugOrId)}`);
}

/** @deprecated Prefer `fetchProduct` — slug or SKU id accepted */
export const fetchProductById = fetchProduct;

export function placeOrder(payload) {
  return request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
