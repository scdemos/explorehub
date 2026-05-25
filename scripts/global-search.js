/**
 * Playbook search — sidebar (all pages) + Explore Hub. One index, correct paths.
 */
(function (global) {
  const LANE_LABELS = {
    playbook: 'Playbooks & Recipes',
    cookbook: 'Cookbook',
    'case-study': 'Case studies',
    ai: 'AI and AEM',
    'getting-started': 'Getting Started',
    references: 'References',
  };

  let entries = null;
  let loadPromise = null;
  let debounceTimer = null;

  function getBasePath() {
    const path = global.location.pathname;
    const dirs = ['/use-cases/', '/playbooks/', '/cookbook/', '/case-studies/', '/ai-and-aem/', '/getting-started/', '/references/'];
    return dirs.some((d) => path.includes(d)) ? '../' : './';
  }

  function resolveUrl(relativePath) {
    return `${getBasePath()}${relativePath}`;
  }

  function tokenize(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  }

  function buildHaystack(entry) {
    return [entry.title, entry.description, entry.category, entry.lane, ...(entry.tags || []), entry.path]
      .join(' ').toLowerCase();
  }

  function scoreEntry(entry, tokens) {
    if (!tokens.length) return 0;
    const hay = buildHaystack(entry);
    const title = entry.title.toLowerCase();
    let score = 0;
    for (const tok of tokens) {
      if (title.includes(tok)) score += 10;
      else if (hay.includes(tok)) score += 4;
      else return 0;
    }
    return score;
  }

  function search(query, options = {}) {
    const { lane = 'all', limit = 0 } = options;
    const tokens = tokenize(query);
    if (!entries || !tokens.length) return [];

    let results = entries
      .map((e) => ({ entry: e, score: scoreEntry(e, tokens) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.entry);

    if (lane !== 'all') results = results.filter((e) => e.lane === lane);
    if (limit > 0) results = results.slice(0, limit);
    return results;
  }

  function loadIndex() {
    if (entries) return Promise.resolve(entries);
    if (loadPromise) return loadPromise;
    loadPromise = fetch(`${resolveUrl('scripts/search-index.json')}`)
      .then((r) => (r.ok ? r.json() : { entries: [] }))
      .then((data) => {
        entries = data.entries || [];
        return entries;
      })
      .catch(() => {
        entries = [];
        return entries;
      });
    return loadPromise;
  }

  function resultLink(entry) {
    const a = document.createElement('a');
    a.className = 'hub-result';
    a.href = resolveUrl(entry.path);

    const chip = document.createElement('span');
    chip.className = `lane-chip lane-${entry.lane === 'getting-started' ? 'getting-started' : entry.lane}`;
    chip.textContent = LANE_LABELS[entry.lane] || entry.lane;

    const body = document.createElement('div');
    body.className = 'hub-result-content';
    const h3 = document.createElement('h3');
    h3.textContent = entry.title;
    const p = document.createElement('p');
    p.textContent = entry.description;
    body.append(h3, p);
    a.append(chip, body);
    return a;
  }

  function fillResults(container, results, emptyMsg) {
    container.innerHTML = '';
    if (!results.length) {
      const el = document.createElement('p');
      el.className = 'hub-empty';
      el.textContent = emptyMsg;
      container.appendChild(el);
      return;
    }
    results.forEach((e) => container.appendChild(resultLink(e)));
  }

  function initSidebar() {
    const input = document.getElementById('global-search-input');
    const panel = document.getElementById('global-search-results');
    if (!input || !panel) return;

    const run = () => {
      const q = input.value.trim();
      if (!q) {
        panel.hidden = true;
        panel.innerHTML = '';
        return;
      }
      const results = search(q, { limit: 8 });
      fillResults(panel, results, 'No matches.');
      panel.hidden = false;
    };

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(run, 150);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        input.value = '';
        panel.hidden = true;
      }
    });

    loadIndex();
  }

  function initHub() {
    const input = document.getElementById('hub-search-input');
    const resultsEl = document.getElementById('hub-results');
    const summaryEl = document.getElementById('hub-results-summary');
    const browse = document.getElementById('hub-browse-section');
    if (!input || !resultsEl) return;

    let activeLane = 'all';
    const params = new URLSearchParams(global.location.search);
    if (params.get('q')) input.value = params.get('q');

    document.querySelectorAll('.lane-filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lane-filter').forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        activeLane = btn.dataset.lane;
        run();
      });
    });

    const run = () => {
      const q = input.value.trim();
      const url = new URL(global.location.href);
      if (q) url.searchParams.set('q', q);
      else url.searchParams.delete('q');
      global.history.replaceState(null, '', url);

      if (!q) {
        resultsEl.innerHTML = '';
        resultsEl.classList.remove('is-active');
        if (summaryEl) {
          summaryEl.textContent = activeLane === 'all'
            ? ''
            : `Type a keyword to search ${LANE_LABELS[activeLane] || activeLane}.`;
        }
        if (browse) browse.hidden = false;
        return;
      }

      const results = search(q, { lane: activeLane });
      fillResults(resultsEl, results, 'No matches — try another keyword or clear the lane filter.');
      resultsEl.classList.add('is-active');
      if (summaryEl) {
        summaryEl.textContent = `${results.length} result${results.length === 1 ? '' : 's'}`;
      }
      if (browse) browse.hidden = true;
    };

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(run, 150);
    });

    loadIndex().then(run);
  }

  let initialized = false;
  function init() {
    if (initialized) return;
    initialized = true;
    initSidebar();
    initHub();
  }

  global.PlaybookSearch = { init, loadIndex, search };
}(window));
