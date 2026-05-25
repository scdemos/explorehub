/**
 * Sidebar navigation — structured lanes with nested groups.
 * Cookbook guides live in /use-cases/ for stable URLs.
 */

const PLAYBOOK_CHAPTERS = [
  { title: 'Gated content', href: 'playbooks/gated-content.html' },
  { title: 'Worker-backed forms', href: 'playbooks/worker-backed-forms.html' },
  { title: 'JSON2HTML dynamic pages', href: 'playbooks/json2html-dynamic-pages.html' },
  { title: 'Search & discovery', href: 'playbooks/search-and-discovery.html' },
  { title: 'Experimentation', href: 'playbooks/experimentation-and-personalization.html' },
  { title: 'Embeddable content', href: 'playbooks/embeddable-eds-content.html' },
  { title: 'RSS / JSON feeds', href: 'playbooks/rss-and-feeds.html' },
];

const CASE_STUDIES = [
  { title: 'cmegroup.com', href: 'case-studies/cmegroup.html' },
  { title: 'revolt.tv', href: 'case-studies/revolt.html' },
  { title: 'volvo', href: 'case-studies/volvo.html' },
  { title: 'crn.com', href: 'case-studies/crn.html' },
  { title: 'run disney', href: 'case-studies/run-disney.html' },
  { title: 'jet2', href: 'case-studies/jet2.html' },
];

const NAV_ITEMS_SCROLL_THRESHOLD = 10;

function nest(items, level = 2) {
  return items.map((item) => ({ ...item, level }));
}

const NAVIGATION_DATA = {
  categories: [
    {
      id: 'getting-started',
      title: 'Getting Started',
      indexHref: 'getting-started/index.html',
      items: [],
    },
    {
      id: 'playbooks',
      title: 'Playbooks & Recipes',
      indexHref: 'playbooks/index.html',
      items: [
        ...nest(PLAYBOOK_CHAPTERS),
      ],
    },
    {
      id: 'demo-library',
      title: 'Demo Site Library',
      indexHref: 'playbooks/hosted-demo-map.html',
      items: [
        { title: 'Experience Patterns', href: 'playbooks/hosted-demo-map.html#experience-patterns' },
        { title: 'Cookbook', href: 'cookbook/index.html' },
        { title: 'Create your Demo Playground', href: 'aem-playground/index.html' },
      ],
    },
    {
      id: 'ai-and-aem',
      title: 'AI and AEM',
      indexHref: 'ai-and-aem/index.html',
      items: [
        { title: 'Playground agent skills', href: 'ai-and-aem/playground-agent-skills.html' },
        { title: 'Skills', href: 'ai-and-aem/skills.html' },
        { title: 'Prompts', href: 'ai-and-aem/prompts.html' },
        { title: 'MCP', href: 'ai-and-aem/mcp.html' },
        { title: 'Modernization', href: 'ai-and-aem/modernization.html' },
      ],
    },
    {
      id: 'case-studies',
      title: 'Case studies',
      indexHref: 'case-studies/index.html',
      collapseDefault: true,
      items: [
        ...nest(CASE_STUDIES),
      ],
    },
    {
      id: 'references',
      title: 'References',
      indexHref: 'references/index.html',
      collapseDefault: true,
      items: [
        { title: 'Contributing', href: 'getting-started/contributing.html' },
      ],
    },
  ],
};

function getCurrentFile() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function isActivePage(href) {
  const currentPath = window.location.pathname.replace(/\/+$/, '/');
  const [pathPart, hashPart] = href.split('#');
  const linkFile = pathPart.split('/').pop();
  const linkDir = pathPart.includes('/') ? pathPart.split('/').slice(-2, -1)[0] : '';

  const pathMatches = currentPath.endsWith(`/${linkFile}`)
    && (linkDir === '' || currentPath.includes(`/${linkDir}/`));

  if (!pathMatches) {
    if (linkFile === 'hosted-demo-map.html' && currentPath.endsWith('/demo-patterns.html')) {
      return !hashPart || window.location.hash === `#${hashPart}`;
    }
    return false;
  }

  if (hashPart) {
    return window.location.hash === `#${hashPart}`;
  }

  if (linkFile === 'hosted-demo-map.html') {
    return !window.location.hash;
  }

  return true;
}

function getBasePath() {
  const path = window.location.pathname;
  const knownDirs = ['/use-cases/', '/playbooks/', '/cookbook/', '/case-studies/', '/ai-and-aem/', '/getting-started/', '/references/', '/aem-playground/'];
  if (knownDirs.some((d) => path.includes(d))) return '../';
  return './';
}

function knownPathInDeepDir() {
  return ['/use-cases/', '/playbooks/', '/cookbook/', '/case-studies/', '/ai-and-aem/', '/getting-started/', '/references/', '/aem-playground/']
    .some((d) => window.location.pathname.includes(d));
}

function categoryHasActiveChild(category) {
  return category.items?.some((item) => item.href && isActivePage(item.href)) ?? false;
}

function isCategorySectionActive(category) {
  return isActivePage(category.indexHref) || categoryHasActiveChild(category);
}

function renderCategoryTitle(category, basePath) {
  const title = document.createElement('a');
  title.className = 'nav-category-title';
  title.href = basePath + category.indexHref;
  title.textContent = category.title;
  if (isCategorySectionActive(category)) {
    title.classList.add('active');
  }
  if (isActivePage(category.indexHref)) {
    title.setAttribute('aria-current', 'page');
  }
  return title;
}

function createNavItemsPanel(category, basePath) {
  const itemsDiv = document.createElement('div');
  itemsDiv.className = 'nav-items nav-accordion-panel';
  itemsDiv.id = `nav-items-${category.id}`;
  if (category.items.length > NAV_ITEMS_SCROLL_THRESHOLD) {
    itemsDiv.classList.add('nav-items-scroll');
  }
  category.items.forEach((item) => appendNavEntry(itemsDiv, item, basePath));
  return itemsDiv;
}

function setAccordionExpanded(categoryDiv, expanded) {
  const panel = categoryDiv.querySelector('.nav-accordion-panel');
  const toggle = categoryDiv.querySelector('.nav-accordion-toggle');
  if (!panel || !toggle) return;

  categoryDiv.classList.toggle('is-collapsed', !expanded);
  panel.hidden = !expanded;
  panel.setAttribute('aria-hidden', String(!expanded));
  toggle.setAttribute('aria-expanded', String(expanded));
}

function isAccordionInitiallyExpanded(category) {
  if (category.collapseDefault) return false;
  return true;
}

/** Categories with child links render as a collapsible accordion. */
function appendAccordionCategory(categoryDiv, category, basePath) {
  categoryDiv.classList.add('nav-category-accordion');

  const expanded = isAccordionInitiallyExpanded(category);
  const header = document.createElement('div');
  header.className = 'nav-category-header';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-accordion-toggle';
  toggle.setAttribute('aria-controls', `nav-items-${category.id}`);
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} ${category.title}`);

  const icon = document.createElement('span');
  icon.className = 'nav-accordion-icon';
  icon.setAttribute('aria-hidden', 'true');
  toggle.appendChild(icon);

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    const next = !isOpen;
    setAccordionExpanded(categoryDiv, next);
    toggle.setAttribute('aria-label', `${next ? 'Collapse' : 'Expand'} ${category.title}`);
  });

  header.appendChild(renderCategoryTitle(category, basePath));
  header.appendChild(toggle);

  const itemsDiv = createNavItemsPanel(category, basePath);

  categoryDiv.appendChild(header);
  categoryDiv.appendChild(itemsDiv);
  setAccordionExpanded(categoryDiv, expanded);
  toggle.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} ${category.title}`);
}

function appendNavEntry(itemsDiv, item, basePath) {
  if (item.type === 'label') {
    const label = document.createElement('span');
    label.className = 'nav-group-label';
    if (item.level) label.classList.add(`nav-group-label-${item.level}`);
    label.textContent = item.title;
    itemsDiv.appendChild(label);
    return;
  }

  if (item.divider) {
    const divider = document.createElement('div');
    divider.className = 'nav-divider';
    divider.setAttribute('role', 'separator');
    itemsDiv.appendChild(divider);
    return;
  }

  const link = document.createElement('a');
  link.href = basePath + item.href;
  link.className = 'nav-item';
  if (item.level === 2) link.classList.add('nav-item-nested');
  if (item.level === 3) link.classList.add('nav-item-nested-2');
  link.textContent = item.title;

  if (isActivePage(item.href)) {
    link.classList.add('active');
    if (!item.href.includes('#') || window.location.hash) {
      link.setAttribute('aria-current', 'page');
    }
  }

  itemsDiv.appendChild(link);
}

function renderNavigation() {
  const basePath = getBasePath();
  const isHub = getCurrentFile() === 'index.html' && !knownPathInDeepDir();

  const nav = document.createElement('nav');
  nav.className = 'sidebar-nav';
  nav.setAttribute('aria-label', 'Main navigation');

  const homeLink = document.createElement('a');
  homeLink.href = `${basePath}index.html`;
  homeLink.className = `nav-home${isHub ? ' active' : ''}`;
  const homeLogo = document.createElement('img');
  homeLogo.src = `${basePath}assets/hub-logo.svg`;
  homeLogo.alt = '';
  homeLogo.width = 32;
  homeLogo.height = 32;
  homeLogo.className = 'nav-home-logo';
  homeLogo.decoding = 'async';
  const homeLabel = document.createElement('span');
  homeLabel.className = 'nav-home-label';
  homeLabel.textContent = 'Explore Hub';
  homeLink.append(homeLogo, homeLabel);
  nav.appendChild(homeLink);

  const searchWrap = document.createElement('div');
  searchWrap.className = 'nav-search';
  searchWrap.innerHTML = `
    <input type="search" id="global-search-input" placeholder="Search…" autocomplete="off"
      aria-label="Search playbook" aria-controls="global-search-results" />
    <div id="global-search-results" class="global-search-results" hidden></div>
  `;
  nav.appendChild(searchWrap);

  NAVIGATION_DATA.categories.forEach((category) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'nav-category';
    categoryDiv.setAttribute('data-category', category.id);

    if (category.items.length > 0) {
      appendAccordionCategory(categoryDiv, category, basePath);
    } else {
      categoryDiv.appendChild(renderCategoryTitle(category, basePath));
    }

    nav.appendChild(categoryDiv);
  });

  return nav;
}

const SITE_FOOTER = {
  disclaimer: '<strong>Reference, not production.</strong> Sample code only — adapt schemas, security, and performance for your project.',
  copyright: '© AEM Edge Delivery Reference Playbook.',
};

/** Page-specific footer notes (path suffix → HTML string). */
const FOOTER_NOTES = {
  'playbooks/index.html': 'Each playbook is a pattern, not a fixed implementation — adapt JSON schemas, security, and integrations to your project.',
  'playbooks/gated-content.html': 'Adapt to your own auth provider, role taxonomy, cache strategy, and observability needs.',
  'playbooks/worker-backed-forms.html': 'Add bot protection, server-side validation, rate limiting, and structured logging before shipping to a public surface.',
  'playbooks/json2html-dynamic-pages.html': 'Validate JSON shape and templates — missing keys render as empty strings. Add tests around template-to-output mapping for structured data.',
  'playbooks/search-and-discovery.html': 'For large content sets (10k+ pages), consider server-side filtering. The blocks here are UI-only — the data layer is swappable.',
  'playbooks/embeddable-eds-content.html': 'Test image-path rewrites, CORS, and auth-gated content. Adapt <code>connectedCallback</code> if your host site has its own initialization.',
  'playbooks/rss-and-feeds.html': 'Validate feeds on launch. Tune cache TTL for your editorial cadence; production newsrooms often want 60–300s.',
  'playbooks/hosted-demo-map.html': 'Hosted demo scripts are for demonstration. Adoption paths point at <code>scdemos/demo</code> — verify security, scale, and compliance for your tenant.',
  'case-studies/index.html': 'Live customer sites for orientation — inspect UX and adopt patterns via playbooks.',
  'case-studies/cmegroup.html': 'Customer-managed implementation — details vary by environment; use playbooks for adoptable patterns.',
  'getting-started/contributing.html': 'Contributions remain curated reference material, not Adobe-blessed architecture.',
  'getting-started/boilerplate-vs-author-kit-vs-playbooks.html': 'Start new projects from <code>aem-boilerplate</code>. Use this playbook as a pattern library, not a starting point.',
  'ai-and-aem/index.html': '<strong>Experimental.</strong> AI tooling on AEM evolves quickly. Links below are starting points, not stable API commitments.',
  'ai-and-aem/playground-agent-skills.html': 'Install paths differ by IDE — symlink skills from demo-playground and scdemos/demo when you want updates without recopying.',
  'ai-and-aem/skills.html': 'Skills evolve as agent runtimes mature — read descriptions in <code>scdemos/demo</code> rather than relying on summaries here.',
  'ai-and-aem/prompts.html': 'Adapt prompts to your project vocabulary and loaded skill names.',
  'ai-and-aem/mcp.html': 'MCP APIs and config formats are evolving. See <a href="https://github.com/adobe/da-mcp" target="_blank" rel="noopener">adobe/da-mcp</a> for current install steps; scope agent permissions before production tenants.',
  'ai-and-aem/modernization.html': 'Treat AI-driven migration as a force multiplier, not autopilot. Sample-review every batch and reserve architect time for edge cases.',
  'cookbook/index.html': 'Block guides are samples — adapt schemas, security model, performance budget, and integrations.',
  'aem-playground/index.html': 'Provisioning is automated behind this form — internal pilot. Do not share outside approved audiences without checking access policy.',
};

function getFooterNoteKey() {
  const path = window.location.pathname.replace(/^\//, '');
  return Object.keys(FOOTER_NOTES).find((key) => path.endsWith(key)) || null;
}

function initSiteFooter() {
  const footer = document.querySelector('footer');
  if (!footer || footer.dataset.enhanced === 'true') return;

  footer.classList.add('site-footer');
  footer.dataset.enhanced = 'true';
  footer.innerHTML = '';

  const noteKey = getFooterNoteKey();
  const noteHtml = noteKey ? FOOTER_NOTES[noteKey] : null;
  const useCustomDisclaimer = noteKey === 'ai-and-aem/index.html';

  const disclaimer = document.createElement('p');
  disclaimer.className = 'footer-disclaimer';
  disclaimer.innerHTML = useCustomDisclaimer ? noteHtml : SITE_FOOTER.disclaimer;
  footer.appendChild(disclaimer);

  if (noteHtml && !useCustomDisclaimer) {
    const note = document.createElement('p');
    note.className = 'footer-note';
    note.innerHTML = noteHtml;
    footer.appendChild(note);
  }

  const copy = document.createElement('p');
  copy.className = 'footer-copyright';
  copy.textContent = SITE_FOOTER.copyright;
  footer.appendChild(copy);
}

/**
 * Makes .card-grid .guide-card articles fully clickable when they contain h3 > a.
 */
function initClickableGuideCards() {
  document.querySelectorAll('.card-grid .guide-card').forEach((card) => {
    if (card.dataset.clickable === 'true' || card.tagName === 'A') return;

    const titleLink = card.querySelector(':scope > h3 > a[href]');
    if (!titleLink) return;

    const href = titleLink.getAttribute('href');
    if (!href || href.startsWith('#')) return;

    const overlay = document.createElement('a');
    overlay.className = 'guide-card-link';
    overlay.href = href;
    if (titleLink.target) overlay.target = titleLink.target;
    if (titleLink.rel) overlay.rel = titleLink.rel;
    overlay.setAttribute(
      'aria-label',
      `Open: ${titleLink.textContent.replace(/\s+/g, ' ').trim()}`,
    );

    const h3 = titleLink.closest('h3');
    if (h3) h3.textContent = titleLink.textContent;

    card.classList.add('is-clickable');
    card.prepend(overlay);
    card.dataset.clickable = 'true';
  });
}

function loadGlobalSearch() {
  const base = getBasePath();
  if (window.PlaybookSearch) {
    window.PlaybookSearch.init();
    return;
  }
  const script = document.createElement('script');
  script.src = `${base}scripts/global-search.js`;
  script.async = true;
  script.onload = () => window.PlaybookSearch?.init();
  document.head.appendChild(script);
}

function initNavigation() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  sidebar.appendChild(renderNavigation());
  loadGlobalSearch();

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(sidebar.classList.contains('open')));
    });
  }

  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && e.target !== mobileToggle) {
      sidebar.classList.remove('open');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initPlaybookChrome() {
  initSiteFooter();
  initClickableGuideCards();
  initNavigation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPlaybookChrome);
} else {
  initPlaybookChrome();
}
