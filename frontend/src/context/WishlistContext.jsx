/**
 * Lightweight wishlist with localStorage — mirrors modern storefront UX.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { productHref, productMainImage, productTitle } from '../utils/catalogProduct.js';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'nw_wishlist_snapshots_v1';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => []);

  useEffect(() => {
    setItems(load());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const count = items.length;

  const isWishlisted = useCallback(
    (productId) => items.some((x) => x.id === productId),
    [items]
  );

  const toggleWishlist = useCallback((product) => {
    if (!product?.id) return { added: false, reason: 'invalid' };
    let added = false;
    setItems((prev) => {
      const exists = prev.some((x) => x.id === product.id);
      if (exists) {
        added = false;
        return prev.filter((x) => x.id !== product.id);
      }
      added = true;
      const snap = {
        id: product.id,
        slug: product.slug,
        title: productTitle(product),
        href: productHref(product),
        image: productMainImage(product),
        price: Number(product.price) || 0,
        category: product.category,
        brand: product.brand,
      };
      return [snap, ...prev.filter((x) => x.id !== product.id)];
    });
    return { added };
  }, []);

  const removeWishlist = useCallback((productId) => {
    setItems((prev) => prev.filter((x) => x.id !== productId));
  }, []);

  const value = useMemo(
    () => ({
      items,
      count,
      isWishlisted,
      toggleWishlist,
      removeWishlist,
      clearWishlist: () => setItems([]),
    }),
    [items, count, isWishlisted, toggleWishlist, removeWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider');
  return ctx;
}
