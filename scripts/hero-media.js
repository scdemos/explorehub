/**
 * Injects gradient hero backgrounds into guide-header / hub-hero (EDS hero-block pattern).
 */
(function heroMedia() {
  const PAGE_HERO = {
    'index.html': 'hub-home',
    'getting-started/index.html': 'lane-getting-started',
    'playbooks/index.html': 'lane-playbooks',
    'cookbook/index.html': 'lane-cookbook',
    'ai-and-aem/index.html': 'lane-ai',
    'case-studies/index.html': 'lane-case-studies',
    'references/index.html': 'lane-references',
    'aem-playground/index.html': 'lane-playground',
    'playbooks/hosted-demo-map.html': 'hosted-demo-map',
    'getting-started/contributing.html': 'contributing',
    'getting-started/boilerplate-vs-author-kit-vs-playbooks.html': 'boilerplate-vs-author-kit-vs-playbooks',
  };

  const COOKBOOK_RULES = [
    [/hero|teaser/, 'cookbook-hero'],
    [/form|n8n|quiz/, 'cookbook-forms'],
    [/search|feed|related-articles|product-grid/, 'cookbook-search'],
    [/modal|embed|tabs|columns|cards|fragment|faq|table|journey/, 'cookbook-ui'],
    [/calculator|networth|savings|compound/, 'cookbook-data'],
    [/auth|experimentation|page-load/, 'cookbook-security'],
  ];

  /* Synced with assets/heroes/hero-manifest.json — values are gradient tone names */
  const HERO_TONE = {
    'hub-home': 'hub',
    'lane-getting-started': 'getting-started',
    'lane-playbooks': 'playbook',
    'lane-cookbook': 'cookbook',
    'lane-ai': 'ai',
    'lane-case-studies': 'case-study',
    'lane-references': 'reference',
    'lane-playground': 'playground',
    'hosted-demo-map': 'reference',
    'gated-content': 'playbook',
    'worker-backed-forms': 'playbook',
    'json2html-dynamic-pages': 'playbook',
    'search-and-discovery': 'playbook',
    'experimentation-and-personalization': 'playbook',
    'embeddable-eds-content': 'playbook',
    'rss-and-feeds': 'playbook',
    'financial-markets': 'case-study',
    'media-entertainment': 'case-study',
    automotive: 'case-study',
    'b2b-publishing': 'case-study',
    'events-registration': 'case-study',
    'travel-consumer': 'case-study',
    'playground-agent-skills': 'ai',
    skills: 'ai',
    prompts: 'ai',
    mcp: 'ai',
    modernization: 'ai',
    contributing: 'getting-started',
    'boilerplate-vs-author-kit-vs-playbooks': 'getting-started',
    'cookbook-default': 'cookbook',
    'cookbook-hero': 'cookbook',
    'cookbook-forms': 'cookbook',
    'cookbook-data': 'cookbook',
    'cookbook-ui': 'cookbook',
    'cookbook-search': 'cookbook',
    'cookbook-security': 'cookbook',
  };

  function pageRel() {
    const nav = document.querySelector('script[src*="navigation.js"]');
    if (nav) {
      try {
        const navUrl = new URL(nav.src, window.location.href);
        const rootPath = navUrl.pathname.replace(/\/scripts\/navigation\.js$/i, '');
        const pageUrl = new URL(window.location.href);
        if (pageUrl.pathname.startsWith(rootPath)) {
          let rel = pageUrl.pathname.slice(rootPath.length).replace(/^\//, '');
          if (!rel || rel.endsWith('/')) rel += 'index.html';
          return rel;
        }
      } catch {
        /* fall through */
      }
    }
    let path = window.location.pathname.replace(/^\//, '');
    const laneDirs = [
      'use-cases', 'playbooks', 'case-studies', 'ai-and-aem',
      'getting-started', 'cookbook', 'references', 'aem-playground',
    ];
    for (const dir of laneDirs) {
      const marker = `/${dir}/`;
      const i = path.indexOf(marker);
      if (i !== -1) {
        path = path.slice(i + 1);
        break;
      }
    }
    if (path === 'index.html' || path.endsWith('/index.html')) {
      /* root index when served from site root */
    } else if (!path.includes('/') && !path.endsWith('.html')) {
      path = 'index.html';
    }
    if (!path || path.endsWith('/')) path += 'index.html';
    return path;
  }

  function heroKeyFor(rel) {
    if (PAGE_HERO[rel]) return PAGE_HERO[rel];
    const slug = rel.split('/').pop().replace(/\.html$/, '');
    if (rel.includes('demo-patterns') || rel === 'cookbook/patterns.html') return null;
    if (rel.startsWith('use-cases/')) {
      for (const [re, key] of COOKBOOK_RULES) {
        if (re.test(slug)) return key;
      }
      return 'cookbook-default';
    }
    return slug;
  }

  function wrapHero(container, { bodyClass, withClass, tone }) {
    if (!container || !tone) return;
    container.classList.add(withClass, `hero-tone-${tone}`);
    container.querySelectorAll('img').forEach((img) => img.remove());
    if (!container.querySelector(`.${bodyClass}`)) {
      const body = document.createElement('div');
      body.className = bodyClass;
      [...container.children].forEach((child) => {
        if (!child.classList.contains(bodyClass)) body.appendChild(child);
      });
      container.appendChild(body);
    }
  }

  function init() {
    const rel = pageRel();
    const key = heroKeyFor(rel);
    const tone = key && HERO_TONE[key];
    if (!tone) return;

    const hub = document.querySelector('.hub-hero');
    if (hub) {
      wrapHero(hub, {
        bodyClass: 'hub-hero-body',
        withClass: 'hub-hero--with-media',
        tone,
      });
    }

    document.querySelectorAll('.guide-header').forEach((header) => {
      wrapHero(header, {
        bodyClass: 'guide-header-body',
        withClass: 'guide-header--with-media',
        tone,
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
