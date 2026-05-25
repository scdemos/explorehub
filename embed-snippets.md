# Embed snippets — drop the playbook into other sites

Three ready-to-paste snippets for surfacing this playbook from AEM docs, DA docs, internal wikis, and partner sites.

> The playbook is intentionally a small static site so embedding stays trivial. None of these snippets require a build step.

---

## 1. Single-chapter callout (in any markdown / HTML page)

The smallest unit. A blockquote-style callout with a one-line description and a link.

**Markdown**

```markdown
> 📘 **Reference Playbook — Gated content**
> Cloudflare Access + CDN HTML rewriting + author preview toggle for member-only EDS pages.
> [Read the playbook →](https://demo.bbird.live/playbook/playbooks/gated-content.html)
```

**HTML**

```html
<aside class="playbook-callout" role="note">
  <strong>📘 Reference Playbook — Gated content</strong>
  <p>Cloudflare Access + CDN HTML rewriting + author preview toggle for member-only EDS pages.</p>
  <a href="https://demo.bbird.live/playbook/playbooks/gated-content.html">Read the playbook →</a>
</aside>
```

---

## 2. Chapter card grid (for "see also" sections)

For a docs page that wants to surface a curated set of playbooks at the bottom.

```html
<section class="playbook-cards">
  <h2>Related implementation playbooks</h2>
  <div class="playbook-grid">
    <a class="playbook-card" href="https://demo.bbird.live/playbook/playbooks/gated-content.html">
      <strong>Gated content</strong>
      <p>Cloudflare Access + CDN + author preview.</p>
    </a>
    <a class="playbook-card" href="https://demo.bbird.live/playbook/playbooks/worker-backed-forms.html">
      <strong>Worker-backed forms</strong>
      <p>JSON form → Cloudflare Worker → Slack / n8n / CRM.</p>
    </a>
    <a class="playbook-card" href="https://demo.bbird.live/playbook/playbooks/search-and-discovery.html">
      <strong>Search &amp; discovery</strong>
      <p>Faceted search and recommendations from query-index.</p>
    </a>
  </div>
</section>
```

CSS (drop into the host's stylesheet, scope under `.playbook-cards`):

```css
.playbook-cards { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
.playbook-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.playbook-card {
  display: block; padding: 1rem 1.25rem; border: 1px solid #e5e7eb; border-radius: 8px;
  text-decoration: none; color: inherit; transition: border-color 120ms;
}
.playbook-card:hover { border-color: #1473e6; }
.playbook-card strong { display: block; margin-bottom: 0.25rem; }
.playbook-card p { margin: 0; color: #4b5563; font-size: 0.875rem; }
```

---

## 3. Iframe of a single chapter (in-page reading)

For wiki pages or knowledge-base systems where authors want the chapter to render inline.

```html
<iframe
  src="https://demo.bbird.live/playbook/playbooks/gated-content.html"
  title="Reference Playbook — Gated content"
  loading="lazy"
  style="width: 100%; height: 70vh; border: 1px solid #e5e7eb; border-radius: 8px;"
  sandbox="allow-same-origin allow-scripts allow-popups">
</iframe>
<p style="font-size: 0.875rem; color: #6b7280;">
  Source: <a href="https://demo.bbird.live/playbook/playbooks/gated-content.html" target="_blank">Reference Playbook — Gated content</a>
</p>
```

`sandbox` keeps host JS isolated; `loading="lazy"` defers the fetch until the section scrolls into view.

---

## 4. Search box that points at the Explore Hub

Drop into a docs sidebar or homepage to give users a single search experience.

```html
<form action="https://demo.bbird.live/playbook/" method="get" style="display:flex; gap:0.5rem;">
  <input type="search" name="q" placeholder="Search Reference Playbook…"
         aria-label="Search Reference Playbook" required
         style="flex:1; padding:0.5rem 0.75rem; border:1px solid #d1d5db; border-radius:6px;">
  <button type="submit" style="padding:0.5rem 1rem; background:#1473e6; color:#fff; border:0; border-radius:6px;">
    Search
  </button>
</form>
```

The Explore Hub reads `?q=...` from the URL on load and runs the search automatically.

---

## 5. AEM block table form (for embedding inside an EDS page)

If you're embedding inside another EDS site, author this block in DA:

```
+--------------------------------------+
| Embed                                |
+--------------------------------------+
| https://demo.bbird.live/playbook/    |
|   playbooks/gated-content.html       |
+--------------------------------------+
```

The standard Embed block will render the chapter inside the host EDS page. Combined with the [Embeddable EDS content playbook](./playbooks/embeddable-eds-content.html), you can also use the `<aem-embed url="...">` web component for full block-level decoration with shadow-DOM isolation.

---

## URL conventions

All chapters have stable URLs:

- Hub: `/playbook/`
- Lane index: `/playbook/{lane}/`
- Chapter: `/playbook/{lane}/{slug}.html`
- Cookbook: `/playbook/use-cases/{slug}.html`

These won't change without a redirect. Safe to bookmark and link from external surfaces.

---

## Hosting note

If you self-host (vs linking to `demo.bbird.live`), update the URLs in these snippets to match. The playbook is fully relative-link-safe inside its own folder, so wherever you mount it the internal navigation works.
