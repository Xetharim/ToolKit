/**
 * Tool 24: PDF Rotator
 * Studio layout with interactive work panel and settings sidebar.
 */

window.initPdfRotator = function() {
  const container = document.getElementById('tool-pdf-rotator');
  if (!container) return;

  let currentDoc = null;
  let currentFile = null;
  let totalPages = 0;
  let rotations = [];

  const dropzone = document.getElementById('pdf-rot-dropzone');
  const input = document.getElementById('pdf-rot-input');
  const content = document.getElementById('pdf-rot-content');
  const filenameEl = document.getElementById('pdf-rot-filename');
  const filesizeEl = document.getElementById('pdf-rot-filesize');
  const grid = document.getElementById('pdf-rot-grid');
  const runBtn = document.getElementById('pdf-rot-run-btn');
  const resetBtn = document.getElementById('pdf-rot-reset-btn');

  ToolkitUtils.setupDropZone(dropzone, input, async (files) => {
    const f = files[0];
    if (!f || (!f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf')) {
      ToolkitUtils.showToast('Please select a valid PDF file.', 'warning');
      return;
    }

    try {
      ToolkitUtils.showToast('Loading PDF...', 'info');
      const arrayBuffer = await ToolkitUtils.readFileAsArrayBuffer(f);
      currentDoc = await window.PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      currentFile = f;
      totalPages = currentDoc.getPageCount();

      filenameEl.textContent = f.name;
      filesizeEl.textContent = `${ToolkitUtils.formatBytes(f.size)} • ${totalPages} pages`;

      rotations = [];
      const pages = currentDoc.getPages();
      for (let i = 0; i < totalPages; i++) {
        const rot = pages[i].getRotation().angle || 0;
        rotations.push(rot % 360);
      }

      renderGrid();
      dropzone.classList.add('hidden');
      content.classList.remove('hidden');
      runBtn.disabled = false;
      ToolkitUtils.showToast(`Loaded ${f.name}`, 'success');
    } catch (err) {
      console.error(err);
      ToolkitUtils.showToast(`Failed to load PDF: ${err.message}`, 'error');
    }
  }, { accept: '.pdf' });

  function renderGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const idx = i;
      const card = document.createElement('div');
      card.className = 'page-preview-card cursor-pointer';
      card.innerHTML = `
        <div class="w-full aspect-[3/4] bg-[#1d1f20] rounded flex flex-col items-center justify-center border border-[#303334] mb-1.5 relative overflow-hidden">
          <div class="page-icon-wrapper transition-transform duration-200" style="transform: rotate(${rotations[idx]}deg)">
            <span class="text-2xl">📄</span>
          </div>
          <span class="absolute top-1 right-1 text-[9px] font-mono px-1 py-0.5 rounded bg-black/60 text-white rot-label">
            ${rotations[idx]}°
          </span>
        </div>
        <div class="flex items-center justify-between w-full px-1">
          <span class="text-[10px] font-mono text-slate-300">P. ${idx + 1}</span>
          <span class="text-[10px] text-slate-500">↻</span>
        </div>
      `;

      card.addEventListener('click', () => {
        rotations[idx] = (rotations[idx] + 90) % 360;
        card.querySelector('.page-icon-wrapper').style.transform = `rotate(${rotations[idx]}deg)`;
        card.querySelector('.rot-label').textContent = `${rotations[idx]}°`;
      });

      grid.appendChild(card);
    }
  }

  document.getElementById('pdf-rot-all-right').addEventListener('click', () => {
    rotations = rotations.map(r => (r + 90) % 360);
    renderGrid();
  });
  document.getElementById('pdf-rot-all-left').addEventListener('click', () => {
    rotations = rotations.map(r => (r - 90 + 360) % 360);
    renderGrid();
  });
  document.getElementById('pdf-rot-all-180').addEventListener('click', () => {
    rotations = rotations.map(r => (r + 180) % 360);
    renderGrid();
  });
  document.getElementById('pdf-rot-all-reset').addEventListener('click', () => {
    rotations = rotations.map(() => 0);
    renderGrid();
  });

  resetBtn.addEventListener('click', () => {
    currentDoc = null;
    currentFile = null;
    totalPages = 0;
    rotations = [];
    dropzone.classList.remove('hidden');
    content.classList.add('hidden');
    runBtn.disabled = true;
  });

  runBtn.addEventListener('click', async () => {
    if (!currentDoc || !currentFile) return;
    try {
      runBtn.disabled = true;
      ToolkitUtils.showToast('Applying rotations and exporting PDF...', 'info');

      const pages = currentDoc.getPages();
      for (let i = 0; i < totalPages; i++) {
        pages[i].setRotation(window.PDFLib.degrees(rotations[i]));
      }

      const bytes = await currentDoc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const baseName = currentFile.name.replace(/\.pdf$/i, '');
      const outName = `${baseName}_rotated.pdf`;

      ToolkitUtils.downloadBlob(blob, outName);
      ToolkitUtils.showToast(`Saved ${outName}!`, 'success');
    } catch (err) {
      console.error(err);
      ToolkitUtils.showToast(`Rotation failed: ${err.message}`, 'error');
    } finally {
      runBtn.disabled = false;
    }
  });
};
