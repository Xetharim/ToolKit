/**
 * Tool 22: PDF Splitter
 * Studio layout with split work panel and settings sidebar.
 */

window.initPdfSplitter = function() {
  const container = document.getElementById('tool-pdf-splitter');
  if (!container) return;

  let currentFile = null;
  let currentDoc = null;
  let pageCount = 0;

  const dropzone = document.getElementById('pdf-split-dropzone');
  const input = document.getElementById('pdf-split-input');
  const workspace = document.getElementById('pdf-split-workspace');
  const filenameEl = document.getElementById('pdf-split-filename');
  const filesizeEl = document.getElementById('pdf-split-filesize');
  const pageCountEl = document.getElementById('pdf-split-page-count');
  const pageGrid = document.getElementById('pdf-split-page-grid');
  const resetBtn = document.getElementById('pdf-split-reset-btn');
  const runBtn = document.getElementById('pdf-split-run-btn');
  const btnLabel = document.getElementById('pdf-split-btn-label');
  const rangeBox = document.getElementById('pdf-split-range-box');
  const rangeInput = document.getElementById('pdf-split-range-input');
  const rangeHint = document.getElementById('pdf-split-range-hint');
  const modeRadios = container.querySelectorAll('input[name="pdf-split-mode"]');

  modeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'ranges') {
        rangeBox.style.display = 'block';
      } else {
        rangeBox.style.display = 'none';
      }
    });
  });

  ToolkitUtils.setupDropZone(dropzone, input, async (files) => {
    const f = files[0];
    if (!f || (!f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf')) {
      ToolkitUtils.showToast('Please select a valid PDF file.', 'warning');
      return;
    }

    try {
      ToolkitUtils.showToast('Loading PDF document...', 'info');
      const arrayBuffer = await ToolkitUtils.readFileAsArrayBuffer(f);
      if (!window.PDFLib) {
        throw new Error('PDF-Lib is loading or unavailable.');
      }
      currentDoc = await window.PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      currentFile = f;
      pageCount = currentDoc.getPageCount();

      filenameEl.textContent = f.name;
      filesizeEl.textContent = `${ToolkitUtils.formatBytes(f.size)} • ${pageCount} pages`;
      pageCountEl.textContent = pageCount;
      rangeHint.textContent = `Pages 1 - ${pageCount}`;

      // Default smart range
      if (pageCount === 1) {
        rangeInput.value = '1';
      } else if (pageCount <= 3) {
        rangeInput.value = '1, 2';
      } else {
        const half = Math.floor(pageCount / 2);
        rangeInput.value = `1-${half}, ${half + 1}-${pageCount}`;
      }

      // Render miniature page overview cards
      pageGrid.innerHTML = '';
      for (let i = 0; i < pageCount; i++) {
        const card = document.createElement('div');
        card.className = 'page-preview-card';
        card.innerHTML = `
          <div class="w-full aspect-[3/4] bg-[#1d1f20] rounded flex flex-col items-center justify-center border border-[#303334] mb-1.5 text-slate-400">
            <span class="text-xl">📄</span>
          </div>
          <span class="text-[10px] font-mono text-slate-300">P. ${i + 1}</span>
        `;
        pageGrid.appendChild(card);
      }

      dropzone.classList.add('hidden');
      workspace.classList.remove('hidden');
      runBtn.disabled = false;
      ToolkitUtils.showToast(`Loaded ${f.name} (${pageCount} pages)`, 'success');
    } catch (err) {
      console.error(err);
      ToolkitUtils.showToast(`Failed to parse PDF: ${err.message}`, 'error');
    }
  }, { accept: '.pdf' });

  resetBtn.addEventListener('click', () => {
    currentFile = null;
    currentDoc = null;
    pageCount = 0;
    dropzone.classList.remove('hidden');
    workspace.classList.add('hidden');
    runBtn.disabled = true;
    btnLabel.textContent = 'Run PDF Splitter';
    runBtn.classList.remove('complete');
  });

  runBtn.addEventListener('click', async () => {
    if (!currentDoc || !currentFile) return;

    const mode = container.querySelector('input[name="pdf-split-mode"]:checked').value;
    const baseName = currentFile.name.replace(/\.pdf$/i, '');
    const outputFiles = [];

    runBtn.disabled = true;
    btnLabel.textContent = 'Processing pages...';

    try {
      if (mode === 'all') {
        for (let i = 0; i < pageCount; i++) {
          btnLabel.textContent = `Splitting page ${i + 1} of ${pageCount}...`;
          const newDoc = await window.PDFLib.PDFDocument.create();
          const [copiedPage] = await newDoc.copyPages(currentDoc, [i]);
          newDoc.addPage(copiedPage);

          const bytes = await newDoc.save();
          outputFiles.push({
            name: `${baseName}_page_${i + 1}.pdf`,
            blob: new Blob([bytes], { type: 'application/pdf' })
          });
        }
      } else {
        const rawRanges = rangeInput.value.split(',').map(s => s.trim()).filter(Boolean);
        if (rawRanges.length === 0) {
          throw new Error('Please enter at least one valid page range.');
        }

        for (let rIdx = 0; rIdx < rawRanges.length; rIdx++) {
          const rStr = rawRanges[rIdx];
          let indices = [];

          if (rStr.includes('-')) {
            const parts = rStr.split('-').map(p => parseInt(p.trim(), 10));
            const start = parts[0];
            const end = parts[1];
            if (isNaN(start) || isNaN(end) || start < 1 || end > pageCount || start > end) {
              throw new Error(`Invalid range "${rStr}". Must be between 1 and ${pageCount}.`);
            }
            for (let p = start; p <= end; p++) indices.push(p - 1);
          } else {
            const pageNum = parseInt(rStr, 10);
            if (isNaN(pageNum) || pageNum < 1 || pageNum > pageCount) {
              throw new Error(`Invalid page number "${rStr}". Must be between 1 and ${pageCount}.`);
            }
            indices.push(pageNum - 1);
          }

          btnLabel.textContent = `Generating part ${rIdx + 1}/${rawRanges.length}...`;
          const newDoc = await window.PDFLib.PDFDocument.create();
          const copiedPages = await newDoc.copyPages(currentDoc, indices);
          copiedPages.forEach(p => newDoc.addPage(p));

          const bytes = await newDoc.save();
          outputFiles.push({
            name: `${baseName}_part_${rIdx + 1}_(pages_${rStr}).pdf`,
            blob: new Blob([bytes], { type: 'application/pdf' })
          });
        }
      }

      btnLabel.textContent = 'Packaging downloads...';

      if (outputFiles.length === 1) {
        ToolkitUtils.downloadBlob(outputFiles[0].blob, outputFiles[0].name);
        ToolkitUtils.showToast(`Saved ${outputFiles[0].name}`, 'success');
      } else {
        await ToolkitUtils.zipAndDownload(outputFiles, `${baseName}_split.zip`);
      }

      btnLabel.textContent = 'Complete ✓ Download Ready';
      runBtn.classList.add('complete');
    } catch (err) {
      console.error(err);
      ToolkitUtils.showToast(err.message, 'error');
      btnLabel.textContent = 'Run PDF Splitter';
    } finally {
      runBtn.disabled = false;
    }
  });
};
