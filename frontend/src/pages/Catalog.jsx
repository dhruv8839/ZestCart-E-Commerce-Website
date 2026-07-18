import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { STORE_CATEGORIES } from '../catalog/categories.js';
import { fetchProducts } from '../api/client.js';
import SEO from '../components/SEO.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductGridSkeleton from '../components/ProductGridSkeleton.jsx';
import { PRODUCT_GRID_CLASS } from '../constants/productGrid.js';

const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating_desc' },
];

/**
 * Full catalog grid with richer filters mirrored by the REST API query string.
 */

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const urlSearch = params.get('search') ?? '';
  const urlCategory = params.get('category') || 'All';
  const saleOnly = params.get('sale') === 'true';
  const featuredOnly = params.get('featured') === 'true';
  const sortFromUrl = params.get('sort') || 'popularity';

  const [searchDraft, setSearchDraft] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch.trim());

  const [category, setCategory] = useState(urlCategory);
  const [minPrice, setMinPrice] = useState(params.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') ?? '');
  const [minRating, setMinRating] = useState(params.get('minRating') ?? '');
  const [sort, setSort] = useState(sortFromUrl);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /** Keep draft aligned when navbar/deep-links change URL */
  useEffect(() => {
    setSearchDraft(urlSearch);
    setDebouncedSearch(urlSearch.trim());
  }, [urlSearch]);

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchDraft.trim()), 320);
    return () => clearTimeout(t);
  }, [searchDraft]);

  /** Persist debounced keyword into the query string shareably */
  useEffect(() => {
    setParams(
      (prev) => {
        const n = new URLSearchParams(prev);
        if (debouncedSearch) n.set('search', debouncedSearch);
        else n.delete('search');
        return n;
      },
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync URL with debounced typing
  }, [debouncedSearch]);

  useEffect(() => {
    setSort(sortFromUrl);
  }, [sortFromUrl]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchProducts({
          search: debouncedSearch || undefined,
          category,
          minPrice,
          maxPrice,
          minRating,
          sale: saleOnly ? true : undefined,
          featured: featuredOnly ? true : undefined,
          sort,
        });
        if (!cancelled) setProducts(data.products || []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load catalog.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, category, minPrice, maxPrice, minRating, saleOnly, featuredOnly, sort]);

  function persistFilters(nextParts) {
    setParams((prev) => {
      const n = new URLSearchParams(prev);
      Object.entries(nextParts).forEach(([k, v]) => {
        if (
          v === '' ||
          v === null ||
          v === undefined ||
          v === 'All' ||
          v === false
        ) {
          if (k === 'sale') n.delete('sale');
          else n.delete(k);
        } else {
          n.set(k, String(v));
        }
      });
      return n;
    }, { replace: true });
  }

  function setCategoryFiltered(cat) {
    setCategory(cat);
    persistFilters({ category: cat === 'All' ? '' : cat });
  }

  function setSortPersist(next) {
    setSort(next);
    persistFilters({ sort: next === 'popularity' ? '' : next });
  }

  function applyNumericFilters() {
    persistFilters({
      minPrice,
      maxPrice,
      minRating,
    });
  }

  function clearEverything() {
    setSearchDraft('');
    setDebouncedSearch('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSort('popularity');
    setParams(new URLSearchParams(), { replace: true });
  }

  const emptyMessage = useMemo(() => {
    if (
      debouncedSearch ||
      saleOnly ||
      featuredOnly ||
      category !== 'All' ||
      minPrice ||
      maxPrice ||
      minRating
    ) {
      return 'No products matched your exact criteria. Please try adjusting your filters or search term.';
    }
    return 'Our catalog is currently being updated. Please check back later.';
  }, [debouncedSearch, saleOnly, featuredOnly, category, minPrice, maxPrice, minRating]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SEO
        title="Shop"
        description="Browse our full catalog — search, filter by category, price, and rating."
        path="/products"
      />

      <header className="flex flex-col gap-3 border-b border-slate-200 pb-10 dark:border-slate-800">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Shop All Products
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-500 dark:text-slate-400">
              Browse our complete collection of premium gear and accessories. Use the filters to find exactly what you need.
            </p>
          </div>
          {saleOnly ? (
            <span className="rounded-full bg-rose-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-rose-500/35">
              Special Offers
            </span>
          ) : null}
          {featuredOnly ? (
            <span className="rounded-full bg-indigo-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
              Featured Items
            </span>
          ) : null}
        </div>
      </header>

      <div className="mt-10 flex flex-col gap-10 lg:flex-row">
        <aside className="w-full shrink-0 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:w-72 xl:w-80">
          <FilterField label="Search in results">
            <input
              type="search"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Search products..."
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-brand-500/30 focus:border-brand-500 focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              aria-describedby="catalog-search-hint"
            />
            <p id="catalog-search-hint" className="sr-only">
              Matches title, tags, descriptions, categories, brands
            </p>
          </FilterField>

          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Department</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {STORE_CATEGORIES.map((cat) => {
                const selected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFiltered(cat)}
                    className={[
                      'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                      selected
                        ? 'border-brand-600 bg-brand-600 text-white shadow-md'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200',
                    ].join(' ')}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <FilterField label="Minimum price ($)">
              <input
                inputMode="decimal"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </FilterField>
            <FilterField label="Maximum price ($)">
              <input
                inputMode="decimal"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </FilterField>
          </div>

          <FilterField label="Minimum rating">
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Any</option>
              <option value="3">★★★☆☆ & up</option>
              <option value="4">★★★★☆ & up</option>
              <option value="4.5">4.5 & up</option>
            </select>
          </FilterField>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applyNumericFilters}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500"
            >
              Apply price & rating
            </button>
            <button
              type="button"
              onClick={clearEverything}
              className="inline-flex rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Reset all
            </button>
          </div>

          <FilterField label="Sort">
            <select
              value={sort}
              onChange={(e) => setSortPersist(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FilterField>

          {!saleOnly ? (
            <button
              type="button"
              onClick={() => persistFilters({ sale: 'true' })}
              className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-rose-800 transition hover:bg-rose-100 dark:border-rose-400/60 dark:bg-rose-950/60 dark:text-rose-100"
            >
              Show sale items only
            </button>
          ) : (
            <button
              type="button"
              onClick={() => persistFilters({ sale: '' })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Clear sale filter
            </button>
          )}
        </aside>

        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="mt-2">
              <ProductGridSkeleton count={12} />
            </div>
          ) : null}

          {!loading && error ? (
            <div
              className="rounded-3xl border border-red-300 bg-red-50 p-8 text-red-900 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-100"
              role="alert"
            >
              <p className="text-lg font-bold">We couldn’t refresh inventory</p>
              <p className="mt-2 text-sm opacity-90">{error}</p>
            </div>
          ) : null}

          {!loading && !error && products.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-24 text-center dark:border-slate-700 dark:bg-slate-900">
              <span className="text-6xl grayscale">🛍️</span>
              <p className="mt-8 text-xl font-bold text-slate-900 dark:text-white">
                No products found
              </p>
              <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
                {emptyMessage}
              </p>
              <button
                type="button"
                className="mt-8 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-500"
                onClick={clearEverything}
              >
                Clear filters & try again
              </button>
            </div>
          ) : null}

          {!loading && !error && products.length > 0 ? (
            <>
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {products.length} results
                  {debouncedSearch ? (
                    <>
                      {' '}
                      for “<span className="text-brand-600">{debouncedSearch}</span>”
                    </>
                  ) : null}
                </p>
              </div>
              <div className={`${PRODUCT_GRID_CLASS} items-stretch`}>
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FilterField({ label, children }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      {children}
    </div>
  );
}
