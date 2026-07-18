import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { placeOrder } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import SEO from '../components/SEO.jsx';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING, TAX_RATE } from '../constants.js';
import { formatUsd } from '../utils/money.js';
import { computeCartTotals } from '../utils/totals.js';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: 'United States',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
};

/**
 * Multi-section checkout with client-side validation and simulated payment UX.
 */

export default function Checkout() {
  const navigate = useNavigate();
  const { lines, clearCart, appliedCoupons } = useCart();
  const totals = useMemo(
    () => computeCartTotals(lines, appliedCoupons),
    [lines, appliedCoupons]
  );
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const empty = lines.length === 0;

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  /** Simple required + pattern checks mirrored loosely by the Express validator */
  function validate() {
    const e = {};

    const requireText = (key, label) => {
      if (!String(form[key] || '').trim()) e[key] = `${label} is required`;
    };

    requireText('fullName', 'Full name');
    requireText('phone', 'Phone');

    const email = String(form.email || '').trim();
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Enter a valid email';

    requireText('street', 'Street address');
    requireText('city', 'City');
    requireText('state', 'State / region');
    requireText('zip', 'Postal code');
    requireText('country', 'Country');

    requireText('cardName', 'Name on card');

    const digits = String(form.cardNumber || '').replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19)
      e.cardNumber = 'Card number must have 13–19 digits';

    const exp = String(form.expiry || '').trim();
    if (exp.length < 4) e.expiry = 'Enter expiry (MM/YY)';

    const cvv = String(form.cvv || '').trim();
    if (!/^\d{3,4}$/.test(cvv)) e.cvv = 'CVV must be 3 or 4 digits';

    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setSubmitError('');
    if (empty) {
      setSubmitError('Your cart is empty.');
      return;
    }

    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    setSubmitting(true);

    // Brief delay so the “secure processing” state is visible (demo only)
    await new Promise((r) => setTimeout(r, 900));

    const payload = {
      customer: {
        name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      },
      shipping: {
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zip: form.zip.trim(),
        country: form.country.trim(),
      },
      payment: {
        cardName: form.cardName.trim(),
        cardNumber: form.cardNumber.trim(),
        expiry: form.expiry.trim(),
        cvv: form.cvv.trim(),
      },
      items: lines.map((l) => ({
        productId: l.productId,
        slug: l.slug || undefined,
        title: l.title,
        name: l.title,
        quantity: l.quantity,
        price: l.price,
      })),
      totals: {
        subtotal: totals.subtotal,
        discount: totals.discountAmount,
        tax: totals.tax,
        shipping: totals.shippingCost,
        total: totals.total,
        couponsApplied: totals.couponsApplied,
      },
    };

    try {
      const res = await placeOrder(payload);
      clearCart();
      navigate('/order-confirmation', {
        replace: true,
        state: { order: res.order, message: res.message },
      });
    } catch (err) {
      const serverErrors = err.body?.errors;
      if (Array.isArray(serverErrors) && serverErrors.length) {
        setSubmitError(serverErrors.join(' '));
      } else {
        setSubmitError(err.message || 'Checkout failed.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (empty) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SEO title="Checkout" description="Finalize your simulated order." path="/checkout" />
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-amber-950">
          <h1 className="text-xl font-bold">Nothing to checkout</h1>
          <p className="mt-2 text-sm">
            Add products to your cart before visiting this page.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SEO
        title="Secure Checkout"
        description="Simulated multi-step checkout with validation rails — no PSP attached."
        path="/checkout"
      />
      <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
      <p className="mt-1 text-slate-600">
        All fields are validated locally and on the server. Payments are{' '}
        <span className="font-semibold">simulated</span> — no charges occur.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 grid gap-10 lg:grid-cols-3"
        noValidate
      >
        <div className="space-y-10 lg:col-span-2">
          {/* Customer */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Contact</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                id="fullName"
                value={form.fullName}
                error={errors.fullName}
                onChange={(v) => updateField('fullName', v)}
                autoComplete="name"
              />
              <Field
                label="Email"
                id="email"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={(v) => updateField('email', v)}
                autoComplete="email"
              />
              <Field
                label="Phone"
                id="phone"
                type="tel"
                value={form.phone}
                error={errors.phone}
                onChange={(v) => updateField('phone', v)}
                autoComplete="tel"
                className="sm:col-span-2"
              />
            </div>
          </section>

          {/* Shipping */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Shipping address</h2>
            <div className="mt-6 grid gap-4">
              <Field
                label="Street"
                id="street"
                value={form.street}
                error={errors.street}
                onChange={(v) => updateField('street', v)}
                autoComplete="street-address"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="City"
                  id="city"
                  value={form.city}
                  error={errors.city}
                  onChange={(v) => updateField('city', v)}
                  autoComplete="address-level2"
                />
                <Field
                  label="State / region"
                  id="state"
                  value={form.state}
                  error={errors.state}
                  onChange={(v) => updateField('state', v)}
                  autoComplete="address-level1"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Postal code"
                  id="zip"
                  value={form.zip}
                  error={errors.zip}
                  onChange={(v) => updateField('zip', v)}
                  autoComplete="postal-code"
                />
                <Field
                  label="Country"
                  id="country"
                  value={form.country}
                  error={errors.country}
                  onChange={(v) => updateField('country', v)}
                  autoComplete="country-name"
                />
              </div>
            </div>
          </section>

          {/* Payment simulation */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Payment (simulated)
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Use any test values that pass validation — for example card{' '}
              <code className="rounded bg-slate-100 px-1">4242 4242 4242 4242</code>, expiry{' '}
              <code className="rounded bg-slate-100 px-1">12/30</code>, CVV{' '}
              <code className="rounded bg-slate-100 px-1">123</code>.
            </p>
            <div className="mt-6 grid gap-4">
              <Field
                label="Name on card"
                id="cardName"
                value={form.cardName}
                error={errors.cardName}
                onChange={(v) => updateField('cardName', v)}
                autoComplete="cc-name"
              />
              <Field
                label="Card number"
                id="cardNumber"
                value={form.cardNumber}
                error={errors.cardNumber}
                onChange={(v) => updateField('cardNumber', v)}
                autoComplete="cc-number"
                placeholder="•••• •••• •••• ••••"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Expiry (MM/YY)"
                  id="expiry"
                  value={form.expiry}
                  error={errors.expiry}
                  onChange={(v) => updateField('expiry', v)}
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                />
                <Field
                  label="CVV"
                  id="cvv"
                  value={form.cvv}
                  error={errors.cvv}
                  onChange={(v) => updateField('cvv', v)}
                  autoComplete="cc-csc"
                  inputMode="numeric"
                />
              </div>
            </div>
          </section>

          {submitError ? (
            <div
              className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
              role="alert"
            >
              {submitError}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-brand-600 px-8 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700 disabled:cursor-wait disabled:opacity-70 sm:flex-none"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Processing…
                </span>
              ) : (
                'Place order (demo)'
              )}
            </button>
            <Link
              to="/cart"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to cart
            </Link>
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
          <ul className="max-h-64 space-y-3 overflow-y-auto text-sm">
            {lines.map((l) => (
              <li key={l.productId} className="flex justify-between gap-3">
                <span className="text-slate-600">
                  {l.title}{' '}
                  <span className="text-slate-400">×{l.quantity}</span>
                </span>
                <span className="font-medium text-slate-900">
                  {formatUsd(l.price * l.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <dt>Subtotal</dt>
              <dd className="font-medium text-slate-900">
                {formatUsd(totals.subtotal)}
              </dd>
            </div>
            {totals.discountAmount > 0 ? (
              <div className="flex justify-between text-emerald-600">
                <dt>Coupon savings</dt>
                <dd className="font-semibold">{formatUsd(-totals.discountAmount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between text-slate-600">
              <dt>{`Estimated tax (${(TAX_RATE * 100).toFixed(0)}%)`}</dt>
              <dd className="font-medium text-slate-900">{formatUsd(totals.tax)}</dd>
            </div>
            <div className="flex justify-between text-slate-600">
              <dt>Shipping</dt>
              <dd className="font-medium text-slate-900">
                {totals.shippingCost === 0 ? (
                  <span className="text-emerald-600">FREE</span>
                ) : (
                  formatUsd(totals.shippingCost)
                )}
              </dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
              <dt>Total</dt>
              <dd>{formatUsd(totals.total)}</dd>
            </div>
          </dl>
          {!appliedCoupons.includes('FREESHIP') &&
          totals.taxableMerchandise < FREE_SHIPPING_THRESHOLD ? (
            <p className="text-xs text-slate-500">
              Standard shipping {formatUsd(STANDARD_SHIPPING)} applies under{' '}
              {formatUsd(FREE_SHIPPING_THRESHOLD)} discounted merchandise unless{' '}
              <span className="font-semibold">FREESHIP</span> is active.
            </p>
          ) : null}
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  placeholder,
  className = '',
  inputMode,
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-slate-800">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          'mt-2 w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-brand-500/30 transition focus:ring-4',
          error ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-brand-500',
        ].join(' ')}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
