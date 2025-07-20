# Harper Documentation Requirements

## Status
**Tool Selected**: Docusaurus (Migration in progress - see DOCUSAURUS_MIGRATION_PLAN.md)

## Core Requirements

### ✅ Completed Requirements
- [x] Local preview/build capability
- [x] Version switching for different releases
- [x] Search functionality
- [x] Good navigation/sidebar structure
- [x] Code syntax highlighting
- [x] API documentation support
- [x] Mobile-responsive design
- [x] Mermaid diagram support
- [x] Full styling customization
- [x] Flexible directory structure

### 🚧 In Progress
- [ ] Documentation in main Harper repository (`harperdb/docs`) - Phase 3
- [ ] Automatic deployment on releases
- [ ] Simple local development workflow from Harper repo
- [ ] CI/CD integration with S3 deployment

### ✅ Architecture Decisions

1. **Two-Repository Structure** (Phase 1-2)
   - Documentation repository: Source of truth, handles builds/deployment
   - Harper repository: Will receive docs in Phase 3 for developer convenience

2. **Version Strategy**
   - Branch-based versioning (main, release_4.5, release_4.6)
   - `latest-version.txt` determines current version
   - Each branch deploys to its version path

3. **URL Structure**
   - Versioned paths unchanged: `/docs/4.6/...`
   - Non-versioned paths redirect to latest: `/docs/...` → `/docs/latest/...`

4. **Content Types Supported**
   - Getting started guides
   - API reference
   - Tutorials
   - Architecture/concepts
   - Configuration reference
   - Release notes

## Migration Status
See DOCUSAURUS_MIGRATION_PLAN.md for detailed implementation phases and current progress.

## Original Requirements Archive
The full evaluation of documentation tools and detailed requirements analysis has been archived. Key findings:
- GitBook limitations: No local preview, limited customization, no PR integration
- Docusaurus selected for: React-based, excellent versioning, full control, team expertise alignment
- Other tools evaluated: MkDocs, VitePress, Nextra (see git history for full analysis)