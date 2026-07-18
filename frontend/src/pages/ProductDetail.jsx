import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProduct, fetchProducts } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import RatingStars from '../components/RatingStars.jsx';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductGridSkeleton from '../components/ProductGridSkeleton.jsx';
import { PRODUCT_GRID_CLASS } from '../constants/productGrid.js';
import SEO from '../components/SEO.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { formatUsd } from '../utils/money.js';
import { savingsPercent } from '../utils/pricing.js';
import { productTitle } from '../utils/catalogProduct.js';
import { pushRecentProduct } from '../utils/recentStorage.js';

/**
 * PDP with gallery cues, contextual merchandising modules, accessibility labels.
 */

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [galleryIdx, setGalleryIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setQty(1);
    setGalleryIdx(0);
    setError('');
    setProduct(null);
    setRelated([]);
    (async () => {
      setLoading(true);
      try {
        const data = await fetchProduct(slug);
        if (!cancelled) setProduct(data.product);
      } catch (e) {
        const msg =
          e.status === 404
            ? 'This product could not be found — it may have moved.'
            : e.message || 'Failed to load product.';
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!product?.category) return undefined;
    let cancelled = false;
    (async () => {
      setRelatedLoading(true);
      try {
        const data = await fetchProducts({
          category: product.category,
          sort: 'rating_desc',
        });
        const picks = (data.products || [])
          .filter((p) => p.id !== product.id)
          .slice(0, 4);
        if (!cancelled) setRelated(picks);
      } catch {
        if (!cancelled) setRelated([]);
      } finally {
        if (!cancelled) setRelatedLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product]);

  useEffect(() => {
    if (product) pushRecentProduct(product);
  }, [product]);

  const pct = useMemo(
    () => (product ? savingsPercent(product.price, product.compareAtPrice) : null),
    [product]
  );

  const name = product ? productTitle(product) : '';

  function handleWishlist() {
    if (!product) return;
    const { added } = toggleWishlist(product);
    showToast(
      added ? `Saved “${name}”.` : `Removed “${name}”.`,
      'info'
    );
  }

  function handleAdd() {
    if (!product || product.stock < 1) return;
    const safeQty = Math.min(Math.max(1, qty), product.stock);
    addToCart(product, safeQty);
    showToast(
      safeQty === 1
        ? `Added “${name}” to cart.`
        : `Added ${safeQty}× “${name}”.`
    );
  }

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SEO title="Unavailable" description="Product missing or moved." />
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-900 dark:border-rose-500/50 dark:bg-rose-950/40 dark:text-rose-100">
          <h1 className="text-2xl font-bold">We hit a snag</h1>
          <p className="mt-2 text-sm">{error}</p>
          <Link
            to="/products"
            className="mt-8 inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white dark:bg-brand-600"
          >
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const images = Array.isArray(product.images) ? product.images : [];
  const mainSrc = images[galleryIdx] || images[0];
  const wl = isWishlisted(product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <SEO
        title={name}
        description={product.description?.slice(0, 155) || `${name} at ZestCart.`}
        path={`/products/${encodeURIComponent(slug ?? '')}`}
      />

      <nav className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-brand-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-brand-600">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-brand-600"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800 dark:text-slate-200">{name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-slate-100 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            {pct != null ? (
              <span className="absolute left-5 top-5 z-[1] rounded-full bg-rose-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                Save {pct}%
              </span>
            ) : null}
            <ProductImage
              src={mainSrc}
              alt={name}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" role="tablist">
            {images.map((thumb, idx) => (
              <button
                key={thumb || idx}
                type="button"
                role="tab"
                aria-selected={galleryIdx === idx}
                onClick={() => setGalleryIdx(idx)}
                className={[
                  'relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition hover:border-brand-500 dark:bg-slate-900',
                  galleryIdx === idx
                    ? 'border-brand-600 ring-2 ring-brand-200 dark:ring-brand-500/60'
                    : 'border-transparent',
                ].join(' ')}
              >
                <ProductImage
                  src={thumb}
                  alt={`${name} view ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600 dark:text-brand-400">
            {product.brand}
          </p>
          <h1 className="mt-3 text-4xl font-black text-slate-900 dark:text-white md:text-5xl">
            {name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-6">
            <div className="flex flex-wrap items-baseline gap-3">
              <p className="text-4xl font-black text-slate-900 dark:text-white">
                {formatUsd(product.price)}
              </p>
              {product.compareAtPrice && pct != null ? (
                <p className="text-2xl font-semibold text-slate-400 line-through">
                  {formatUsd(product.compareAtPrice)}
                </p>
              ) : null}
            </div>
            <RatingStars value={product.rating} />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {Number(product.reviewsCount || 0).toLocaleString()} shopper reviews
            </span>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            {product.description}
          </p>

          <ul className="mt-6 space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            {(product.features || []).map((feat) => (
              <li key={feat}>• {feat}</li>
            ))}
          </ul>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950/70">
            {inStock ? (
              <div className="flex flex-col gap-6">
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {product.stock} available · ships from our warehouse hubs
                </p>
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label
                      htmlFor="qty"
                      className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                      Quantity
                    </label>
                    <div className="mt-2 inline-flex overflow-hidden rounded-2xl border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        className="px-4 py-2 text-xl font-semibold text-slate-700 dark:text-slate-100"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                      >
                        −
                      </button>
                      <input
                        id="qty"
                        inputMode="numeric"
                        min={1}
                        max={product.stock}
                        value={qty}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (!Number.isFinite(v)) return setQty(1);
                          setQty(Math.min(Math.max(1, v), product.stock));
                        }}
                        className="w-16 border-x border-slate-300 bg-transparent py-2 text-center text-base font-semibold outline-none dark:border-slate-600"
                      />
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        className="px-4 py-2 text-xl font-semibold text-slate-700 dark:text-slate-100"
                        onClick={() =>
                          setQty((q) => Math.min(product.stock, q + 1))
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 px-8 text-base font-black text-white shadow-elevated transition hover:brightness-110"
                    >
                      Add to cart
                    </button>
                    <button
                      type="button"
                      onClick={handleWishlist}
                      className={`inline-flex min-h-[52px] items-center justify-center rounded-2xl border px-6 text-sm font-bold uppercase tracking-wide transition ${
                        wl
                          ? 'border-rose-500 bg-rose-600 text-white'
                          : 'border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
                      }`}
                    >
                      {wl ? 'Saved' : 'Wishlist'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="font-semibold text-rose-600">Currently unavailable — notify me coming soon.</p>
            )}
          </div>

          <dl className="mt-10 grid gap-8 border-t border-slate-200 pt-10 sm:grid-cols-2 dark:border-slate-800">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                SKU
              </dt>
              <dd className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {product.id}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Tags
              </dt>
              <dd className="mt-2 text-sm font-medium text-brand-700 dark:text-brand-400">
                {(product.tags || []).join(' · ')}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Curated complements
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              More adored picks from {product.category}.
            </p>
          </div>
          <Link
            className="text-sm font-semibold uppercase tracking-wide text-brand-700 hover:text-brand-500 dark:text-brand-300"
            to={`/products?category=${encodeURIComponent(product.category)}`}
          >
            View category →
          </Link>
        </div>

        {relatedLoading ? (
          <div className="mt-10">
            <ProductGridSkeleton count={4} />
          </div>
        ) : related.length === 0 ? (
          <p className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950">
            Solo hero — widen your search inside the{' '}
            <Link className="font-semibold text-brand-700" to="/products">
              main catalog.
            </Link>
          </p>
        ) : (
          <div className={`mt-10 ${PRODUCT_GRID_CLASS} items-stretch`}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
