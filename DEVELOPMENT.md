# Markpad Development Guide

## Quick Start

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
# Windows
dev.bat

# Linux/Mac
./dev.sh

# Or run directly
npm run electron:dev
```

### Build Application

```bash
npm run electron:build
```

## Project Architecture

### Technology Stack

- **Frontend**: Vue 3 + Vite
- **State Management**: Pinia
- **UI Framework**: Element Plus
- **Editor**: Toast UI Editor
- **Desktop Framework**: Electron
- **Markdown Parser**: Marked

### Directory Structure

```
markpad/
├── electron/              # Electron main process
│   ├── main.js           # Main process entry
│   └── preload.js        # Preload script
├── src/                  # Vue application
│   ├── components/       # Components
│   │   ├── HeaderBar.vue     # Top menu bar
│   │   ├── Sidebar.vue       # Sidebar
│   │   ├── DocumentTabs.vue  # Document tabs
│   │   ├── EditorView.vue    # Editor view
│   │   ├── EditorToolbar.vue # Editor toolbar
│   │   └── WelcomePage.vue   # Welcome page
│   ├── views/            # Views
│   │   └── MainLayout.vue    # Main layout
│   ├── store/            # State management
│   │   ├── documents.js      # Document state
│   │   └── settings.js       # Settings state
│   ├── router/           # Router
│   │   └── index.js
│   ├── utils/            # Utility functions
│   │   ├── electron.js       # Electron API wrapper
│   │   └── markdown.js       # Markdown utilities
│   ├── styles/           # Styles
│   │   ├── main.scss         # Main styles
│   │   └── variables.scss    # Variables
│   ├── App.vue           # Root component
│   └── main.js           # Entry file
├── public/               # Static resources
├── .vscode/              # VS Code configuration
├── package.json
├── vite.config.js
└── README.md
```

## Core Features

### 1. Document Management

- **New Document**: `Ctrl+N`
- **Open File**: `Ctrl+O`
- **Save File**: `Ctrl+S`
- **Close Document**: `Ctrl+W`
- **Multi-document Tabs**: Support opening multiple documents simultaneously
- **Auto-save**: Automatically save changes every 60 seconds

### 2. Markdown Editing

- **Real-time Preview**: Edit on the left, preview on the right in real-time
- **Syntax Highlighting**: Code block syntax highlighting
- **Quick Toolbar**: Provides common Markdown syntax shortcuts
- **Supported Syntax**:
  - Headings (H1-H6)
  - Bold, italic, strikethrough
  - Lists (ordered, unordered)
  - Code blocks, inline code
  - Quotes
  - Links, images
  - Tables
  - Horizontal rules

### 3. File Insertion

- **Image Insertion**: Support for local image insertion
- **Video Insertion**: Support for local video files
- **Audio Insertion**: Support for audio files

### 4. Export Functions

- **Markdown Export**: Export as .md file
- **HTML Export**: Export as .html file with styling
- **PDF Export**: Export as PDF document
- **Plain Text Export**: Export as .txt file (remove Markdown formatting)

### 5. Themes

- **Light Theme**: Default white theme
- **Dark Theme**: Dark eye-friendly theme
- **Quick Toggle**: Click the button in the upper right corner to switch

### 6. Settings

- Auto-save interval
- Default export format
- Font size
- Line height
- Preview show/hide

## Development Guide

### Adding New Components

1. Create component file in `src/components/`
2. Use Vue 3 Composition API
3. Use `<script setup>` syntax
4. Add necessary styles (using scoped)

### Using Store

```javascript
import { useDocumentsStore } from '@/store/documents'
import { useSettingsStore } from '@/store/settings'

const documentsStore = useDocumentsStore()
const settingsStore = useSettingsStore()

// Access state
const docs = documentsStore.documents
const theme = settingsStore.theme

// Call methods
documentsStore.createDocument()
settingsStore.toggleTheme()
```

### Using Electron API

```javascript
import { fileAPI, assetAPI, exportAPI } from '@/utils/electron'

// File operations
const result = await fileAPI.open()
await fileAPI.save(filePath, content)

// Asset import
const image = await assetAPI.importImage()

// Export
await exportAPI.toPdf('document.pdf')
```

### IPC Communication

**Renderer Process** → **Main Process**:

```javascript
// APIs defined in preload.js
window.electronAPI.fileOpen()
window.electronAPI.fileSave({ filePath, content })
```

**Main Process Handling**:

```javascript
// electron/main.js
ipcMain.handle('file:open', async () => {
  // Processing logic
})
```

## Debugging

### Developer Tools

Chromium DevTools will open automatically in development mode.

### Vue DevTools

Install Vue DevTools browser extension to use it in Electron.

### Main Process Debugging

```bash
# Add --inspect parameter when starting
electron --inspect=5858 .
```

Then visit `chrome://inspect` in Chrome for debugging.

## Packaging

### Windows

```bash
npm run electron:build
```

The generated installer is in the `dist-electron/` directory.

### macOS

Must be built on macOS system:

```bash
npm run electron:build
```

### Linux

```bash
npm run electron:build
```

## Common Issues

### Q: Cannot open file?

A: Ensure Electron main process is running normally, check file permissions.

### Q: Editor styling abnormal?

A: Clear cache and reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Q: Build failed?

A: Check Node.js version (recommended 16.x or higher), check if dependencies are fully installed.

## Contributing

Welcome to submit Issues and Pull Requests!

## License

MIT License
