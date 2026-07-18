import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import { formatUsd } from '../utils/money.js';

/**
 * Receipt-style confirmation with ETA + coupon transparency.
 */

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;
  const banner = location.state?.message;

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SEO title="Order unavailable" />
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">No order on file</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Complete checkout — or your session refreshed after navigation.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex rounded-2xl bg-brand-600 px-8 py-3 text-sm font-bold text-white hover:bg-brand-500"
          >
            Browse catalog
          </Link>
        </div>
      </div>
    );
  }

  const t = order.totals || {};
  const delivery = order.estimatedDelivery || {};

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <SEO title={`Thanks ${order.customer?.name || ''}`} description="Receipt summary for simulated ZestCart order." />
      <div className="overflow-hidden rounded-[32px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-brand-50 shadow-2xl dark:border-emerald-500/30 dark:from-emerald-950/40 dark:via-slate-950 dark:to-brand-950/40">
        <div className="border-b border-emerald-100 bg-white/80 px-8 py-10 backdrop-blur dark:border-emerald-500/40 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase tracking-[0.45em] text-emerald-600 dark:text-emerald-300">
            Order locked
          </p>
          <h1 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">Thanks, {order.customer?.name}</h1>
          {banner ? (
            <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300">{banner}</p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 text-sm font-semibold text-emerald-900 dark:text-emerald-100 md:flex-row md:items-center md:justify-between">
            <p className="font-mono rounded-full bg-emerald-100 px-4 py-2 text-xs uppercase tracking-[0.2em] dark:bg-emerald-900/70">
              {order.id}
            </p>
            {delivery.label ? (
              <p className="rounded-full border border-emerald-200 px-5 py-2 text-xs uppercase tracking-[0.2em] dark:border-emerald-500/70">
                Est. arrival · {delivery.label}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-6 px-8 py-10">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
              Ship window
            </h2>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {delivery.label ||
                '5–8 business days (simulated SLA after warehouse release)'}
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
              Ship to
            </h2>
            <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-100">
              {order.customer?.name}
              <br />
              {order.shipping?.street}
              <br />
              {order.shipping?.city}, {order.shipping?.state} {order.shipping?.zip}
              <br />
              {order.shipping?.country}
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
              Payment masked
            </h2>
            <p className="mt-3 font-mono text-lg text-slate-900 dark:text-white">{order.paymentMasked}</p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
              Items & totals
            </h2>
            <ul className="mt-6 divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {order.items?.map((item, i) => (
                <li key={`${item.productId}-${i}`} className="flex justify-between py-4">
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {item.name}{' '}
                    <span className="text-slate-400">×{item.quantity}</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatUsd(item.unitPrice * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-slate-100 pt-6 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-semibold">{formatUsd(t.subtotal ?? 0)}</dd>
              </div>
              {(t.discount ?? 0) > 0 ? (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <dt>Savings</dt>
                  <dd className="font-semibold">{formatUsd(-t.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt>Tax</dt>
                <dd>{formatUsd(t.tax ?? 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>{formatUsd(t.shippingCost ?? 0)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-4 text-lg font-black text-slate-900 dark:border-slate-800 dark:text-white">
                <dt>Grand total</dt>
                <dd>{formatUsd(t.total ?? 0)}</dd>
              </div>
            </dl>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-brand-500"
              to="/products"
            >
              Keep shopping
            </Link>
            <Link
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:text-white dark:hover:bg-slate-900"
              to="/"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
