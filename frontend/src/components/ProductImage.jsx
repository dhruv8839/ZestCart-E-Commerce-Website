import { useEffect, useState } from 'react';

/** Local placeholder when CDN / API image URL fails */
const PLACEHOLDER = '/placeholder-product.svg';

/**
 * Resilient product image — parent should set fixed height; this fills with object-cover.
 */
export default function ProductImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  ...rest
}) {
  const [current, setCurrent] = useState(() => src || PLACEHOLDER);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setCurrent(src || PLACEHOLDER);
  }, [src]);

  function onError() {
    if (!failed) {
      setFailed(true);
      setCurrent(PLACEHOLDER);
    }
  }

  return (
    <img
      src={current || PLACEHOLDER}
      alt={alt || 'Product'}
      loading={loading}
      onError={onError}
      className={className}
      {...rest}
    />
  );
}
