/**
 * Tool 29: Image Format Converter
 * Supports JPG/JPEG, PNG, WebP, SVG, GIF, AVIF, and BMP bidirectional conversions.
 */

window.initImageConverter = function() {
  const container = document.getElementById('tool-image-converter');
  if (!container) return;

  let fileQueue = [];

  const dropzone = document.getElementById('img-conv-dropzone');
  const input = document.getElementById('img-conv-input');
  const formatSelect = document.getElementById('img-conv-target-format');
  const qualSlider = document.getElementById('img-conv-quality');
  const qualLabel = document.getElementById('img-conv-qual-label');
  const qualBox = document.getElementById('img-conv-qual-box');
  const queueBox = document.getElementById('img-conv-queue-box');
  const queueList = document.getElementById('img-conv-queue-list');
  const queueCount = document.getElementById('img-conv-queue-count');
  const clearBtn = document.getElementById('img-conv-clear-btn');
  const runBtn = document.getElementById('img-conv-run-btn');
  const zipBtn = document.getElementById('img-conv-zip-btn');
  const statusSummary = document.getElementById('img-conv-status-summary');

  qualSlider.addEventListener('input', () => {
    qualLabel.textContent = `${qualSlider.value}%`;
  });

  formatSelect.addEventListener('change', () => {
    const val = formatSelect.value;
    const needsQuality = val === 'image/jpeg' || val === 'image/webp' || val === 'image/avif';
    if (qualBox) qualBox.style.display = needsQuality ? 'block' : 'none';
  });

  ToolkitUtils.setupDropZone(dropzone, input, (files) => {
    const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.avif', '.bmp'];
    const images = files.filter(f => {
      const name = f.name.toLowerCase();
      return f.type.startsWith('image/') || validExts.some(ext => name.endsWith(ext));
    });

    if (images.length === 0) {
      ToolkitUtils.showToast('Please select valid images (JPG, PNG, WebP, SVG, GIF, AVIF).', 'warning');
      return;
    }

    images.forEach(f => {
      fileQueue.push({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        size: f.size,
        convertedBlob: null,
        convertedName: null,
        status: 'pending'
      });
    });

    renderQueue();
    ToolkitUtils.showToast(`Added ${images.length} image(s)`, 'info');
  }, { accept: 'image/*,.jpg,.jpeg,.png,.webp,.svg,.gif,.avif,.bmp' });

  function renderQueue() {
    queueList.innerHTML = '';
    if (fileQueue.length === 0) {
      queueBox.classList.add('hidden');
      clearBtn.classList.add('hidden');
      zipBtn.classList.add('hidden');
      runBtn.disabled = true;
      return;
    }

    queueBox.classList.remove('hidden');
    clearBtn.classList.remove('hidden');
    queueCount.textContent = fileQueue.length;
    runBtn.disabled = false;

    const hasConverted = fileQueue.some(item => item.convertedBlob);
    if (hasConverted) zipBtn.classList.remove('hidden');

    fileQueue.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'file-list-item';
      row.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          <span class="text-base text-slate-400">🖼️</span>
          <div class="truncate">
            <p class="text-xs font-semibold text-white truncate">${ToolkitUtils.escapeHtml(item.name)}</p>
            <p class="text-[11px] font-mono text-slate-400">
              ${ToolkitUtils.formatBytes(item.size)}
              ${item.convertedBlob ? ` → <strong class="text-emerald-400 font-mono">${ToolkitUtils.formatBytes(item.convertedBlob.size)} (${item.convertedName.split('.').pop().toUpperCase()})</strong>` : ''}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          ${item.convertedBlob ? `
            <button class="btn-secondary py-1 px-2.5 text-[11px]" data-download="${item.id}">Save</button>
          ` : `
            <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1e2022] text-slate-400">Queued</span>
          `}
          <button class="text-slate-400 hover:text-rose-400 p-1" data-remove="${item.id}">✕</button>
        </div>
      `;

      const dlBtn = row.querySelector('[data-download]');
      if (dlBtn) {
        dlBtn.addEventListener('click', () => {
          ToolkitUtils.downloadBlob(item.convertedBlob, item.convertedName);
        });
      }

      row.querySelector('[data-remove]').addEventListener('click', () => {
        fileQueue = fileQueue.filter(q => q.id !== item.id);
        renderQueue();
      });

      queueList.appendChild(row);
    });
  }

  clearBtn.addEventListener('click', () => {
    fileQueue = [];
    renderQueue();
  });

  runBtn.addEventListener('click', async () => {
    if (fileQueue.length === 0) return;

    const targetMime = formatSelect.value;
    const quality = parseFloat(qualSlider.value) / 100;

    runBtn.disabled = true;
    statusSummary.textContent = 'Converting...';

    for (let i = 0; i < fileQueue.length; i++) {
      const item = fileQueue[i];
      try {
        const img = await ToolkitUtils.loadImage(item.file);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const result = await ToolkitUtils.convertCanvas(canvas, targetMime, quality);
        const baseName = item.name.replace(/\.[^/.]+$/, '');
        item.convertedBlob = result.blob;
        item.convertedName = `${baseName}.${result.ext}`;
        item.status = 'converted';
      } catch (err) {
        console.error('Failed converting', item.name, err);
        item.status = 'error';
      }
    }

    renderQueue();
    statusSummary.textContent = 'Done ✓';
    runBtn.disabled = false;
    ToolkitUtils.showToast(`Converted ${fileQueue.length} image(s)!`, 'success');
  });

  zipBtn.addEventListener('click', async () => {
    const convertedItems = fileQueue.filter(item => item.convertedBlob);
    if (convertedItems.length === 0) return;

    const filesToZip = convertedItems.map(item => ({
      name: item.convertedName,
      blob: item.convertedBlob
    }));

    await ToolkitUtils.zipAndDownload(filesToZip, `converted_images_${Date.now()}.zip`);
  });
};
