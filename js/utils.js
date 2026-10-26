/**
 * fileTookKit - Shared Utility Functions
 */

// Format byte size to human readable format (Binary or Decimal)
function formatBytes(bytes, decimals = 2, binary = true) {
  if (bytes === 0) return '0 Bytes';
  if (!bytes || isNaN(bytes)) return '-';
  const k = binary ? 1024 : 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = binary 
    ? ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'] 
    : ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeI = Math.min(i, sizes.length - 1);
  return parseFloat((bytes / Math.pow(k, safeI)).toFixed(dm)) + ' ' + sizes[safeI];
}

// Trigger browser download for a Blob
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Download plain text content as a file
function downloadText(text, filename, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type: mimeType });
  downloadBlob(blob, filename);
}

// Read File as ArrayBuffer
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

// Read File as Text
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// Read File as Data URL
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Load Image Element from File or Data URL (handles SVG, AVIF, WebP, GIF, PNG, JPG)
function loadImage(source) {
  return new Promise(async (resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image file. Verify it is a valid graphic.'));

    try {
      if (typeof source === 'string') {
        img.src = source;
      } else if (source instanceof File || source instanceof Blob) {
        const isSvg = (source.name && source.name.toLowerCase().endsWith('.svg')) ||
                      (source.type && source.type.includes('svg'));
        if (isSvg) {
          const text = await readFileAsText(source);
          let svgData = text;
          if (!text.includes('xmlns=')) {
            svgData = text.replace(/<svg\b([^>]*)>/i, '<svg xmlns="http://www.w3.org/2000/svg" $1>');
          }
          const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          img.src = URL.createObjectURL(blob);
        } else {
          img.src = URL.createObjectURL(source);
        }
      } else {
        reject(new Error('Unsupported image source type'));
      }
    } catch (err) {
      reject(err);
    }
  });
}

// Convert canvas to standards-compliant SVG vector container
function imageToSvgBlob(canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const dataUrl = canvas.toDataURL('image/png');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <title>fileTookKit Converted SVG</title>
  <image width="${w}" height="${h}" href="${dataUrl}" xlink:href="${dataUrl}"/>
</svg>`;
  return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
}

// Pure client-side GIF89a encoder for canvas
function canvasToGifBlob(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, width, height).data;

  // Build a 256-color palette: 6x6x6 color cube (216) + 32 grayscale + 7 reserve + 1 transparent
  const palette = [];
  for (let r = 0; r < 6; r++) {
    for (let g = 0; g < 6; g++) {
      for (let b = 0; b < 6; b++) {
        palette.push([Math.round(r * 255 / 5), Math.round(g * 255 / 5), Math.round(b * 255 / 5)]);
      }
    }
  }
  for (let i = 0; i < 32; i++) {
    const v = Math.round(i * 255 / 31);
    palette.push([v, v, v]);
  }
  while (palette.length < 255) {
    palette.push([0, 0, 0]);
  }
  palette[255] = [0, 0, 0]; // Index 255 reserved for alpha transparency

  const numPixels = width * height;
  const indexedPixels = new Uint8Array(numPixels);
  let hasAlpha = false;

  for (let i = 0; i < numPixels; i++) {
    const offset = i * 4;
    const a = imgData[offset + 3];
    if (a < 128) {
      indexedPixels[i] = 255;
      hasAlpha = true;
    } else {
      const r = imgData[offset];
      const g = imgData[offset + 1];
      const b = imgData[offset + 2];
      if (Math.abs(r - g) < 8 && Math.abs(g - b) < 8) {
        const grayIdx = 216 + Math.min(31, Math.round(((r + g + b) / 3) * 31 / 255));
        indexedPixels[i] = grayIdx;
      } else {
        const ri = Math.min(5, Math.round(r * 5 / 255));
        const gi = Math.min(5, Math.round(g * 5 / 255));
        const bi = Math.min(5, Math.round(b * 5 / 255));
        indexedPixels[i] = ri * 36 + gi * 6 + bi;
      }
    }
  }

  const minCodeSize = 8;
  const clearCode = 1 << minCodeSize; // 256
  const eoiCode = clearCode + 1; // 257

  const outputBytes = [];
  // Header: GIF89a
  outputBytes.push(0x47, 0x49, 0x46, 0x38, 0x39, 0x61);
  // Logical Screen Descriptor
  outputBytes.push(width & 0xff, (width >> 8) & 0xff);
  outputBytes.push(height & 0xff, (height >> 8) & 0xff);
  outputBytes.push(0xf7); // GCT flag, 8 bits/pixel, 256 colors
  outputBytes.push(hasAlpha ? 255 : 0);
  outputBytes.push(0);

  // Global Color Table (768 bytes)
  for (let i = 0; i < 256; i++) {
    outputBytes.push(palette[i][0], palette[i][1], palette[i][2]);
  }

  // Graphic Control Extension
  if (hasAlpha) {
    outputBytes.push(0x21, 0xf9, 0x04, 0x01, 0x00, 0x00, 255, 0x00);
  }

  // Image Descriptor
  outputBytes.push(0x2c, 0, 0, 0, 0);
  outputBytes.push(width & 0xff, (width >> 8) & 0xff);
  outputBytes.push(height & 0xff, (height >> 8) & 0xff);
  outputBytes.push(0x00);

  // LZW Raster Data
  outputBytes.push(minCodeSize);

  let curCodeSize = minCodeSize + 1;
  let nextAvailableCode = eoiCode + 1;
  let bitBuf = 0;
  let bitCount = 0;
  const subBlock = [];

  function writeBits(code, bits) {
    bitBuf |= (code << bitCount);
    bitCount += bits;
    while (bitCount >= 8) {
      subBlock.push(bitBuf & 0xff);
      if (subBlock.length === 254) {
        outputBytes.push(subBlock.length);
        for (let b = 0; b < subBlock.length; b++) outputBytes.push(subBlock[b]);
        subBlock.length = 0;
      }
      bitBuf >>= 8;
      bitCount -= 8;
    }
  }

  function flushBits() {
    if (bitCount > 0) {
      subBlock.push(bitBuf & 0xff);
      bitBuf = 0;
      bitCount = 0;
    }
    if (subBlock.length > 0) {
      outputBytes.push(subBlock.length);
      for (let b = 0; b < subBlock.length; b++) outputBytes.push(subBlock[b]);
      subBlock.length = 0;
    }
  }

  writeBits(clearCode, curCodeSize);

  const dict = new Map();
  let prefix = indexedPixels[0];

  for (let i = 1; i < numPixels; i++) {
    const k = indexedPixels[i];
    const key = (prefix << 8) | k;
    if (dict.has(key)) {
      prefix = dict.get(key);
    } else {
      writeBits(prefix, curCodeSize);
      if (nextAvailableCode < 4096) {
        dict.set(key, nextAvailableCode++);
        if (nextAvailableCode > (1 << curCodeSize) && curCodeSize < 12) {
          curCodeSize++;
        }
      } else {
        writeBits(clearCode, curCodeSize);
        dict.clear();
        curCodeSize = minCodeSize + 1;
        nextAvailableCode = eoiCode + 1;
      }
      prefix = k;
    }
  }
  writeBits(prefix, curCodeSize);
  writeBits(eoiCode, curCodeSize);
  flushBits();

  outputBytes.push(0x00); // Block terminator
  outputBytes.push(0x3b); // Trailer ';'

  return new Blob([new Uint8Array(outputBytes)], { type: 'image/gif' });
}

// Detect if current browser natively supports writing AVIF via canvas
function isAvifSupported() {
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    return c.toDataURL('image/avif').startsWith('data:image/avif');
  } catch (e) {
    return false;
  }
}

// Unified Canvas Format Converter (supports JPG, PNG, WebP, SVG, GIF, AVIF, BMP)
async function convertCanvas(canvas, targetMime, quality = 0.9) {
  // SVG output
  if (targetMime === 'image/svg+xml') {
    return {
      blob: imageToSvgBlob(canvas),
      ext: 'svg',
      mime: 'image/svg+xml'
    };
  }

  // GIF output
  if (targetMime === 'image/gif') {
    return {
      blob: canvasToGifBlob(canvas),
      ext: 'gif',
      mime: 'image/gif'
    };
  }

  // AVIF output
  if (targetMime === 'image/avif') {
    if (isAvifSupported()) {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/avif', quality));
      return { blob, ext: 'avif', mime: 'image/avif' };
    }
    // High-efficiency WebP fallback if browser lacks native AVIF encoder
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality));
    return { blob, ext: 'webp', mime: 'image/webp', fallbackFrom: 'avif' };
  }

  // JPEG output (renders white background behind transparent pixels)
  if (targetMime === 'image/jpeg' || targetMime === 'image/jpg') {
    const flatCanvas = document.createElement('canvas');
    flatCanvas.width = canvas.width;
    flatCanvas.height = canvas.height;
    const flatCtx = flatCanvas.getContext('2d');
    flatCtx.fillStyle = '#ffffff';
    flatCtx.fillRect(0, 0, canvas.width, canvas.height);
    flatCtx.drawImage(canvas, 0, 0);
    const blob = await new Promise(resolve => flatCanvas.toBlob(resolve, 'image/jpeg', quality));
    return { blob, ext: 'jpg', mime: 'image/jpeg' };
  }

  // BMP output
  if (targetMime === 'image/bmp') {
    const blob = await new Promise(resolve => {
      canvas.toBlob(b => {
        if (b && b.type === 'image/bmp') resolve(b);
        else canvas.toBlob(resolve, 'image/png');
      }, 'image/bmp');
    });
    return { blob, ext: blob.type === 'image/bmp' ? 'bmp' : 'png', mime: blob.type };
  }

  // PNG output
  if (targetMime === 'image/png') {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    return { blob, ext: 'png', mime: 'image/png' };
  }

  // WebP output (default)
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality));
  return { blob, ext: 'webp', mime: 'image/webp' };
}

// Toast notification system
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const typeClasses = {
    info: 'bg-blue-600 text-white',
    success: 'bg-emerald-600 text-white',
    warning: 'bg-amber-600 text-white',
    error: 'bg-rose-600 text-white'
  };

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  toast.className = `${typeClasses[type] || typeClasses.info} pointer-events-auto px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 transition-all transform translate-y-4 opacity-0 text-sm font-medium`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span class="flex-1">${escapeHtml(message)}</span><button class="opacity-70 hover:opacity-100 text-lg leading-none" onclick="this.parentElement.remove()">×</button>`;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Escape HTML for safe rendering
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Setup a drag-and-drop zone
function setupDropZone(dropZoneEl, fileInputEl, onFilesSelected, options = {}) {
  if (!dropZoneEl) return;

  const highlight = () => dropZoneEl.classList.add('border-indigo-500', 'bg-indigo-50/10', 'scale-[1.01]');
  const unhighlight = () => dropZoneEl.classList.remove('border-indigo-500', 'bg-indigo-50/10', 'scale-[1.01]');

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZoneEl.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      highlight();
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZoneEl.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      unhighlight();
    }, false);
  });

  dropZoneEl.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      if (options.accept) {
        const accepted = Array.from(files).filter(f => matchesAccept(f, options.accept));
        if (accepted.length === 0) {
          showToast(`Invalid file type. Accepted: ${options.accept}`, 'warning');
          return;
        }
        onFilesSelected(accepted);
      } else {
        onFilesSelected(Array.from(files));
      }
    }
  });

  if (fileInputEl) {
    if (dropZoneEl.tagName !== 'LABEL') {
      dropZoneEl.addEventListener('click', (e) => {
        if (e.target !== fileInputEl && e.target.tagName !== 'BUTTON') {
          fileInputEl.click();
        }
      });
    }

    fileInputEl.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        onFilesSelected(Array.from(e.target.files));
        fileInputEl.value = ''; // Reset so the same file can be picked again
      }
    });
  }
}

// Check if file matches accept attribute with extension fallback
function matchesAccept(file, acceptStr) {
  if (!acceptStr || acceptStr === '*' || acceptStr === '*/*') return true;
  const mime = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();
  const types = acceptStr.split(',').map(s => s.trim().toLowerCase());

  return types.some(type => {
    if (type.startsWith('.')) {
      return name.endsWith(type);
    } else if (type.endsWith('/*')) {
      const prefix = type.replace('/*', '');
      if (mime.startsWith(prefix)) return true;
      if (prefix === 'image') {
        return /\.(jpe?g|png|webp|svg|gif|avif|bmp|ico|tiff)$/i.test(name);
      }
      return false;
    } else {
      if (mime === type) return true;
      if (type === 'application/pdf' && name.endsWith('.pdf')) return true;
      return false;
    }
  });
}

// Simple zip and download using JSZip if loaded, or sequential downloads
async function zipAndDownload(filesWithNames, zipFilename = 'archive.zip') {
  if (window.JSZip) {
    const zip = new window.JSZip();
    for (const item of filesWithNames) {
      zip.file(item.name, item.blob || item.content);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, zipFilename);
    showToast(`Downloaded ${zipFilename} successfully!`, 'success');
  } else {
    // Sequential fallback
    for (const item of filesWithNames) {
      const blob = item.blob || new Blob([item.content]);
      downloadBlob(blob, item.name);
      await new Promise(r => setTimeout(r, 200));
    }
    showToast(`Downloaded ${filesWithNames.length} files`, 'success');
  }
}

// Lightweight HTML Sanitizer to prevent arbitrary script execution in previews
function sanitizeHtml(rawHtml) {
  if (!rawHtml) return '';
  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*(["'])[\s\S]*?\1/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/href\s*=\s*(["'])javascript:[\s\S]*?\1/gi, 'href="#"');
}

// Copy text to clipboard with notification
async function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showToast(successMsg, 'success');
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(successMsg, 'success');
    }
  } catch (err) {
    showToast('Failed to copy to clipboard', 'error');
  }
}

// Expose utilities to global scope
window.ToolkitUtils = {
  formatBytes,
  downloadBlob,
  downloadText,
  readFileAsArrayBuffer,
  readFileAsText,
  readFileAsDataURL,
  loadImage,
  imageToSvgBlob,
  canvasToGifBlob,
  isAvifSupported,
  convertCanvas,
  showToast,
  escapeHtml,
  setupDropZone,
  zipAndDownload,
  copyToClipboard,
  sanitizeHtml
};
