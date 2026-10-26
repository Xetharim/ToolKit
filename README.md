# fileTookKit 🧰
> **15-in-1 Comprehensive Suite for File, Document, PDF & Image Processing**  
> Fast, 100% Client-Side, Zero-Upload Privacy, Works Completely Offline in Your Browser.

---

## 🌟 Overview

**fileTookKit** is an all-in-one suite of 15 essential utilities for processing PDFs, images, text, and documents. All operations run **100% locally** in your web browser using modern Web APIs (`Canvas`, `Web Crypto`, `FileReader`, `pdf-lib`, `JSZip`).

- **🔒 Zero Data Uploads**: No files ever leave your machine. Processing takes place strictly in local browser memory.
- **⚡ Works Completely Offline**: Includes local vendor bundles in `js/vendor/` — no internet connection required.
- **📦 No Dependencies / No Build Steps**: Zero `npm install`, zero compilation. Open and run instantly.
- **🎯 Predictable Navigation**: Full browser history (Back / Forward), hash-based deep linking (`#pdf-merger`), and instant search.

---

## 🚀 How to Run

You can run **fileTookKit** in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, Safari, Opera).

### Method 1: Instant Launch (No Installation / Offline)
Simply **open `index.html`** in your favorite browser:
- Double-click **`index.html`** in your file explorer.
- Or right-click **`index.html`** → **Open with** → your browser.

> All templates are pre-compiled into `pages/templates.js` and all vendor libraries are bundled locally in `js/vendor/`, allowing complete functionality under the `file:///` protocol with zero CORS restrictions and no internet connection required.

---

### Method 2: Local HTTP Server (Optional)
If you prefer running through a local web server:

**Using Python (Windows, macOS, Linux):**
```bash
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

**Using Node.js:**
```bash
npx serve .
# or
npx http-server -p 8080
```

**Using VS Code:**
Right-click `index.html` → **Open with Live Server**.

---

## 📋 Included Tools (15 Utilities)

### 📑 1. PDF Tools
| # | Tool | Description | Capabilities |
|---|---|---|---|
| **21** | **PDF Merger** | Combine multiple PDF documents | Reorder files with arrows, live page counts, instant combined download. |
| **22** | **PDF Splitter** | Split PDFs by custom page ranges or separate all pages | Custom ranges (e.g. `1-3, 4-6`), split every page, automated ZIP archive packaging. |
| **23** | **PDF Page Extractor** | Extract specific pages into a new document | Visual interactive page grid, click to select/deselect, custom range parser. |
| **24** | **PDF Rotator** | Rotate orientation of pages | 90°, 180°, or 270° clockwise/counter-clockwise with real-time visual card preview. |
| **25** | **PDF Compressor** | Reduce PDF file size | Stream object optimization, metadata removal (Title, Author, Producer, Date). |

---

### 🖼️ 2. Image Tools
| # | Tool | Description | Capabilities |
|---|---|---|---|
| **26** | **Image Compressor** | Compress JPEG, PNG, and WebP images | Real-time quality slider (5%–100%), max dimension capping (HD/2K), before-vs-after byte savings. |
| **27** | **Image Resizer** | Scale images by pixels, percent, or presets | Width/height pixel lock, aspect ratio constraint, social presets (Full HD, 2K, Instagram, Avatars). |
| **28** | **Image Cropper** | Interactive visual cropping tool | Draggable crop handles, preset aspect ratios (Freeform, 1:1 Square, 16:9, 4:3, 9:16 Story, 3:2). |
| **29** | **Image Format Converter** | Batch convert between 7 formats | JPG/JPEG, PNG, WebP, SVG, GIF, AVIF, and BMP with customizable quality and ZIP archive download. |
| **30** | **WebP Converter** | Specialized bidirectional WebP encoder/decoder | Encode to WebP (JPG, PNG, SVG, GIF, AVIF → WebP) and decode from WebP (WebP → PNG, JPG, SVG, GIF, AVIF). Lossless & Lossy modes. |

---

### 📝 3. Document, Size & Cryptographic Tools
| # | Tool | Description | Capabilities |
|---|---|---|---|
| **31** | **File Size Calculator** | File size and storage analysis | Decimal (KB, MB, GB, TB) vs binary (KiB, MiB, GiB, TiB), 4KB disk cluster alignment, 8 network transfer speed benchmarks, media storage capacity. |
| **32** | **Markdown to HTML Converter** | Live side-by-side Markdown editor | GitHub-Flavored Markdown (GFM), instant sanitized HTML rendering, word/char counters, self-contained HTML5 document export. |
| **33** | **HTML to Markdown Converter** | Clean standard Markdown conversion | Converts HTML articles, tables, code blocks, lists, and headings into clean ATX Markdown syntax. |
| **34** | **Text File Merger** | Combine multiple text or code files | Drag-and-drop reordering, custom separators (Newlines, Banners, Markdown headings, Dashed lines), instant file preview. |
| **35** | **File Hash Checker** | Hardware-accelerated cryptographic checksums | Computes SHA-256, SHA-512, SHA-384, SHA-1 (Web Crypto API) and MD5 (RFC 1321) simultaneously. Automated match detection with format verification. |

---

## 🏗️ Project Architecture

```
fileTookKit/
├── index.html                   # Single-Page Application root shell & discovery UI
├── README.md                    # Project documentation & usage guide
│
├── css/
│   ├── main.css                 # Site typography, header, discovery bar & directory grid
│   ├── components.css           # Buttons, form controls, badges, and layout helpers
│   └── workspace.css            # Studio 2-column workspace layout, dropzones, and previews
│
├── js/
│   ├── app.js                   # Application router, search/filter engine & tool controller
│   ├── utils.js                 # Shared utilities (Canvas, FileReaders, Toast, GIF/SVG engines)
│   ├── md5.js                   # Client-side pure JS MD5 cryptographic hashing engine
│   │
│   ├── vendor/                  # 100% offline local vendor libraries
│   │   ├── pdf-lib.min.js       # PDF generation, splitting, extraction, and merging (v1.17.1)
│   │   ├── jszip.min.js         # Client-side zip file archive packaging
│   │   ├── marked.min.js        # GitHub-Flavored Markdown parser
│   │   └── turndown.js          # HTML-to-Markdown ATX converter
│   │
│   └── tools/                   # Dedicated controller scripts for all 15 utilities
│       ├── pdf-merger.js
│       ├── pdf-splitter.js
│       ├── pdf-extractor.js
│       ├── pdf-rotator.js
│       ├── pdf-compressor.js
│       ├── image-compressor.js
│       ├── image-resizer.js
│       ├── image-cropper.js
│       ├── image-converter.js
│       ├── webp-converter.js
│       ├── size-calculator.js
│       ├── md-to-html.js
│       ├── html-to-md.js
│       ├── text-merger.js
│       └── hash-checker.js
│
└── pages/                       # Decoupled HTML templates for every utility
    ├── templates.js             # Synchronous precompiled string templates for file:/// mode
    ├── pdf-merger.html
    ├── pdf-splitter.html
    ├── pdf-extractor.html
    ├── pdf-rotator.html
    ├── pdf-compressor.html
    ├── image-compressor.html
    ├── image-resizer.html
    ├── image-cropper.html
    ├── image-converter.html
    ├── webp-converter.html
    ├── size-calculator.html
    ├── md-to-html.html
    ├── html-to-md.html
    ├── text-merger.html
    └── hash-checker.html
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Context | Action |
|---|---|---|
| `/` | Directory View | Focus the utility search bar |
| `Escape` | Inside Input Field | Blur/unfocus the current text field |
| `Escape` | Inside Tool Workspace | Return to the main tools directory |

---

## 🔒 Security & Privacy

1. **No External Network Requests**: All PDF manipulations, image rasterization, and cryptographic hashes execute locally inside your browser thread.
2. **HTML Sanitization**: Live Markdown previews sanitize `<script>`, `<iframe>`, `<object>`, inline `onload`/`onerror` event handlers, and `javascript:` URLs.
3. **No Cookies or Tracking**: Zero tracking pixels, telemetry, third-party analytics, or session trackers.

---

## 📄 License

MIT License. Open-source and free for personal and commercial use.
