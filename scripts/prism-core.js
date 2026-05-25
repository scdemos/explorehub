/**
 * Prism Core - Lightweight syntax highlighter
 * Simplified version for developer guides
 */

const Prism = {
  languages: {},
  plugins: {},

  highlight: function(text, grammar, language) {
    return this.tokenize(text, grammar).map(token => {
      if (typeof token === 'string') {
        return this.encode(token);
      }
      return this.wrapToken(token);
    }).join('');
  },

  tokenize: function(text, grammar) {
    const tokens = [text];

    for (const token in grammar) {
      if (!grammar.hasOwnProperty(token)) continue;

      const pattern = grammar[token];

      for (let i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] !== 'string') continue;

        const matches = tokens[i].match(pattern);
        if (!matches) continue;

        const before = tokens[i].substring(0, matches.index);
        const match = matches[0];
        const after = tokens[i].substring(matches.index + match.length);

        const newTokens = [];
        if (before) newTokens.push(before);
        newTokens.push({ type: token, content: match });
        if (after) newTokens.push(after);

        tokens.splice(i, 1, ...newTokens);
        i += newTokens.length - 1;
      }
    }

    return tokens;
  },

  wrapToken: function(token) {
    return `<span class="token ${token.type}">${this.encode(token.content)}</span>`;
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
      const language = [...block.classList].find(c => c.startsWith('language-'))?.replace('language-', '');
      if (language && this.languages[language]) {
        const code = block.textContent;
        block.innerHTML = this.highlight(code, this.languages[language], language);
      }
    });
  }
};

// JavaScript Language Definition
Prism.languages.javascript = {
  'comment': /\/\/.*|\/\*[\s\S]*?\*\//g,
  'string': /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/g,
  'keyword': /\b(?:async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|if|import|in|instanceof|let|new|return|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/g,
  'boolean': /\b(?:true|false)\b/g,
  'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/gi,
  'function': /\b[a-z_]\w*(?=\()/gi,
  'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/g,
  'punctuation': /[{}[\];(),.:]/g
};

// CSS Language Definition
Prism.languages.css = {
  'comment': /\/\*[\s\S]*?\*\//g,
  'atrule': /@[\w-]+(?:\([^)]*\))?/g,
  'selector': /[^{}\s][^{}]*(?=\s*\{)/g,
  'property': /[\w-]+(?=\s*:)/g,
  'string': /(["'])(?:(?!\1)[^\\\r\n]|\\(?:\r\n|[\s\S]))*\1/g,
  'important': /!important\b/gi,
  'function': /[\w-]+(?=\()/g,
  'number': /\b\d+(?:\.\d+)?(?:%|[a-z]+)?\b/gi,
  'punctuation': /[{}:;,()]/g
};

// HTML Language Definition
Prism.languages.html = Prism.languages.markup = {
  'comment': /<!--[\s\S]*?-->/g,
  'doctype': /<![^>]+>/gi,
  'tag': /<\/?[\w:-]+(?:\s+[\w:-]+(?:=(?:"[^"]*"|'[^']*'|[^\s"'=><`]+))?)*\s*\/?>/gi,
  'attr-name': /[\w:-]+(?=\s*=)/g,
  'attr-value': /(?:=\s*)(?:"[^"]*"|'[^']*'|[^\s"'=><`]+)/g
};

// JSON Language Definition
Prism.languages.json = {
  'property': /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/g,
  'string': /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/g,
  'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/gi,
  'punctuation': /[{}[\],]/g,
  'operator': /:/g,
  'boolean': /\b(?:true|false)\b/g,
  'null': /\bnull\b/g
};

// Bash/Shell Language Definition
Prism.languages.bash = Prism.languages.shell = {
  'comment': /#.*/g,
  'string': /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g,
  'variable': /\$\{?[a-zA-Z_]\w*\}?/g,
  'function': /\b\w+(?=\()/g,
  'keyword': /\b(?:if|then|else|elif|fi|for|while|do|done|case|esac|function)\b/g,
  'operator': /[|&;()<>]/g
};

// Text/Plain (no highlighting)
Prism.languages.text = Prism.languages.plain = {};

// Auto-highlight on load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Prism.highlightAll());
  } else {
    Prism.highlightAll();
  }
}

export default Prism;
