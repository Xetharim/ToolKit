/**
 * fileTookKit - Tool Templates Registry
 * Pre-compiled string templates of individual pages/*.html files.
 * Enables instant zero-CORS synchronous mounting for file:/// protocol.
 */

window.TOOL_TEMPLATES = {
  "hash-checker": `<!-- Tool 35: File Hash Checker HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <label id="hash-dropzone" class="dropzone cursor-pointer">
      <input type="file" id="hash-file-input">
      <div class="dropzone-icon-circle">
        <svg class="dropzone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>
      </div>
      <strong>Drop any file here to compute checksums</strong>
      <span>or click to choose from your device</span>
      <div class="dropzone-badges">
        <span class="dropzone-badge">SHA-256</span>
        <span class="dropzone-badge">MD5</span>
        <span class="dropzone-badge">SHA-512</span>
        <span class="dropzone-badge">SHA-1</span>
        <span class="dropzone-badge">SHA-384</span>
      </div>
      <small>Any file size • Hardware-accelerated client hashing</small>
    </label>

    <div id="hash-workspace" class="space-y-6 hidden">
      <div class="file-row">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/></svg>
        <div>
          <strong id="hash-file-name">file.bin</strong>
          <span id="hash-file-size">0 MB</span>
        </div>
        <div class="text-right">
          <span class="badge badge-calc">Computed</span>
        </div>
        <button id="hash-reset-btn" title="Remove file">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>

      <!-- Hash List -->
      <div class="space-y-3">
        <span class="text-xs font-mono uppercase text-slate-400 tracking-wider">Computed Cryptographic Digests</span>
        <div id="hash-list-container" class="space-y-3"></div>
      </div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Checksum Verification</span>
      <small>01 / 01</small>
    </div>

    <div class="setting-item">
      <span><b>Compare Expected Hash</b><small class="text-slate-400 font-mono">Auto-detect</small></span>
      <input type="text" id="hash-verify-input" class="input-dark mt-2 font-mono text-xs" placeholder="Paste expected checksum here...">
      <div id="hash-verify-status" class="mt-2 hidden text-xs font-mono p-2.5 rounded"></div>
    </div>

    <div class="setting-item">
      <span><b>Algorithms Computed</b></span>
      <p class="text-xs text-slate-400 mt-1">SHA-256, SHA-512, SHA-384, SHA-1 via native WebCrypto; MD5 via RFC 1321 pure engine.</p>
    </div>

    <div class="privacy-note">
      File digests are calculated stream-by-stream in hardware memory. Zero bytes transmitted over network.
    </div>

    <button id="hash-copy-all-btn" class="primary" disabled>
      <span>Copy All Hashes</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
  </aside>
</div>
`,

  "html-to-md": `<!-- Tool 33: HTML to Markdown Converter HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <div class="flex items-center justify-between mb-3 text-xs font-mono">
      <span class="uppercase text-slate-400">HTML Source Input</span>
      <span id="html-stats" class="text-slate-400">0 chars</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-[480px]">
      <div class="flex flex-col bg-[#17191a] border border-[#303334] rounded overflow-hidden">
        <div class="p-2.5 bg-[#1e2022] border-b border-[#303334] text-[11px] font-mono uppercase text-slate-400">
          Paste HTML Markup
        </div>
        <textarea id="html-input" class="w-full flex-1 p-3 bg-transparent text-xs font-mono text-slate-200 border-none outline-none resize-none" placeholder="<p>Paste HTML here...</p>"></textarea>
      </div>

      <div class="flex flex-col bg-[#17191a] border border-[#303334] rounded overflow-hidden">
        <div class="p-2.5 bg-[#1e2022] border-b border-[#303334] text-[11px] font-mono uppercase text-slate-400">
          Clean Markdown Output
        </div>
        <textarea id="md-output" readonly class="w-full flex-1 p-3 bg-black/40 text-slate-100 text-xs font-mono border-none outline-none resize-none"></textarea>
      </div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Converter Options</span>
      <small>01 / 01</small>
    </div>

    <div class="setting-item">
      <button id="html-load-file-btn" class="btn-secondary w-full py-2 text-xs">Upload HTML Document</button>
      <input type="file" id="html-file-input" accept=".html,.htm,.txt" class="hidden">
    </div>

    <div class="setting-item">
      <button id="html-paste-demo" class="btn-secondary w-full py-2 text-xs">Insert Sample Markup</button>
    </div>

    <div class="setting-item">
      <button id="html-copy-btn" class="btn-secondary w-full py-2 text-xs">Copy Markdown</button>
    </div>

    <div class="privacy-note">
      DOM traversal and Markdown generation run strictly client-side.
    </div>

    <button id="html-download-btn" class="primary">
      <span>Download .md Document</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v12m0 0 5-5m-5 5-5-5"/><path d="M4 20h16"/></svg>
    </button>
  </aside>
</div>
`,

  "image-compressor": `<!-- Tool 26: Image Compressor HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <label id="img-comp-dropzone" class="dropzone cursor-pointer">
      <input type="file" id="img-comp-input" accept="image/*,.jpg,.jpeg,.png,.webp,.svg,.gif,.avif">
      <div class="dropzone-icon-circle">
        <svg class="dropzone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>
      </div>
      <strong>Drop image file here to compress</strong>
      <span>or click to choose from your device</span>
      <div class="dropzone-badges">
        <span class="dropzone-badge">JPG</span>
        <span class="dropzone-badge">PNG</span>
        <span class="dropzone-badge">WebP</span>
        <span class="dropzone-badge">AVIF</span>
      </div>
      <small>Real-time visual optimization & size reduction</small>
    </label>

    <div id="img-comp-workspace" class="space-y-6 hidden">
      <div class="file-row">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/></svg>
        <div>
          <strong id="img-comp-filename">photo.jpg</strong>
          <span id="img-comp-file-stats">0 KB • 0 × 0px</span>
        </div>
        <div class="text-right">
          <span id="img-comp-badge" class="badge badge-image">-0%</span>
        </div>
        <button id="img-comp-reset-btn" title="Remove file">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>

      <!-- Preview Stage -->
      <div class="preview-stage">
        <img id="img-comp-preview" class="max-h-[340px] max-w-full rounded object-contain shadow" alt="Preview">
      </div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Compression Controls</span>
      <small>01 / 01</small>
    </div>

    <label class="setting-item">
      <span>Output Quality <b id="img-comp-quality-val" class="font-mono text-indigo-400">80%</b></span>
      <input type="range" id="img-comp-quality-slider" min="5" max="100" value="80">
    </label>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Target Format</span>
      <select id="img-comp-format-select" class="input-dark">
        <option value="image/webp" selected>WebP (High efficiency)</option>
        <option value="image/jpeg">JPEG (Standard photo)</option>
        <option value="image/png">PNG (Lossless)</option>
      </select>
    </div>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Max Dimension</span>
      <select id="img-comp-max-dim" class="input-dark">
        <option value="0" selected>Original Resolution</option>
        <option value="2560">Max 2560px (2K)</option>
        <option value="1920">Max 1920px (Full HD)</option>
        <option value="1280">Max 1280px (HD)</option>
      </select>
    </div>

    <div class="setting-item">
      <span><b>Size Savings</b><small id="img-comp-diff-label" class="text-emerald-400 font-mono">-</small></span>
      <p id="img-comp-summary" class="text-xs text-slate-400 mt-2">Adjust slider to see real-time size reduction.</p>
    </div>

    <div class="privacy-note">
      Canvas rasterization runs in hardware-accelerated local memory.
    </div>

    <button id="img-comp-download-btn" class="primary" disabled>
      <span id="img-comp-btn-label">Download Compressed Image</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v12m0 0 5-5m-5 5-5-5"/><path d="M4 20h16"/></svg>
    </button>
  </aside>
</div>
`,

  "image-converter": `<!-- Tool 29: Image Format Converter HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <label id="img-conv-dropzone" class="dropzone cursor-pointer">
      <input type="file" id="img-conv-input" accept="image/*,.jpg,.jpeg,.png,.webp,.svg,.gif,.avif,.bmp" multiple>
      <div class="dropzone-icon-circle">
        <svg class="dropzone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>
      </div>
      <strong>Drop images here for format conversion</strong>
      <span>or click to choose from your device</span>
      <div class="dropzone-badges">
        <span class="dropzone-badge">JPG / JPEG</span>
        <span class="dropzone-badge">PNG</span>
        <span class="dropzone-badge">WebP</span>
        <span class="dropzone-badge">SVG</span>
        <span class="dropzone-badge">GIF</span>
        <span class="dropzone-badge">AVIF</span>
      </div>
      <small>Bidirectional conversion • 100% Client-side</small>
    </label>

    <div id="img-conv-queue-box" class="space-y-4 hidden">
      <div class="flex justify-between items-center text-xs font-mono text-slate-400 uppercase tracking-wider">
        <span>Queued Images (<b id="img-conv-queue-count" class="text-white">0</b>)</span>
        <span id="img-conv-status-summary">Ready</span>
      </div>
      <div id="img-conv-queue-list" class="space-y-2 max-h-[400px] overflow-y-auto"></div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Conversion Setup</span>
      <small>01 / 01</small>
    </div>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Target Output Format</span>
      <select id="img-conv-target-format" class="input-dark text-xs">
        <option value="image/webp" selected>WebP (Modern, ultra-compact)</option>
        <option value="image/png">PNG (Lossless, alpha support)</option>
        <option value="image/jpeg">JPG / JPEG (Standard photo)</option>
        <option value="image/svg+xml">SVG (Vector container format)</option>
        <option value="image/gif">GIF (Graphic interchange format)</option>
        <option value="image/avif">AVIF (Next-gen compression)</option>
        <option value="image/bmp">BMP (Uncompressed bitmap)</option>
      </select>
    </div>

    <label id="img-conv-qual-box" class="setting-item">
      <span>Quality (JPEG / WebP / AVIF) <b id="img-conv-qual-label" class="font-mono text-indigo-400">90%</b></span>
      <input type="range" id="img-conv-quality" min="10" max="100" value="90">
    </label>

    <div class="setting-item">
      <div class="flex justify-between items-center">
        <span class="text-xs font-mono text-slate-400 uppercase">Clear All</span>
        <button id="img-conv-clear-btn" class="btn-secondary py-1 px-3 text-xs hidden">Reset</button>
      </div>
    </div>

    <div class="privacy-note">
      Batch pixel rasterization executed across local client-side memory. Zero server uploads.
    </div>

    <div class="space-y-2 mt-auto">
      <button id="img-conv-run-btn" class="primary w-full" disabled>
        <span>Convert All Images</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
      <button id="img-conv-zip-btn" class="btn-secondary w-full py-2.5 text-xs hidden">
        Download Batch Archive (.zip)
      </button>
    </div>
  </aside>
</div>
`,

  "image-cropper": `<!-- Tool 28: Image Cropper HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <label id="img-crop-dropzone" class="dropzone cursor-pointer">
      <input type="file" id="img-crop-input" accept="image/*,.jpg,.jpeg,.png,.webp,.svg,.gif,.avif">
      <div class="dropzone-icon-circle">
        <svg class="dropzone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>
      </div>
      <strong>Drop image file here to crop</strong>
      <span>or click to choose from your device</span>
      <div class="dropzone-badges">
        <span class="dropzone-badge">JPG</span>
        <span class="dropzone-badge">PNG</span>
        <span class="dropzone-badge">WebP</span>
        <span class="dropzone-badge">SVG</span>
        <span class="dropzone-badge">AVIF</span>
      </div>
      <small>Interactive bounding box & aspect ratio locks</small>
    </label>

    <div id="img-crop-workspace" class="space-y-6 hidden">
      <div class="file-row">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/></svg>
        <div>
          <strong id="img-crop-filename">photo.png</strong>
          <span id="img-crop-orig-info">0 × 0px</span>
        </div>
        <div class="text-right">
          <span id="img-crop-dim-badge" class="badge badge-image">0 × 0</span>
        </div>
        <button id="img-crop-reset-btn" title="Remove file">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>

      <!-- Interactive Crop Stage -->
      <div class="p-4 bg-[#17191a] border border-[#303334] rounded flex items-center justify-center min-h-[380px] overflow-hidden select-none">
        <div id="img-crop-stage-container" class="relative inline-block">
          <canvas id="img-crop-main-canvas" class="block max-h-[400px] max-w-full"></canvas>
          <!-- Interactive overlay box -->
          <div id="img-crop-box" class="absolute border-2 border-indigo-400 bg-indigo-500/10 cursor-move" style="top: 0; left: 0; width: 100px; height: 100px;">
            <div class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-indigo-600 rounded-sm cursor-nwse-resize" data-handle="tl"></div>
            <div class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-indigo-600 rounded-sm cursor-nesw-resize" data-handle="tr"></div>
            <div class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-indigo-600 rounded-sm cursor-nesw-resize" data-handle="bl"></div>
            <div class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-indigo-600 rounded-sm cursor-nwse-resize" data-handle="br"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Crop Settings</span>
      <small>01 / 01</small>
    </div>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Aspect Ratio</span>
      <div class="grid grid-cols-3 gap-2">
        <button class="crop-ratio-btn btn-secondary py-1 text-xs active bg-white text-black" data-ratio="free">Free</button>
        <button class="crop-ratio-btn btn-secondary py-1 text-xs" data-ratio="1:1">1:1</button>
        <button class="crop-ratio-btn btn-secondary py-1 text-xs" data-ratio="16:9">16:9</button>
        <button class="crop-ratio-btn btn-secondary py-1 text-xs" data-ratio="4:3">4:3</button>
        <button class="crop-ratio-btn btn-secondary py-1 text-xs" data-ratio="9:16">9:16</button>
        <button class="crop-ratio-btn btn-secondary py-1 text-xs" data-ratio="3:2">3:2</button>
      </div>
    </div>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Crop Preview</span>
      <div class="w-full flex items-center justify-center bg-[#17191a] border border-[#303334] rounded p-2 min-h-[120px]">
        <canvas id="img-crop-preview-canvas" class="max-h-[110px] max-w-full rounded object-contain shadow-sm"></canvas>
      </div>
    </div>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Output Format</span>
      <select id="img-crop-format" class="input-dark text-xs">
        <option value="image/webp" selected>WebP (Efficient)</option>
        <option value="image/png">PNG (Lossless)</option>
        <option value="image/jpeg">JPEG (Photo)</option>
      </select>
    </div>

    <div class="privacy-note">
      Pixel buffer clipping is performed locally. Zero cloud round-trips.
    </div>

    <button id="img-crop-run-btn" class="primary" disabled>
      <span>Crop & Download</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v12m0 0 5-5m-5 5-5-5"/><path d="M4 20h16"/></svg>
    </button>
  </aside>
</div>
`,

  "image-resizer": `<!-- Tool 27: Image Resizer HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <label id="img-res-dropzone" class="dropzone cursor-pointer">
      <input type="file" id="img-res-input" accept="image/*,.jpg,.jpeg,.png,.webp,.svg,.gif,.avif">
      <div class="dropzone-icon-circle">
        <svg class="dropzone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>
      </div>
      <strong>Drop image file here to resize</strong>
      <span>or click to choose from your device</span>
      <div class="dropzone-badges">
        <span class="dropzone-badge">JPG</span>
        <span class="dropzone-badge">PNG</span>
        <span class="dropzone-badge">WebP</span>
        <span class="dropzone-badge">SVG</span>
        <span class="dropzone-badge">AVIF</span>
      </div>
      <small>Scale by dimensions, percentage or preset</small>
    </label>

    <div id="img-res-workspace" class="space-y-6 hidden">
      <div class="file-row">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/></svg>
        <div>
          <strong id="img-res-filename">image.png</strong>
          <span id="img-res-orig-info">0 × 0px • 0 KB</span>
        </div>
        <div class="text-right">
          <span id="img-res-canvas-info" class="badge badge-image">0 × 0</span>
        </div>
        <button id="img-res-reset-btn" title="Remove file">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>

      <!-- Canvas Preview Stage -->
      <div class="preview-stage">
        <canvas id="img-res-canvas" class="max-h-[360px] max-w-full rounded object-contain shadow"></canvas>
      </div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Scaling Controls</span>
      <small>01 / 01</small>
    </div>

    <div class="setting-item">
      <div class="flex justify-between items-center mb-2">
        <span class="text-xs font-mono text-slate-400 uppercase">Exact Dimensions</span>
        <button id="img-res-lock-btn" class="text-[11px] font-mono text-indigo-400 hover:text-indigo-300">
          <span id="img-res-lock-icon">🔒</span> <span id="img-res-lock-text">Locked</span>
        </button>
      </div>
      <div class="grid grid-cols-2 gap-2 mt-2">
        <div>
          <span class="text-[10px] font-mono text-slate-500 uppercase block mb-1">Width (px)</span>
          <input type="number" id="img-res-width" min="1" class="input-dark font-mono text-xs">
        </div>
        <div>
          <span class="text-[10px] font-mono text-slate-500 uppercase block mb-1">Height (px)</span>
          <input type="number" id="img-res-height" min="1" class="input-dark font-mono text-xs">
        </div>
      </div>
    </div>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Quick Scale</span>
      <div class="grid grid-cols-4 gap-2">
        <button class="btn-secondary py-1 text-xs" data-scale="0.25">25%</button>
        <button class="btn-secondary py-1 text-xs" data-scale="0.5">50%</button>
        <button class="btn-secondary py-1 text-xs" data-scale="0.75">75%</button>
        <button class="btn-secondary py-1 text-xs" data-scale="1.5">150%</button>
      </div>
    </div>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Popular Presets</span>
      <select id="img-res-preset" class="input-dark text-xs">
        <option value="">Select a preset...</option>
        <option value="1080x1080">Instagram Square (1080 × 1080)</option>
        <option value="1080x1920">Instagram Story (1080 × 1920)</option>
        <option value="1920x1080">Full HD (1920 × 1080)</option>
        <option value="1280x720">HD (1280 × 720)</option>
        <option value="1500x500">Twitter Header (1500 × 500)</option>
        <option value="512x512">Avatar (512 × 512)</option>
        <option value="32x32">Favicon (32 × 32)</option>
      </select>
    </div>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Output Format</span>
      <select id="img-res-format" class="input-dark text-xs">
        <option value="image/webp" selected>WebP (Compact)</option>
        <option value="image/png">PNG (Lossless)</option>
        <option value="image/jpeg">JPEG (Photo)</option>
      </select>
    </div>

    <div class="privacy-note">
      Bicubic image re-sampling executed inside GPU canvas memory.
    </div>

    <button id="img-res-download-btn" class="primary" disabled>
      <span>Download Resized Image</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v12m0 0 5-5m-5 5-5-5"/><path d="M4 20h16"/></svg>
    </button>
  </aside>
</div>
`,

  "md-to-html": `<!-- Tool 32: Markdown to HTML Converter HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <div class="flex items-center justify-between mb-3 text-xs font-mono">
      <div class="flex items-center gap-2">
        <button id="md-tab-rendered" class="tab-btn active">Rendered View</button>
        <button id="md-tab-code" class="tab-btn">HTML Code</button>
      </div>
      <span id="md-input-stats" class="text-slate-400">0 words • 0 chars</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-[480px]">
      <div class="flex flex-col bg-[#17191a] border border-[#303334] rounded overflow-hidden">
        <div class="p-2.5 bg-[#1e2022] border-b border-[#303334] text-[11px] font-mono uppercase text-slate-400">
          Markdown Source
        </div>
        <textarea id="md-input" class="w-full flex-1 p-3 bg-transparent text-xs font-mono text-slate-200 border-none outline-none resize-none" placeholder="# Welcome to Markdown&#10;&#10;Write here..."></textarea>
      </div>

      <div class="flex flex-col bg-[#17191a] border border-[#303334] rounded overflow-hidden">
        <div class="p-2.5 bg-[#1e2022] border-b border-[#303334] text-[11px] font-mono uppercase text-slate-400">
          Preview / Generated
        </div>
        <div id="md-preview-view" class="flex-1 p-4 overflow-y-auto prose prose-invert max-w-none text-xs text-slate-300"></div>
        <div id="md-code-view" class="flex-1 overflow-hidden hidden">
          <textarea id="md-raw-code" readonly class="w-full h-full p-3 bg-black/40 text-emerald-400 text-xs font-mono border-none outline-none resize-none"></textarea>
        </div>
      </div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Export Options</span>
      <small>01 / 01</small>
    </div>

    <label class="toggle-row setting-item">
      <span>
        <b>Wrap HTML5 Template</b>
        <small>Includes modern responsive styles & typography</small>
      </span>
      <input type="checkbox" id="md-wrap-doc" checked>
    </label>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Load File</span>
      <button id="md-load-file-btn" class="btn-secondary w-full py-2 text-xs">Upload .md Document</button>
      <input type="file" id="md-file-input" accept=".md,.markdown,.txt" class="hidden">
    </div>

    <div class="setting-item">
      <button id="md-copy-btn" class="btn-secondary w-full py-2 text-xs">Copy Raw HTML</button>
    </div>

    <div class="privacy-note">
      Markdown parsing happens in browser script runtime.
    </div>

    <button id="md-download-btn" class="primary">
      <span>Download HTML Document</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v12m0 0 5-5m-5 5-5-5"/><path d="M4 20h16"/></svg>
    </button>
  </aside>
</div>
`,

  "pdf-compressor": `<!-- Tool 25: PDF Compressor HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <label id="pdf-comp-dropzone" class="dropzone cursor-pointer">
      <input type="file" id="pdf-comp-input" accept=".pdf,application/pdf">
      <div class="dropzone-icon-circle">
        <svg class="dropzone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>
      </div>
      <strong>Drop PDF document here</strong>
      <span>or click to choose from your device</span>
      <div class="dropzone-badges">
        <span class="dropzone-badge">Stream Compaction</span>
        <span class="dropzone-badge">Object Deduplication</span>
        <span class="dropzone-badge">Strip Metadata</span>
      </div>
      <small>Stream & Object optimization</small>
    </label>

    <div id="pdf-comp-workspace" class="space-y-6 hidden">
      <div class="file-row">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/></svg>
        <div>
          <strong id="pdf-comp-name">document.pdf</strong>
          <span id="pdf-comp-orig-size">0 MB</span>
        </div>
        <div class="text-right">
          <span id="pdf-comp-badge" class="badge badge-pdf">Loaded</span>
        </div>
        <button id="pdf-comp-reset-btn" title="Remove file">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>

      <!-- Optimization Metrics Comparison -->
      <div id="pdf-comp-result-box" class="space-y-3 hidden">
        <div class="text-xs font-mono uppercase text-slate-400 tracking-wider">Compression Results</div>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-[#17191a] border border-[#303334] rounded">
            <span class="text-xs font-mono text-slate-500 uppercase block mb-1">Original Size</span>
            <p id="pdf-comp-stat-orig" class="text-base font-bold font-mono text-white">-</p>
          </div>
          <div class="p-4 bg-[#17191a] border border-indigo-500/40 rounded">
            <span class="text-xs font-mono text-indigo-400 uppercase block mb-1">Optimized Size</span>
            <p id="pdf-comp-stat-new" class="text-base font-bold font-mono text-indigo-400">-</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Optimization Settings</span>
      <small>01 / 01</small>
    </div>

    <div class="setting-item">
      <span class="mb-3 text-xs uppercase font-mono text-slate-400">Compression Profile</span>
      <div class="space-y-2">
        <label class="p-3 border border-[#303334] hover:border-indigo-500 bg-[#17191a] rounded cursor-pointer flex items-center gap-3">
          <input type="radio" name="pdf-comp-level" value="balanced" checked class="accent-indigo-600">
          <div>
            <p class="text-xs font-semibold text-white">Balanced (Recommended)</p>
            <p class="text-[11px] text-slate-400">Deduplicate objects & compact streams</p>
          </div>
        </label>
        <label class="p-3 border border-[#303334] hover:border-indigo-500 bg-[#17191a] rounded cursor-pointer flex items-center gap-3">
          <input type="radio" name="pdf-comp-level" value="max" class="accent-indigo-600">
          <div>
            <p class="text-xs font-semibold text-white">Aggressive</p>
            <p class="text-[11px] text-slate-400">Strip annotations & compact dictionaries</p>
          </div>
        </label>
      </div>
    </div>

    <label class="toggle-row setting-item">
      <span>
        <b>Strip document metadata</b>
        <small>Removes author, producer & creation dates</small>
      </span>
      <input type="checkbox" id="pdf-comp-strip-meta" checked>
    </label>

    <div class="privacy-note">
      Internal PDF object trees are sanitized entirely in local browser RAM.
    </div>

    <button id="pdf-comp-run-btn" class="primary" disabled>
      <span id="pdf-comp-btn-label">Compress PDF</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
  </aside>
</div>
`,

  "pdf-extractor": `<!-- Tool 23: PDF Page Extractor HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <label id="pdf-ext-dropzone" class="dropzone cursor-pointer">
      <input type="file" id="pdf-ext-input" accept=".pdf,application/pdf">
      <div class="dropzone-icon-circle">
        <svg class="dropzone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>
      </div>
      <strong>Drop PDF document here</strong>
      <span>or click to choose from your device</span>
      <div class="dropzone-badges">
        <span class="dropzone-badge">Visual Grid</span>
        <span class="dropzone-badge">Page Selector</span>
        <span class="dropzone-badge">Quick Filters</span>
      </div>
      <small>Visually select & extract specific pages</small>
    </label>

    <div id="pdf-ext-content" class="space-y-6 hidden">
      <div class="file-row">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/></svg>
        <div>
          <strong id="pdf-ext-filename">document.pdf</strong>
          <span id="pdf-ext-filesize">0 MB • 0 pages</span>
        </div>
        <div class="text-right">
          <span id="pdf-ext-badge" class="badge badge-pdf">0 selected</span>
        </div>
        <button id="pdf-ext-reset-btn" title="Remove file">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>

      <!-- Quick Select Bar -->
      <div class="flex items-center justify-between p-3 bg-[#17191a] border border-[#303334] rounded flex-wrap gap-2 text-xs">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="font-mono text-slate-500 uppercase text-[10px] mr-1">Select:</span>
          <button id="pdf-ext-sel-all" class="btn-secondary py-0.5 px-2 text-[11px]">All</button>
          <button id="pdf-ext-sel-none" class="btn-secondary py-0.5 px-2 text-[11px]">None</button>
          <button id="pdf-ext-sel-odd" class="btn-secondary py-0.5 px-2 text-[11px]">Odd</button>
          <button id="pdf-ext-sel-even" class="btn-secondary py-0.5 px-2 text-[11px]">Even</button>
        </div>
        <div class="flex items-center gap-2">
          <input type="text" id="pdf-ext-range-text" class="input-dark py-1 px-2 text-xs w-28 font-mono" placeholder="1, 3, 5-8">
          <button id="pdf-ext-apply-range" class="btn-secondary py-1 px-2.5 text-xs">Apply</button>
        </div>
      </div>

      <!-- Page Grid -->
      <div id="pdf-ext-grid" class="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-[340px] overflow-y-auto p-1"></div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Extraction Setup</span>
      <small>01 / 01</small>
    </div>

    <div class="setting-item">
      <span><b>Pages Selected</b><small id="pdf-ext-stat-count" class="text-indigo-400 font-mono">0 of 0</small></span>
      <p class="text-xs text-slate-400 mt-2">Click individual page thumbnails on the left or use the quick selection tools.</p>
    </div>

    <div class="privacy-note">
      Page tree manipulation performed in local sandboxed memory.
    </div>

    <button id="pdf-ext-run-btn" class="primary" disabled>
      <span id="pdf-ext-btn-label">Extract Selected Pages</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
  </aside>
</div>
`,

  "pdf-merger": `<!-- Tool 21: PDF Merger HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <label id="pdf-merger-dropzone" class="dropzone cursor-pointer">
      <input type="file" id="pdf-merger-input" accept=".pdf,application/pdf" multiple>
      <div class="dropzone-icon-circle">
        <svg class="dropzone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>
      </div>
      <strong>Drop multiple PDF files here</strong>
      <span>or click to choose from your device</span>
      <div class="dropzone-badges">
        <span class="dropzone-badge">PDF</span>
        <span class="dropzone-badge">Multi-File</span>
        <span class="dropzone-badge">Reorderable</span>
      </div>
      <small>Combine 2 or more documents into one</small>
    </label>

    <div id="pdf-merger-list-container" class="space-y-4 hidden">
      <div class="flex justify-between items-center text-xs font-mono text-slate-400 uppercase tracking-wider">
        <span>Documents to Merge (<b id="pdf-merger-count" class="text-white">0</b>)</span>
        <span>Drag or click arrows to reorder</span>
      </div>
      <div id="pdf-merger-file-list" class="space-y-2 max-h-[420px] overflow-y-auto"></div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Merge Setup</span>
      <small>01 / 01</small>
    </div>

    <div class="setting-item">
      <span><b>Queue Status</b><small id="pdf-merger-queue-stat" class="font-mono text-indigo-400">0 files</small></span>
      <p class="text-xs text-slate-400 mt-2">Documents will be combined in the exact top-to-bottom sequence shown on the left.</p>
    </div>

    <div class="setting-item">
      <div class="flex justify-between items-center">
        <span class="text-xs font-mono text-slate-400 uppercase">Clear All</span>
        <button id="pdf-merger-clear-btn" class="btn-secondary py-1 px-3 text-xs hidden">Reset Queue</button>
      </div>
    </div>

    <div class="privacy-note">
      Documents are combined in local browser memory. Zero bytes leave your machine.
    </div>

    <button id="pdf-merger-run-btn" class="primary" disabled>
      <span id="pdf-merger-btn-label">Merge All PDFs</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
  </aside>
</div>
`,

  "pdf-rotator": `<!-- Tool 24: PDF Rotator HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <label id="pdf-rot-dropzone" class="dropzone cursor-pointer">
      <input type="file" id="pdf-rot-input" accept=".pdf,application/pdf">
      <div class="dropzone-icon-circle">
        <svg class="dropzone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>
      </div>
      <strong>Drop PDF document here to rotate</strong>
      <span>or click to choose from your device</span>
      <div class="dropzone-badges">
        <span class="dropzone-badge">90° Clockwise</span>
        <span class="dropzone-badge">180° Flip</span>
        <span class="dropzone-badge">Batch Rotate</span>
      </div>
      <small>Rotate individual pages or entire document</small>
    </label>

    <div id="pdf-rot-content" class="space-y-6 hidden">
      <div class="file-row">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/></svg>
        <div>
          <strong id="pdf-rot-filename">document.pdf</strong>
          <span id="pdf-rot-filesize">0 MB • 0 pages</span>
        </div>
        <div class="text-right">
          <span class="badge badge-pdf">Loaded</span>
        </div>
        <button id="pdf-rot-reset-btn" title="Remove file">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>

      <!-- Page Grid -->
      <div class="space-y-3">
        <span class="text-xs font-mono uppercase text-slate-400 tracking-wider">Page Orientations (Click any card to rotate +90°)</span>
        <div id="pdf-rot-grid" class="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-[340px] overflow-y-auto p-1"></div>
      </div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Rotation Controls</span>
      <small>01 / 01</small>
    </div>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Batch Rotate All</span>
      <div class="grid grid-cols-2 gap-2">
        <button id="pdf-rot-all-right" class="btn-secondary py-1.5 text-xs">+90° Clockwise</button>
        <button id="pdf-rot-all-left" class="btn-secondary py-1.5 text-xs">-90° Counter</button>
        <button id="pdf-rot-all-180" class="btn-secondary py-1.5 text-xs">180° Flip</button>
        <button id="pdf-rot-all-reset" class="btn-secondary py-1.5 text-xs">Reset to 0°</button>
      </div>
    </div>

    <div class="privacy-note">
      Page matrix transformation is performed purely on client-side vectors.
    </div>

    <button id="pdf-rot-run-btn" class="primary" disabled>
      <span>Save Rotated PDF</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
  </aside>
</div>
`,

  "pdf-splitter": `<!-- Tool 22: PDF Splitter HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <label id="pdf-split-dropzone" class="dropzone cursor-pointer">
      <input type="file" id="pdf-split-input" accept=".pdf,application/pdf">
      <div class="dropzone-icon-circle">
        <svg class="dropzone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>
      </div>
      <strong>Drop PDF document here</strong>
      <span>or click to choose from your device</span>
      <div class="dropzone-badges">
        <span class="dropzone-badge">Custom Ranges</span>
        <span class="dropzone-badge">Extract All</span>
        <span class="dropzone-badge">ZIP Export</span>
      </div>
      <small>Split by page ranges or extract all pages</small>
    </label>

    <div id="pdf-split-workspace" class="space-y-6 hidden">
      <div class="file-row">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/></svg>
        <div>
          <strong id="pdf-split-filename">document.pdf</strong>
          <span id="pdf-split-filesize">0 MB • 0 pages</span>
        </div>
        <div class="text-right">
          <span class="badge badge-pdf">Loaded</span>
        </div>
        <button id="pdf-split-reset-btn" title="Remove file">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>

      <!-- Page Previews Overview Grid -->
      <div class="space-y-3">
        <div class="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
          <span>Document Overview</span>
          <span><b id="pdf-split-page-count" class="text-white">0</b> total pages</span>
        </div>
        <div id="pdf-split-page-grid" class="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-[340px] overflow-y-auto p-1"></div>
      </div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Split Configuration</span>
      <small id="pdf-split-step-badge">Step 01</small>
    </div>

    <!-- Split Mode Selector -->
    <div class="setting-item">
      <span class="mb-3 text-xs uppercase font-mono text-slate-400">Splitting Strategy</span>
      <div class="space-y-2">
        <label class="p-3 border border-[#303334] hover:border-indigo-500 bg-[#17191a] rounded cursor-pointer flex items-start gap-3 transition-colors">
          <input type="radio" name="pdf-split-mode" value="ranges" checked class="mt-1 accent-indigo-600">
          <div>
            <p class="text-xs font-semibold text-white">Custom Page Ranges</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Separate into groups (e.g. <code class="text-indigo-400 font-mono">1-3, 4-6, 7</code>)</p>
          </div>
        </label>

        <label class="p-3 border border-[#303334] hover:border-indigo-500 bg-[#17191a] rounded cursor-pointer flex items-start gap-3 transition-colors">
          <input type="radio" name="pdf-split-mode" value="all" class="mt-1 accent-indigo-600">
          <div>
            <p class="text-xs font-semibold text-white">Extract Every Page</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Save every page as a single standalone PDF (packaged in ZIP)</p>
          </div>
        </label>
      </div>
    </div>

    <!-- Range Input Field -->
    <div id="pdf-split-range-box" class="setting-item">
      <span><b>Specify Ranges</b><small id="pdf-split-range-hint" class="text-indigo-400 font-mono">Pages 1 - 0</small></span>
      <input type="text" id="pdf-split-range-input" class="input-dark mt-3" placeholder="e.g. 1-2, 3-5, 6">
      <small class="text-slate-500 text-[11px] mt-2 block">Comma-separated ranges or single page numbers.</small>
    </div>

    <div class="privacy-note">
      Document streams are extracted in hardware memory without external network calls.
    </div>

    <button id="pdf-split-run-btn" class="primary" disabled>
      <span id="pdf-split-btn-label">Run PDF Splitter</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
  </aside>
</div>
`,

  "size-calculator": `<!-- Tool 31: File Size Calculator HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <label id="calc-dropzone" class="dropzone cursor-pointer mb-6">
      <input type="file" id="calc-file-input">
      <div class="dropzone-icon-circle">
        <svg class="dropzone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>
      </div>
      <strong>Drop any file here to calculate exact size</strong>
      <span>or click to choose from your device</span>
      <div class="dropzone-badges">
        <span class="dropzone-badge">Decimal</span>
        <span class="dropzone-badge">Binary IEC</span>
        <span class="dropzone-badge">4KB Sectors</span>
        <span class="dropzone-badge">Transfer Times</span>
      </div>
      <small>Inspect binary & decimal storage metrics</small>
    </label>

    <!-- Metric Grid -->
    <div class="space-y-4">
      <span class="text-xs font-mono uppercase text-slate-400 tracking-wider">Storage Representation</span>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="p-3 bg-[#17191a] border border-[#303334] rounded">
          <span class="text-[10px] font-mono uppercase text-slate-500">Bytes</span>
          <p id="calc-res-bytes" class="text-sm font-bold font-mono text-white mt-1 break-all">0 B</p>
        </div>
        <div class="p-3 bg-[#17191a] border border-[#303334] rounded">
          <span class="text-[10px] font-mono uppercase text-slate-500">Total Bits</span>
          <p id="calc-res-bits" class="text-sm font-bold font-mono text-white mt-1 break-all">0 bits</p>
        </div>
        <div class="p-3 bg-[#17191a] border border-[#303334] rounded">
          <span class="text-[10px] font-mono uppercase text-slate-500">KB / KiB</span>
          <p id="calc-res-kb" class="text-sm font-bold font-mono text-white mt-1 break-all">0 KB</p>
        </div>
        <div class="p-3 bg-[#17191a] border border-[#303334] rounded">
          <span class="text-[10px] font-mono uppercase text-slate-500">MB / MiB</span>
          <p id="calc-res-mb" class="text-sm font-bold font-mono text-white mt-1 break-all">0 MB</p>
        </div>
        <div class="p-3 bg-[#17191a] border border-[#303334] rounded">
          <span class="text-[10px] font-mono uppercase text-slate-500">GB / GiB</span>
          <p id="calc-res-gb" class="text-sm font-bold font-mono text-white mt-1 break-all">0 GB</p>
        </div>
        <div class="p-3 bg-[#17191a] border border-[#303334] rounded">
          <span class="text-[10px] font-mono uppercase text-slate-500">TB / TiB</span>
          <p id="calc-res-tb" class="text-sm font-bold font-mono text-white mt-1 break-all">0 TB</p>
        </div>
        <div class="p-3 bg-[#17191a] border border-[#303334] rounded">
          <span class="text-[10px] font-mono uppercase text-slate-500">4KB Sectors</span>
          <p id="calc-res-clusters" class="text-sm font-bold font-mono text-indigo-400 mt-1 break-all">0</p>
        </div>
        <div class="p-3 bg-[#17191a] border border-[#303334] rounded">
          <span class="text-[10px] font-mono uppercase text-slate-500">Disk Footprint</span>
          <p id="calc-res-ondisk" class="text-sm font-bold font-mono text-indigo-400 mt-1 break-all">0 B</p>
        </div>
      </div>
    </div>

    <!-- Transfer Times -->
    <div class="space-y-3 mt-6">
      <span class="text-xs font-mono uppercase text-slate-400 tracking-wider">Estimated Transfer Speeds</span>
      <div class="overflow-x-auto rounded border border-[#303334] bg-[#17191a]">
        <table class="w-full text-left text-xs font-mono">
          <thead class="bg-[#1e2022] text-slate-400 text-[10px] uppercase">
            <tr>
              <th class="p-2.5">Connection Channel</th>
              <th class="p-2.5">Speed</th>
              <th class="p-2.5">Transfer Time</th>
            </tr>
          </thead>
          <tbody id="calc-transfer-tbody" class="divide-y divide-[#2a2d2f]"></tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Manual Input & Media</span>
      <small>01 / 01</small>
    </div>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Input Custom Size</span>
      <div class="flex gap-2">
        <input type="number" id="calc-manual-val" value="50" min="0" step="any" class="input-dark font-mono text-xs flex-1">
        <select id="calc-manual-unit" class="input-dark font-mono text-xs w-28 shrink-0">
          <option value="B">B</option>
          <option value="KB">KB</option>
          <option value="KiB">KiB</option>
          <option value="MB" selected>MB</option>
          <option value="MiB">MiB</option>
          <option value="GB">GB</option>
          <option value="GiB">GiB</option>
          <option value="TB">TB</option>
        </select>
      </div>
      <p id="calc-active-file-label" class="text-[11px] font-mono text-slate-400 mt-2 truncate">Manual size calculation</p>
    </div>

    <div class="setting-item">
      <span><b>Storage Equivalents</b></span>
      <div id="calc-media-fits" class="space-y-1.5 mt-2 text-xs font-mono text-slate-400"></div>
    </div>

    <div class="privacy-note">
      Exact byte calculations evaluated completely in client runtime.
    </div>
  </aside>
</div>
`,

  "text-merger": `<!-- Tool 34: Text File Merger HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <label id="txt-merge-dropzone" class="dropzone cursor-pointer">
      <input type="file" id="txt-merge-input" multiple>
      <div class="dropzone-icon-circle">
        <svg class="dropzone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>
      </div>
      <strong>Drop text or code files here</strong>
      <span>or click to choose from your device</span>
      <div class="dropzone-badges">
        <span class="dropzone-badge">TXT</span>
        <span class="dropzone-badge">CSV</span>
        <span class="dropzone-badge">LOG</span>
        <span class="dropzone-badge">MD</span>
        <span class="dropzone-badge">JSON</span>
        <span class="dropzone-badge">CODE</span>
      </div>
      <small>Combine multiple text documents into one</small>
    </label>

    <div id="txt-merge-content" class="space-y-6 hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- File List -->
        <div class="space-y-3">
          <div class="flex justify-between items-center text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span>Merge Sequence</span>
            <span class="text-slate-500 text-[10px]">Use arrows to reorder</span>
          </div>
          <div id="txt-merge-file-list" class="space-y-2 max-h-[380px] overflow-y-auto"></div>
        </div>

        <!-- Merged Output Preview -->
        <div class="flex flex-col bg-[#17191a] border border-[#303334] rounded overflow-hidden">
          <div class="p-2.5 bg-[#1e2022] border-b border-[#303334] flex justify-between items-center text-[11px] font-mono uppercase text-slate-400">
            <span>Merged Preview</span>
            <span id="txt-merge-stats">0 lines</span>
          </div>
          <textarea id="txt-merge-preview" readonly class="w-full flex-1 p-3 bg-black/40 text-slate-200 text-xs font-mono border-none outline-none resize-none"></textarea>
        </div>
      </div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Delimiter Options</span>
      <small>01 / 01</small>
    </div>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">File Separator</span>
      <select id="txt-merge-separator" class="input-dark text-xs">
        <option value="double-newline" selected>Double Blank Line</option>
        <option value="newline">Single Line Break</option>
        <option value="header-banner">Banner with Filename</option>
        <option value="md-heading">Markdown Heading (## file)</option>
        <option value="dashed">Dashed Line Break</option>
        <option value="custom">Custom Text...</option>
      </select>
    </div>

    <div id="txt-merge-custom-box" class="setting-item hidden">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Custom Separator</span>
      <input type="text" id="txt-merge-custom-text" class="input-dark text-xs font-mono" placeholder="=== NEXT FILE ===">
    </div>

    <div class="setting-item">
      <div class="flex justify-between items-center">
        <span class="text-xs font-mono text-slate-400 uppercase">Clear All</span>
        <button id="txt-merge-clear-btn" class="btn-secondary py-1 px-3 text-xs hidden">Reset</button>
      </div>
    </div>

    <div class="setting-item">
      <button id="txt-merge-copy-btn" class="btn-secondary w-full py-2 text-xs" disabled>Copy Merged Text</button>
    </div>

    <div class="privacy-note">
      Text concats executed inside local browser buffers. Zero bytes sent to server.
    </div>

    <button id="txt-merge-download-btn" class="primary" disabled>
      <span>Download Merged File</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v12m0 0 5-5m-5 5-5-5"/><path d="M4 20h16"/></svg>
    </button>
  </aside>
</div>
`,

  "webp-converter": `<!-- Tool 30: WebP Converter HTML Template -->
<div class="workspace-grid">
  <!-- Left: Interactive Work Panel -->
  <section class="work-panel">
    <label id="webp-dropzone" class="dropzone cursor-pointer">
      <input type="file" id="webp-input" accept="image/*,.jpg,.jpeg,.png,.webp,.svg,.gif,.avif,.bmp" multiple>
      <div class="dropzone-icon-circle">
        <svg class="dropzone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>
      </div>
      <strong>Drop images here for WebP conversion</strong>
      <span>or click to choose from your device</span>
      <div class="dropzone-badges">
        <span class="dropzone-badge">JPG / JPEG</span>
        <span class="dropzone-badge">PNG</span>
        <span class="dropzone-badge">WebP</span>
        <span class="dropzone-badge">SVG</span>
        <span class="dropzone-badge">GIF</span>
        <span class="dropzone-badge">AVIF</span>
      </div>
      <small>Bidirectional WebP encoding & decoding</small>
    </label>

    <div id="webp-results-box" class="space-y-4 hidden">
      <div class="flex justify-between items-center text-xs font-mono text-slate-400 uppercase tracking-wider">
        <span>Files Queue (<b id="webp-file-count" class="text-white">0</b>)</span>
        <span>Batch processing</span>
      </div>
      <div id="webp-results-list" class="space-y-2 max-h-[400px] overflow-y-auto"></div>
    </div>
  </section>

  <!-- Right: Settings & Action Panel -->
  <aside class="settings">
    <div class="settings-head">
      <span>Encoder Profile</span>
      <small>01 / 01</small>
    </div>

    <div class="setting-item">
      <span class="mb-2 text-xs font-mono text-slate-400 uppercase">Conversion Mode</span>
      <select id="webp-direction" class="input-dark text-xs">
        <optgroup label="Encode to WebP">
          <option value="to-webp" selected>Any Image → Modern WebP</option>
          <option value="png-to-webp">PNG → WebP</option>
          <option value="jpg-to-webp">JPG / JPEG → WebP</option>
          <option value="svg-to-webp">SVG → WebP (Crisp Vector Raster)</option>
          <option value="gif-to-webp">GIF → WebP (Optimized)</option>
          <option value="avif-to-webp">AVIF → WebP</option>
        </optgroup>
        <optgroup label="Decode from WebP">
          <option value="from-webp-png">WebP → PNG (Lossless)</option>
          <option value="from-webp-jpg">WebP → JPG / JPEG (Photo)</option>
          <option value="from-webp-svg">WebP → SVG (Vector Container)</option>
          <option value="from-webp-gif">WebP → GIF (Graphic)</option>
          <option value="from-webp-avif">WebP → AVIF (Next-Gen)</option>
        </optgroup>
      </select>
    </div>

    <label id="webp-quality-box" class="setting-item">
      <span>Quality Level <b id="webp-quality-val" class="font-mono text-indigo-400">85%</b></span>
      <input type="range" id="webp-quality" min="10" max="100" value="85">
    </label>

    <label class="toggle-row setting-item">
      <span>
        <b>Lossless WebP</b>
        <small>Pixel-exact compression for logos & graphics</small>
      </span>
      <input type="checkbox" id="webp-lossless">
    </label>

    <div class="setting-item">
      <div class="flex justify-between items-center">
        <span class="text-xs font-mono text-slate-400 uppercase">Clear Queue</span>
        <button id="webp-clear-btn" class="btn-secondary py-1 px-3 text-xs hidden">Reset</button>
      </div>
    </div>

    <div class="privacy-note">
      WebP VP8/VP8L bitstream encoding handled client-side. Zero bytes leave your machine.
    </div>

    <div class="space-y-2 mt-auto">
      <button id="webp-run-btn" class="primary w-full" disabled>
        <span>Run WebP Converter</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
      <button id="webp-zip-btn" class="btn-secondary w-full py-2.5 text-xs hidden">
        Download WebP Archive (.zip)
      </button>
    </div>
  </aside>
</div>
`
};
