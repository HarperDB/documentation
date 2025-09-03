# Harper Documentation

Documentation website for [Harper](https://harpersystems.dev), a fullstack, serverful Node.js application platform.

Powered by [Docusaurus](https://docusaurus.io/).

## Contributing

This documentation site is open source!

If you notice something out-of-place or have suggestions for improvement, please feel free to submit an issue and/or a pull request. Make sure to follow the relevant bug report and content/feature request templates.

For more information on contributing, follow the [contribution guide](CONTRIBUTING.md).

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

```text
├── docs/                # Main documentation content
├── static/              # Static assets
│   ├── img/             # Site images and logos (versioned)
│   └── js/              # JavaScript files
├── src/                 # React components and custom pages
│   ├── css/             # Custom styles
│   └── pages/           # Custom pages
├── versioned_docs/      # Documentation for previous versions
├── versioned_sidebars/  # Sidebar configurations for versions
├── docusaurus.config.ts # Main Docusaurus configuration
├── sidebars.ts          # Sidebar navigation structure
├── redirects.ts         # URL redirects configuration
└── versions.json        # Version configuration
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

### Other Commands

```bash
# Type checking
npm run typecheck

# Format code
npm run format

# Clean all generated files and caches
npm run clear
```

## 📋 Cutting a New Version

When releasing a new version of Harper documentation:

```bash
# Cut a new version (e.g., 4.7)
npm run version
```

This will:

1. Copy current docs to versioned_docs/version-4.7
2. Copy current sidebars to versioned_sidebars
3. Update versions.json

After cutting a version, update `docusaurus.config.ts` to set the new `lastVersion`.
