/**
 * Tool 26: Image Compressor
 * Studio layout with interactive work panel and settings sidebar.
 */

window.initImageCompressor = function() {
  const container = document.getElementById('tool-image-compressor');
  if (!container) return;

  let currentImage = null;
  let currentFile = null;
  let compressedBlob = null;

  const dropzone = document.getElementById('img-comp-dropzone');
  const input = document.getElementById('img-comp-input');
  const workspace = document.getElementById('img-comp-workspace');
  const filenameEl = document.getElementById('img-comp-filename');
  const fileStatsEl = document.getElementById('img-comp-file-stats');
  const badgeEl = document.getElementById('img-comp-badge');
  const previewImg = document.getElementById('img-comp-preview');
  const resetBtn = document.getElementById('img-comp-reset-btn');
  const qualitySlider = document.getElementById('img-comp-quality-slider');
  const qualityVal = document.getElementById('img-comp-quality-val');
  const formatSelect = document.getElementById('img-comp-format-select');
  const maxDimSelect = document.getElementById('img-comp-max-dim');
  const diffLabel = document.getElementById('img-comp-diff-label');
  const summaryEl = document.getElementById('img-comp-summary');
  const downloadBtn = document.getElementById('img-comp-download-btn');

  ToolkitUtils.setupDropZone(dropzone, input, async (files) => {
    const f = files[0];
    const isImg = f && (f.type.startsWith('image/') || /\.(jpe?g|png|webp|avif|gif|bmp|svg)$/i.test(f.name));
    if (!isImg) {
      ToolkitUtils.showToast('Please select a valid image file.', 'warning');
      return;
    }

    try {
      currentFile = f;
      currentImage = await ToolkitUtils.loadImage(f);

      filenameEl.textContent = f.name;
      fileStatsEl.textContent = `${ToolkitUtils.formatBytes(f.size)} • ${currentImage.naturalWidth} × ${currentImage.naturalHeight}px`;

      dropzone.classList.add('hidden');
      workspace.classList.remove('hidden');
      downloadBtn.disabled = false;

      recompress();
      ToolkitUtils.showToast(`Loaded ${f.name}`, 'info');
    } catch (err) {
      console.error(err);
      ToolkitUtils.showToast('Failed to load image', 'error');
    }
  }, { accept: 'image/*' });

  qualitySlider.addEventListener('input', () => {
    qualityVal.textContent = `${qualitySlider.value}%`;
    debouncedRecompress();
  });

  formatSelect.addEventListener('change', () => recompress());
  maxDimSelect.addEventListener('change', () => recompress());

  let debounceTimer = null;
  function debouncedRecompress() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(recompress, 120);
  }

  function recompress() {
    if (!currentImage || !currentFile) return;

    const quality = parseFloat(qualitySlider.value) / 100;
    const format = formatSelect.value;
    const maxDim = parseInt(maxDimSelect.value, 10);

    let targetW = currentImage.naturalWidth;
    let targetH = currentImage.naturalHeight;

    if (maxDim > 0 && (targetW > maxDim || targetH > maxDim)) {
      if (targetW >= targetH) {
        targetH = Math.round((targetH * maxDim) / targetW);
        targetW = maxDim;
      } else {
        targetW = Math.round((targetW * maxDim) / targetH);
        targetH = maxDim;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);
    }

    ctx.drawImage(currentImage, 0, 0, targetW, targetH);

    canvas.toBlob((blob) => {
      if (!blob) return;
      compressedBlob = blob;
      previewImg.src = URL.createObjectURL(blob);

      const orig = currentFile.size;
      const comp = blob.size;
      const savedPct = Math.round(((orig - comp) / orig) * 100);

      diffLabel.textContent = `${ToolkitUtils.formatBytes(orig)} → ${ToolkitUtils.formatBytes(comp)}`;
      badgeEl.textContent = savedPct >= 0 ? `-${savedPct}%` : `+${Math.abs(savedPct)}%`;
      summaryEl.textContent = savedPct > 0 
        ? `Reduced size by ${savedPct}% with high visual retention.`
        : `Format overhead slightly increased file size.`;
    }, format, quality);
  }

  resetBtn.addEventListener('click', () => {
    currentImage = null;
    currentFile = null;
    compressedBlob = null;
    dropzone.classList.remove('hidden');
    workspace.classList.add('hidden');
    downloadBtn.disabled = true;
  });

  downloadBtn.addEventListener('click', () => {
    if (!compressedBlob || !currentFile) return;

    let ext = 'webp';
    const format = formatSelect.value;
    if (format === 'image/png') ext = 'png';
    else if (format === 'image/jpeg') ext = 'jpg';

    const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
    ToolkitUtils.downloadBlob(compressedBlob, `${baseName}_compressed.${ext}`);
    ToolkitUtils.showToast('Downloaded compressed image!', 'success');
  });
};
