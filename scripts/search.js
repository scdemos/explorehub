/**
 * Explore Hub search — loaded by index.html for backwards compatibility.
 * Implementation lives in global-search.js (also loaded via navigation.js on every page).
 */
if (window.PlaybookSearch) {
  window.PlaybookSearch.init();
} else {
  const base = (() => {
    const path = window.location.pathname;
    const knownDirs = ['/use-cases/', '/playbooks/', '/cookbook/', '/case-studies/', '/ai-and-aem/', '/getting-started/', '/references/', '/aem-playground/'];
    return knownDirs.some((d) => path.includes(d)) ? '../' : './';
  })();
  const script = document.createElement('script');
  script.src = `${base}scripts/global-search.js`;
  script.onload = () => window.PlaybookSearch?.init();
  document.head.appendChild(script);
}
