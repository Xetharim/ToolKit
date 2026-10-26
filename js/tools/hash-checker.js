/**
 * Tool 35: File Hash Checker
 * Studio layout with interactive work panel and settings sidebar.
 */

window.initHashChecker = function() {
  const container = document.getElementById('tool-hash-checker');
  if (!container) return;

  let currentFile = null;
  let computedHashes = {};

  const dropzone = document.getElementById('hash-dropzone');
  const input = document.getElementById('hash-file-input');
  const workspace = document.getElementById('hash-workspace');
  const fileNameEl = document.getElementById('hash-file-name');
  const fileSizeEl = document.getElementById('hash-file-size');
  const resetBtn = document.getElementById('hash-reset-btn');
  const listContainer = document.getElementById('hash-list-container');
  const verifyInput = document.getElementById('hash-verify-input');
  const verifyStatus = document.getElementById('hash-verify-status');
  const copyAllBtn = document.getElementById('hash-copy-all-btn');

  const algorithms = [
    { key: 'sha256', name: 'SHA-256', bits: 256 },
    { key: 'md5', name: 'MD5', bits: 128 },
    { key: 'sha1', name: 'SHA-1', bits: 160 },
    { key: 'sha512', name: 'SHA-512', bits: 512 },
    { key: 'sha384', name: 'SHA-384', bits: 384 }
  ];

  ToolkitUtils.setupDropZone(dropzone, input, async (files) => {
    const f = files[0];
    if (!f) return;

    currentFile = f;
    fileNameEl.textContent = f.name;
    fileSizeEl.textContent = `${ToolkitUtils.formatBytes(f.size)} (${f.size.toLocaleString()} bytes)`;

    dropzone.classList.add('hidden');
    workspace.classList.remove('hidden');
    verifyInput.value = '';
    verifyStatus.classList.add('hidden');

    await computeAllHashes(f);
  });

  async function computeAllHashes(file) {
    listContainer.innerHTML = '<div class="text-xs text-slate-400 p-4 font-mono">Computing cryptographic digests...</div>';
    computedHashes = {};

    try {
      const buffer = await ToolkitUtils.readFileAsArrayBuffer(file);

      async function calcSubtle(algoName) {
        const hashBuf = await crypto.subtle.digest(algoName, buffer);
        const hashArr = Array.from(new Uint8Array(hashBuf));
        return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
      }

      const [sha256, sha512, sha384, sha1] = await Promise.all([
        calcSubtle('SHA-256'),
        calcSubtle('SHA-512'),
        calcSubtle('SHA-384'),
        calcSubtle('SHA-1')
      ]);

      const md5Hash = window.calcMD5 ? window.calcMD5(new Uint8Array(buffer)) : 'N/A';

      computedHashes = { sha256, md5: md5Hash, sha1, sha512, sha384 };
      copyAllBtn.disabled = false;
      renderHashList();
      ToolkitUtils.showToast('Hashes calculated!', 'success');
    } catch (err) {
      console.error(err);
      ToolkitUtils.showToast(`Digest error: ${err.message}`, 'error');
    }
  }

  function renderHashList() {
    listContainer.innerHTML = '';
    const query = verifyInput.value.trim().toLowerCase();

    algorithms.forEach(algo => {
      const hashVal = computedHashes[algo.key] || '';
      const isMatch = query && hashVal.toLowerCase() === query;

      const card = document.createElement('div');
      card.className = `p-3.5 border transition-all rounded ${
        isMatch 
          ? 'border-emerald-500 bg-emerald-950/20' 
          : 'border-[#303334] bg-[#17191a]'
      }`;

      card.innerHTML = `
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono uppercase font-semibold text-white">${algo.name}</span>
            <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1e2022] text-slate-400">${algo.bits}-BIT</span>
            ${isMatch ? '<span class="text-[10px] font-mono uppercase font-bold text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded">MATCH</span>' : ''}
          </div>
          <button class="text-xs font-mono text-slate-400 hover:text-white copy-btn" data-val="${hashVal}">Copy</button>
        </div>
        <div class="font-mono text-xs text-slate-300 break-all select-all leading-relaxed">
          ${hashVal}
        </div>
      `;

      card.querySelector('.copy-btn').addEventListener('click', () => {
        ToolkitUtils.copyToClipboard(hashVal, `${algo.name} copied!`);
      });

      listContainer.appendChild(card);
    });
  }

  verifyInput.addEventListener('input', () => {
    const val = verifyInput.value.trim().toLowerCase();
    if (!val) {
      verifyStatus.classList.add('hidden');
      renderHashList();
      return;
    }

    const isHex = /^[0-9a-f]+$/i.test(val);
    const validLengths = [32, 40, 64, 96, 128]; // MD5, SHA-1, SHA-256, SHA-384, SHA-512
    const isValidLength = validLengths.includes(val.length);

    let matchedAlgo = null;
    for (const algo of algorithms) {
      if (computedHashes[algo.key] && computedHashes[algo.key].toLowerCase() === val) {
        matchedAlgo = algo;
        break;
      }
    }

    verifyStatus.classList.remove('hidden');
    if (matchedAlgo) {
      verifyStatus.className = 'mt-2 text-xs font-mono p-3 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-700/80 leading-relaxed';
      verifyStatus.innerHTML = `
        <div class="font-bold flex items-center gap-1.5 text-emerald-200 mb-1">
          <svg class="w-3.5 h-3.5 inline text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Exact Match Verified (${matchedAlgo.name})
        </div>
        <p class="text-[11px] text-emerald-300/90 m-0">The file's byte contents strictly match the expected cryptographic digest. Note: Checksum matching verifies that file bytes are identical to the expected digest, but does not certify software safety.</p>
      `;
    } else if (!isHex || !isValidLength) {
      verifyStatus.className = 'mt-2 text-xs font-mono p-3 rounded bg-amber-950/60 text-amber-300 border border-amber-800/80 leading-relaxed';
      verifyStatus.innerHTML = `
        <div class="font-bold text-amber-200 mb-1">⚠️ Incomplete or Non-Hex Format</div>
        <p class="text-[11px] text-amber-300/90 m-0">Expected hex digest (MD5: 32 chars, SHA-1: 40, SHA-256: 64, SHA-384: 96, SHA-512: 128). Currently ${val.length} chars.</p>
      `;
    } else {
      verifyStatus.className = 'mt-2 text-xs font-mono p-3 rounded bg-rose-950/70 text-rose-300 border border-rose-800/80 leading-relaxed';
      verifyStatus.innerHTML = `
        <div class="font-bold flex items-center gap-1.5 text-rose-200 mb-1">
          <svg class="w-3.5 h-3.5 inline text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Digest Mismatch
        </div>
        <p class="text-[11px] text-rose-300/90 m-0">Provided ${val.length}-character hash does not match the file's computed digests. The file content differs or has been modified.</p>
      `;
    }

    renderHashList();
  });

  copyAllBtn.addEventListener('click', () => {
    const allText = algorithms.map(a => `${a.name}: ${computedHashes[a.key] || ''}`).join('\n');
    ToolkitUtils.copyToClipboard(allText, 'All digests copied to clipboard!');
  });

  resetBtn.addEventListener('click', () => {
    currentFile = null;
    computedHashes = {};
    dropzone.classList.remove('hidden');
    workspace.classList.add('hidden');
    copyAllBtn.disabled = true;
  });
};
