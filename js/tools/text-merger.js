/**
 * Tool 34: Text File Merger
 * Studio layout with split work panel and settings sidebar.
 */

window.initTextMerger = function() {
  const container = document.getElementById('tool-text-merger');
  if (!container) return;

  let textFiles = [];

  const dropzone = document.getElementById('txt-merge-dropzone');
  const input = document.getElementById('txt-merge-input');
  const content = document.getElementById('txt-merge-content');
  const fileListEl = document.getElementById('txt-merge-file-list');
  const separatorSelect = document.getElementById('txt-merge-separator');
  const customBox = document.getElementById('txt-merge-custom-box');
  const customText = document.getElementById('txt-merge-custom-text');
  const previewTextarea = document.getElementById('txt-merge-preview');
  const statsEl = document.getElementById('txt-merge-stats');
  const copyBtn = document.getElementById('txt-merge-copy-btn');
  const downloadBtn = document.getElementById('txt-merge-download-btn');
  const clearBtn = document.getElementById('txt-merge-clear-btn');

  separatorSelect.addEventListener('change', () => {
    customBox.style.display = separatorSelect.value === 'custom' ? 'block' : 'none';
    updateMergedOutput();
  });
  customText.addEventListener('input', updateMergedOutput);

  ToolkitUtils.setupDropZone(dropzone, input, async (files) => {
    for (const f of files) {
      try {
        const text = await ToolkitUtils.readFileAsText(f);
        textFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          name: f.name,
          size: f.size,
          content: text
        });
      } catch (err) {
        console.warn('Could not read', f.name);
      }
    }

    renderFileList();
    ToolkitUtils.showToast(`Added ${files.length} file(s)`, 'info');
  });

  function renderFileList() {
    fileListEl.innerHTML = '';
    if (textFiles.length === 0) {
      dropzone.classList.remove('hidden');
      content.classList.add('hidden');
      if (clearBtn) clearBtn.classList.add('hidden');
      copyBtn.disabled = true;
      downloadBtn.disabled = true;
      previewTextarea.value = '';
      statsEl.textContent = '0 lines';
      return;
    }

    dropzone.classList.add('hidden');
    content.classList.remove('hidden');
    if (clearBtn) clearBtn.classList.remove('hidden');
    copyBtn.disabled = false;
    downloadBtn.disabled = false;

    textFiles.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'file-list-item';
      row.innerHTML = `
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-5 h-5 rounded bg-[#1e2022] text-indigo-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
            ${index + 1}
          </span>
          <div class="truncate">
            <p class="text-xs font-semibold text-white truncate">${ToolkitUtils.escapeHtml(item.name)}</p>
            <p class="text-[10px] font-mono text-slate-400">${ToolkitUtils.formatBytes(item.size)}</p>
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button class="p-1 text-xs text-slate-400 hover:text-white ${index === 0 ? 'opacity-20 cursor-not-allowed' : ''}" data-action="up" data-index="${index}">▲</button>
          <button class="p-1 text-xs text-slate-400 hover:text-white ${index === textFiles.length - 1 ? 'opacity-20 cursor-not-allowed' : ''}" data-action="down" data-index="${index}">▼</button>
          <button class="p-1 text-xs text-slate-400 hover:text-rose-400 ml-1" data-action="remove" data-index="${index}">✕</button>
        </div>
      `;

      row.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.dataset.action;
          const idx = parseInt(btn.dataset.index, 10);
          if (action === 'up' && idx > 0) {
            const temp = textFiles[idx];
            textFiles[idx] = textFiles[idx - 1];
            textFiles[idx - 1] = temp;
            renderFileList();
          } else if (action === 'down' && idx < textFiles.length - 1) {
            const temp = textFiles[idx];
            textFiles[idx] = textFiles[idx + 1];
            textFiles[idx + 1] = temp;
            renderFileList();
          } else if (action === 'remove') {
            textFiles.splice(idx, 1);
            renderFileList();
          }
        });
      });

      fileListEl.appendChild(row);
    });

    updateMergedOutput();
  }

  function getSeparator(fileName, index) {
    const sepType = separatorSelect.value;
    switch (sepType) {
      case 'newline': return '\n';
      case 'double-newline': return '\n\n';
      case 'header-banner': return `\n\n/* === File: ${fileName} === */\n\n`;
      case 'md-heading': return `\n\n## ${fileName}\n\n`;
      case 'dashed': return `\n\n--------------------------------\n-- ${fileName}\n--------------------------------\n\n`;
      case 'custom': return `\n\n${customText.value || '---'}\n\n`;
      default: return '\n\n';
    }
  }

  function updateMergedOutput() {
    if (textFiles.length === 0) {
      previewTextarea.value = '';
      statsEl.textContent = '0 lines';
      return;
    }

    let merged = '';
    for (let i = 0; i < textFiles.length; i++) {
      const file = textFiles[i];
      if (i > 0) merged += getSeparator(file.name, i);
      merged += file.content;
    }

    previewTextarea.value = merged;
    const lines = merged.split('\n').length;
    statsEl.textContent = `${lines.toLocaleString()} lines • ${merged.length.toLocaleString()} chars`;
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      textFiles = [];
      renderFileList();
      ToolkitUtils.showToast('Cleared merge queue', 'info');
    });
  }

  copyBtn.addEventListener('click', () => {
    ToolkitUtils.copyToClipboard(previewTextarea.value, 'Merged text copied!');
  });

  downloadBtn.addEventListener('click', () => {
    ToolkitUtils.downloadText(previewTextarea.value, 'merged_text.txt');
    ToolkitUtils.showToast('Downloaded merged_text.txt', 'success');
  });
};
