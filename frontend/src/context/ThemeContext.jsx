/**
 * Minimal light/dark switch with Tailwind `class` strategy (`dark:*` variants).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const ThemeContext = createContext(null);
const KEY = 'nw_theme_v1';

function readStored() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readStored() || 'light');

  useEffect(() => {
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isDark: theme === 'dark',
    }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
