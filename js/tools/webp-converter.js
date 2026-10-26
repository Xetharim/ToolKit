/**
 * Tool 30: WebP Converter
 * High-efficiency bidirectional WebP conversions across JPG, PNG, SVG, GIF, AVIF.
 */

window.initWebpConverter = function() {
  const container = document.getElementById('tool-webp-converter');
  if (!container) return;

  let currentFiles = [];

  const dropzone = document.getElementById('webp-dropzone');
  const input = document.getElementById('webp-input');
  const directionSelect = document.getElementById('webp-direction');
  const qualitySlider = document.getElementById('webp-quality');
  const qualityVal = document.getElementById('webp-quality-val');
  const losslessCheckbox = document.getElementById('webp-lossless');
  const qualityBox = document.getElementById('webp-quality-box');
  const resultsBox = document.getElementById('webp-results-box');
  const resultsList = document.getElementById('webp-results-list');
  const fileCount = document.getElementById('webp-file-count');
  const runBtn = document.getElementById('webp-run-btn');
  const zipBtn = document.getElementById('webp-zip-btn');
  const clearBtn = document.getElementById('webp-clear-btn');

  qualitySlider.addEventListener('input', () => {
    qualityVal.textContent = `${qualitySlider.value}%`;
  });

  directionSelect.addEventListener('change', () => {
    const dir = directionSelect.value;
    const isToWebp = dir.includes('to-webp');
    const isLosslessTarget = dir === 'from-webp-png' || dir === 'from-webp-svg' || dir === 'from-webp-gif';

    if (losslessCheckbox) {
      const toggleRow = losslessCheckbox.closest('label');
      if (toggleRow) toggleRow.style.display = isToWebp ? 'flex' : 'none';
    }

    if (qualityBox) {
      qualityBox.style.display = isLosslessTarget ? 'none' : 'block';
    }
  });

  losslessCheckbox.addEventListener('change', () => {
    qualitySlider.disabled = losslessCheckbox.checked;
    qualityVal.textContent = losslessCheckbox.checked ? 'Lossless' : `${qualitySlider.value}%`;
  });

  ToolkitUtils.setupDropZone(dropzone, input, (files) => {
    const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.avif', '.bmp'];
    const valid = files.filter(f => {
      const name = f.name.toLowerCase();
      return f.type.startsWith('image/') || validExts.some(ext => name.endsWith(ext));
    });

    if (valid.length === 0) {
      ToolkitUtils.showToast('Please select valid images (JPG, PNG, WebP, SVG, GIF, AVIF).', 'warning');
      return;
    }

    valid.forEach(f => {
      currentFiles.push({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        size: f.size,
        blob: null,
        outName: null
      });
    });

    renderList();
    ToolkitUtils.showToast(`Added ${valid.length} image(s)`, 'info');
  }, { accept: 'image/*,.jpg,.jpeg,.png,.webp,.svg,.gif,.avif,.bmp' });

  function renderList() {
    resultsList.innerHTML = '';
    if (currentFiles.length === 0) {
      resultsBox.classList.add('hidden');
      zipBtn.classList.add('hidden');
      if (clearBtn) clearBtn.classList.add('hidden');
      runBtn.disabled = true;
      return;
    }

    resultsBox.classList.remove('hidden');
    if (clearBtn) clearBtn.classList.remove('hidden');
    fileCount.textContent = currentFiles.length;
    runBtn.disabled = false;

    const hasResults = currentFiles.some(f => f.blob);
    if (hasResults) zipBtn.classList.remove('hidden');

    currentFiles.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'file-list-item';
      let statsHtml = `<span class="text-[11px] font-mono text-slate-400">${ToolkitUtils.formatBytes(item.size)}</span>`;

      if (item.blob) {
        const diff = item.size - item.blob.size;
        const pct = Math.round((diff / item.size) * 100);
        statsHtml = `
          <span class="text-[11px] font-mono text-slate-400">${ToolkitUtils.formatBytes(item.size)} → <strong class="text-indigo-400 font-mono">${ToolkitUtils.formatBytes(item.blob.size)} (${item.outName.split('.').pop().toUpperCase()})</strong></span>
          <span class="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded ml-2 ${diff > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'}">
            ${diff > 0 ? `-${pct}%` : `+${Math.abs(pct)}%`}
          </span>
        `;
      }

      row.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          <span class="text-base text-slate-400">⚡</span>
          <div class="truncate">
            <p class="text-xs font-semibold text-white truncate">${ToolkitUtils.escapeHtml(item.name)}</p>
            <div>${statsHtml}</div>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          ${item.blob ? `
            <button class="btn-secondary py-1 px-2.5 text-[11px]" data-download="${item.id}">Download</button>
          ` : `
            <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1e2022] text-slate-400">Ready</span>
          `}
          <button class="text-slate-400 hover:text-rose-400 p-1" data-remove="${item.id}">✕</button>
        </div>
      `;

      const dlBtn = row.querySelector('[data-download]');
      if (dlBtn) {
        dlBtn.addEventListener('click', () => {
          ToolkitUtils.downloadBlob(item.blob, item.outName);
        });
      }

      row.querySelector('[data-remove]').addEventListener('click', () => {
        currentFiles = currentFiles.filter(q => q.id !== item.id);
        renderList();
      });

      resultsList.appendChild(row);
    });
  }

  runBtn.addEventListener('click', async () => {
    if (currentFiles.length === 0) return;

    const dir = directionSelect.value;
    const isLossless = losslessCheckbox.checked;
    const quality = isLossless ? 1.0 : parseFloat(qualitySlider.value) / 100;

    // Determine target MIME type based on selected mode
    let targetMime = 'image/webp';
    if (dir === 'from-webp-png') targetMime = 'image/png';
    else if (dir === 'from-webp-jpg') targetMime = 'image/jpeg';
    else if (dir === 'from-webp-svg') targetMime = 'image/svg+xml';
    else if (dir === 'from-webp-gif') targetMime = 'image/gif';
    else if (dir === 'from-webp-avif') targetMime = 'image/avif';

    runBtn.disabled = true;

    for (let i = 0; i < currentFiles.length; i++) {
      const item = currentFiles[i];
      try {
        const img = await ToolkitUtils.loadImage(item.file);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const result = await ToolkitUtils.convertCanvas(canvas, targetMime, quality);
        const baseName = item.name.replace(/\.[^/.]+$/, '');
        item.blob = result.blob;
        item.outName = `${baseName}.${result.ext}`;
      } catch (err) {
        console.error('WebP conversion error', item.name, err);
      }
    }

    renderList();
    runBtn.disabled = false;
    ToolkitUtils.showToast('Conversion completed!', 'success');
  });

  zipBtn.addEventListener('click', async () => {
    const completed = currentFiles.filter(item => item.blob);
    if (completed.length === 0) return;

    const filesToZip = completed.map(item => ({
      name: item.outName,
      blob: item.blob
    }));

    await ToolkitUtils.zipAndDownload(filesToZip, `converted_archive_${Date.now()}.zip`);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentFiles = [];
      input.value = '';
      renderList();
    });
  }
};
