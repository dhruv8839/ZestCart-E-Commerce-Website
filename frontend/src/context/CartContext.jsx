/**
 * Cart + simulated coupon codes with localStorage persistence.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { productMainImage, productTitle } from '../utils/catalogProduct.js';
import { normalizeCouponCode } from '../utils/totals.js';

const CartContext = createContext(null);

const STORAGE_LINES = 'portfolio_ecommerce_cart_v2';
const STORAGE_COUPONS = 'portfolio_ecommerce_coupons_v1';

const VALID_COUPONS = new Set(['SAVE10', 'FREESHIP']);

/** Normalize persisted lines (legacy `name` → `title`, `image` → first image) */
function hydrateLines(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item) =>
        item &&
        typeof item.productId === 'string' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
    )
    .map((item) => {
      const title = item.title || item.name || 'Item';
      const image =
        item.image ||
        (Array.isArray(item.images) ? item.images[0] : '') ||
        '';
      const next = {
        ...item,
        title,
        image,
        slug: item.slug || null,
        brand: item.brand || null,
      };
      if (typeof next.stock === 'number') {
        next.quantity = Math.min(next.quantity, next.stock);
      }
      return next;
    });
}

export function lineFromProduct(product, quantity = 1) {
  const qty = Math.max(1, Number(quantity) || 1);
  const maxStock = Number(product.stock);
  const capped =
    Number.isFinite(maxStock) && maxStock >= 0 ? Math.min(qty, maxStock) : qty;
  return {
    productId: product.id,
    title: productTitle(product),
    slug: product.slug || null,
    brand: product.brand || null,
    price: product.price,
    image: productMainImage(product),
    images: Array.isArray(product.images) ? product.images : undefined,
    category: product.category,
    rating: product.rating,
    stock: product.stock,
    quantity: capped,
  };
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(() => []);
  const [appliedCoupons, setAppliedCoupons] = useState(() => []);

  useEffect(() => {
    try {
      const rawLines = localStorage.getItem(STORAGE_LINES);
      if (rawLines) setLines(hydrateLines(JSON.parse(rawLines)));
      else {
        const legacy = localStorage.getItem('portfolio_ecommerce_cart_v1');
        if (legacy) {
          setLines(hydrateLines(JSON.parse(legacy)));
          localStorage.removeItem('portfolio_ecommerce_cart_v1');
        }
      }
    } catch {
      setLines([]);
    }
    try {
      const rawC = localStorage.getItem(STORAGE_COUPONS);
      if (rawC) {
        const arr = JSON.parse(rawC);
        if (Array.isArray(arr))
          setAppliedCoupons(
            arr.map((c) => normalizeCouponCode(c)).filter((c) => VALID_COUPONS.has(c))
          );
      }
    } catch {
      setAppliedCoupons([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LINES, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COUPONS, JSON.stringify(appliedCoupons));
    } catch {
      /* ignore */
    }
  }, [appliedCoupons]);

  const itemCount = useMemo(
    () => lines.reduce((n, line) => n + line.quantity, 0),
    [lines]
  );

  const upsertLine = useCallback((newLine) => {
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.productId === newLine.productId);
      if (idx === -1) return [...prev, newLine];
      const next = [...prev];
      const max =
        typeof newLine.stock === 'number'
          ? newLine.stock
          : next[idx].stock ?? Infinity;
      const mergedQty = Math.min(next[idx].quantity + newLine.quantity, max);
      next[idx] = {
        ...next[idx],
        ...newLine,
        quantity: mergedQty,
      };
      return next;
    });
  }, []);

  const addToCart = useCallback(
    (product, quantity = 1) => {
      upsertLine(lineFromProduct(product, quantity));
    },
    [upsertLine]
  );

  const setQuantity = useCallback((productId, quantity) => {
    const qty = Math.max(0, Math.floor(Number(quantity)));
    setLines((prev) => {
      if (qty === 0)
        return prev.filter((line) => line.productId !== productId);
      return prev.map((line) => {
        if (line.productId !== productId) return line;
        const max = typeof line.stock === 'number' ? line.stock : Infinity;
        return { ...line, quantity: Math.min(qty, max) };
      });
    });
  }, []);

  const removeLine = useCallback((productId) => {
    setLines((prev) => prev.filter((line) => line.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
    setAppliedCoupons([]);
  }, []);

  const applyCoupon = useCallback((raw) => {
    const code = normalizeCouponCode(raw);
    if (!code) return { ok: false, message: 'Enter a coupon code.' };
    if (!VALID_COUPONS.has(code))
      return { ok: false, message: 'That code is not valid in this demo.' };
    let appended = false;
    setAppliedCoupons((prev) => {
      if (prev.includes(code)) return prev;
      appended = true;
      return [...prev, code];
    });
    if (!appended) {
      return { ok: false, message: `${code} is already active.` };
    }
    return { ok: true, message: `Applied ${code}.` };
  }, []);

  const removeCoupon = useCallback((code) => {
    const c = normalizeCouponCode(code);
    setAppliedCoupons((prev) => prev.filter((x) => x !== c));
  }, []);

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      appliedCoupons,
      addToCart,
      setQuantity,
      removeLine,
      clearCart,
      applyCoupon,
      removeCoupon,
    }),
    [
      lines,
      itemCount,
      appliedCoupons,
      addToCart,
      setQuantity,
      removeLine,
      clearCart,
      applyCoupon,
      removeCoupon,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
