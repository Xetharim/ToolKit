/**
 * Tool 25: PDF Compressor
 * Studio layout with split work panel and settings sidebar.
 */

window.initPdfCompressor = function() {
  const container = document.getElementById('tool-pdf-compressor');
  if (!container) return;

  let currentFile = null;
  let compressedBlob = null;

  const dropzone = document.getElementById('pdf-comp-dropzone');
  const input = document.getElementById('pdf-comp-input');
  const workspace = document.getElementById('pdf-comp-workspace');
  const nameEl = document.getElementById('pdf-comp-name');
  const origSizeEl = document.getElementById('pdf-comp-orig-size');
  const resetBtn = document.getElementById('pdf-comp-reset-btn');
  const resultBox = document.getElementById('pdf-comp-result-box');
  const statOrig = document.getElementById('pdf-comp-stat-orig');
  const statNew = document.getElementById('pdf-comp-stat-new');
  const badge = document.getElementById('pdf-comp-badge');
  const stripMetaCheckbox = document.getElementById('pdf-comp-strip-meta');
  const runBtn = document.getElementById('pdf-comp-run-btn');
  const btnLabel = document.getElementById('pdf-comp-btn-label');

  ToolkitUtils.setupDropZone(dropzone, input, (files) => {
    const f = files[0];
    if (!f || (!f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf')) {
      ToolkitUtils.showToast('Please select a valid PDF file.', 'warning');
      return;
    }
    currentFile = f;
    compressedBlob = null;

    nameEl.textContent = f.name;
    origSizeEl.textContent = ToolkitUtils.formatBytes(f.size);
    statOrig.textContent = ToolkitUtils.formatBytes(f.size);

    dropzone.classList.add('hidden');
    workspace.classList.remove('hidden');
    resultBox.classList.add('hidden');
    runBtn.disabled = false;
    btnLabel.textContent = 'Compress PDF';
    runBtn.classList.remove('complete');
  }, { accept: '.pdf' });

  resetBtn.addEventListener('click', () => {
    currentFile = null;
    compressedBlob = null;
    badge.textContent = 'Loaded';
    badge.className = 'badge badge-pdf';
    dropzone.classList.remove('hidden');
    workspace.classList.add('hidden');
    runBtn.disabled = true;
    btnLabel.textContent = 'Compress PDF';
    runBtn.classList.remove('complete');
  });

  runBtn.addEventListener('click', async () => {
    if (compressedBlob) {
      // Download phase
      const baseName = currentFile.name.replace(/\.pdf$/i, '');
      ToolkitUtils.downloadBlob(compressedBlob, `${baseName}_compressed.pdf`);
      ToolkitUtils.showToast('Downloaded compressed PDF!', 'success');
      return;
    }

    if (!currentFile || !window.PDFLib) return;
    try {
      runBtn.disabled = true;
      btnLabel.textContent = 'Compressing stream objects...';

      const arrayBuffer = await ToolkitUtils.readFileAsArrayBuffer(currentFile);
      const pdfDoc = await window.PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      if (stripMetaCheckbox.checked) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
      }

      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50
      });

      compressedBlob = new Blob([compressedBytes], { type: 'application/pdf' });
      statNew.textContent = ToolkitUtils.formatBytes(compressedBlob.size);

      const savedPct = Math.round(((currentFile.size - compressedBlob.size) / currentFile.size) * 100);
      badge.textContent = savedPct > 0 ? `-${savedPct}% Saved` : 'Optimized';
      badge.className = 'text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300';

      resultBox.classList.remove('hidden');
      btnLabel.textContent = 'Download Compressed PDF';
      runBtn.classList.add('complete');
      ToolkitUtils.showToast('PDF compressed successfully!', 'success');
    } catch (err) {
      console.error(err);
      ToolkitUtils.showToast(`Compression failed: ${err.message}`, 'error');
      btnLabel.textContent = 'Compress PDF';
    } finally {
      runBtn.disabled = false;
    }
  });
};
