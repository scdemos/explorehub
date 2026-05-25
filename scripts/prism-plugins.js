/**
 * Prism Plugins - Line numbers and toolbar
 */

import Prism from './prism-core.js';

// Line Numbers Plugin
Prism.plugins.lineNumbers = {
  init: function() {
    document.querySelectorAll('pre[class*="language-"]').forEach(pre => {
      if (pre.classList.contains('line-numbers')) {
        this.addLineNumbers(pre);
      }
    });
  },

  addLineNumbers: function(pre) {
    const code = pre.querySelector('code');
    if (!code) return;

    const lines = code.textContent.split('\n').length - 1;
    const lineNumbersWrapper = document.createElement('span');
    lineNumbersWrapper.className = 'line-numbers-rows';
    lineNumbersWrapper.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < lines; i++) {
      lineNumbersWrapper.appendChild(document.createElement('span'));
    }

    if (code.querySelector('.line-numbers-rows')) {
      code.querySelector('.line-numbers-rows').remove();
    }

    code.appendChild(lineNumbersWrapper);
  }
};

// Toolbar Plugin
Prism.plugins.toolbar = {
  init: function() {
    document.querySelectorAll('pre[class*="language-"]').forEach(pre => {
      this.addToolbar(pre);
    });
  },

  addToolbar: function(pre) {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-toolbar';

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';

    // Copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'toolbar-item copy-button';
    copyButton.textContent = 'Copy';
    copyButton.addEventListener('click', () => {
      const code = pre.querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 2000);
      });
    });

    toolbar.appendChild(copyButton);
    wrapper.appendChild(toolbar);
  }
};

// Initialize plugins
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      Prism.plugins.lineNumbers.init();
      Prism.plugins.toolbar.init();
    });
  } else {
    Prism.plugins.lineNumbers.init();
    Prism.plugins.toolbar.init();
  }
}

export default Prism.plugins;
