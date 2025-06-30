# Harper Documentation Platform Migration Plan

## Overview

Migrate Harper documentation from GitBook to Docusaurus using a split-repository architecture that aligns documentation versioning with Harper's branch strategy while maintaining clean separation of concerns.

## Architecture

### Two-Repository Strategy
1. **harperdb** - Contains documentation source files in `/docs/`
2. **harper-docs** - Contains Docusaurus site configuration and deployment

### Key Benefits
- Local preview ability for documentation changes
- Documentation reviewed with code changes in PRs
- Clean separation between documentation and doc site transformation/rendering
- Easy platform migration in future

## Version Management

### Branch-Based Documentation
- `main` branch → Current/Next documentation
- `release_4.5` branch → 4.5.x documentation
- `release_4.6` branch → 4.6.x documentation
- Documentation automatically versions with code

### Build Strategy
- Fetch documentation at build time from git branches
- No duplicate content stored in repositories
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
2. Configure automated branch fetching
3. Set up GitHub Actions for CI/CD
4. Implement version switching UI

### Phase 2: Content Migration
1. Create `/docs/` directory structure in harperdb
2. Develop sync script that:
   - Fetches content from documentation repo by version
   - Transforms GitBook syntax to Docusaurus format
   - Updates internal links and image paths
   - Stages changes for review
3. Run sync script for each version:
   - `./sync-docs.sh` (sync current/main)
   - `./sync-docs.sh 4.5` (sync specific version)
   - `./sync-docs.sh --all` (sync all versions)

### Phase 3: Production Deployment
1. Deploy to temporary hostname (e.g., `docs-new.harperdb.io`)
2. Configure URL redirects (301s)
3. Verify all functionality on temporary hostname
4. Switch DNS from GitBook to new site
5. Monitor analytics and fix issues

## Technical Implementation

### Content Sync Script
During migration, use sync script to keep documentation in sync:
```bash
# Sync current documentation
./scripts/sync-docs.sh

# Sync specific version
./scripts/sync-docs.sh 4.5

# Sync all versions
./scripts/sync-docs.sh --all
```

The script handles:
- Fetching from appropriate branch in documentation repo
- Converting GitBook syntax (hints, embeds, etc.)
- Updating internal links for new structure
- Fixing image paths
- Staging all changes for review

### Local Development Workflow
```bash
# From harperdb directory
npm run docs:dev  # Starts local documentation preview
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
2. Run `npm run docs:dev`
3. Open http://localhost:3000

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

2. **SEO Impact**: URL verification and redirect strategy
3. **Team Adoption**: Quick training and documentation
4. **Technical Issues**: Test on temporary hostname before DNS switch
5. **Zero Downtime**: Keep GitBook running until new site is verified
