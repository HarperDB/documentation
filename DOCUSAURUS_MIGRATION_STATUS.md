# Docusaurus Migration Status

The Harper documentation migration from GitBook to Docusaurus is currently in **Phase 1: Parallel Deployment**.

## Current Status

See [DOCUSAURUS_MIGRATION_PLAN.md](./DOCUSAURUS_MIGRATION_PLAN.md#migration-status) for the comprehensive migration plan and current progress.

### Quick Status Summary

- ✅ **Completed**: Docusaurus setup, conversion scripts, redirect mapping, local search, Mermaid support
- 🚧 **In Progress**: CI/CD pipeline, theme/branding, deployment infrastructure
- 📋 **Next Phase**: DNS cutover and source file conversion

## Key Documents

1. **[DOCUSAURUS_MIGRATION_PLAN.md](./DOCUSAURUS_MIGRATION_PLAN.md)** - Main migration plan with phases
2. **[DOCUSAURUS_REDIRECTS.md](./DOCUSAURUS_REDIRECTS.md)** - URL redirect mappings
3. **[DOCUSAURUS_MIGRATION_PHASE3.md](./DOCUSAURUS_MIGRATION_PHASE3.md)** - Future enhancements

## Testing Instructions

From the documentation repository:
```bash
cd site
npm install
npm start  # Local preview with runtime conversion
```
