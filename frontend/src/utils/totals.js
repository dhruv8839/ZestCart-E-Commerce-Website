import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING, TAX_RATE } from '../constants.js';

/** Uppercase simulated coupon IDs */
export function normalizeCouponCode(code) {
  return String(code || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

/**
 * Computes money breakdown with optional stacking coupons:
 * SAVE10 → 10% off merchandise subtotal
 * FREESHIP → waives standard shipping regardless of thresholds
 *
 * Tax is simulated on discounted merchandise (education demo only).
 */
export function computeCartTotals(lineItems, appliedCoupons = []) {
  const codes = appliedCoupons.map((c) => normalizeCouponCode(c)).filter(Boolean);
  const hasSave = codes.includes('SAVE10');
  const hasFreeShip = codes.includes('FREESHIP');

  const subtotal = lineItems.reduce(
    (sum, line) => sum + Number(line.price || 0) * Number(line.quantity || 0),
    0
  );
  const subFixed = +subtotal.toFixed(2);

  let discountAmount = 0;
  if (hasSave && subFixed > 0) {
    discountAmount = +(subFixed * 0.1).toFixed(2);
  }

  const afterDiscount = Math.max(0, +(subFixed - discountAmount).toFixed(2));

  let shippingCost = 0;
  if (afterDiscount <= 0) {
    shippingCost = 0;
  } else if (hasFreeShip) {
    shippingCost = 0;
  } else if (afterDiscount >= FREE_SHIPPING_THRESHOLD) {
    shippingCost = 0;
  } else {
    shippingCost = STANDARD_SHIPPING;
  }

  const tax = +(afterDiscount * TAX_RATE).toFixed(2);
  const total = +(afterDiscount + tax + shippingCost).toFixed(2);

  return {
    subtotal: subFixed,
    discountAmount,
    taxableMerchandise: afterDiscount,
    tax,
    shippingCost,
    total,
    couponsApplied: [...new Set(codes)],
  };
}

/** Back-compat helper for callers that ignore coupons */
export function computeTotals(lineItems) {
  return computeCartTotals(lineItems, []);
}
