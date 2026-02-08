# Markpad

A powerful Markdown notebook application built with Vue 3 and Electron.

## Features

- ✅ **Markdown Editing**: Real-time preview, syntax highlighting
- ✅ **File Management**: Multi-document tabs, auto-save, recent files
- ✅ **Insert Functions**: Support for images, audio/video, files (Base64 images auto-collapse)
- ✅ **Export Functions**: Export to PDF, HTML, Markdown, plain text
- ✅ **Search & Replace**: Full-text search and replace
- ✅ **Theme Switching**: Light/dark themes, follow system
- ✅ **Internationalization (i18n)**: Support for 10 languages (EN, ZH-CN, ZH-TW, JA, KO, ES, FR, DE, RU, PT-BR)
- ✅ **Settings Center**: Complete settings page with editor, appearance, file, and language configuration
- ✅ **Cross-Platform**: Windows, macOS, Linux support
- ✅ **CI/CD**: Automated builds and releases via GitHub Actions

## Technology Stack

- **Frontend**: Vue 3 + Pinia + Vue Router
- **UI Framework**: Element Plus
- **Editor**: Toast UI Editor
- **Desktop Framework**: Electron
- **Build Tool**: Vite

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run electron:dev

# Build app (directory only, for testing)
npm run electron:build:dir

# Full build (with installer)
npm run electron:build
```

## Release Version

```bash
# 1. Update version number
npm version patch  # or minor, major

# 2. Create and push tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 3. GitHub Actions automatically builds and releases
```

### Cloudflare Pages Deployment

This project uses Cloudflare Pages to host release files and provide auto-update service with global CDN acceleration.

**Setup Instructions:** [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md)

Features:
- 🌍 Global CDN acceleration for faster downloads
- 🚀 Automatic deployment after each release
- 📦 Independent update service (no reliance on GitHub Releases)
- 🔒 HTTPS with automatic SSL certificates

See detailed release guide: [docs/RELEASE.md](docs/RELEASE.md)

## Project Structure

```
markpad/
├── .github/          # GitHub configuration
│   ├── workflows/    # CI/CD workflows
│   └── ISSUE_TEMPLATE/ # Issue templates
├── build/            # Build resources
│   └── icon.*        # Application icon
├── electron/         # Electron main process
│   ├── main.js       # Main process entry
│   └── preload.js    # Preload script
├── src/              # Vue application
│   ├── components/   # Components
│   ├── views/        # Views
│   ├── store/        # State management (Pinia)
│   ├── router/       # Router
│   ├── i18n/         # Internationalization
│   │   ├── index.js  # i18n configuration
│   │   └── locales/  # Language packs (10 languages)
│   ├── utils/        # Utility functions
│   ├── styles/       # Global styles
│   ├── App.vue       # Root component
│   └── main.js       # Entry file
├── docs/             # Documentation
├── public/           # Public resources
├── package.json
└── vite.config.js
```

## Documentation

- [User Guide](USER_GUIDE.md)
- [Development Guide](DEVELOPMENT.md)
- [Release Guide](docs/RELEASE.md)
- [Internationalization (i18n)](docs/I18N.md)
- [Quick Start](QUICK_START.md)

## License

MIT License
