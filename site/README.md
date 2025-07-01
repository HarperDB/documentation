# Harper Documentation Site (Docusaurus)

This directory contains the Docusaurus site for Harper documentation.

## ⚠️ Important: GitBook to Docusaurus Migration

**Current State**: The documentation repository contains GitBook-formatted docs. This Docusaurus site requires converted docs to function properly.

## Prerequisites

- Both repositories must be on the `docs-in-hdb` branch
- Repositories must be in sibling directories:
  ```
  parent-directory/
  ├── documentation/  (on docs-in-hdb branch)
  └── harperdb/      (on docs-in-hdb branch)
  ```

## Quick Start

From the documentation repository:
```bash
# Install dependencies
npm run site:install

# Sync and preview docs
npm run site:sync-and-dev
```

From the harperdb repository:
```bash
# Sync docs and preview
npm run docs:sync:sample
npm run docs:dev
```

## How It Works

1. **Source**: GitBook-formatted docs in `documentation/docs/`
1. **Conversion**: Scripts convert GitBook syntax to Docusaurus format
1. **Destination**: Converted docs go to `harperdb/docs/`
1. **Preview**: Docusaurus always reads from `harperdb/docs/`

## Available Scripts

### From documentation repo (`npm run`):
- `site:install` - Install Docusaurus dependencies
- `site:dev` - Preview converted docs from harperdb (shows warning)
- `site:build` - Build production site from harperdb docs
- `site:sync-and-dev` - Sync sample docs and start preview
- `sync:to-harperdb` - Full sync to harperdb
- `sync:to-harperdb:sample` - Sync sample files only

### From harperdb repo (`npm run`):
- `docs:init` - Install dependencies
- `docs:sync` - Sync all docs from documentation repo
- `docs:sync:sample` - Sync sample files for testing
- `docs:dev` - Start preview server
- `docs:build` - Build production site

### Direct Docusaurus commands (from site directory):
- `npm start` - Start dev server (requires DOCS_PATH env var)
- `npm run build` - Build production site
- `npm run serve` - Serve production build
- `npm run clear` - Clear cache

## Architecture

```
documentation/              harperdb/
├── docs/         →→→      ├── docs/
│   (GitBook)     sync     │   (Docusaurus)
│                 and      │
├── site/         convert  └── (preview from here)
│   (Docusaurus)
│
└── images/       →→→      └── docs/images/
```

## Conversion Features

The sync scripts handle:
- GitBook hints → Docusaurus admonitions
- GitBook tabs → Docusaurus tabs
- README.md → index.md
- Link fixing (removes .md extensions)
- Image path updates
- Title extraction from headings
- Category generation for directories

## Future State

Once the migration is complete:
- Documentation repo will contain Docusaurus-formatted docs
- No conversion will be needed
- Can preview directly from documentation repo

## Learn More

- [Docusaurus Documentation](https://docusaurus.io/)
- [Migration Plan](../DOCUSAURUS_MIGRATION_PLAN.md)
- [Migration Status](../DOCUSAURUS_MIGRATION_STATUS.md)
