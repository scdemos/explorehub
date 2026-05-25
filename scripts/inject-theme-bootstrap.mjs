import { readFileSync, writeFileSync } from 'fs';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const root = new URL('..', import.meta.url).pathname;
const inject = '\n  <script src="../scripts/theme-bootstrap.js"></script>';
let count = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith('.html')) {
      let text = readFileSync(full, 'utf8');
      if (text.includes('theme-bootstrap.js')) continue;
      const rel = full.slice(root.length + 1);
      const depth = rel.split('/').length - 1;
      const sp = `${'../'.repeat(depth)}scripts/theme-bootstrap.js`;
      const snip = `\n  <script src="${sp}"></script>`;
      const variants = [
        '<link rel="stylesheet" href="../styles/styles.css">',
        '<link rel="stylesheet" href="../styles/styles.css" />',
        '<link rel="stylesheet" href="styles/styles.css">',
      ];
      for (const v of variants) {
        if (text.includes(v)) {
          text = text.replace(v, v + snip, 1);
          writeFileSync(full, text);
          count += 1;
          break;
        }
      }
    }
  }
}

walk(root);
console.log(`updated ${count} files`);
