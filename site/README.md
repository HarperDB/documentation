# Harper Documentation Site

This directory contains the Docusaurus configuration and build files for the Harper documentation site.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
# Opens at http://localhost:3000

# Build for production
npm run build

# Serve production build locally
npm run serve
```

## 📁 Directory Structure

```
site/
├── build/              # Production build output
├── src/                # React components and custom pages
│   ├── css/           # Custom styles
│   └── pages/         # Custom pages
├── static/            # Static assets
│   ├── img/          # Images and logos
│   └── js/           # JavaScript files
├── versioned_docs/    # Documentation for previous versions
├── versioned_sidebars/ # Sidebar configurations for versions
├── docusaurus.config.ts # Main Docusaurus configuration
├── sidebars.ts        # Sidebar navigation structure
├── redirects.ts       # URL redirects configuration
└── versions.json      # Version configuration
```

## 🛠️ Development

### Running Locally

```bash
# Start the development server with hot reload
npm start

# Clear cache if you encounter issues
npm run clear
```

The development server runs at `http://localhost:3000` and automatically reloads when you make changes.

### Building

```bash
# Create production build
npm run build

# Test production build locally
npm run serve
```

The production build is optimized and outputs to the `build/` directory.

## 📋 Cutting a New Version

When releasing a new version of Harper documentation:

```bash
# Cut a new version (e.g., 4.7)
npm run version

# This will:
# 1. Copy current docs to versioned_docs/version-4.7
# 2. Copy current sidebars to versioned_sidebars
# 3. Update versions.json
```

After cutting a version:
1. The current `/docs` becomes the new "next" version
2. The previous latest version is archived
3. Update `docusaurus.config.ts` to set the new `lastVersion`

## 🔧 Configuration

- **`docusaurus.config.ts`** - Main site configuration (metadata, plugins, themes)
- **`sidebars.ts`** - Documentation navigation structure
- **`redirects.ts`** - URL redirect rules
- **`versions.json`** - Available documentation versions

## 🔍 Search

The site includes local search that indexes all documentation content at build time, providing fast client-side search without external dependencies.

## 📝 Other Commands

```bash
# Type checking
npm run typecheck

# Clean all generated files and caches
npm run clear
```

## 🚢 Deployment

The site builds to static HTML/CSS/JS files that can be deployed to any static hosting service. The production build is in the `build/` directory after running `npm run build`.