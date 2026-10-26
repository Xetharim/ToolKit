/**
 * Tool 21: PDF Merger
 * Studio layout with interactive work panel and settings sidebar.
 */

window.initPdfMerger = function() {
  const container = document.getElementById('tool-pdf-merger');
  if (!container) return;

  let pdfFiles = [];

  const dropzone = document.getElementById('pdf-merger-dropzone');
  const input = document.getElementById('pdf-merger-input');
  const fileListEl = document.getElementById('pdf-merger-file-list');
  const listContainer = document.getElementById('pdf-merger-list-container');
  const countEl = document.getElementById('pdf-merger-count');
  const queueStat = document.getElementById('pdf-merger-queue-stat');
  const runBtn = document.getElementById('pdf-merger-run-btn');
  const btnLabel = document.getElementById('pdf-merger-btn-label');
  const clearBtn = document.getElementById('pdf-merger-clear-btn');

  ToolkitUtils.setupDropZone(dropzone, input, async (files) => {
    const pdfs = files.filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
    if (pdfs.length === 0) {
      ToolkitUtils.showToast('Please select valid PDF files.', 'warning');
      return;
    }

    ToolkitUtils.showToast(`Reading ${pdfs.length} PDF(s)...`, 'info');
    for (const f of pdfs) {
      let pageCount = '?';
      try {
        if (window.PDFLib) {
          const arrayBuffer = await ToolkitUtils.readFileAsArrayBuffer(f);
          const pdfDoc = await window.PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          pageCount = pdfDoc.getPageCount();
        }
      } catch (e) {
        console.warn('Could not read page count for', f.name, e);
      }

      pdfFiles.push({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        size: f.size,
        pageCount
      });
    }

    renderList();
  }, { accept: '.pdf' });

  function renderList() {
    fileListEl.innerHTML = '';
    if (pdfFiles.length === 0) {
      listContainer.classList.add('hidden');
      clearBtn.classList.add('hidden');
      runBtn.disabled = true;
      queueStat.textContent = '0 files';
      return;
    }

    listContainer.classList.remove('hidden');
    clearBtn.classList.remove('hidden');
    countEl.textContent = pdfFiles.length;
    queueStat.textContent = `${pdfFiles.length} files queued`;
    runBtn.disabled = pdfFiles.length < 2;

    pdfFiles.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'file-list-item';
      row.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          <span class="w-6 h-6 rounded bg-[#1e2022] border border-[#303334] text-indigo-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
            ${index + 1}
          </span>
          <div class="truncate">
            <p class="text-xs font-semibold text-white truncate">${ToolkitUtils.escapeHtml(item.name)}</p>
            <p class="text-[11px] font-mono text-slate-400">${ToolkitUtils.formatBytes(item.size)} • ${item.pageCount} ${item.pageCount === 1 ? 'page' : 'pages'}</p>
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button class="p-1.5 text-slate-400 hover:text-white ${index === 0 ? 'opacity-20 cursor-not-allowed' : ''}" data-action="up" data-index="${index}">▲</button>
          <button class="p-1.5 text-slate-400 hover:text-white ${index === pdfFiles.length - 1 ? 'opacity-20 cursor-not-allowed' : ''}" data-action="down" data-index="${index}">▼</button>
          <button class="p-1.5 text-slate-400 hover:text-rose-400 ml-2" data-action="remove" data-index="${index}">✕</button>
        </div>
      `;

      row.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.dataset.action;
          const idx = parseInt(btn.dataset.index, 10);
          if (action === 'up' && idx > 0) {
            const temp = pdfFiles[idx];
            pdfFiles[idx] = pdfFiles[idx - 1];
            pdfFiles[idx - 1] = temp;
            renderList();
          } else if (action === 'down' && idx < pdfFiles.length - 1) {
            const temp = pdfFiles[idx];
            pdfFiles[idx] = pdfFiles[idx + 1];
            pdfFiles[idx + 1] = temp;
            renderList();
          } else if (action === 'remove') {
            pdfFiles.splice(idx, 1);
            renderList();
          }
        });
      });

      fileListEl.appendChild(row);
    });
  }

  clearBtn.addEventListener('click', () => {
    pdfFiles = [];
    renderList();
  });

  runBtn.addEventListener('click', async () => {
    if (pdfFiles.length < 2) return;
    if (!window.PDFLib) {
      ToolkitUtils.showToast('PDF-Lib is loading or unavailable.', 'error');
      return;
    }

    try {
      runBtn.disabled = true;
      btnLabel.textContent = 'Merging documents...';

      const mergedPdf = await window.PDFLib.PDFDocument.create();

      for (let i = 0; i < pdfFiles.length; i++) {
        const item = pdfFiles[i];
        btnLabel.textContent = `Merging (${i + 1}/${pdfFiles.length})...`;
        const arrayBuffer = await ToolkitUtils.readFileAsArrayBuffer(item.file);
        const donorPdf = await window.PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      btnLabel.textContent = 'Saving merged PDF...';
      const mergedBytes = await mergedPdf.save();
      const mergedBlob = new Blob([mergedBytes], { type: 'application/pdf' });
      const outName = `merged_${Date.now()}.pdf`;

      ToolkitUtils.downloadBlob(mergedBlob, outName);
      ToolkitUtils.showToast(`Merged ${pdfFiles.length} files into ${outName}`, 'success');

      btnLabel.textContent = 'Complete ✓ Download Ready';
      runBtn.classList.add('complete');
    } catch (err) {
      console.error(err);
      ToolkitUtils.showToast(`Merge failed: ${err.message}`, 'error');
      btnLabel.textContent = 'Merge All PDFs';
    } finally {
      runBtn.disabled = false;
    }
  });
};
