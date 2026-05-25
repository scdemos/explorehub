/**
 * Theme toggle — aligned with helix-website (system → light → dark → system).
 */
(function themeModule(global) {
  const THEME_STORAGE_KEY = 'aem-theme-preference';
  const THEME_VALUES = ['system', 'light', 'dark'];

  const THEME_ICONS = {
    system: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 17a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1Zm10-5a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1ZM5 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1Zm15.07-7.07a1 1 0 0 1 0 1.41l-1.42 1.42a1 1 0 1 1-1.41-1.41l1.41-1.42a1 1 0 0 1 1.42 0ZM6.34 17.66a1 1 0 0 1 0 1.41l-1.42 1.42a1 1 0 1 1-1.41-1.41l1.41-1.42a1 1 0 0 1 1.42 0Zm12.02-.95a1 1 0 0 1-1.41 0l-1.42-1.41a1 1 0 0 1 1.41-1.41l1.42 1.41a1 1 0 0 1 0 1.41ZM6.34 6.34a1 1 0 0 1-1.41 0L3.51 4.93a1 1 0 0 1 1.41-1.41l1.42 1.41a1 1 0 0 1 0 1.41ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/></svg>',
    light: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm0-20a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm10 10a1 1 0 0 1 1 1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1Zm-20 0a1 1 0 0 1 1 1H2a1 1 0 1 1 0 2h1a1 1 0 0 1 1-1Zm15.07-7.07a1 1 0 0 1 1.41 0l.71.71a1 1 0 0 1-1.41 1.41l-.71-.71a1 1 0 0 1 0-1.41ZM5.22 18.36a1 1 0 0 1 1.41 0l.71.71a1 1 0 1 1-1.41 1.41l-.71-.71a1 1 0 0 1 0-1.41Zm12.02-.95a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0ZM5.22 5.22a1 1 0 0 1 0 1.41l-.71.71A1 1 0 1 1 3.1 5.93l.71-.71a1 1 0 0 1 1.41 0Z"/></svg>',
    dark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M10.5 2.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.05a8.5 8.5 0 1 1-3 15.4 1 1 0 0 1 .4-1.94 6.5 6.5 0 1 0 1.6-12.51H11.5a1 1 0 0 1-1-1v-1Z"/></svg>',
  };

  const LABELS = {
    system: 'Theme: System (click for Light)',
    light: 'Theme: Light (click for Dark)',
    dark: 'Theme: Dark (click for System)',
  };

  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && THEME_VALUES.includes(stored)) return stored;
    } catch (e) {
      /* localStorage unavailable */
    }
    return 'system';
  }

  function storeTheme(theme) {
    try {
      if (theme === 'system') {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    } catch (e) {
      /* localStorage unavailable */
    }
  }

  function resolveTheme(theme) {
    if (theme === 'system') {
      return global.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', resolveTheme(theme));
  }

  function getNextTheme(current) {
    const index = THEME_VALUES.indexOf(current);
    return THEME_VALUES[(index + 1) % THEME_VALUES.length];
  }

  function updateButton(button, theme) {
    button.innerHTML = THEME_ICONS[theme] || THEME_ICONS.system;
    button.setAttribute('aria-label', LABELS[theme]);
    button.setAttribute('title', LABELS[theme].replace(/^Theme: /, ''));
  }

  function initThemeToggle(button) {
    let currentTheme = getStoredTheme();
    applyTheme(currentTheme);
    updateButton(button, currentTheme);

    button.addEventListener('click', () => {
      currentTheme = getNextTheme(currentTheme);
      applyTheme(currentTheme);
      storeTheme(currentTheme);
      updateButton(button, currentTheme);
    });
  }

  function initTheme() {
    applyTheme(getStoredTheme());
  }

  global.ExploreHubTheme = {
    applyTheme,
    getStoredTheme,
    initTheme,
    initThemeToggle,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
}(window));
