/**
 * fileTookKit - Main Application Core & Router
 * Private, local-first file utilities running 100% in-browser.
 */

const TOOL_ICONS = {
  pdfMerger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>`,
  pdfSplitter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="8" cy="13" r="1.5"/><circle cx="8" cy="17" r="1.5"/><line x1="9.5" y1="13.5" x2="16" y2="16.5"/></svg>`,
  pdfExtractor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 12 12 15 15"/><line x1="12" y1="12" x2="12" y2="18"/></svg>`,
  pdfRotator: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,
  pdfCompressor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="10 13 12 15 14 13"/><polyline points="10 17 12 15 14 17"/></svg>`,
  imgCompressor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/><path d="M12 5v3m0 0-1.5-1.5M12 8l1.5-1.5"/></svg>`,
  imgResizer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
  imgCropper: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>`,
  imgConverter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  webpConverter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  sizeCalc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="6" y1="8" x2="6" y2="8.01"/><line x1="10" y1="8" x2="10" y2="8.01"/><line x1="14" y1="8" x2="14" y2="8.01"/></svg>`,
  mdToHtml: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  htmlToMd: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  textMerger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><path d="M4 6h16M4 12h16M4 18h12"/></svg>`,
  hashChecker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="tool-svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="2"/></svg>`
};

const TOOLS = [
  {
    id: 'pdf-merger',
    num: 21,
    code: '21',
    category: 'PDF',
    title: 'PDF Merger',
    iconSvg: TOOL_ICONS.pdfMerger,
    badge: 'Multi-File Combine',
    desc: 'Combine and reorder multiple PDF documents into a single organized file with instant download.',
    initFn: 'initPdfMerger',
    tags: ['pdf', 'combine', 'merge', 'join', 'reorder', 'pages']
  },
  {
    id: 'pdf-splitter',
    num: 22,
    code: '22',
    category: 'PDF',
    title: 'PDF Splitter',
    iconSvg: TOOL_ICONS.pdfSplitter,
    badge: 'Custom Ranges & ZIP',
    desc: 'Split PDFs by custom page ranges (e.g. 1-3, 4-6) or separate every single page into a ZIP archive.',
    initFn: 'initPdfSplitter',
    tags: ['pdf', 'split', 'ranges', 'separate', 'divide', 'zip']
  },
  {
    id: 'pdf-extractor',
    num: 23,
    code: '23',
    category: 'PDF',
    title: 'PDF Page Extractor',
    iconSvg: TOOL_ICONS.pdfExtractor,
    badge: 'Visual Page Selector',
    desc: 'Visually select and extract specific pages into a brand new standalone PDF document.',
    initFn: 'initPdfExtractor',
    tags: ['pdf', 'extract', 'pages', 'select', 'pull']
  },
  {
    id: 'pdf-rotator',
    num: 24,
    code: '24',
    category: 'PDF',
    title: 'PDF Rotator',
    iconSvg: TOOL_ICONS.pdfRotator,
    badge: '90° / 180° / 270°',
    desc: 'Rotate all or individual pages clockwise or counter-clockwise with live orientation preview.',
    initFn: 'initPdfRotator',
    tags: ['pdf', 'rotate', 'orientation', 'flip', 'angle']
  },
  {
    id: 'pdf-compressor',
    num: 25,
    code: '25',
    category: 'PDF',
    title: 'PDF Compressor',
    iconSvg: TOOL_ICONS.pdfCompressor,
    badge: 'Object Stream Cleanup',
    desc: 'Optimize internal streams and strip unnecessary metadata to reduce overall PDF file size.',
    initFn: 'initPdfCompressor',
    tags: ['pdf', 'compress', 'optimize', 'shrink', 'size']
  },
  {
    id: 'image-compressor',
    num: 26,
    code: '26',
    category: 'Image',
    title: 'Image Compressor',
    iconSvg: TOOL_ICONS.imgCompressor,
    badge: 'WebP / JPG / PNG',
    desc: 'Compress images with real-time visual quality slider, dimension capping, and before-vs-after savings.',
    initFn: 'initImageCompressor',
    tags: ['image', 'compress', 'shrink', 'jpg', 'png', 'webp', 'quality']
  },
  {
    id: 'image-resizer',
    num: 27,
    code: '27',
    category: 'Image',
    title: 'Image Resizer',
    iconSvg: TOOL_ICONS.imgResizer,
    badge: 'Pixel & Aspect Lock',
    desc: 'Scale images by exact pixels, percentage presets, or standard social media resolutions.',
    initFn: 'initImageResizer',
    tags: ['image', 'resize', 'scale', 'dimensions', 'aspect ratio', 'pixels']
  },
  {
    id: 'image-cropper',
    num: 28,
    code: '28',
    category: 'Image',
    title: 'Image Cropper',
    iconSvg: TOOL_ICONS.imgCropper,
    badge: 'Interactive Aspect Box',
    desc: 'Crop images with an interactive crop box and fixed aspect ratios (1:1, 16:9, 4:3, 9:16).',
    initFn: 'initImageCropper',
    tags: ['image', 'crop', 'aspect', 'square', 'cut', 'box']
  },
  {
    id: 'image-converter',
    num: 29,
    code: '29',
    category: 'Image',
    title: 'Image Format Converter',
    iconSvg: TOOL_ICONS.imgConverter,
    badge: '7 Formats Bidirectional',
    desc: 'Batch conversion between JPG, PNG, WebP, SVG, GIF, AVIF, and BMP with ZIP export.',
    initFn: 'initImageConverter',
    tags: ['image', 'convert', 'format', 'jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'avif', 'bmp']
  },
  {
    id: 'webp-converter',
    num: 30,
    code: '30',
    category: 'Image',
    title: 'WebP Converter',
    iconSvg: TOOL_ICONS.webpConverter,
    badge: 'Lossless & Lossy WebP',
    desc: 'High-efficiency bidirectional WebP encoding and decoding across JPG, PNG, SVG, GIF, and AVIF.',
    initFn: 'initWebpConverter',
    tags: ['image', 'webp', 'convert', 'lossless', 'lossy', 'svg', 'gif', 'avif', 'png', 'jpg']
  },
  {
    id: 'size-calculator',
    num: 31,
    code: '31',
    category: 'Document',
    title: 'File Size Calculator',
    iconSvg: TOOL_ICONS.sizeCalc,
    badge: 'Binary & Speed Benchmarks',
    desc: 'Decimal vs binary breakdowns, 4KB cluster alignment, media capacity, and transfer speeds.',
    initFn: 'initSizeCalculator',
    tags: ['calculator', 'size', 'bytes', 'mb', 'gb', 'kib', 'transfer', 'speed']
  },
  {
    id: 'md-to-html',
    num: 32,
    code: '32',
    category: 'Document',
    title: 'Markdown to HTML Converter',
    iconSvg: TOOL_ICONS.mdToHtml,
    badge: 'Live GFM & HTML5 Export',
    desc: 'Convert GitHub-flavored Markdown to clean styled HTML with live side-by-side preview.',
    initFn: 'initMdToHtml',
    tags: ['markdown', 'html', 'converter', 'gfm', 'editor', 'preview']
  },
  {
    id: 'html-to-md',
    num: 33,
    code: '33',
    category: 'Document',
    title: 'HTML to Markdown Converter',
    iconSvg: TOOL_ICONS.htmlToMd,
    badge: 'Clean ATX Syntax',
    desc: 'Convert HTML code snippets, articles, and formatted text into clean standard Markdown.',
    initFn: 'initHtmlToMd',
    tags: ['html', 'markdown', 'converter', 'clean', 'tags']
  },
  {
    id: 'text-merger',
    num: 34,
    code: '34',
    category: 'Document',
    title: 'Text File Merger',
    iconSvg: TOOL_ICONS.textMerger,
    badge: 'Custom Delimiters',
    desc: 'Merge multiple text, code, CSV, or log files with reorderable sequence and custom headers.',
    initFn: 'initTextMerger',
    tags: ['text', 'merge', 'combine', 'txt', 'csv', 'log', 'concat']
  },
  {
    id: 'hash-checker',
    num: 35,
    code: '35',
    category: 'Document',
    title: 'File Hash Checker',
    iconSvg: TOOL_ICONS.hashChecker,
    badge: '5 Hashes + Verification',
    desc: 'Hardware-accelerated SHA-256, SHA-512, SHA-384, SHA-1, and MD5 digests with match detection.',
    initFn: 'initHashChecker',
    tags: ['hash', 'checksum', 'sha256', 'md5', 'verify', 'crypto', 'integrity']
  }
];

class App {
  constructor() {
    this.currentTool = null;
    this.currentCategory = 'all';
    this.searchTerm = '';
    this.init();
  }

  init() {
    this.renderDirectory();
    this.setupEventListeners();
    // Route from current URL hash on initial load
    this.syncStateFromUrl();
  }

  renderDirectory() {
    const grid = document.getElementById('tool-grid');
    const countBadge = document.getElementById('tool-count-badge');
    if (!grid) return;

    const filtered = TOOLS.filter(t => {
      const matchCat = this.currentCategory === 'all' || 
        t.category.toLowerCase() === this.currentCategory.toLowerCase() ||
        (this.currentCategory === 'document' && (t.category.toLowerCase() === 'document' || t.category.toLowerCase() === 'hash'));
      
      const term = this.searchTerm.toLowerCase();
      const matchSearch = !term ||
        t.title.toLowerCase().includes(term) ||
        t.desc.toLowerCase().includes(term) ||
        t.code.includes(term) ||
        t.category.toLowerCase().includes(term) ||
        t.tags.some(tag => tag.toLowerCase().includes(term));
      
      return matchCat && matchSearch;
    });

    if (countBadge) {
      if (this.searchTerm) {
        countBadge.textContent = `Showing ${filtered.length} of ${TOOLS.length} utilities`;
      } else if (this.currentCategory !== 'all') {
        countBadge.textContent = `${filtered.length} utilities in ${this.currentCategory.toUpperCase()}`;
      } else {
        countBadge.textContent = `Showing all ${TOOLS.length} utilities`;
      }
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="empty-icon"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
          <p class="empty-title">No utility found matching "${ToolkitUtils.escapeHtml(this.searchTerm)}"</p>
          <p class="empty-desc">Try searching by file format (.pdf, .webp, .svg), action (merge, compress), or clear your category filter.</p>
          <button class="btn-clear-search" onclick="window.app.resetFilters()">Clear Filters & Search</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(t => `
      <button class="tool-card group" onclick="window.app.navigateToTool('${t.id}')" aria-label="Open ${t.title}">
        <div class="tool-card-top">
          <span class="tool-code">#${t.code}</span>
          <span class="tool-category">${t.category}</span>
        </div>
        <div class="tool-icon-circle">
          ${t.iconSvg}
        </div>
        <strong class="tool-title">${t.title}</strong>
        <p class="tool-detail">${t.desc}</p>
        <div class="tool-card-bottom">
          <span class="tool-pill">${t.badge}</span>
          <span class="tool-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </button>
    `).join('');
  }

  navigateToTool(toolId) {
    if (window.location.hash !== `#${toolId}`) {
      window.location.hash = `#${toolId}`;
    } else {
      this.syncStateFromUrl();
    }
  }

  navigateToDirectory() {
    if (window.location.hash && window.location.hash !== '#' && window.location.hash !== '#/') {
      window.location.hash = '';
    } else {
      this.syncStateFromUrl();
    }
  }

  syncStateFromUrl() {
    let rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (rawHash.startsWith('tool-') && !TOOLS.some(t => t.id === rawHash)) {
      rawHash = rawHash.replace('tool-', '');
    }

    if (!rawHash) {
      this.renderDirectoryView();
      return;
    }

    const tool = TOOLS.find(t => t.id === rawHash);
    if (!tool) {
      if (typeof ToolkitUtils !== 'undefined' && ToolkitUtils.showToast) {
        ToolkitUtils.showToast(`Utility "${rawHash}" not found. Returning to directory.`, 'warning');
      }
      history.replaceState(null, '', window.location.pathname + window.location.search);
      this.renderDirectoryView();
      return;
    }

    this.renderToolWorkspace(tool);
  }

  async renderToolWorkspace(tool) {
    // Prevent duplicate re-renders if the tool is already mounted
    if (this.currentTool && this.currentTool.id === tool.id) {
      return;
    }

    this.currentTool = tool;

    // View toggling
    const homeView = document.getElementById('home-view');
    const workspaceView = document.getElementById('workspace-view');
    if (homeView) homeView.style.display = 'none';
    if (workspaceView) workspaceView.style.display = 'block';

    // Update active metadata & breadcrumbs
    const codeEl = document.getElementById('active-tool-code');
    const titleEl = document.getElementById('active-tool-title');
    const descEl = document.getElementById('active-tool-desc');
    const crumbCat = document.getElementById('breadcrumb-category');
    const crumbTitle = document.getElementById('breadcrumb-title');

    if (codeEl) codeEl.textContent = `${tool.category} / #${tool.code}`;
    if (titleEl) titleEl.textContent = tool.title;
    if (descEl) descEl.textContent = `${tool.desc} Files are processed locally in your browser memory and never uploaded.`;
    if (crumbCat) crumbCat.textContent = tool.category;
    if (crumbTitle) crumbTitle.textContent = tool.title;

    document.title = `${tool.title} — fileTookKit`;

    // Dynamic mount from decoupled pages/*.html or templates registry
    const mount = document.getElementById('active-tool-mount');
    if (!mount) return;

    let templateHtml = (window.TOOL_TEMPLATES && window.TOOL_TEMPLATES[tool.id]) || '';

    // If running via HTTP server and template wasn't in memory, attempt fetch
    if (!templateHtml && window.location.protocol.startsWith('http')) {
      try {
        const res = await fetch(`pages/${tool.id}.html`);
        if (res.ok) templateHtml = await res.text();
      } catch (e) {
        console.warn('Template fetch fallback', e);
      }
    }

    mount.innerHTML = `<div id="tool-${tool.id}" class="tool-view active">${templateHtml}</div>`;

    // Initialize controller for active tool
    if (tool.initFn && typeof window[tool.initFn] === 'function') {
      try {
        window[tool.initFn]();
      } catch (err) {
        console.error(`Failed to initialize ${tool.id}:`, err);
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderDirectoryView() {
    this.currentTool = null;
    document.title = 'fileTookKit — Files, Refined. Nothing Retained.';

    const homeView = document.getElementById('home-view');
    const workspaceView = document.getElementById('workspace-view');
    if (homeView) homeView.style.display = 'block';
    if (workspaceView) workspaceView.style.display = 'none';

    const mount = document.getElementById('active-tool-mount');
    if (mount) mount.innerHTML = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetFilters() {
    this.searchTerm = '';
    this.currentCategory = 'all';

    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.classList.add('hidden');

    document.querySelectorAll('.filters button').forEach(btn => {
      if (btn.dataset.category === 'all') btn.classList.add('active');
      else btn.classList.remove('active');
    });

    this.renderDirectory();
  }

  setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.trim();
        if (clearBtn) {
          if (this.searchTerm.length > 0) clearBtn.classList.remove('hidden');
          else clearBtn.classList.add('hidden');
        }
        this.renderDirectory();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        this.searchTerm = '';
        clearBtn.classList.add('hidden');
        this.renderDirectory();
      });
    }

    document.querySelectorAll('.filters button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.dataset.category || 'all';
        this.renderDirectory();
      });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Escape key handler: blurs inputs if active, or returns to directory
      if (e.key === 'Escape') {
        const activeEl = document.activeElement;
        const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');
        if (isInputFocused) {
          activeEl.blur();
          return;
        }
        if (this.currentTool) {
          this.navigateToDirectory();
        }
      }

      // Slash key to focus search (only on directory view when not typing)
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const activeEl = document.activeElement;
        const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');
        if (!isInputFocused && !this.currentTool) {
          e.preventDefault();
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        }
      }
    });

    // Listen for browser Back/Forward and direct hash edits
    window.addEventListener('hashchange', () => this.syncStateFromUrl());
    window.addEventListener('popstate', () => this.syncStateFromUrl());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
