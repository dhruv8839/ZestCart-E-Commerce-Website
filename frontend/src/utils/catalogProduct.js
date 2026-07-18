/** Normalized getters so UI works across legacy `{ name, image }` and new `{ title, images[] }`. */

export function productTitle(product) {
  return product?.title ?? product?.name ?? 'Product';
}

export function productImages(product) {
  if (Array.isArray(product?.images) && product.images.length) return product.images;
  if (product?.image) return [product.image];
  return [];
}

export function productMainImage(product) {
  const imgs = productImages(product);
  return imgs[0] || '';
}

export function productHref(product) {
  const slugOrId = product?.slug ?? product?.id;
  return `/products/${encodeURIComponent(slugOrId ?? '')}`;
}
