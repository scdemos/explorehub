/**
 * Injects gradient hero markup into guide-header / hub-hero blocks.
 * Run: node scripts/apply-hero-images.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

const root = new URL('..', import.meta.url).pathname;
const manifest = JSON.parse(
  readFileSync(join(root, 'assets/heroes/hero-manifest.json'), 'utf8'),
);

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

const SKIP = new Set(['playbooks/demo-patterns.html', 'cookbook/patterns.html']);

function heroKeyFor(rel) {
  if (PAGE_HERO[rel]) return PAGE_HERO[rel];
  const slug = basename(rel, '.html');
  if (manifest[slug]) return slug;
  if (rel.startsWith('use-cases/')) {
    for (const [re, key] of COOKBOOK_RULES) {
      if (re.test(slug)) return key;
    }
    return 'cookbook-default';
  }
  return null;
}

function normalizeLaneChips(html, rel) {
  html = html.replace(
    /<span class="lane-chip">Case study<\/span>/g,
    '<span class="lane-chip lane-case-study">Case study</span>',
  );
  if (rel.startsWith('playbooks/') && rel !== 'playbooks/index.html') {
    html = html.replace(
      /<span class="lane-chip">Playbook<\/span>/g,
      '<span class="lane-chip lane-playbook">Playbook</span>',
    );
    if (!html.includes('lane-playbook') && html.includes('guide-header-body')) {
      html = html.replace(
        /<div class="guide-header-body">\s*/,
        '<div class="guide-header-body">\n      <span class="lane-chip lane-playbook">Playbook</span>\n      ',
      );
    }
  }
  if (rel.startsWith('ai-and-aem/') && rel !== 'ai-and-aem/index.html' && !html.includes('lane-ai')) {
    html = html.replace(
      /<div class="guide-header-body">\s*/,
      '<div class="guide-header-body">\n      <span class="lane-chip lane-ai">AI and AEM</span>\n      ',
    );
  }
  return html;
}

function injectGuideHeader(html, tone) {
  if (html.includes('guide-header--with-media')) {
    if (!html.includes('guide-header-body')) {
      const re = /(<header class="guide-header guide-header--with-media hero-tone-[^"]+">)\s*/;
      html = html.replace(re, '$1\n      <div class="guide-header-body">\n      ');
      const close = /(\s*)<\/header>/;
      const idx = html.search(/<header class="guide-header guide-header--with-media/);
      if (idx !== -1) {
        const closeIdx = html.indexOf('</header>', idx);
        if (closeIdx !== -1 && !html.slice(idx, closeIdx).includes('</div>\n    </header>')) {
          html = `${html.slice(0, closeIdx)}\n      </div>${html.slice(closeIdx)}`;
        }
      }
    }
    return html;
  }

  const openTag = '<header class="guide-header">';
  const idx = html.indexOf(openTag);
  if (idx === -1) return html;

  const closeIdx = html.indexOf('</header>', idx);
  if (closeIdx === -1) return html;

  const inner = html.slice(idx + openTag.length, closeIdx);
  const replacement = `<header class="guide-header guide-header--with-media hero-tone-${tone}">
      <div class="guide-header-body">${inner}
      </div>
    </header>`;

  return html.slice(0, idx) + replacement + html.slice(closeIdx + '</header>'.length);
}

function injectHubHero(html, tone) {
  if (html.includes('hub-hero--with-media')) {
    if (!html.includes('hub-hero-body')) {
      html = html.replace(
        /(<section class="hub-hero hub-hero--with-media hero-tone-[^"]+">)\s*/,
        '$1\n      <div class="hub-hero-body">\n      ',
      );
      const idx = html.indexOf('<section class="hub-hero');
      const closeIdx = html.indexOf('</section>', idx);
      if (closeIdx !== -1 && !html.slice(idx, closeIdx).includes('hub-hero-body')) {
        html = `${html.slice(0, closeIdx)}\n      </div>${html.slice(closeIdx)}`;
      }
    }
    return html;
  }

  const openTag = '<section class="hub-hero">';
  const idx = html.indexOf(openTag);
  if (idx === -1) return html;

  const closeIdx = html.indexOf('</section>', idx);
  if (closeIdx === -1) return html;

  const inner = html.slice(idx + openTag.length, closeIdx);
  const replacement = `<section class="hub-hero hub-hero--with-media hero-tone-${tone}">
      <div class="hub-hero-body">${inner}
      </div>
    </section>`;

  return html.slice(0, idx) + replacement + html.slice(closeIdx + '</section>'.length);
}

function walk(dir, base = '') {
  let n = 0;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    if (statSync(full).isDirectory()) {
      n += walk(full, rel);
    } else if (name.endsWith('.html') && !SKIP.has(rel) && !rel.includes('demo-patterns')) {
      const key = heroKeyFor(rel);
      if (!key || !manifest[key]) continue;
      const tone = manifest[key];
      let html = readFileSync(full, 'utf8');
      const before = html;
      if (rel === 'index.html') html = injectHubHero(html, tone);
      else if (html.includes('class="guide-header"')) html = injectGuideHeader(html, tone);
      html = normalizeLaneChips(html, rel);
      if (html !== before) {
        writeFileSync(full, html);
        n += 1;
        console.log(rel, '→', tone);
      }
    }
  }
  return n;
}

console.log(`Updated ${walk(root)} pages`);
