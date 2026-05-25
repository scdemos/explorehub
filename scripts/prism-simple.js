/**
 * Prism - Simple standalone version
 * Works without ES modules for file:// URLs
 */

(function() {
  const Prism = {
    languages: {},

    highlight: function(text, grammar) {
      if (!grammar) return this.encode(text);

      const tokens = [];
      let currentPos = 0;
      const matchedRanges = [];

      // Collect all matches with their positions
      for (const tokenName in grammar) {
        const pattern = grammar[tokenName];
        let match;

        // Reset regex
        pattern.lastIndex = 0;

        while ((match = pattern.exec(text)) !== null) {
          matchedRanges.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
            type: tokenName
          });
        }
      }

      // Sort by position
      matchedRanges.sort((a, b) => a.start - b.start);

      // Filter overlapping ranges (keep first match)
      const filtered = [];
      for (let i = 0; i < matchedRanges.length; i++) {
        const current = matchedRanges[i];
        let overlap = false;

        for (const prev of filtered) {
          if (current.start < prev.end) {
            overlap = true;
            break;
          }
        }

        if (!overlap) {
          filtered.push(current);
        }
      }

      // Build output
      let html = '';
      let pos = 0;

      for (const range of filtered) {
        // Add text before match
        if (range.start > pos) {
          html += this.encode(text.substring(pos, range.start));
        }
        // Add highlighted match
        html += `<span class="token ${range.type}">${this.encode(range.text)}</span>`;
        pos = range.end;
      }

      // Add remaining text
      if (pos < text.length) {
        html += this.encode(text.substring(pos));
      }

      return html;
    },

    encode: function(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },

    highlightAll: function() {
      document.querySelectorAll('pre code[class*="language-"]').forEach(block => {
        const match = block.className.match(/language-(\w+)/);
        if (!match) return;

        const language = match[1];
        const grammar = this.languages[language];

        if (grammar) {
          const code = block.textContent;
          block.innerHTML = this.highlight(code, grammar);
        }
      });
    }
  };

  // JavaScript
  Prism.languages.javascript = {
    'comment': /\/\/.*|\/\*[\s\S]*?\*\//g,
    'string': /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/g,
    'keyword': /\b(?:async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|if|import|in|instanceof|let|new|return|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/g,
    'boolean': /\b(?:true|false|null|undefined)\b/g,
    'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/gi,
    'function': /\b[a-z_]\w*(?=\()/gi,
    'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/g,
    'punctuation': /[{}[\];(),.:]/g
  };

  // CSS
  Prism.languages.css = {
    'comment': /\/\*[\s\S]*?\*\//g,
    'atrule': /@[\w-]+/g,
    'selector': /[^{}\s][^{}]*(?=\s*\{)/g,
    'property': /[\w-]+(?=\s*:)/g,
    'string': /(["'])(?:(?!\1)[^\\\r\n]|\\(?:\r\n|[\s\S]))*\1/g,
    'important': /!important\b/gi,
    'function': /[\w-]+(?=\()/g,
    'number': /\b\d+(?:\.\d+)?(?:%|[a-z]+)?\b/gi,
    'punctuation': /[{}:;,()]/g
  };

  // HTML
  Prism.languages.html = Prism.languages.markup = {
    'comment': /<!--[\s\S]*?-->/g,
    'doctype': /<![^>]+>/gi,
    'tag': /<\/?[\w:-]+(?:\s+[\w:-]+(?:=(?:"[^"]*"|'[^']*'|[^\s"'=><`]+))?)*\s*\/?>/gi
  };

  // JSON
  Prism.languages.json = {
    'property': /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/g,
    'string': /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/g,
    'number': /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/gi,
    'punctuation': /[{}[\],]/g,
    'operator': /:/g,
    'boolean': /\b(?:true|false)\b/g,
    'null': /\bnull\b/g
  };

  // Bash
  Prism.languages.bash = Prism.languages.shell = {
    'comment': /#.*/g,
    'string': /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g,
    'variable': /\$\{?[a-zA-Z_]\w*\}?/g,
    'keyword': /\b(?:if|then|else|elif|fi|for|while|do|done|case|esac|function)\b/g,
    'operator': /[|&;()<>]/g
  };

  // Text/Plain
  Prism.languages.text = Prism.languages.plain = {};

  // Auto-highlight
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Prism.highlightAll());
  } else {
    Prism.highlightAll();
  }

  // Export globally
  window.Prism = Prism;
})();
