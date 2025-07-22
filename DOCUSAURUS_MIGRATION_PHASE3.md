# Phase 3: Harper Integration and Future Enhancements

This document details the planned enhancements after Phase 1 (parallel deployment) and Phase 2 (DNS cutover and source conversion) are complete.

## Overview

Phase 3 focuses on developer experience improvements and advanced features once the core Docusaurus platform is stable.

## 3.1 Documentation Sync Setup

### Goal
Enable Harper developers to maintain documentation alongside their code changes.

### Implementation

1. **Copy Docs to Harper Repository**
   - Add `/docs` directory to harperdb repo
   - Set up sync workflow from documentation repo
   - Configure branch mapping (main → main, release_X → release_X)

2. **Sync Scripts**
   ```bash
   # In harperdb repo, sync from documentation repo
   ./scripts/sync-from-upstream.sh main
   ./scripts/sync-from-upstream.sh release_4.5
   ./scripts/sync-from-upstream.sh --all
   ```

3. **Developer Experience**
   - Add `npm run docs:dev` for local preview
   - Create pre-commit hooks for doc validation
   - Set up automatic PR creation for doc changes

### Workflow

**Initial One-Way Sync**:
- Documentation repo remains source of truth
- Changes sync to harperdb repo on merge
- Developers can preview locally

**Future Bidirectional Sync**:
```bash
# In either repo, sync changes
./scripts/sync-docs.sh

# Handle PR from documentation repo
./scripts/sync-pr.sh PR_NUMBER
```

The sync process will handle:
- Branch mapping between repositories
- Format conversions if needed
- Conflict detection and resolution
- Automated PR creation for review

### PR Workflow

When a harperdb PR includes `/docs` changes:
1. Automated PR created in documentation repo
2. Link between PRs for tracking
3. Preview deployment from harperdb PR
4. Merge to harperdb triggers sync PR

## 3.2 Unversioned Release Notes

### Goal
Move release notes to unversioned paths to enable stable cross-version linking.

### Implementation

**Migration Strategy**:
- Move release notes from `/docs/{version}/technical-details/release-notes/*` to `/docs/release-notes/*`
- Remove release notes from versioned documentation paths
- Set up 301 redirects from all versioned paths to unversioned paths

**Publishing Rules**:
- Each branch publishes only its own release notes to `/docs/release-notes/*`
- The branch marked as "latest" also publishes index pages
- No branch overwrites another branch's release notes

**Redirect Configuration**:
```
# Redirect all versioned release notes to unversioned
/docs/*/technical-details/release-notes/* → /docs/release-notes/*
```

**Benefits**:
- Stable URLs that never change (e.g., `/docs/release-notes/4.tucker/4.6.2`)
- Natural versioning - release notes live with their code
- Can update old release notes retrospectively
- Simpler URL structure without version prefixes

### Nice to Have: Automated Release Note Creation

**Goal**: Generate release notes automatically from PR descriptions and commit messages.

**Potential Implementation**:
- GitHub Action triggered on release tag
- Collect PRs merged since last release
- Extract release note entries from PR descriptions (using a template)
- Generate markdown file in correct format
- Create PR with draft release notes for review

**Benefits**:
- Consistent release note format
- Reduced manual effort
- Nothing gets forgotten
- Can still be edited before publishing

## 3.3 PR Preview Deployments

### Goal
Enable automatic preview deployments for documentation changes in PRs.

### Implementation

1. **Infrastructure Setup**
   - Deploy to preview URLs (e.g., `preview.harper-docs.dev/pr/123`)
   - Use authentication to prevent public access
   - Different hostname to force separate cookies (security)

2. **GitHub Actions Integration**
   ```yaml
   on:
     pull_request:
       paths:
         - 'docs/**'
   
   jobs:
     preview:
       steps:
         - name: Build PR Preview
           run: npm run build
         - name: Deploy to Preview
           run: deploy-to-preview ${{ github.event.pull_request.number }}
   ```

3. **Automatic Cleanup**
   - Remove preview when PR is closed
   - Set TTL on preview deployments

## 3.4 Single-Page Documentation Views

### Goal
Generate combined documentation pages for easier PDF export and offline viewing.

### Implementation

Create single-page versions of documentation sections:

```json
// single-page-config.json
{
  "singlePages": [
    {
      "path": "/docs/developers/operations-api",
      "output": "/docs/developers/operations-api/all",
      "title": "Complete Operations API Reference"
    },
    {
      "path": "/docs/developers/applications",
      "output": "/docs/developers/applications/all",
      "title": "Complete Applications Guide"
    }
  ]
}
```

### Benefits
- Easy "Save as PDF" for offline documentation
- Better searchability with browser find (Ctrl+F)
- Useful for auditing/reviewing all content
- Simplified printing for physical documentation needs

### Technical Approach
- Build-time generation of combined pages
- Maintain navigation structure in single page
- Include table of contents with anchor links
- Optimize for print CSS

## Success Criteria

1. Harper developers can edit docs alongside code
2. Documentation PRs are automatically created
3. Release notes have stable URLs
4. PR previews are available
5. Documentation sync is reliable and conflict-free
6. Single-page views available for major sections