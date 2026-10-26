/**
 * Tool 33: HTML to Markdown Converter
 * Studio layout with split work panel and settings sidebar.
 */

window.initHtmlToMd = function() {
  const container = document.getElementById('tool-html-to-md');
  if (!container) return;

  const inputEl = document.getElementById('html-input');
  const outputEl = document.getElementById('md-output');
  const statsEl = document.getElementById('html-stats');
  const loadBtn = document.getElementById('html-load-file-btn');
  const fileInput = document.getElementById('html-file-input');
  const copyBtn = document.getElementById('html-copy-btn');
  const downloadBtn = document.getElementById('html-download-btn');
  const demoBtn = document.getElementById('html-paste-demo');

  function convertHtmlToMarkdown(html) {
    if (window.TurndownService) {
      try {
        const turndownService = new window.TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
        return turndownService.turndown(html);
      } catch (e) {
        console.warn('Turndown fallback', e);
      }
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    function nodeToMd(node) {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.replace(/\s+/g, ' ');
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      const tag = node.tagName.toLowerCase();
      const children = Array.from(node.childNodes).map(nodeToMd).join('');

      switch (tag) {
        case 'h1': return `\n\n# ${children.trim()}\n\n`;
        case 'h2': return `\n\n## ${children.trim()}\n\n`;
        case 'h3': return `\n\n### ${children.trim()}\n\n`;
        case 'p': return `\n\n${children.trim()}\n\n`;
        case 'strong':
        case 'b': return `**${children.trim()}**`;
        case 'em':
        case 'i': return `*${children.trim()}*`;
        case 'code': return `\`${children.trim()}\``;
        case 'pre': return `\n\n\`\`\`\n${children.trim()}\n\`\`\`\n\n`;
        case 'blockquote': return `\n\n> ${children.trim()}\n\n`;
        case 'a': return `[${children.trim() || node.getAttribute('href')}](${node.getAttribute('href') || '#'})`;
        case 'ul': return '\n' + Array.from(node.children).map(li => `- ${nodeToMd(li).trim()}`).join('\n') + '\n';
        case 'ol': return '\n' + Array.from(node.children).map((li, idx) => `${idx + 1}. ${nodeToMd(li).trim()}`).join('\n') + '\n';
        case 'li': return children;
        default: return children;
      }
    }

    return nodeToMd(doc.body).replace(/\n{3,}/g, '\n\n').trim();
  }

  function update() {
    const html = inputEl.value;
    statsEl.textContent = `${html.length} chars`;
    outputEl.value = convertHtmlToMarkdown(html);
  }

  inputEl.addEventListener('input', update);

  loadBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      inputEl.value = await ToolkitUtils.readFileAsText(f);
      update();
      ToolkitUtils.showToast(`Loaded ${f.name}`, 'success');
    } catch (err) {
      ToolkitUtils.showToast('Failed to read file', 'error');
    }
  });

  copyBtn.addEventListener('click', () => {
    ToolkitUtils.copyToClipboard(outputEl.value, 'Markdown copied to clipboard!');
  });

  downloadBtn.addEventListener('click', () => {
    ToolkitUtils.downloadText(outputEl.value, 'converted.md', 'text/markdown;charset=utf-8');
    ToolkitUtils.showToast('Downloaded converted.md', 'success');
  });

  demoBtn.addEventListener('click', () => {
    inputEl.value = `<h1>fileTookKit HTML Converter</h1>
<p>Clean conversions with <strong>bold</strong> and <em>italic</em> formatting.</p>
<blockquote>Client-side processing preserves privacy.</blockquote>
<ul>
  <li>Fast conversion</li>
  <li>No sign-up</li>
  <li>Immediate export</li>
</ul>`;
    update();
  });

  demoBtn.click();
};
