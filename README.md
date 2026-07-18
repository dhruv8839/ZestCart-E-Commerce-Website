# Northwind Mercantile · Deployment-Ready Demo Storefront

Portfolio-grade full-stack e-commerce experience: React + Tailwind SPA on the frontend, Express REST API + JSON catalog on the backend. **Payments, emails, coupons, SLAs are simulated.**

## Highlights

| Area | What's included |
|------|----------------|
| Commerce UX | PDP gallery, badges (New/Best Seller/Sale), filters, contextual search, skeletons |
| Persistence | Wishlist + cart + coupons + theme + PDP history via `localStorage` |
| Simulated perks | Coupons `SAVE10` (10 % merchandise) · `FREESHIP` · trust blocks · newsletter echoes |
| API | Structured products (45 SKUs across 7 departments) with enrichment + filters |
| SEO | Route-level titles/meta via `react-helmet-async`, optional canonical via `VITE_SITE_URL` |
| Deploy | Vercel/Netlify rewrites baked in (`vercel.json`, `netlify.toml`, `public/_redirects`) |

## Tech stack

| Layer | Details |
|-------|---------|
| Frontend | React 18, React Router 7-lite patterns, Tailwind CSS 3 (`darkMode: 'class'`), Vite 5 |
| Backend | Node 18+, Express 4, `cors`, `dotenv` |
| Assets | Photography pulled from curated Unsplash URLs (see generator script below) |

## Repository layout

```
E commerce web app/
├── README.md                ← you are here
├── package.json             # optional orchestration shortcuts
├── backend/
│   ├── .env.example
│   ├── data/products.json    # regenerated via scripts/build-catalog.cjs (45 items today)
│   ├── scripts/build-catalog.cjs
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── .env.example
│   ├── public/_redirects
│   ├── vercel.json
│   ├── netlify.toml
│   └── src/**                # SPA source
└── ...
```

## Local prerequisites

1. Install [Node.js 18+](https://nodejs.org/) (includes `npm`)

## Bootstrap & run

### Quick path (recommended)

From the repo root:

```bash
npm run install:all
npm install   # installs root tooling (concurrently) if needed
npm run dev   # concurrently starts API (:5000) + Vite (:5173)
```

Open **http://localhost:5173** — Vite proxies `/api` traffic to `:5000` automatically whenever `VITE_API_URL` is **unset**.

### Manual two-terminal flow

Terminal A — API

```bash
cd backend
npm install
npm run dev       # listens on PORT (default 5000)
npm run catalog:build   # optional · regenerate demo catalog JSON + images metadata
```

Terminal B — Frontend

```bash
cd frontend
npm install
npm run dev       # listens on http://localhost:5173
```

### Regenerating merchandise

Want to riff on pricing or taxonomy? Edit `backend/scripts/build-catalog.cjs`, then regenerate:

```bash
cd backend
npm run catalog:build
```

## Environment variables

### Backend (`backend/.env`)

| Key | Meaning |
|-----|---------|
| `PORT` | Optional override (`5000` default) |
| `FRONTEND_URL` | Comma-separated SPA origins permitted by CORS. Leave blank for permissive localhost dev |

### Frontend (`frontend/.env`)

| Key | Meaning |
|-----|---------|
| `VITE_API_URL` | Absolute API origin **without trailing slash**. Leave blank in dev → use `/api` proxy |
| `VITE_SITE_URL` | Optional canonical base for `<link rel="canonical">` in `SEO.jsx` |

Copy the included `.env.example` files alongside your real `.env`.

## Frontend deployment · Vercel

1. Create a Git repo or drag-and-drop upload.
2. Set **Framework Preset**: Vite.
3. **Root directory**: `frontend`
4. **Build command**: `npm run build`
5. **Output directory**: `dist`
6. **Environment Variables**:
   - `VITE_API_URL=https://YOUR-BACKEND` (production API)
   - `VITE_SITE_URL=https://YOUR-VERCEL-HOSTNAME` *(optional canonical)*
7. Redeploy whenever env vars change (Vite bakes env at build-time).

SPA fallbacks handled via `frontend/vercel.json`.

## Frontend deployment · Netlify

Configure build:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- `_redirects` already copied via `frontend/public/_redirects` + `netlify.toml`

Mirror the same `VITE_*` env vars as Vercel.

## Backend deployment · Render / Railway / Cyclic

1. Repo root **`backend`** as service root (`server.js`).
2. **Start command**: `npm start`
3. **Build command**: `npm install` *(default)*
4. Set **`PORT`** if the platform assigns one dynamically (usually automatic).
5. Set **`FRONTEND_URL`** to your deployed SPA origin(s), e.g. `https://app.vercel.app` (comma separated for multiples).
6. After your API hostname is stable, redeploy frontend with matching `VITE_API_URL`.

> Render free tiers may cold-start APIs — bake skeleton / friendly error states *(already wired in SPA)*.

## Demo checkout playbook

| Step | Guidance |
|------|----------|
| Browse | Filters + search simultaneously hit `/api/products` queries |
| Wishlist | Heart icon persists per browser |
| Cart | Coupons `SAVE10`, `FREESHIP` interact with totals + shipping tiers |
| Checkout | Test card numbers like `4242 4242 4242 4242`, expiry `12/34`, CVV `123` |
| Receipt | Order ID, masked PAN, ETA window, totals echo client math |

Nothing posts to PSPs · nothing emails real users.

## API surface (truncated cheatsheet)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/products` | Full query surface (`search`,`category`,`minPrice`,`maxPrice`,`minRating`,`featured`,`newOnly`,`sale`,`sort`,`sortBy`,`order`) |
| GET | `/api/products/search?q=` | Alias forcing `search` |
| GET | `/api/products/category/:category` | Narrow by department |
| GET | `/api/products/:slugOrId` | Detail by slug (`/products/:slug`) or SKU (`SKU-…`) |
| POST | `/api/orders` | Validates JSON body, echoes totals + ETA |
| GET | `/api/health` | Liveness probe for hosting dashboards |

Refer to inline comments inside `backend/server.js` for validation specifics.

## Testing checklist (what we validate before tagging a release)

- [x] Browse home modules + navigate into catalog PDP
- [x] Filters + navbar search + sorting + URL deep links (`sale=true`,`featured=true`, etc.)
- [x] Toggle wishlist toast + PDP gallery + recently viewed persistence
- [x] Cart quantity caps + coupon STACK + FREESHIP + SAVE10 interplay
- [x] Checkout validation + spinner + masked receipt totals
- [x] `npm run build` (frontend green)

---

MIT license — demonstration use only · swap assets & copy before commercial launch.
