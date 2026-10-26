/**
 * Tool 23: PDF Page Extractor
 * Studio layout with interactive work panel and settings sidebar.
 */

window.initPdfExtractor = function() {
  const container = document.getElementById('tool-pdf-extractor');
  if (!container) return;

  let currentDoc = null;
  let currentFile = null;
  let totalPages = 0;
  let selectedPages = new Set();

  const dropzone = document.getElementById('pdf-ext-dropzone');
  const input = document.getElementById('pdf-ext-input');
  const content = document.getElementById('pdf-ext-content');
  const filenameEl = document.getElementById('pdf-ext-filename');
  const filesizeEl = document.getElementById('pdf-ext-filesize');
  const badgeEl = document.getElementById('pdf-ext-badge');
  const statCountEl = document.getElementById('pdf-ext-stat-count');
  const grid = document.getElementById('pdf-ext-grid');
  const runBtn = document.getElementById('pdf-ext-run-btn');
  const resetBtn = document.getElementById('pdf-ext-reset-btn');
  const rangeTextInput = document.getElementById('pdf-ext-range-text');
  const applyRangeBtn = document.getElementById('pdf-ext-apply-range');

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
      selectedPages.clear();

      filenameEl.textContent = f.name;
      filesizeEl.textContent = `${ToolkitUtils.formatBytes(f.size)} • ${totalPages} pages`;

      renderGrid();
      dropzone.classList.add('hidden');
      content.classList.remove('hidden');
      updateSelectionUI();
    } catch (err) {
      console.error(err);
      ToolkitUtils.showToast(`Failed to load PDF: ${err.message}`, 'error');
    }
  }, { accept: '.pdf' });

  function renderGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const pageIndex = i;
      const card = document.createElement('div');
      card.className = `page-preview-card cursor-pointer`;
      card.dataset.index = pageIndex;
      card.innerHTML = `
        <div class="w-full aspect-[3/4] bg-[#1d1f20] rounded flex flex-col items-center justify-center border border-[#303334] mb-1.5 relative overflow-hidden">
          <span class="text-xl text-slate-400">📄</span>
          <div class="absolute top-1 right-1 w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center bg-[#17191a] check-box">
            <span class="text-[9px] font-bold text-white hidden">✓</span>
          </div>
        </div>
        <span class="text-[10px] font-mono text-slate-300">P. ${pageIndex + 1}</span>
      `;

      card.addEventListener('click', () => {
        if (selectedPages.has(pageIndex)) {
          selectedPages.delete(pageIndex);
        } else {
          selectedPages.add(pageIndex);
        }
        updateSelectionUI();
      });

      grid.appendChild(card);
    }
  }

  function updateSelectionUI() {
    badgeEl.textContent = `${selectedPages.size} selected`;
    statCountEl.textContent = `${selectedPages.size} of ${totalPages}`;
    runBtn.disabled = selectedPages.size === 0;

    const cards = grid.querySelectorAll('.page-preview-card');
    cards.forEach(card => {
      const idx = parseInt(card.dataset.index, 10);
      const isSelected = selectedPages.has(idx);
      const check = card.querySelector('.check-box span');
      const box = card.querySelector('.check-box');

      if (isSelected) {
        card.classList.add('selected');
        box.classList.add('bg-indigo-600', 'border-indigo-600');
        check.classList.remove('hidden');
      } else {
        card.classList.remove('selected');
        box.classList.remove('bg-indigo-600', 'border-indigo-600');
        check.classList.add('hidden');
      }
    });
  }

  document.getElementById('pdf-ext-sel-all').addEventListener('click', () => {
    for (let i = 0; i < totalPages; i++) selectedPages.add(i);
    updateSelectionUI();
  });
  document.getElementById('pdf-ext-sel-none').addEventListener('click', () => {
    selectedPages.clear();
    updateSelectionUI();
  });
  document.getElementById('pdf-ext-sel-odd').addEventListener('click', () => {
    selectedPages.clear();
    for (let i = 0; i < totalPages; i++) if ((i + 1) % 2 !== 0) selectedPages.add(i);
    updateSelectionUI();
  });
  document.getElementById('pdf-ext-sel-even').addEventListener('click', () => {
    selectedPages.clear();
    for (let i = 0; i < totalPages; i++) if ((i + 1) % 2 === 0) selectedPages.add(i);
    updateSelectionUI();
  });

  applyRangeBtn.addEventListener('click', () => {
    const text = rangeTextInput.value.trim();
    if (!text) return;
    try {
      selectedPages.clear();
      const parts = text.split(',').map(s => s.trim()).filter(Boolean);
      for (const p of parts) {
        if (p.includes('-')) {
          const [s, e] = p.split('-').map(n => parseInt(n.trim(), 10));
          if (!isNaN(s) && !isNaN(e) && s >= 1 && e <= totalPages) {
            for (let k = s; k <= e; k++) selectedPages.add(k - 1);
          }
        } else {
          const num = parseInt(p, 10);
          if (!isNaN(num) && num >= 1 && num <= totalPages) selectedPages.add(num - 1);
        }
      }
      updateSelectionUI();
      ToolkitUtils.showToast(`Selected ${selectedPages.size} pages`, 'info');
    } catch (e) {
      ToolkitUtils.showToast('Invalid range format', 'error');
    }
  });

  resetBtn.addEventListener('click', () => {
    currentDoc = null;
    currentFile = null;
    totalPages = 0;
    selectedPages.clear();
    dropzone.classList.remove('hidden');
    content.classList.add('hidden');
    runBtn.disabled = true;
  });

  runBtn.addEventListener('click', async () => {
    if (!currentDoc || selectedPages.size === 0) return;
    try {
      runBtn.disabled = true;
      ToolkitUtils.showToast('Extracting selected pages...', 'info');

      const sortedIndices = Array.from(selectedPages).sort((a, b) => a - b);
      const newDoc = await window.PDFLib.PDFDocument.create();
      const copiedPages = await newDoc.copyPages(currentDoc, sortedIndices);
      copiedPages.forEach(p => newDoc.addPage(p));

      const bytes = await newDoc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const baseName = currentFile.name.replace(/\.pdf$/i, '');
      const outName = `${baseName}_extracted_${sortedIndices.length}pages.pdf`;

      ToolkitUtils.downloadBlob(blob, outName);
      ToolkitUtils.showToast(`Extracted ${sortedIndices.length} pages!`, 'success');
    } catch (err) {
      console.error(err);
      ToolkitUtils.showToast(`Extraction failed: ${err.message}`, 'error');
    } finally {
      runBtn.disabled = false;
    }
  });
};
