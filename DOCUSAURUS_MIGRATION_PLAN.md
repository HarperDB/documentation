# Harper Documentation Platform Migration Plan

## Overview

Migrate Harper documentation from GitBook to Docusaurus using a split-repository architecture that aligns documentation versioning with Harper's branch strategy while maintaining clean separation of concerns.

## Architecture

### Two-Repository Strategy with Bidirectional Sync
1. **harperdb** - Primary source for documentation in `/docs/` on main and release branches
2. **documentation** - Docusaurus site with full documentation copies on corresponding branches

### Bidirectional Workflow
- **Harper Contributors**: Write docs in harperdb, preview locally, changes sync to documentation repo on merge
- **Public Contributors**: Fork documentation repo, preview changes, submit PRs that sync back to harperdb
- **Build Flexibility**: Can build and preview from either repository

### Key Benefits
- Local preview ability from both repositories
- Harper developers can document alongside code changes
- Public contributors have familiar documentation-only workflow
- Documentation reviewed with code changes in PRs
- Clean separation between documentation and doc site transformation/rendering
- Easy platform migration in future

## Version Management

### Branch-Based Documentation
- `main` branch → Current/Next documentation (in both repos)
- `release_4.5` branch → 4.5.x documentation (in both repos)
- `release_4.6` branch → 4.6.x documentation (in both repos)
- Branches stay in sync between repositories

### Synchronization Strategy
- **On merge to harperdb main/release branches**: Sync to documentation repo
- **On PR to documentation repo**: Option to sync back to harperdb
- **Conflict resolution**: harperdb is source of truth
- **Automated sync**: GitHub Actions handle bidirectional updates

### Build Strategy
- Build directly from current repository (no fetching)
- Both repos contain full documentation content
- Selective rebuilds when branches change
- Cached builds for unchanged versions

## URL Structure

### Maintain Current URL Pattern
- Current version: `https://docs.harperdb.io/docs/`
- Versioned docs: `https://docs.harperdb.io/docs/4.5/`, `https://docs.harperdb.io/docs/4.6/`
- All existing URLs must continue to work
- Configure Docusaurus to match GitBook's URL structure

### URL Examples
```
https://docs.harperdb.io/docs/                    → Current version
https://docs.harperdb.io/docs/4.5/                → Version 4.5
https://docs.harperdb.io/docs/4.5/getting-started → Specific page in 4.5
https://docs.harperdb.io/docs/getting-started     → Same page in current
```

## Implementation Phases

### Phase 1: Infrastructure Setup
1. Create `harper-docs` repository with Docusaurus
1. Configure automated branch fetching
1. Set up GitHub Actions for CI/CD
1. Implement version switching UI

### Phase 2: Content Migration & Sync Setup
1. Initial sync from documentation repo (upstream) to harperdb:
   - Copy docs from documentation repo branches to harperdb `/docs/`
   - Set up one-way sync: documentation → harperdb
   - Handle any necessary format conversions
1. Transition period workflow:
   - Documentation repo remains source of truth
   - Changes flow from documentation to harperdb
   - Both repos can build and preview
1. After Docusaurus launch:
   - Switch harperdb to be upstream
   - Enable bidirectional sync
   - Documentation repo accepts public contributions

### Phase 3: Production Deployment
1. Deploy to temporary hostname (e.g., `docs-new.harperdb.io`)
1. Configure URL redirects (301s)
1. Verify all functionality on temporary hostname
1. Switch DNS from GitBook to new site
1. Monitor analytics and fix issues

## Technical Implementation

### Content Sync Workflow

**During Transition (documentation → harperdb)**
```bash
# In harperdb repo, sync from documentation repo
./scripts/sync-from-upstream.sh main
./scripts/sync-from-upstream.sh release_4.5
./scripts/sync-from-upstream.sh --all
```

**After Launch (bidirectional sync)**
```bash
# In either repo, sync changes
./scripts/sync-docs.sh

# Handle PR from documentation repo
./scripts/sync-pr.sh PR_NUMBER
```

The sync process handles:
- Branch mapping between repositories
- Format conversions if needed
- Conflict detection and resolution
- Automated PR creation for review

### Local Development Workflow

**From harperdb repository:**
```bash
cd /path/to/harperdb
npm run docs:dev  # Preview docs from harperdb/docs/
```

**From documentation repository:**
```bash
cd /path/to/documentation
npm run start     # Preview docs from current branch
npm run build     # Build static site
```

### PR Preview Strategy

**Initial Approach (No Additional Infrastructure)**
When a PR modifies files in `/docs/`:
- GitHub Action adds a comment with local preview instructions
- Reviewers can run the docs locally to see changes

Example PR comment:
```
📚 Documentation changes detected in this PR

To preview these changes locally:
1. Check out this branch
1. Run `npm run docs:dev`
1. Open http://localhost:3000

Files changed in /docs/:
- docs/getting-started/installation.md
- docs/api/rest.md
```

**Future Enhancement**
- Treat PR branches as temporary versions
- Deploy to preview URLs (e.g., `some-other-harper-domain.dev/pr/123` behind authz - different hostname to force completely separate cookies to reduce risk of a pr causing trouble)
- Automatic cleanup when PR closes

### Automated Deployment
- Push to `harperdb/docs/` triggers rebuild
- Only affected versions are rebuilt
- Zero-touch release process
- Instant documentation updates

## Migration Checklist

### Pre-Migration
- [ ] Audit current documentation structure
- [ ] Map GitBook features to Docusaurus equivalents
- [ ] Create redirect mapping for SEO preservation
- [ ] Set up harper-docs repository

### Migration
- [ ] Create sync script for content migration
- [ ] Configure Docusaurus with version plugins
- [ ] Test sync script on one version first
- [ ] Create custom components (API endpoints, etc.)
- [ ] Set up search functionality
- [ ] Run sync script for all versions
- [ ] Review and commit migrated content

### Post-Migration
- [ ] Deploy to temporary hostname for verification
- [ ] Test all version switching and search functionality
- [ ] Verify all URLs from docs.harperdb.io exist on docs-new.harperdb.io
- [ ] Verify all redirects work correctly
- [ ] Run link checker to ensure no broken links
- [ ] Switch DNS from GitBook to new Docusaurus site
- [ ] Set up monitoring and analytics
- [ ] Update team workflows documentation
- [ ] Deprecate GitBook instance

## Key Goals

- **Fast local preview** for developers
- **Automated deployments** on every push
- **No broken links** after migration
- **Maintain SEO rankings** with proper redirects

## Risk Mitigation

1. **SEO Impact**: URL verification and redirect strategy
1. **Team Adoption**: Quick training and documentation
1. **Technical Issues**: Test on temporary hostname before DNS switch
1. **Zero Downtime**: Keep GitBook running until new site is verified

## Stretch Goals / Nice-to-Haves

### Single-Page Documentation Views
Generate combined documentation pages based on configuration:

```json
// single-page-config.json
{
  "singlePages": [
    {
      "path": "/api",
      "output": "/api/all",
      "title": "All API Documentation"
    },
    {
      "path": "/",
      "output": "/all-docs",
      "title": "Complete Documentation"
    },
    {
      "path": "/developers/applications",
      "output": "/developers/applications/all",
      "title": "All Application Documentation"
    }
  ]
}
```

**Benefits**:
- Easy "Save as PDF" for offline documentation
- Better searchability with browser find (Ctrl+F)
- Useful for auditing/reviewing all content
- Generated as part of regular build process

**Usage**:
- Link to single-page versions from relevant sections
- Add "View as single page" button in navigation
- Include in version dropdown or footer

### Search Implementation

**Phase 1: Local Search (Launch)**
- Use `@easyops-cn/docusaurus-search-local` plugin
- Zero cost, no external dependencies
- Features:
  - Client-side search indexed at build time
  - Search highlighting and previews
  - Works offline
  - Good enough for most use cases

**Phase 2: Enhanced Search (Future)**
- Evaluate need for Algolia (requires self-hosted crawler)
- Consider AI-powered assistant for natural language queries
- Example: "How do I secure my Harper instance?" → contextual answer
- Could use OpenAI/Anthropic API with documentation embeddings

### Additional Nice-to-Haves
- **Copy Button**: For all code blocks
- **OpenAPI Integration**: Generate API docs from OpenAPI spec
- **Versioned Search**: Search only within selected version
- **Search Analytics**: Track what users search for to improve docs

## Next Steps

1. Create detailed technical specifications (separate docs):
   - SEO preservation strategy
   - Detailed migration procedures
   - Information architecture design
1. Set up harper-docs repository
1. Begin Phase 1 implementation
