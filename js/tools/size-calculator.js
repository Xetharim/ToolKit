/**
 * Tool 31: File Size Calculator
 * Studio layout with interactive work panel and settings sidebar.
 */

window.initSizeCalculator = function() {
  const container = document.getElementById('tool-size-calculator');
  if (!container) return;

  const dropzone = document.getElementById('calc-dropzone');
  const fileInput = document.getElementById('calc-file-input');
  const manualVal = document.getElementById('calc-manual-val');
  const manualUnit = document.getElementById('calc-manual-unit');
  const activeLabel = document.getElementById('calc-active-file-label');

  const resBytes = document.getElementById('calc-res-bytes');
  const resBits = document.getElementById('calc-res-bits');
  const resKb = document.getElementById('calc-res-kb');
  const resMb = document.getElementById('calc-res-mb');
  const resGb = document.getElementById('calc-res-gb');
  const resTb = document.getElementById('calc-res-tb');
  const resClusters = document.getElementById('calc-res-clusters');
  const resOndisk = document.getElementById('calc-res-ondisk');
  const transferTbody = document.getElementById('calc-transfer-tbody');
  const mediaFits = document.getElementById('calc-media-fits');

  ToolkitUtils.setupDropZone(dropzone, fileInput, (files) => {
    const f = files[0];
    if (!f) return;
    activeLabel.textContent = `File: ${f.name}`;
    updateWithBytes(f.size);
    ToolkitUtils.showToast(`Inspecting ${f.name}`, 'info');
  });

  manualVal.addEventListener('input', calculateFromManual);
  manualUnit.addEventListener('change', calculateFromManual);

  function calculateFromManual() {
    activeLabel.textContent = 'Manual size calculation';
    const num = parseFloat(manualVal.value) || 0;
    const unit = manualUnit.value;
    let bytes = 0;

    switch (unit) {
      case 'B': bytes = num; break;
      case 'KB': bytes = num * 1e3; break;
      case 'KiB': bytes = num * 1024; break;
      case 'MB': bytes = num * 1e6; break;
      case 'MiB': bytes = num * (1024 * 1024); break;
      case 'GB': bytes = num * 1e9; break;
      case 'GiB': bytes = num * (1024 * 1024 * 1024); break;
      case 'TB': bytes = num * 1e12; break;
    }
    updateWithBytes(bytes);
  }

  function formatTime(seconds) {
    if (seconds <= 0) return '0 s';
    if (seconds < 0.01) return '< 10 ms';
    if (seconds < 1) return `${Math.round(seconds * 1000)} ms`;
    if (seconds < 60) return `${seconds.toFixed(1)} s`;
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${mins}m ${secs}s`;
    }
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  }

  function updateWithBytes(bytes) {
    bytes = Math.max(0, Math.round(bytes));
    const bits = bytes * 8;

    resBytes.textContent = `${bytes.toLocaleString()} B`;
    resBits.textContent = `${bits.toLocaleString()} bits`;

    const kbDec = (bytes / 1e3).toFixed(2);
    const kbBin = (bytes / 1024).toFixed(2);
    resKb.textContent = `${kbDec} KB / ${kbBin} KiB`;

    const mbDec = (bytes / 1e6).toFixed(2);
    const mbBin = (bytes / (1024 * 1024)).toFixed(2);
    resMb.textContent = `${mbDec} MB / ${mbBin} MiB`;

    const gbDec = (bytes / 1e9).toFixed(3);
    const gbBin = (bytes / (1024 * 1024 * 1024)).toFixed(3);
    resGb.textContent = `${gbDec} GB / ${gbBin} GiB`;

    const tbDec = (bytes / 1e12).toFixed(4);
    const tbBin = (bytes / Math.pow(1024, 4)).toFixed(4);
    resTb.textContent = `${tbDec} TB / ${tbBin} TiB`;

    const clusterSize = 4096;
    const clusters = Math.ceil(bytes / clusterSize);
    const sizeOnDisk = clusters * clusterSize;
    resClusters.textContent = clusters.toLocaleString();
    resOndisk.textContent = `${ToolkitUtils.formatBytes(sizeOnDisk)}`;

    const profiles = [
      { name: '4G LTE Broadband', speedLabel: '25 Mbps', bps: (25 * 1e6) / 8 },
      { name: 'Standard Fiber', speedLabel: '100 Mbps', bps: (100 * 1e6) / 8 },
      { name: 'Gigabit Fiber', speedLabel: '1 Gbps', bps: (1000 * 1e6) / 8 },
      { name: 'USB 3.0 External', speedLabel: '350 MB/s', bps: 350 * 1024 * 1024 },
      { name: 'NVMe Gen 4 SSD', speedLabel: '5,000 MB/s', bps: 5000 * 1024 * 1024 }
    ];

    transferTbody.innerHTML = profiles.map(p => `
      <tr class="hover:bg-[#1f2224]">
        <td class="p-2.5 text-white">${p.name}</td>
        <td class="p-2.5 text-slate-400">${p.speedLabel}</td>
        <td class="p-2.5 ${bytes / p.bps < 60 ? 'text-emerald-400' : 'text-slate-300'}">${formatTime(bytes / p.bps)}</td>
      </tr>
    `).join('');

    // Media capacity
    const floppyFits = bytes > 0 ? (1440000 / bytes).toFixed(1) : '∞';
    const cdFits = bytes > 0 ? (700000000 / bytes).toFixed(1) : '∞';
    const dvdFits = bytes > 0 ? (4700000000 / bytes).toFixed(1) : '∞';
    mediaFits.innerHTML = `
      <div>• 1.44 MB Floppy: ${floppyFits > 1 ? `${Math.floor(floppyFits)} fits` : (bytes <= 1440000 ? '1 fits' : 'Exceeds')}</div>
      <div>• 700 MB CD-R: ${cdFits > 1 ? `${Math.floor(cdFits)} fit` : (bytes <= 700000000 ? '1 fits' : 'Exceeds')}</div>
      <div>• 4.7 GB DVD: ${dvdFits > 1 ? `${Math.floor(dvdFits)} fit` : (bytes <= 4700000000 ? '1 fits' : 'Exceeds')}</div>
    `;
  }

  calculateFromManual();
};
