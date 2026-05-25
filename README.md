# EDS Reference Playbook

A curated, use-case-driven reference for building real things on AEM Edge Delivery Services and Document Authoring. Implementation-first, code-cited, intentionally lightweight.

> **Reference, not production.** Code linked from this playbook is provided as a sample, and is not suitable for production use as-is. Adapt to your own schemas, security model, performance budget, and integrations.

---

## What this is

A bridge between the official "Getting Started" tutorials on [aem.live](https://www.aem.live/docs/) / [docs.da.live](https://docs.da.live/developers) and the enterprise use cases customers actually ship. Every chapter:

- Frames a real-world problem.
- Points at working code in [scdemos/demo](https://github.com/scdemos/demo) via commit-pinned GitHub permalinks.
- Shows how to adapt it into your own project.
- Caps at a 7-block schema — no chapter ever grows into a tutorial-of-tutorials.

## What this is NOT

- Not a boilerplate, starter kit, or framework
- Not "Adobe-blessed architecture" — read it as community / SC reference
- Not a documentation portal duplicating aem.live or docs.da.live
- No build step, no framework, no backing CMS — pure static HTML

## Six lanes

| Lane | What it answers |
|---|---|
| [**Explore Hub**](./index.html) | Search + pick a lane |
| [**Getting Started**](./getting-started/index.html) | What this is and how to navigate |
| [**Playbooks**](./playbooks/index.html) | [Chapters](./playbooks/index.html) (7 guides) + [Demo Site - Library](./playbooks/hosted-demo-map.html) |
| [**Cookbook**](./cookbook/index.html) | Block and plugin reference (26 guides) |
| [**Case studies**](./case-studies/index.html) | Production EDS sites (cmegroup, revolt, volvo, crn, run disney, jet2) |
| [**AI and AEM**](./ai-and-aem/index.html) | Meta skill + 17 task skills, prompts, MCP |
| [**References**](./references/index.html) | Official doc links |

## Demo Site - Library

Hosted demo use cases live under `https://demo.bbird.live/demo-docs/usecases/*`. The playbook does **not** duplicate those SC demo scripts. Instead, [playbooks/hosted-demo-map.html](./playbooks/hosted-demo-map.html) (Demo Site - Library) links each walkthrough to adoption paths and points to:

- **Playbook chapter** — full 7-block adoption guide with GitHub snippets  
- **Cookbook** — block-level reference where relevant  
- **Live demo** — hosted walkthrough for customer demos  

## The 7 playbooks

**Experience patterns**
- [Gated content](./playbooks/gated-content.html) — Cloudflare Access + CDN HTML rewriting + author preview toggle
- [Search & discovery](./playbooks/search-and-discovery.html) — query-index-driven search and recommendations
- [Experimentation & personalization](./playbooks/experimentation-and-personalization.html) — A/B + audiences + Adobe Target

**Dynamic content & workers**
- [Structured JSON → dynamic HTML](./playbooks/json2html-dynamic-pages.html) — Mustache templates + mhast fallback
- [RSS / JSON Feed syndication](./playbooks/rss-and-feeds.html) — Worker over query-index
- [Embeddable EDS content](./playbooks/embeddable-eds-content.html) — web component with shadow-DOM isolation

**Forms & workflows**
- [Worker-backed forms](./playbooks/worker-backed-forms.html) — JSON form → Cloudflare Worker → Slack / n8n / CRM

Calculators and dynamic blocks (tabs/modal) are covered in the **Cookbook** and **Demo Site - Library**, not standalone playbook chapters.

## Agent skills (IDE / LLM)

Install **`eds-reference-playbook`** so assistants consult this playbook before inventing EDS patterns:

```bash
# Example: global Cursor skill (recommended)
mkdir -p ~/.cursor/skills
cp -R .skills/eds-reference-playbook ~/.cursor/skills/
```

Also copy task skills from [scdemos/demo `.skills/`](https://github.com/scdemos/demo/tree/main/.skills) into each EDS project. Step-by-step: [Playground agent skills](./ai-and-aem/playground-agent-skills.html).

## Run locally

Pure static HTML. Any HTTP server will do:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Distribute as a zip

```bash
cd ..
zip -r eds-reference-playbook.zip demo-playground \
  -x "demo-playground/.DS_Store" \
  -x "demo-playground/**/.DS_Store" \
  -x "demo-playground/node_modules/*"
```

## Embed an excerpt elsewhere

The playbook is a static site, so any chapter can be linked or iframed. For richer in-doc embeds, see [`embed-snippets.md`](./embed-snippets.md) — copy/paste snippets ready for AEM docs, internal wikis, or partner sites.

## Layout

```
demo-playground/
├── index.html                  # Explore Hub (unified search)
├── README.md
├── embed-snippets.md           # Snippets for embedding chapters elsewhere
├── getting-started/
│   ├── index.html
│   ├── boilerplate-vs-author-kit-vs-playbooks.html
│   └── contributing.html
├── playbooks/                  # 10 use-case-first chapters
│   ├── index.html
│   ├── _template.html          # Canonical 7-block chapter template
│   └── ...
├── cookbook/
│   └── index.html              # Lands users into use-cases/ (block-by-block reference)
├── case-studies/               # Production EDS customer sites
│   └── ...
├── use-cases/                  # 26 audit-fixed block / plugin / tool guides
│   └── ...
├── .skills/                    # eds-reference-playbook meta skill (canonical)
├── ai-and-aem/                 # AI lane: skills, prompts, MCP, modernization
│   └── ...
├── references/                 # External docs hub
├── styles/styles.css           # Heritage theme + layout
├── scripts/
│   ├── navigation.js           # Sidebar (five lanes)
│   ├── global-search.js        # Search on hub + sidebar
│   └── search-index.json       # Unified search index
└── assets/
```

## Contributing

See [`getting-started/contributing.html`](./getting-started/contributing.html) for:
- How to file a use-case request
- Chapter checklist (7-block schema, commit-pinned permalinks, lane chips)
- Anti-goals (what we don't accept)

Issues / PRs welcome at [scdemos/demo-playground](https://github.com/scdemos/demo-playground).

## Anti-goals (revisited on every PR)

- ✗ Don't duplicate content from aem.live / docs.da.live
- ✗ Don't invent best practices not grounded in `scdemos/demo` source
- ✗ Don't add a runtime build step, framework, or CMS
- ✗ Don't let any chapter exceed the 7-block schema
- ✗ Don't link to `main` — use commit-pinned permalinks so freshness is conscious

## License

Educational reference. The code referenced lives in [scdemos/demo](https://github.com/scdemos/demo) under its own license; this site is a free-to-use reference layer over it.

---

Built for customers, partners, SCs, and internal teams looking for "Okay, this is actually possible on EDS and DA, and I can inspect how they did it."
