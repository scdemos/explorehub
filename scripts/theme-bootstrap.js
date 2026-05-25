/**
 * Minimal theme bootstrap for <head> — prevents flash before full theme.js loads.
 */
(function bootstrapTheme() {
  const KEY = 'aem-theme-preference';
  try {
    const stored = localStorage.getItem(KEY);
    let resolved = 'light';
    if (stored === 'dark' || stored === 'light') {
      resolved = stored;
    } else {
      resolved = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', resolved);
  } catch (e) {
    /* localStorage unavailable */
  }
}());
