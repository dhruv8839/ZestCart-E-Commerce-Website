import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatUsd } from '../utils/money.js';
import { fetchProduct } from '../api/client.js';

/**
 * Lightweight saved-items surface — combines local snapshots with live SKU refetch hints.
 */

export default function Wishlist() {
  const { items, removeWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  async function addFromWish(entry) {
    try {
      const data = await fetchProduct(entry.slug || entry.id);
      addToCart(data.product, 1);
      showToast(`Moved “${entry.title}” into your cart.`);
    } catch {
      showToast('That SKU is unavailable right now.', 'error');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SEO
        title="Wishlist"
        description="Locally saved favourites — persists in this browser only."
        path="/wishlist"
      />
      <header className="border-b border-slate-200 pb-8 dark:border-slate-800">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">Wishlist closet</h1>
        <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
          Items stay on-device for recruiter-friendly demos — no authentication wall required.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 bg-surface-50 p-14 text-center shadow-soft dark:border-slate-700 dark:bg-slate-900/50">
          <p className="text-5xl grayscale">♡</p>
          <p className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">Nothing bookmarked yet</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Tap the heart on any listing to build a curator’s shortlist.
          </p>
          <Link
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 px-8 py-3.5 text-sm font-bold text-white shadow-elevated transition hover:brightness-110"
            to="/products"
          >
            Explore catalog
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <Link to={item.href} className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                <ProductImage
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Link
                  className="text-base font-bold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
                  to={item.href}
                >
                  {item.title}
                </Link>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.category}</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{formatUsd(item.price)}</p>
                <div className="mt-auto flex gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-soft transition hover:brightness-110"
                    onClick={() => addFromWish(item)}
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-slate-200 px-3 text-xs font-semibold text-red-600 dark:border-slate-700"
                    onClick={() => removeWishlist(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
