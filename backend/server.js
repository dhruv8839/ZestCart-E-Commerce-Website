/**
 * Express REST API for the e-commerce demo (deployment-ready scaffolding).
 * Products load from data/products.json. Orders are simulated (no PSP).
 */

require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const PORT = Number(process.env.PORT) || 5000;
const PRODUCTS_PATH = path.join(__dirname, 'data', 'products.json');

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || '';
const corsOrigin =
  FRONTEND_URL.trim() === ''
    ? true
    : FRONTEND_URL.split(',').map((s) => s.trim()).filter(Boolean);

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(express.json());

function loadProducts() {
  const raw = fs.readFileSync(PRODUCTS_PATH, 'utf8');
  return JSON.parse(raw);
}

/** Derived fields helpful for storefront UIs */
function enrichProduct(raw) {
  const discount = Number(raw.discountPercentage) || 0;
  let compareAtPrice = null;
  if (discount > 0 && discount < 100) {
    compareAtPrice = Math.round((raw.price / (1 - discount / 100)) * 100) / 100;
  }
  return { ...raw, compareAtPrice };
}

function enrichList(list) {
  return list.map(enrichProduct);
}

function normalizeSearch(q) {
  return String(q || '')
    .trim()
    .toLowerCase();
}

function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

function calculateSearchScore(p, q) {
  if (!q) return 0;
  const title = String(p.title || '').toLowerCase();
  const brand = String(p.brand || '').toLowerCase();
  const category = String(p.category || '').toLowerCase();
  const desc = String(p.description || '').toLowerCase();
  const tags = (Array.isArray(p.tags) ? p.tags : []).map((t) => String(t || '').toLowerCase());

  let score = 0;

  // Title matches
  if (title === q) {
    score += 100;
  } else if (title.includes(q)) {
    score += 50;
  }

  // Tag matches
  if (tags.includes(q)) {
    score += 40;
  } else if (tags.some((t) => t.includes(q))) {
    score += 20;
  }

  // Category matches
  if (category === q) {
    score += 30;
  } else if (category.includes(q)) {
    score += 15;
  }

  // Brand matches
  if (brand === q) {
    score += 30;
  } else if (brand.includes(q)) {
    score += 15;
  }

  // Description matches (only exact word boundary matches carry real weight)
  try {
    const rx = new RegExp('\\b' + escapeRegex(q) + '\\b', 'i');
    if (rx.test(desc)) {
      score += 5;
    } else if (desc.includes(q)) {
      score += 1;
    }
  } catch {
    if (desc.includes(q)) {
      score += 1;
    }
  }

  return score;
}

/** Apply filtering (no sorting) */
function filterProducts(products, query) {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    featured,
    newOnly,
    sale,
  } = query;

  let out = [...products];
  const q = normalizeSearch(search);

  if (q) {
    out = out
      .map((p) => ({ ...p, _searchScore: calculateSearchScore(p, q) }))
      .filter((p) => p._searchScore > 0);
  }

  if (featured === 'true') {
    out = out.filter((p) => p.isFeatured);
  }
  if (newOnly === 'true') {
    out = out.filter((p) => p.isNewArrival);
  }
  if (sale === 'true') {
    out = out.filter((p) => Number(p.discountPercentage || 0) > 0);
  }

  const cat =
    typeof category === 'string' ? category.trim() : '';
  if (cat && cat !== 'All') {
    // Support frontend alias: "Home & Kitchen" maps to "Home"
    const CATEGORY_ALIASES = { 'Home & Kitchen': 'Home' };
    const resolved = CATEGORY_ALIASES[cat] || cat;
    out = out.filter((p) => p.category === resolved);
  }

  const minP =
    minPrice !== undefined && minPrice !== ''
      ? Number(minPrice)
      : NaN;
  if (!Number.isNaN(minP)) {
    out = out.filter((p) => Number(p.price) >= minP);
  }

  const maxP =
    maxPrice !== undefined && maxPrice !== ''
      ? Number(maxPrice)
      : NaN;
  if (!Number.isNaN(maxP)) {
    out = out.filter((p) => Number(p.price) <= maxP);
  }

  const minR =
    minRating !== undefined && minRating !== ''
      ? Number(minRating)
      : NaN;
  if (!Number.isNaN(minR)) {
    out = out.filter((p) => Number(p.rating) >= minR);
  }

  return out;
}

/**
 * Unified sort helper.
 * sort: newest | rating | price_asc | price_desc
 * Legacy sortBy/order still supported mapping to the above.
 */
function sortProducts(products, query) {
  const sortKey = normalizeSort(query);
  const next = [...products];

  switch (sortKey) {
    case 'relevance':
      next.sort((a, b) => (b._searchScore || 0) - (a._searchScore || 0));
      break;
    case 'price_asc':
      next.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      break;
    case 'price_desc':
      next.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      break;
    case 'popularity':
      next.sort((a, b) => Number(b.reviewsCount || 0) - Number(a.reviewsCount || 0));
      break;
    case 'rating':
    case 'rating_desc':
      next.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      break;
    case 'newest':
      next.sort(
        (a, b) =>
          new Date(b.releasedAt || 0).getTime() - new Date(a.releasedAt || 0).getTime()
      );
      break;
    default:
      break;
  }
  return next;
}

function normalizeSort(query) {
  let { sort, sortBy, order, search } = query;
  sort = typeof sort === 'string' ? sort.trim().toLowerCase() : '';

  const legacyOk = sortBy === 'price' || sortBy === 'rating';
  const dir = order === 'asc' ? 'asc' : 'desc';

  if (!sort && legacyOk) {
    if (sortBy === 'price') return dir === 'asc' ? 'price_asc' : 'price_desc';
    if (sortBy === 'rating') return 'rating_desc';
  }

  if (!sort) {
    return normalizeSearch(search) ? 'relevance' : 'rating_desc';
  }

  const allowed = new Set([
    'relevance',
    'newest',
    'rating',
    'rating_desc',
    'popularity',
    'price_asc',
    'price_desc',
  ]);
  if (!allowed.has(sort)) return 'rating_desc';
  if (sort === 'rating_desc' || sort === 'rating') return 'rating_desc';
  return sort;
}

function respondProducts(req, res) {
  try {
    const enriched = enrichList(loadProducts());
    let list = filterProducts(enriched, req.query);
    list = sortProducts(list, req.query);
    res.json({
      ok: true,
      count: list.length,
      products: list,
    });
  } catch (err) {
    console.error('products list:', err);
    res.status(500).json({
      ok: false,
      message: 'Could not load products. Please try again later.',
    });
  }
}

/** GET /api/products — unified listing + filtering */
app.get('/api/products', respondProducts);

/** GET /api/products/search?q= */
app.get('/api/products/search', (req, res) => {
  const qParam = typeof req.query.q === 'string' ? req.query.q : '';
  req.query = {
    ...req.query,
    search: qParam,
  };
  return respondProducts(req, res);
});

/** GET /api/products/category/:category */
app.get('/api/products/category/:category', (req, res) => {
  req.query = {
    ...req.query,
    category: decodeURIComponent(req.params.category),
  };
  return respondProducts(req, res);
});

/** Lookup by SKU id OR slug — must remain after literal sub-routes */
app.get('/api/products/:idOrSlug', (req, res) => {
  try {
    const param = decodeURIComponent(req.params.idOrSlug);
    const products = loadProducts();
    const hit =
      products.find((p) => p.id === param) ||
      products.find((p) => p.slug === param);
    if (!hit) {
      return res.status(404).json({
        ok: false,
        message: `Product not found: ${param}`,
      });
    }
    return res.json({ ok: true, product: enrichProduct(hit) });
  } catch (err) {
    console.error('product detail:', err);
    return res.status(500).json({
      ok: false,
      message: 'Could not load product.',
    });
  }
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function digitsOnly(str) {
  return String(str).replace(/\D/g, '');
}

function estimateDeliveryRange() {
  const from = new Date();
  from.setDate(from.getDate() + 5);
  const to = new Date();
  to.setDate(to.getDate() + 8);
  const fmt = (d) =>
    d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  return {
    from: from.toISOString(),
    to: to.toISOString(),
    label: `${fmt(from)} – ${fmt(to)}`,
  };
}

app.post('/api/orders', (req, res) => {
  try {
    const body = req.body || {};
    const { customer, shipping, payment, items, totals } = body;

    const errors = [];

    if (!customer || typeof customer !== 'object') {
      errors.push('Customer information is required.');
    } else {
      if (!customer.name || !String(customer.name).trim())
        errors.push('Full name is required.');
      if (!customer.email || !isValidEmail(customer.email))
        errors.push('Valid email is required.');
      if (!customer.phone || !String(customer.phone).trim())
        errors.push('Phone number is required.');
    }

    if (!shipping || typeof shipping !== 'object') {
      errors.push('Shipping address is required.');
    } else {
      if (!shipping.street || !String(shipping.street).trim())
        errors.push('Street address is required.');
      if (!shipping.city || !String(shipping.city).trim())
        errors.push('City is required.');
      if (!shipping.state || !String(shipping.state).trim())
        errors.push('State/region is required.');
      if (!shipping.zip || !String(shipping.zip).trim())
        errors.push('Postal/ZIP code is required.');
      if (!shipping.country || !String(shipping.country).trim())
        errors.push('Country is required.');
    }

    if (!payment || typeof payment !== 'object') {
      errors.push('Payment details are required (simulated).');
    } else {
      const cardDigits = digitsOnly(payment.cardNumber);
      if (cardDigits.length < 13 || cardDigits.length > 19)
        errors.push('Card number must contain between 13 and 19 digits.');
      if (!payment.cardName || !String(payment.cardName).trim())
        errors.push('Name on card is required.');
      const exp =
        typeof payment.expiry === 'string'
          ? payment.expiry.trim()
          : `${payment.expMonth || ''}/${payment.expYear || ''}`;
      if (!exp || exp.length < 4) errors.push('Valid expiry date is required.');
      if (!payment.cvv || !/^\d{3,4}$/.test(String(payment.cvv).trim()))
        errors.push('CVV must be 3 or 4 digits.');
    }

    if (!Array.isArray(items) || items.length === 0) {
      errors.push('Order must contain at least one item.');
    } else {
      const catalog = loadProducts();
      items.forEach((line, idx) => {
        if (!line.productId) {
          errors.push(`Line ${idx + 1}: product id is required.`);
          return;
        }
        if (!line.quantity || Number(line.quantity) < 1) {
          errors.push(`Line ${idx + 1}: quantity must be at least 1.`);
        }
        const prod = catalog.find((p) => p.id === line.productId);
        if (!prod) {
          errors.push(`Line ${idx + 1}: product not found.`);
        } else if (prod.stock < Number(line.quantity)) {
          errors.push(
            `Line ${idx + 1}: not enough stock for "${prod.title}" (requested ${line.quantity}, available ${prod.stock}).`
          );
        }
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        ok: false,
        message: 'Validation failed.',
        errors,
      });
    }

    const orderId = generateOrderId();
    const last4 = digitsOnly(payment.cardNumber).slice(-4) || '****';
    const delivery = estimateDeliveryRange();

    return res.status(201).json({
      ok: true,
      message:
        'Order placed successfully (simulated). No payment was processed.',
      order: {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: {
          name: customer.name.trim(),
          email: customer.email.trim(),
        },
        shipping: {
          street: shipping.street.trim(),
          city: shipping.city.trim(),
          state: shipping.state.trim(),
          zip: shipping.zip.trim(),
          country: shipping.country.trim(),
        },
        paymentMasked: `**** **** **** ${last4}`,
        estimatedDelivery: delivery,
        items: items.map((i) => ({
          productId: i.productId,
          slug: i.slug || null,
          name: i.title || i.name || 'Item',
          quantity: Number(i.quantity),
          unitPrice: Number(i.price || 0),
        })),
        totals:
          totals && typeof totals === 'object'
            ? {
                subtotal: Number(totals.subtotal ?? 0),
                discount: Number(totals.discount ?? 0),
                tax: Number(totals.tax ?? 0),
                shippingCost: Number(
                  totals.shipping ?? totals.shippingCost ?? 0
                ),
                total: Number(totals.total ?? 0),
              }
            : undefined,
      },
    });
  } catch (err) {
    console.error('POST /api/orders:', err);
    return res.status(500).json({
      ok: false,
      message: 'Could not process order. Please try again.',
    });
  }
});

/** Generate readable order IDs (not persisted anywhere) */
function generateOrderId() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${Date.now()}-${suffix}`;
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'ecommerce-demo-api',
    time: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: `No route matches ${req.method} ${req.path}`,
  });
});

app.listen(PORT, () => {
  console.log(
    `API ready · http://localhost:${PORT} · CORS: ${
      Array.isArray(corsOrigin) ? corsOrigin.join(', ') || 'none' : 'allow-all'
    }`
  );
});
