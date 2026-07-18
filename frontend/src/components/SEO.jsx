import { Helmet } from 'react-helmet-async';

const SITE = 'ZestCart';

/** Basic per-route meta for portfolio demos (supplement with index.html defaults). */

export default function SEO({ title, description, path }) {
  const canonicalBase =
    typeof import.meta.env.VITE_SITE_URL === 'string'
      ? import.meta.env.VITE_SITE_URL.replace(/\/$/, '')
      : '';

  const fullTitle = title ? `${title} · ${SITE}` : SITE;

  const url =
    canonicalBase && path ? `${canonicalBase}${path.startsWith('/') ? path : `/${path}`}` : '';

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      {description ? (
        <meta name="description" content={description} />
      ) : null}
      {url ? <link rel="canonical" href={url} /> : null}
    </Helmet>
  );
}
