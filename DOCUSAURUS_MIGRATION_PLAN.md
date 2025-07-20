# Harper Documentation Platform Migration Plan

## Overview

Migrate Harper documentation from GitBook to Docusaurus using a split-repository architecture that aligns documentation versioning with Harper's branch strategy while maintaining clean separation of concerns.

## Architecture

### Current State (Phase 1-2)
- **documentation** repository is the source of truth
- GitBook source files with Docusaurus configuration
- Runtime conversion during build process
- All deployments from documentation repository

### Future State (Phase 3)
- **harperdb** repository will have `/docs/` synchronized
- Documentation sync between repositories
- See [DOCUSAURUS_MIGRATION_PHASE3.md](./DOCUSAURUS_MIGRATION_PHASE3.md) for details

### Key Benefits
- Immediate local preview capability (solving GitBook limitation)
- Phased migration minimizes disruption
- Future: Harper developers can document alongside code
- Clean separation of concerns
- Platform flexibility for future changes

## Version Management

### Branch-Based Documentation

- `main` branch → Next/Unreleased documentation (not published)
- `release_4.5` branch → 4.5.x documentation
- `release_4.6` branch → 4.6.x documentation
- `latest` → Determined by `latest-version.txt` read from main branch

### Version Deployment Strategy

**latest-version.txt** (exists in all branches, but only read from main):

```
release_4.6
```

**S3 Deployment Approach**:

```yaml
# For each branch push
- name: Get Latest Version Config
  run: |
    # Always read from main branch
    git fetch origin main:refs/remotes/origin/main
    LATEST_BRANCH=$(git show origin/main:latest-version.txt)
    echo "LATEST_BRANCH=$LATEST_BRANCH" >> $GITHUB_ENV

- name: Convert GitBook to Docusaurus  # Temporary - remove in Phase 2
  run: node site/scripts/convert-gitbook-to-docusaurus.js docs/
  
- name: Build Docusaurus
  run: cd site && npm run build

- name: Deploy to S3
  run: |
    # Deploy to version-specific path with --delete flag
    aws s3 sync ./build s3://docs-bucket/docs/${VERSION}/ --delete
    
    # If this is the latest version, also sync to latest
    if [ "$CURRENT_BRANCH" = "$LATEST_BRANCH" ]; then
      aws s3 sync ./build s3://docs-bucket/docs/latest/ --delete
    fi
```

### Version Promotion Process

1. Update `latest-version.txt` in main branch via PR
2. Create PR to cherry-pick to the new latest branch:

   ```bash
   # After main PR is merged
   git checkout main
   git pull
   COMMIT_SHA=$(git log -1 --grep="promote.*to latest" --format="%H")
   
   # Create branch from release branch
   git checkout release_4.7
   git checkout -b chore/promote-4.7-latest
   git cherry-pick $COMMIT_SHA
   
   # Push and create PR
   git push -u origin chore/promote-4.7-latest
   gh pr create --title "chore: promote 4.7 to latest" --body "Cherry-pick latest version update from main"
   ```

3. When PR is merged to `release_4.7`, it triggers:
   - Build to `/docs/4.7/`
   - Build to `/docs/latest/` (since it now matches latest-version.txt)


### Build Strategy

**Phase 1 (Runtime Conversion)**:
- Each branch builds independently in documentation repo
- GitBook source → Docusaurus conversion happens at build time
- S3 deployment with `--delete` flag for clean updates
- Main branch never builds/deploys (contains future docs)

**Phase 2 (Post-Conversion)**:
- Direct Docusaurus builds (no conversion needed)
- Each release branch deploys to its version path
- Branch matching `latest-version.txt` also deploys to `/latest/`
- Build caching via GitHub Actions cache for faster builds

**Build Triggers**:
- Push to `release_*` branches → Build and deploy that version
- Push to `main` → No build (future docs, not published)
- PR merges → Trigger build on target branch
- Manual trigger option for emergency fixes

## URL Structure

### Maintain Current URL Pattern with Latest Version Support

- Non-versioned URLs: `https://docs.harperdb.io/docs/` (redirects to `/docs/latest/`)
- Current version: `https://docs.harperdb.io/docs/latest/` (new explicit path)
- Versioned docs: `https://docs.harperdb.io/docs/4.5/`, `https://docs.harperdb.io/docs/4.6/` (unchanged)
- All existing versioned URLs work exactly as before (full parity)
- Only non-versioned URLs get redirects to `/docs/latest/`

### Why This Approach

Currently, non-versioned paths like `/docs/getting-started` point to whatever the "current" version is (e.g., 4.6), but there's no way to create a permalink to that specific version. This causes issues:

- Release notes can't reliably link to their own version's documentation
- External links break when the "current" version changes
- No stable way to reference "always the latest" vs "this specific version"

By adding `/docs/latest/` as an explicit path while redirecting from `/docs/`, we enable:

- Permalinks to any version including the current one
- Release notes can link to `/docs/4.6/feature` for version-specific content
- External sites can choose between `/docs/latest/` (always current) or `/docs/4.6/` (stable)

### URL Examples

```
# Versioned paths (unchanged - full parity with existing)
https://docs.harperdb.io/docs/4.6/                → Version 4.6
https://docs.harperdb.io/docs/4.6/getting-started  → Specific page in 4.6
https://docs.harperdb.io/docs/4.5/                → Version 4.5
https://docs.harperdb.io/docs/4.5/getting-started  → Specific page in 4.5

# New explicit latest path
https://docs.harperdb.io/docs/latest/              → Current version
https://docs.harperdb.io/docs/latest/getting-started → Current version page

# Non-versioned URLs (redirect to latest)
https://docs.harperdb.io/docs/                    → 301 redirect to /docs/latest/
https://docs.harperdb.io/docs/getting-started     → 301 redirect to /docs/latest/getting-started
```

## Release Notes Strategy

**Phase 3 Enhancement**: Release notes will move to unversioned paths for stable cross-version linking.

### Implementation
- Move release notes from `/docs/{version}/technical-details/release-notes/*` to `/docs/release-notes/*`
- Set up redirects from all versioned paths to unversioned paths
- Each branch publishes only its own release notes
- Latest branch manages index pages

### Redirect Examples
- `/docs/4.6/technical-details/release-notes/4.tucker/4.6.2` → `/docs/release-notes/4.tucker/4.6.2`
- `/docs/4.5/technical-details/release-notes/4.tucker/4.5.1` → `/docs/release-notes/4.tucker/4.5.1`
- `/docs/latest/technical-details/release-notes/*` → `/docs/release-notes/*`

**Details**: See [DOCUSAURUS_MIGRATION_PHASE3.md](./DOCUSAURUS_MIGRATION_PHASE3.md) for full implementation plan.

## Implementation Phases

### Phase 1: Parallel Deployment with Runtime Conversion

**Goal**: Deploy Docusaurus site with runtime conversion while GitBook remains live. No code changes needed in documentation source files.

#### 1.1 Infrastructure Setup (No Impact to Current Workflow)

1. **Add Docusaurus to Documentation Repository**
   - Add `/site` directory with Docusaurus configuration
   - Include conversion script in build pipeline
   - Configure for GitBook URL compatibility
   - Set up redirect rules

2. **Theme and Branding**
   - Implement Harper branding (colors, fonts, logo)
   - Custom homepage and navigation
   - Analytics integration (reo.dev)

3. **CI/CD Pipeline Configuration**
   - Modify GitHub Actions to:

     ```yaml
     # Build process
     - name: Convert GitBook to Docusaurus
       run: node site/scripts/convert-gitbook-to-docusaurus.js docs/
     
     - name: Build Docusaurus
       run: cd site && npm run build
     ```

   - Deploy to new infrastructure (e.g., `docs-new.harperdb.io`)
   - Keep GitBook deployment unchanged

4. **Testing and Validation**
   - Deploy all branches (main, release_*) with conversion
   - Run automated link checking
   - Quick manual QA and SEO validation

#### 1.2 Parallel Running Period

1. **Both Sites Live**
   - GitBook at `docs.harperdb.io` (primary)
   - Docusaurus at `docs-new.harperdb.io` (testing)
   - Monitor for issues
   - Gather team feedback

### Phase 2: DNS Cutover and Source Migration

**Goal**: Switch to Docusaurus as primary and convert source files to Docusaurus format.

#### 2.1 DNS Cutover

1. **Pre-Cutover Checklist**
   - All branches building successfully
   - Redirects tested and working
   - Search functioning
   - Team familiar with new platform

2. **Cutover Execution**
   - Update DNS: `docs.harperdb.io` → Docusaurus
   - Keep GitBook at `docs-legacy.harperdb.io` as backup
   - Monitor for errors

#### 2.2 Source File Conversion (Post-Cutover)

1. **Batch Conversion**
   - After DNS cutover is stable (24-48 hours)
   - Run conversion script locally on each branch:

     ```bash
     git checkout main
     node site/scripts/convert-gitbook-to-docusaurus.js docs/
     git commit -am "Convert docs to Docusaurus format"
     git push
     ```

   - Remove conversion step from CI/CD pipeline
   - Repeat for all release branches

2. **Pipeline Simplification**
   - Remove the "Convert GitBook to Docusaurus" step from CI/CD
   - Keep remaining build and deploy steps unchanged
   - Archive GitBook configuration files

### Phase 3: Harper Integration and Future Enhancements

**Goal**: Enable Harper developers to maintain docs alongside code and add advanced features.

**Key Features**:
- Documentation sync between repositories
- Local preview from harperdb repo (`npm run docs:dev`)
- Automated PR creation for doc changes
- Unversioned release notes for stable URLs
- PR preview deployments
- Enhanced search and analytics

**Details**: See [DOCUSAURUS_MIGRATION_PHASE3.md](./DOCUSAURUS_MIGRATION_PHASE3.md) for full implementation plan.

## Technical Implementation

### Current Implementation (Phase 1)

**Conversion Script**: `site/scripts/convert-gitbook-to-docusaurus.js`
- Converts GitBook hints to Docusaurus admonitions
- Fixes GitBook tabs syntax
- Handles broken links and image paths
- Renames README.md to index.md
- Adds frontmatter (metadata header) for Docusaurus:
  ```markdown
  ---
  title: Page Title
  sidebar_position: 1
  ---
  ```

**Note on Mermaid Diagrams**:
- GitBook and Docusaurus both use standard Mermaid syntax
- No conversion needed - diagrams work as-is:
  ````markdown
  ```mermaid
  graph TD
    A[Start] --> B[Process]
    B --> C[End]
  ```
  ````
- Mermaid support configured via `@docusaurus/theme-mermaid`

**Build Process**:
```yaml
# CI/CD Pipeline
- name: Convert GitBook to Docusaurus  # Temporary - remove in Phase 2
  run: node site/scripts/convert-gitbook-to-docusaurus.js docs/
  
- name: Build Docusaurus
  run: cd site && npm run build

- name: Deploy to S3
  run: |
    aws s3 sync ./build s3://docs-bucket/docs/${VERSION}/ --delete
    # Also deploy to /latest/ if this branch matches latest-version.txt
```

**Local Development**:
```bash
# From documentation repository
cd site
npm install
npm run start  # Preview locally with runtime conversion
```

**Note on Dependencies**:
- Docusaurus scaffolding places core packages in `dependencies` (not `devDependencies`)
- This ensures packages are available regardless of NODE_ENV or install flags
- Follows the pattern from official Docusaurus init templates
- All `@docusaurus/*` packages should use the same version

### Hosting Infrastructure

**Phase 1 Options**:
1. **S3 + CloudFront** (recommended)
   - S3 bucket with separate paths per version
   - CloudFront CDN for global distribution
   - Full control over redirects and headers
   - Supports branch-based version deployment

2. **Harper Static Hosting** (dogfooding opportunity)
   - Use Harper's static extension to serve docs
   - Deploy as Harper component
   - Benefits:
     - Dogfooding our own platform
     - Built-in caching and performance
     - Easy to add dynamic features later
   - Example configuration:
     ```yaml
     # docs-component/config.yaml
     extensions:
       static:
         directory: ./build
     ```

**Note**: GitHub Pages was considered but doesn't support our branch-based versioning strategy (only deploys from a single branch).

**Deployment Target**:
- Testing: `docs-new.harperdb.io`
- Production: `docs.harperdb.io` (after DNS cutover)

### Future Implementation

See [DOCUSAURUS_MIGRATION_PHASE3.md](./DOCUSAURUS_MIGRATION_PHASE3.md) for:
- Harper repository integration
- Documentation sync workflows
- PR preview deployments
- Advanced Harper features (search API, analytics)

## Migration Status

### ✅ Completed
- [x] Audit current documentation structure
- [x] Map GitBook features to Docusaurus equivalents
- [x] Create redirect mapping (see DOCUSAURUS_REDIRECTS.md)
- [x] Set up Docusaurus in documentation repository
- [x] Create conversion script (convert-gitbook-to-docusaurus.js)
- [x] Configure Docusaurus with version support
- [x] Fix broken links in source documentation
- [x] Set up local search functionality
- [x] Configure Mermaid diagram support

### 🚧 Phase 1: In Progress
- [ ] Set up CI/CD pipeline with runtime conversion
- [ ] Deploy all branches to docs-new.harperdb.io
- [ ] Test version switching and redirects
- [ ] Validate SEO and performance

### 📋 Phase 2: Planned
- [ ] Switch DNS from GitBook to Docusaurus
- [ ] Convert source files to Docusaurus format
- [ ] Remove runtime conversion from pipeline
- [ ] Archive GitBook configuration

### 🔮 Phase 3: Future
- [ ] Harper repository integration
- [ ] Unversioned release notes
- [ ] PR preview deployments
- [ ] Enhanced features (see DOCUSAURUS_MIGRATION_PHASE3.md)

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

## Next Steps

1. Complete Phase 1 deployment and testing
2. Plan DNS cutover timing
3. Prepare source file conversion scripts
4. Review DOCUSAURUS_MIGRATION_PHASE3.md for future enhancements
