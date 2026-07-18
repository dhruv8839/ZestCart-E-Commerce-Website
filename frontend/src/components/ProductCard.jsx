import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatUsd } from '../utils/money.js';
import { savingsPercent } from '../utils/pricing.js';
import { productHref, productTitle } from '../utils/catalogProduct.js';
import RatingStars from './RatingStars.jsx';
import ProductImage from './ProductImage.jsx';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

/** Catalog tile — equal-height grid cell with fixed image band and bottom-aligned CTA. */

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const inStock = Number(product.stock) > 0;
  const pct = savingsPercent(product.price, product.compareAtPrice);
  const wl = isWishlisted(product.id);
  const name = productTitle(product);
  const href = productHref(product);

  function handleWishlist(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const { added } = toggleWishlist(product);
    showToast(
      added ? `Saved “${name}” to wishlist.` : `Removed “${name}”.`,
      'info'
    );
  }

  function handleAdd(ev) {
    ev.preventDefault();
    addToCart(product, 1);
    showToast(`Added “${name}” to cart.`);
  }

  return (
    <motion.article 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-soft transition-all duration-300 hover:shadow-elevated hover:border-slate-300/80 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
    >
      <div className="relative h-60 w-full shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-800">
        <Link to={href} className="block h-full w-full" tabIndex={-1}>
          <ProductImage
            src={product.images?.[0]}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {(product.isNewArrival || product.isBestSeller || pct != null) && (
          <div className="pointer-events-none absolute left-3 top-3 flex max-w-[calc(100%-3.5rem)] flex-wrap gap-1.5 z-10">
            {product.isNewArrival ? (
              <span className="rounded-lg bg-surface-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm dark:bg-brand-600">
                New
              </span>
            ) : null}
            {product.isBestSeller ? (
              <span className="rounded-lg bg-brand-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                Top Rated
              </span>
            ) : null}
            {pct != null ? (
              <span className="rounded-lg bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                −{pct}%
              </span>
            ) : null}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={handleWishlist}
          aria-pressed={wl}
          aria-label={wl ? 'Remove from wishlist' : 'Add to wishlist'}
          className={[
            'absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition backdrop-blur-md',
            wl
              ? 'border-rose-500 bg-rose-500 text-white'
              : 'border-white/50 bg-white/70 text-slate-700 hover:bg-white dark:border-slate-700/50 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900',
          ].join(' ')}
        >
          <Heart className={`h-4 w-4 ${wl ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-5">
        <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {product.brand ?? 'ZestCart'} · {product.category}
        </p>

        <Link to={href} className="mt-1.5 block min-h-[3rem]">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-tight text-slate-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
            {name}
          </h3>
        </Link>

        <div className="mt-2.5 flex items-center gap-2">
          <RatingStars value={product.rating} />
          <span className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
            ({Number(product.reviewsCount || 0).toLocaleString()})
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <p className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{formatUsd(product.price)}</p>
          {product.compareAtPrice && pct != null ? (
            <p className="text-sm font-medium text-slate-400 line-through">
              {formatUsd(product.compareAtPrice)}
            </p>
          ) : null}
        </div>

        <p
          className={[
            'mt-1.5 text-xs font-bold tracking-wide',
            inStock ? 'text-emerald-500' : 'text-rose-500',
          ].join(' ')}
        >
          {inStock ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        <div className="mt-auto pt-5">
          <motion.button
            whileHover={inStock ? { scale: 1.02 } : {}}
            whileTap={inStock ? { scale: 0.98 } : {}}
            type="button"
            disabled={!inStock}
            onClick={handleAdd}
            className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:bg-brand-700 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
          >
            {inStock ? 'Add to cart' : 'Sold Out'}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
