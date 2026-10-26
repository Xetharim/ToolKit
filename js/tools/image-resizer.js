/**
 * Tool 27: Image Resizer
 * Studio layout with interactive work panel and settings sidebar.
 */

window.initImageResizer = function() {
  const container = document.getElementById('tool-image-resizer');
  if (!container) return;

  let currentImage = null;
  let currentFile = null;
  let originalWidth = 0;
  let originalHeight = 0;
  let lockAspect = true;

  const dropzone = document.getElementById('img-res-dropzone');
  const input = document.getElementById('img-res-input');
  const workspace = document.getElementById('img-res-workspace');
  const filenameEl = document.getElementById('img-res-filename');
  const origInfo = document.getElementById('img-res-orig-info');
  const resetBtn = document.getElementById('img-res-reset-btn');
  const widthInput = document.getElementById('img-res-width');
  const heightInput = document.getElementById('img-res-height');
  const lockBtn = document.getElementById('img-res-lock-btn');
  const lockIcon = document.getElementById('img-res-lock-icon');
  const lockText = document.getElementById('img-res-lock-text');
  const presetSelect = document.getElementById('img-res-preset');
  const formatSelect = document.getElementById('img-res-format');
  const canvas = document.getElementById('img-res-canvas');
  const canvasInfo = document.getElementById('img-res-canvas-info');
  const downloadBtn = document.getElementById('img-res-download-btn');

  ToolkitUtils.setupDropZone(dropzone, input, async (files) => {
    const f = files[0];
    const isImg = f && (f.type.startsWith('image/') || /\.(jpe?g|png|webp|avif|gif|bmp|svg)$/i.test(f.name));
    if (!isImg) {
      ToolkitUtils.showToast('Please select a valid image.', 'warning');
      return;
    }

    try {
      currentFile = f;
      currentImage = await ToolkitUtils.loadImage(f);
      originalWidth = currentImage.naturalWidth;
      originalHeight = currentImage.naturalHeight;

      filenameEl.textContent = f.name;
      origInfo.textContent = `${originalWidth} × ${originalHeight}px • ${ToolkitUtils.formatBytes(f.size)}`;
      widthInput.value = originalWidth;
      heightInput.value = originalHeight;

      dropzone.classList.add('hidden');
      workspace.classList.remove('hidden');
      downloadBtn.disabled = false;

      renderResize();
    } catch (err) {
      console.error(err);
      ToolkitUtils.showToast('Failed to load image', 'error');
    }
  }, { accept: 'image/*' });

  lockBtn.addEventListener('click', () => {
    lockAspect = !lockAspect;
    lockIcon.textContent = lockAspect ? '🔒' : '🔓';
    lockText.textContent = lockAspect ? 'Locked' : 'Unlocked';
  });

  widthInput.addEventListener('input', () => {
    const w = parseInt(widthInput.value, 10);
    if (!isNaN(w) && w > 0 && lockAspect && originalWidth > 0) {
      heightInput.value = Math.round((w * originalHeight) / originalWidth);
    }
    renderResize();
  });

  heightInput.addEventListener('input', () => {
    const h = parseInt(heightInput.value, 10);
    if (!isNaN(h) && h > 0 && lockAspect && originalHeight > 0) {
      widthInput.value = Math.round((h * originalWidth) / originalHeight);
    }
    renderResize();
  });

  container.querySelectorAll('[data-scale]').forEach(btn => {
    btn.addEventListener('click', () => {
      const scale = parseFloat(btn.dataset.scale);
      widthInput.value = Math.round(originalWidth * scale);
      heightInput.value = Math.round(originalHeight * scale);
      renderResize();
    });
  });

  presetSelect.addEventListener('change', () => {
    const val = presetSelect.value;
    if (!val) return;
    const [w, h] = val.split('x').map(n => parseInt(n, 10));
    widthInput.value = w;
    heightInput.value = h;
    renderResize();
  });

  function renderResize() {
    if (!currentImage) return;

    const targetW = Math.max(1, parseInt(widthInput.value, 10) || originalWidth);
    const targetH = Math.max(1, parseInt(heightInput.value, 10) || originalHeight);

    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(currentImage, 0, 0, targetW, targetH);

    canvasInfo.textContent = `${targetW} × ${targetH}px`;
  }

  resetBtn.addEventListener('click', () => {
    currentImage = null;
    currentFile = null;
    dropzone.classList.remove('hidden');
    workspace.classList.add('hidden');
    downloadBtn.disabled = true;
  });

  downloadBtn.addEventListener('click', async () => {
    if (!canvas || !currentFile) return;

    try {
      const mime = formatSelect.value;
      const res = await ToolkitUtils.convertCanvas(canvas, mime, 0.92);
      const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
      const outName = `${baseName}_${canvas.width}x${canvas.height}.${res.ext}`;
      ToolkitUtils.downloadBlob(res.blob, outName);
      ToolkitUtils.showToast(`Saved resized image: ${outName}`, 'success');
    } catch (err) {
      ToolkitUtils.showToast('Failed to export resized image', 'error');
    }
  });
};
