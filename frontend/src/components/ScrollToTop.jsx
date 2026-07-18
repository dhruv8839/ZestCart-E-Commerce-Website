import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Restores scroll position on client-side navigations */

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
