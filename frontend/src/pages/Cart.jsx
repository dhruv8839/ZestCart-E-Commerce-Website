import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import SEO from '../components/SEO.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING, TAX_RATE } from '../constants.js';
import { formatUsd } from '../utils/money.js';
import { computeCartTotals } from '../utils/totals.js';
import { productHref } from '../utils/catalogProduct.js';

/**
 * Cart with coupon simulations (SAVE10, FREESHIP) and tactile line controls.
 */

export default function Cart() {
  const {
    lines,
    setQuantity,
    removeLine,
    clearCart,
    appliedCoupons,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponDraft, setCouponDraft] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const totals = useMemo(
    () => computeCartTotals(lines, appliedCoupons),
    [lines, appliedCoupons]
  );

  const empty = lines.length === 0;

  function tryCoupon(ev) {
    ev.preventDefault();
    setCouponMsg('');
    const res = applyCoupon(couponDraft);
    if (!res.ok) setCouponMsg(res.message);
    else {
      setCouponMsg(res.message);
      setCouponDraft('');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SEO
        title="Cart"
        description="Review lineup, tweak quantities, redeem demo coupons SAVE10 / FREESHIP."
        path="/cart"
      />
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-10 dark:border-slate-800 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600 dark:text-brand-400">
            Bag audit
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">Your cart</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Merchandising math updates instantly · stack SAVE10 ({''}
            {(TAX_RATE * 100).toFixed(0)}% tax modeled on discounted merchandise)
          </p>
        </div>
        {!empty ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Remove every item — including perks?')) clearCart();
            }}
            className="self-start rounded-2xl border border-slate-200 px-5 py-2 text-sm font-semibold text-red-700 transition hover:border-red-400 hover:bg-red-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Clear everything
          </button>
        ) : null}
      </div>

      {empty ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 bg-surface-50 p-14 text-center shadow-soft dark:border-slate-700 dark:bg-slate-900/50">
          <span className="text-6xl grayscale">🛒</span>
          <p className="mt-8 text-xl font-bold text-slate-900 dark:text-white">Quiet in here…</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
            Layer products from the showroom — every line item inherits stock caps and SKU imagery.
          </p>
          <Link
            to="/products"
            className="mt-10 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 px-8 py-3.5 text-sm font-bold text-white shadow-elevated transition hover:brightness-110"
          >
            Browse catalog
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {lines.map((line) => (
              <div
                key={line.productId}
                className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <Link
                  to={productHref({ id: line.productId, slug: line.slug })}
                  className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900"
                >
                  <ProductImage
                    src={line.image}
                    alt={line.title}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to={productHref({ id: line.productId, slug: line.slug })}
                        className="text-lg font-bold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
                      >
                        {line.title}
                      </Link>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {line.category}
                      </p>
                    </div>
                    <p className="font-black text-slate-900 dark:text-white">
                      {formatUsd(line.price * line.quantity)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner dark:border-slate-700 dark:bg-slate-900">
                      <button
                        type="button"
                        className="px-3 py-2 text-xl font-semibold dark:text-white"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity(line.productId, line.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="flex min-w-[2.75rem] items-center justify-center border-x border-slate-200 px-3 text-sm font-bold dark:border-slate-700 dark:text-white">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        className="px-3 py-2 text-xl font-semibold disabled:opacity-35 dark:text-white"
                        aria-label="Increase quantity"
                        disabled={
                          typeof line.stock === 'number' && line.quantity >= line.stock
                        }
                        onClick={() => setQuantity(line.productId, line.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-semibold text-red-600 hover:text-red-800 dark:text-red-400"
                      onClick={() => removeLine(line.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950/60">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white">
                Coupon lab
              </h2>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                TRY <span className="font-bold">SAVE10</span> ({''}10% off merchandise){' '}| <span className="font-bold">FREESHIP</span> ({''}unlock free standard shipping tier)
              </p>
              <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={tryCoupon}>
                <label htmlFor="coupon-field" className="sr-only">
                  Coupon code
                </label>
                <input
                  id="coupon-field"
                  value={couponDraft}
                  onChange={(e) => setCouponDraft(e.target.value)}
                  placeholder="SAVE10 • FREESHIP"
                  className="w-full flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white dark:bg-brand-600"
                >
                  Apply code
                </button>
              </form>
              {couponMsg ? (
                <p className="mt-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400">{couponMsg}</p>
              ) : null}
              {appliedCoupons.length ? (
                <ul className="mt-5 flex flex-wrap gap-3 text-xs font-semibold">
                  {appliedCoupons.map((c) => (
                    <li
                      key={c}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
                    >
                      {c}
                      <button
                        type="button"
                        className="text-slate-500 hover:text-red-600"
                        onClick={() => removeCoupon(c)}
                        aria-label={`Remove ${c}`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-28">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Order summary</h2>
            <dl className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <Row label="Subtotal" value={totals.subtotal} />
              {totals.discountAmount > 0 ? (
                <Row label="Coupon savings" value={-totals.discountAmount} accent="text-emerald-600 dark:text-emerald-400" />
              ) : null}
              <Row label={`Estimated tax (${(TAX_RATE * 100).toFixed(0)}%)`} value={totals.tax} />
              <Row
                label="Shipping"
                value={totals.shippingCost === 0 ? 'FREE' : totals.shippingCost}
              />
            </dl>
            <div className="mt-6 border-t border-slate-200 pt-6 text-xl font-black text-slate-900 dark:text-white">
              <div className="flex justify-between">
                <span>Total</span>
                <span>{formatUsd(totals.total)}</span>
              </div>
            </div>

            {!appliedCoupons.includes('FREESHIP') &&
            totals.taxableMerchandise < FREE_SHIPPING_THRESHOLD &&
            totals.taxableMerchandise > 0 ? (
              <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs text-amber-900 dark:bg-amber-950/70 dark:text-amber-50">
                You are {formatUsd(FREE_SHIPPING_THRESHOLD - totals.taxableMerchandise)} away from free standard demo shipping — or redeem{' '}
                <span className="font-semibold">FREESHIP</span>.
              </p>
            ) : null}

            <Link
              to="/checkout"
              className="mt-8 flex items-center justify-center rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-3 text-base font-black text-white shadow-elevated transition hover:brightness-110"
            >
              Checkout
            </Link>
            <Link
              to="/products"
              className="mt-5 block text-center text-sm font-semibold text-brand-700 hover:text-brand-500 dark:text-brand-400"
            >
              ← Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, accent }) {
  const display =
    typeof value === 'number' ? formatUsd(value) : value;
  const valClass =
    accent ?? 'font-semibold text-slate-900 dark:text-white';

  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd className={valClass}>{display}</dd>
    </div>
  );
}
