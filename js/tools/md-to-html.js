/**
 * Tool 32: Markdown to HTML Converter
 * Studio layout with split work panel and settings sidebar.
 */

window.initMdToHtml = function() {
  const container = document.getElementById('tool-md-to-html');
  if (!container) return;

  const inputEl = document.getElementById('md-input');
  const previewEl = document.getElementById('md-preview-view');
  const codeEl = document.getElementById('md-raw-code');
  const codeView = document.getElementById('md-code-view');
  const inputStats = document.getElementById('md-input-stats');
  const wrapDocCheckbox = document.getElementById('md-wrap-doc');
  const tabRendered = document.getElementById('md-tab-rendered');
  const tabCode = document.getElementById('md-tab-code');
  const loadFileBtn = document.getElementById('md-load-file-btn');
  const fileInput = document.getElementById('md-file-input');
  const copyBtn = document.getElementById('md-copy-btn');
  const downloadBtn = document.getElementById('md-download-btn');

  function parseMarkdown(md) {
    if (window.marked && typeof window.marked.parse === 'function') {
      return window.marked.parse(md);
    }
    let html = ToolkitUtils.escapeHtml(md);
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold my-2 text-white">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold my-3 text-white">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold my-4 pb-2 border-b border-[#303334] text-white">$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/gim, '<code class="bg-[#1e2022] text-indigo-400 px-1 py-0.5 rounded text-xs">$1</code>');
    html = html.replace(/\n\n+/g, '</p><p class="my-2">');
    return `<p class="my-2">${html}</p>`;
  }

  function update() {
    const text = inputEl.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    inputStats.textContent = `${words} words • ${text.length} chars`;

    const parsedHtml = parseMarkdown(text);
    const safeHtml = ToolkitUtils.sanitizeHtml ? ToolkitUtils.sanitizeHtml(parsedHtml) : parsedHtml;
    previewEl.innerHTML = safeHtml;

    if (wrapDocCheckbox.checked) {
      codeEl.value = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style>
    body { font-family: -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #24292e; }
    h1, h2 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    code { background: #f6f8fa; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; }
  </style>
</head>
<body>
${parsedHtml}
</body>
</html>`;
    } else {
      codeEl.value = parsedHtml;
    }
  }

  inputEl.addEventListener('input', update);
  wrapDocCheckbox.addEventListener('change', update);

  tabRendered.addEventListener('click', () => {
    tabRendered.classList.add('active');
    tabCode.classList.remove('active');
    previewEl.classList.remove('hidden');
    codeView.classList.add('hidden');
  });

  tabCode.addEventListener('click', () => {
    tabCode.classList.add('active');
    tabRendered.classList.remove('active');
    previewEl.classList.add('hidden');
    codeView.classList.remove('hidden');
  });

  loadFileBtn.addEventListener('click', () => fileInput.click());
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
    ToolkitUtils.copyToClipboard(codeEl.value, 'HTML copied to clipboard!');
  });

  downloadBtn.addEventListener('click', () => {
    ToolkitUtils.downloadText(codeEl.value, 'document.html', 'text/html;charset=utf-8');
    ToolkitUtils.showToast('Downloaded document.html', 'success');
  });

  inputEl.value = `# fileTookKit Document

A precise set of **client-side** tools.

## Features
- Zero server retention
- Local execution
- Immediate downloads

\`\`\`javascript
console.log("Files, refined. Nothing retained.");
\`\`\`
`;
  update();
};
