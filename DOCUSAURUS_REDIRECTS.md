# Docusaurus Redirects

This file preserves the redirect mappings from GitBook (.gitbook.yaml) for implementation in the new Docusaurus platform.

## Status
These redirects will be implemented as server-side redirects during Phase 1 of the migration to ensure all existing URLs continue to work.

## Redirect Mappings

### Operations API
- `/developers/operations-api/utilities` → `/developers/operations-api/system-operations`

### Installation
- `/install-harperdb` → `/deployments/install-harper/`
- `/install-harperdb/linux` → `/deployments/install-harper/linux`
- `/install-harperdb/other` → `/deployments/install-harper/`
- `/install-harperdb/docker` → `/deployments/install-harper/`
- `/install-harperdb/mac` → `/deployments/install-harper/`
- `/install-harperdb/windows` → `/deployments/install-harper/`
- `/install-harperdb/linux-quickstart` → `/deployments/install-harper/linux`
- `/install-harperdb/offline` → `/deployments/install-harper/`
- `/install-harperdb/node-ver-requirement` → `/deployments/install-harper/`
- `/deployments/install-harperdb` → `/deployments/install-harper/`
- `/deployments/install-harperdb/linux` → `/deployments/install-harper/linux`

### Harper Studio (Old HarperDB Studio paths)
- `/harperdb-studio` → `/administration/harper-studio/`
- `/harperdb-studio/create-account` → `/administration/harper-studio/create-account`
- `/harperdb-studio/login-password-reset` → `/administration/harper-studio/login-password-reset`
- `/harperdb-studio/resources` → `/administration/harper-studio/resources`
- `/harperdb-studio/organizations` → `/administration/harper-studio/organizations`
- `/harperdb-studio/instances` → `/administration/harper-studio/instances`
- `/harperdb-studio/query-instance-data` → `/administration/harper-studio/query-instance-data`
- `/harperdb-studio/manage-schemas-browse-data` → `/administration/harper-studio/manage-databases-browse-data`
- `/harperdb-studio/manage-charts` → `/administration/harper-studio/manage-charts`
- `/harperdb-studio/manage-clustering` → `/administration/harper-studio/manage-replication`
- `/harperdb-studio/manage-instance-users` → `/administration/harper-studio/manage-instance-users`
- `/harperdb-studio/manage-instance-roles` → `/administration/harper-studio/manage-instance-users`
- `/harperdb-studio/manage-functions` → `/administration/harper-studio/manage-applications`
- `/harperdb-studio/instance-metrics` → `/administration/harper-studio/instance-metrics`
- `/harperdb-studio/instance-configuration` → `/administration/harper-studio/instance-configuration`
- `/harperdb-studio/enable-mixed-content` → `/administration/harper-studio/enable-mixed-content`

### Administration Studio Paths
- `/administration/harperdb-studio` → `/administration/harper-studio/`
- `/administration/harperdb-studio/*` → `/administration/harper-studio/*` (all subpaths)

### Harper Cloud (Old HarperDB Cloud paths)
- `/harperdb-cloud` → `/deployments/harper-cloud/`
- `/harperdb-cloud/*` → `/deployments/harper-cloud/*` (all subpaths)
- `/deployments/harperdb-cloud` → `/deployments/harper-cloud/`
- `/deployments/harperdb-cloud/*` → `/deployments/harper-cloud/*` (all subpaths)

### Security
- `/security` → `/developers/security/`
- `/security/jwt-auth` → `/developers/security/jwt-auth`
- `/security/basic-auth` → `/developers/security/basic-auth`
- `/security/configuration` → `/developers/security/configuration`
- `/security/users-and-roles` → `/developers/security/users-and-roles`

### Clustering
- `/clustering` → `/developers/clustering/`
- `/clustering/*` → `/developers/clustering/*` (all subpaths)

### Custom Functions → Applications
- `/custom-functions` → `/developers/applications/`
- `/custom-functions/define-routes` → `/developers/applications/define-routes`
- `/custom-functions/using-npm-git` → `/developers/custom-functions/create-project`
- `/custom-functions/custom-functions-operations` → `/developers/operations-api/`
- `/custom-functions/debugging-custom-function` → `/developers/applications/debugging`
- `/custom-functions/example-projects` → `/developers/applications/example-projects`

### Add-ons and SDKs
- `/add-ons-and-sdks` → `/developers/applications/`
- `/add-ons-and-sdks/google-data-studio` → `/developers/miscellaneous/google-data-studio`

### SQL Guide
- `/sql-guide` → `/developers/sql-guide/`
- `/sql-guide/*` → `/developers/sql-guide/*` (most subpaths)

### CLI
- `/harperdb-cli` → `/deployments/harper-cli`
- `/deployments/harperdb-cli` → `/deployments/harper-cli`

### Top-level paths
- `/configuration` → `/deployments/configuration`
- `/logging` → `/administration/logging/standard-logging`
- `/transaction-logging` → `/administration/logging/transaction-logging`
- `/audit-logging` → `/administration/logging/audit-logging`
- `/jobs` → `/administration/jobs`
- `/upgrade-hdb-instance` → `/deployments/upgrade-hdb-instance`
- `/reference` → `/technical-details/reference/`
- `/operations-api` → `/developers/operations-api/`
- `/rest` → `/developers/rest`
- `/api` → `/developers/operations-api/`

### Release Notes (Phase 3)
- **Phase 3**: All versioned release notes will redirect to unversioned paths:
  - `/docs/*/technical-details/release-notes/*` → `/docs/release-notes/*`
  - Example: `/docs/4.5/technical-details/release-notes/4.tucker/4.5.1` → `/docs/release-notes/4.tucker/4.5.1`

### File Rename Redirects (NEW - for maintaining existing bookmarks)
- `/administration/logging/logging` → `/administration/logging/standard-logging`
- `/administration/logging/logging.md` → `/administration/logging/standard-logging`

### Version Redirects (NEW - for explicit latest version)
All non-versioned documentation paths redirect to `/latest/`:
- `/docs/` → `/docs/latest/`
- `/docs/*` → `/docs/latest/*` (all non-versioned paths)

Examples:
- `/docs/getting-started` → `/docs/latest/getting-started`
- `/docs/developers/applications` → `/docs/latest/developers/applications`
- `/docs/administration/harper-studio/` → `/docs/latest/administration/harper-studio/`

Note: Versioned paths like `/docs/4.5/*` and `/docs/4.6/*` remain unchanged.

## Implementation Notes

For Docusaurus, these redirects should be implemented using:
1. Server-side redirects (nginx, Apache, etc.)
2. Harper middleware/plugin for handling redirects

### Important Changes from GitBook
1. The redirect from `/logging` goes to `/administration/logging/standard-logging` (not `logging.md`)
2. Added redirect for the renamed logging file to preserve existing bookmarks