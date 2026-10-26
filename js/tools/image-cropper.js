/**
 * Tool 28: Image Cropper
 * Studio layout with interactive work panel and settings sidebar.
 */

window.initImageCropper = function() {
  const container = document.getElementById('tool-image-cropper');
  if (!container) return;

  let currentImage = null;
  let currentFile = null;
  let cropState = {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    aspectRatio: null
  };

  const dropzone = document.getElementById('img-crop-dropzone');
  const input = document.getElementById('img-crop-input');
  const workspace = document.getElementById('img-crop-workspace');
  const filenameEl = document.getElementById('img-crop-filename');
  const origInfoEl = document.getElementById('img-crop-orig-info');
  const dimBadge = document.getElementById('img-crop-dim-badge');
  const resetBtn = document.getElementById('img-crop-reset-btn');
  const runBtn = document.getElementById('img-crop-run-btn');
  const mainCanvas = document.getElementById('img-crop-main-canvas');
  const previewCanvas = document.getElementById('img-crop-preview-canvas');
  const cropBox = document.getElementById('img-crop-box');
  const formatSelect = document.getElementById('img-crop-format');
  const ratioBtns = container.querySelectorAll('.crop-ratio-btn');

  let scaleRatio = 1;
  let isDragging = false;
  let activeHandle = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let initialCrop = { x: 0, y: 0, w: 0, h: 0 };

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

      filenameEl.textContent = f.name;
      origInfoEl.textContent = `${currentImage.naturalWidth} × ${currentImage.naturalHeight}px`;

      dropzone.classList.add('hidden');
      workspace.classList.remove('hidden');
      runBtn.disabled = false;

      setupCanvasAndCrop();
    } catch (err) {
      console.error(err);
      ToolkitUtils.showToast('Failed to load image', 'error');
    }
  }, { accept: 'image/*' });

  function setupCanvasAndCrop() {
    const maxW = 560;
    const maxH = 420;
    const natW = currentImage.naturalWidth;
    const natH = currentImage.naturalHeight;

    let dispW = natW;
    let dispH = natH;

    if (dispW > maxW || dispH > maxH) {
      const ratio = Math.min(maxW / dispW, maxH / dispH);
      dispW = Math.round(dispW * ratio);
      dispH = Math.round(dispH * ratio);
    }

    mainCanvas.width = dispW;
    mainCanvas.height = dispH;
    scaleRatio = dispW / natW;

    const ctx = mainCanvas.getContext('2d');
    ctx.drawImage(currentImage, 0, 0, dispW, dispH);

    const initW = Math.round(dispW * 0.75);
    const initH = Math.round(dispH * 0.75);
    cropState.x = Math.round((dispW - initW) / 2);
    cropState.y = Math.round((dispH - initH) / 2);
    cropState.w = initW;
    cropState.h = initH;

    updateCropBoxDOM();
    updatePreviewCanvas();
  }

  function updateCropBoxDOM() {
    cropBox.style.left = `${cropState.x}px`;
    cropBox.style.top = `${cropState.y}px`;
    cropBox.style.width = `${cropState.w}px`;
    cropBox.style.height = `${cropState.h}px`;

    const realW = Math.round(cropState.w / scaleRatio);
    const realH = Math.round(cropState.h / scaleRatio);
    dimBadge.textContent = `${realW} × ${realH}`;
  }

  function updatePreviewCanvas() {
    if (!currentImage) return;

    const realX = Math.round(cropState.x / scaleRatio);
    const realY = Math.round(cropState.y / scaleRatio);
    const realW = Math.max(1, Math.round(cropState.w / scaleRatio));
    const realH = Math.max(1, Math.round(cropState.h / scaleRatio));

    previewCanvas.width = realW;
    previewCanvas.height = realH;
    const ctx = previewCanvas.getContext('2d');
    ctx.drawImage(currentImage, realX, realY, realW, realH, 0, 0, realW, realH);
  }

  cropBox.addEventListener('mousedown', (e) => {
    isDragging = true;
    activeHandle = e.target.dataset.handle || null;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    initialCrop = { ...cropState };
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    const maxBoundW = mainCanvas.width;
    const maxBoundH = mainCanvas.height;

    if (!activeHandle) {
      let newX = initialCrop.x + dx;
      let newY = initialCrop.y + dy;

      newX = Math.max(0, Math.min(newX, maxBoundW - cropState.w));
      newY = Math.max(0, Math.min(newY, maxBoundH - cropState.h));

      cropState.x = newX;
      cropState.y = newY;
    } else {
      const minSize = 25;
      if (activeHandle === 'br') {
        let newW = Math.max(minSize, Math.min(initialCrop.w + dx, maxBoundW - initialCrop.x));
        let newH = cropState.aspectRatio ? Math.round(newW / cropState.aspectRatio) : Math.max(minSize, Math.min(initialCrop.h + dy, maxBoundH - initialCrop.y));
        if (initialCrop.y + newH <= maxBoundH) {
          cropState.w = newW;
          cropState.h = newH;
        }
      } else if (activeHandle === 'bl') {
        let newW = Math.max(minSize, initialCrop.w - dx);
        let newX = initialCrop.x + (initialCrop.w - newW);
        if (newX >= 0) {
          cropState.x = newX;
          cropState.w = newW;
          cropState.h = cropState.aspectRatio ? Math.round(newW / cropState.aspectRatio) : Math.max(minSize, Math.min(initialCrop.h + dy, maxBoundH - initialCrop.y));
        }
      } else if (activeHandle === 'tr') {
        let newW = Math.max(minSize, Math.min(initialCrop.w + dx, maxBoundW - initialCrop.x));
        let newH = Math.max(minSize, initialCrop.h - dy);
        let newY = initialCrop.y + (initialCrop.h - newH);
        if (newY >= 0) {
          cropState.w = newW;
          cropState.y = newY;
          cropState.h = newH;
        }
      } else if (activeHandle === 'tl') {
        let newW = Math.max(minSize, initialCrop.w - dx);
        let newH = Math.max(minSize, initialCrop.h - dy);
        let newX = initialCrop.x + (initialCrop.w - newW);
        let newY = initialCrop.y + (initialCrop.h - newH);
        if (newX >= 0 && newY >= 0) {
          cropState.x = newX;
          cropState.y = newY;
          cropState.w = newW;
          cropState.h = newH;
        }
      }
    }

    updateCropBoxDOM();
    updatePreviewCanvas();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    activeHandle = null;
  });

  ratioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ratioBtns.forEach(b => {
        b.classList.remove('bg-white', 'text-black');
        b.classList.add('text-white');
      });
      btn.classList.add('bg-white', 'text-black');
      btn.classList.remove('text-white');

      const ratio = btn.dataset.ratio;
      if (ratio === 'free') {
        cropState.aspectRatio = null;
      } else {
        const [w, h] = ratio.split(':').map(Number);
        cropState.aspectRatio = w / h;
        cropState.h = Math.round(cropState.w / cropState.aspectRatio);
        if (cropState.y + cropState.h > mainCanvas.height) {
          cropState.h = mainCanvas.height - cropState.y;
          cropState.w = Math.round(cropState.h * cropState.aspectRatio);
        }
      }
      updateCropBoxDOM();
      updatePreviewCanvas();
    });
  });

  resetBtn.addEventListener('click', () => {
    currentImage = null;
    currentFile = null;
    dropzone.classList.remove('hidden');
    workspace.classList.add('hidden');
    runBtn.disabled = true;
  });

  runBtn.addEventListener('click', async () => {
    if (!previewCanvas || !currentFile) return;

    try {
      const mime = formatSelect.value;
      const res = await ToolkitUtils.convertCanvas(previewCanvas, mime, 0.95);
      const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
      const outName = `${baseName}_cropped.${res.ext}`;
      ToolkitUtils.downloadBlob(res.blob, outName);
      ToolkitUtils.showToast(`Saved cropped image: ${outName}`, 'success');
    } catch (err) {
      ToolkitUtils.showToast('Failed to crop and save image', 'error');
    }
  });
};
