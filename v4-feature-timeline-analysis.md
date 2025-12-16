# HarperDB Version 4 Feature Timeline Analysis

**Purpose:** This document provides a comprehensive timeline of features, APIs, and capabilities introduced across HarperDB version 4.x (4.0.0 through 4.7.6) to support the migration from versioned documentation to a unified reference documentation with Node.js-style version callouts.

**Date Generated:** 2025-12-16
**Versions Analyzed:** 4.0.0 - 4.7.6
**Sources:** Release notes (v4-tucker) and versioned documentation (4.1-4.7)

---

## Executive Summary

HarperDB version 4 underwent significant evolution from 4.0.0 to 4.7.6. The most transformative changes occurred in **version 4.2**, which introduced the Resource API, REST interface, MQTT support, component architecture, and schema-based development. Version 4.4 added native replication (Plexus), sharding, and GraphQL support. Versions 4.5-4.7 refined these features with blob storage, vector indexing, enhanced extensions, and improved security.

**Critical Version Markers:**
- **4.0.0** - NATS clustering, storage engine rewrite, YAML config
- **4.2.0** - Resource API, REST, MQTT, Components, Applications model
- **4.4.0** - Native replication (Plexus), sharding, GraphQL
- **4.5.0** - Blob storage, HTTP/2
- **4.6.0** - Vector indexing (HNSW), Extension API, data loader
- **4.7.0** - OCSP support, component status monitoring

---

## Table of Contents

1. [Core APIs & Interfaces](#core-apis--interfaces)
2. [Globals & Server Object](#globals--server-object)
3. [Clustering & Replication](#clustering--replication)
4. [Data Storage & Performance](#data-storage--performance)
5. [Real-Time Messaging & Protocols](#real-time-messaging--protocols)
6. [Schema & Data Modeling](#schema--data-modeling)
7. [Component Architecture](#component-architecture)
8. [Authentication & Security](#authentication--security)
9. [Configuration & Administration](#configuration--administration)
10. [SQL Features & Functions](#sql-features--functions)
11. [Import/Export](#importexport)
12. [Audit & Analytics](#audit--analytics)
13. [Platform Support](#platform-support)
14. [Operations API](#operations-api)
15. [Studio](#studio)
16. [Development Models Evolution](#development-models-evolution)

---

## Core APIs & Interfaces

### Resource API
- **Added:** 4.2.0
- **Updated:** 4.6.0 (upgraded form with improved ease of use)
- **Documentation:** First documented in 4.2, expanded in 4.6
- **Description:** New interface for accessing data with uniform interface for database/tables access. Supports customized application logic, external data sources, caching, and real-time data change notifications. Uses JavaScript/TypeScript idiomatic interfaces with ergonomic object mapping.

**Key Methods:**
- `Table.get(id)` - 4.2.0
- `Table.put(record)` - 4.2.0
- `Table.delete(id)` - 4.2.0
- `Table.search(query)` - 4.2.0
- `Table.getRecordCount()` - 4.5.0
- `Table.operation()` - 4.6.3

### REST Interface
- **Added:** 4.2.0
- **Documentation:** First documented in 4.2
- **Description:** Standards-based HTTP API using intuitive paths and methods (GET, PUT, POST, DELETE). Supports queries through GET requests, data modifications through PUTs, custom actions through POSTs.

**Examples:**
```
GET /Product?category=electronics&sort(price)
PUT /Product/123
DELETE /Product/123
```

### Operations API
- **Present:** All versions (legacy interface)
- **Updated:** 4.2.0 (terminology changes: schema → database, hash → primary key, search_by_hash → search_by_id)
- **Documentation:** Consolidated documentation in 4.2, expanded in 4.6
- **Made Optional:** 4.2.0 (configuration defaults to HTTP section if not defined)

### GraphQL Query Support
- **Added:** 4.4.0 (provisional)
- **Updated:** 4.5.0 (query endpoint configurable, disabled by default)
- **Documentation:** First documented in 4.4
- **Description:** Native GraphQL querying for graph data using GraphQL syntax.

### OpenAPI Specification
- **Added:** 4.3.0
- **Endpoint:** `GET /openapi`
- **Description:** Describes endpoints configured through GraphQL schema.

---

## Globals & Server Object

### `tables` Global
- **Added:** 4.2.0
- **Documentation:** First documented in 4.2
- **Description:** Access to tables in the default database
- **Example:** `tables.Product.get(id)`

### `databases` Global
- **Added:** 4.2.0
- **Documentation:** First documented in 4.2
- **Description:** Access to all databases
- **Example:** `databases.mydb.Product.get(id)`

### `Resource` Class
- **Added:** 4.2.0
- **Documentation:** First documented in 4.2
- **Description:** Base class for creating custom resources

### `server` Object Methods

| Method | Added | Description |
|--------|-------|-------------|
| `server.http()` | 4.2.0 | Register HTTP middleware |
| `server.ws()` | 4.2.0 | Create WebSocket servers |
| `server.socket()` | 4.2.0 | Create socket servers |
| `server.upgrade()` | 4.2.0 | Handle HTTP upgrade events |
| `server.config` | 4.2.0 | Access configuration |
| `server.recordAnalytics()` | 4.2.0 | Record analytics data |
| `server.getUser()` | 4.4.0 | Lookup user without password verification |
| `server.authenticateUser()` | 4.5.0 | Verify user with password |
| `server.resources` | 4.5.10 | Expose resources map |
| `server.operation()` | 4.6.0 | Execute operations programmatically |
| `server.nodes` | 4.6.0 | Cluster node information |
| `server.shards` | 4.6.0 | Sharding information |
| `server.hostname` | 4.6.0 | Node hostname |

### `contentTypes` Global
- **Added:** 4.3.0
- **Documentation:** First documented in 4.3
- **Description:** Content type negotiation utilities

### `Response` Object Support
- **Added:** 4.4.0
- **Description:** Resource methods can return Response objects with headers and status for more control

---

## Clustering & Replication

### NATS-Based Clustering
- **Added:** 4.0.0
- **Documentation:** Documented in 4.1, updated in 4.3 (renamed to "replication")
- **Description:** Complete rewrite using NATS enterprise-grade connective technology. Uses MessagePack for serialization, TLS-only connections.

**Operations:**
- `add_node`, `update_node`, `remove_node` - 4.0.0 (simplified, no longer need host/port)
- `configure_cluster` (alias `set_configuration`) - 4.0.0 (bulk publishing/subscription)
- `set_cluster_routes`, `get_cluster_routes`, `delete_cluster_routes` - 4.0.0
- `cluster_status` - 4.0.0 (updated statistics)
- `cluster_network` - 4.1.0 (ping cluster, return enmeshed nodes)

**Configuration:**
- `clustering.republishMessages` - 4.1.0 (default false in 4.2.0)

### Native Replication (Plexus)
- **Added:** 4.4.0
- **Documentation:** First documented in 4.4 as "replication" (replacing "clustering" terminology)
- **Description:** New replication system using direct WebSocket connections with optimized encoding. Driven by audit/transaction log. Supports PKI/mTLS authentication, automated replication with gossiping for node discovery, cross-node catch-up for consensus consistency.

**Key Features:**
- PKI/mTLS authentication - 4.4.0
- Automated node discovery (gossiping) - 4.4.0
- Cross-node catch-up - 4.4.0
- Blob replication - 4.5.0+
- Connection failover management - 4.5.0+

### Sharding
- **Added:** 4.4.0 (provisional)
- **Updated:** 4.5.0 (expanded with residency information, declarative configuration)
- **Updated:** 4.5.33 (database-level sharding marker)
- **Documentation:** First documented in 4.4
- **Description:** Distribute data across multiple nodes for scalability and performance

### Clone Node
- **Added:** 4.2.0
- **Updated:** 4.2.7 (support for cloning over existing instance)
- **Updated:** 4.2.8 (CLI arguments, cloning without clustering)
- **Description:** Add new nodes by cloning from leader with database snapshot copy and self-configuration

### Replicated Operations
- **Added:** 4.4.0
- **Description:** Component deployment and management can be replicated across cluster. Supports rolling restarts.

---

## Data Storage & Performance

### Storage Engine Improvements (4.0.0)
- Concurrent flushing technology
- Optimized search performance for `search_by_conditions` with multiple AND conditions
- More efficient encoding of secondary indices
- Multiple value indexing of array values
- Large text values (>255 bytes) segmented in same index
- Complex objects stored inline
- Deferred property decoding
- In-memory caching of frequently accessed records
- Async transactions for ACID-compliant updates
- `WRITE_ASYNC` setting support (LMDB nosync)
- Frozen objects returned from queries

### Database File Structure
- **Changed:** 4.2.0
- **Description:** Tables now in single transactionally-consistent database file. Multi-table transactions replicated atomically. Audit logs in same database. Databases entirely encapsulated (can be moved/copied without metadata updates).

### Iterator-Based Queries
- **Added:** 4.1.0
- **Breaking Change:** Results can't be accessed by `[index]`
- **Description:** Memory-efficient streaming of query results. Faster TTFB, less memory usage.

### Storage Location Configuration
- **Added:** 4.1.0
- **Configuration:** Options for specifying database storage file locations on different volumes

### Compression
- **Added:** 4.3.0
- **Default:** Enabled for all records over 4KB
- **Configuration:** Configurable compression settings

### Storage Performance Improvements
- **Added:** 4.3.0
- **Description:** Improved free-space handling to decrease fragmentation and improve reuse. Prioritizes recently released free-space.

### Compact Database
- **Added:** 4.3.0
- **Documentation:** First documented in 4.3
- **Description:** Compact database while offline to eliminate free-space and reset fragmentation
- **Operation:** `compact_database`

### Blob Storage
- **Added:** 4.5.0
- **Documentation:** First documented in 4.5
- **Description:** New blob storage system for large binary objects with streaming support. Efficient for HTML, images, video. Fully replicated. Uses JavaScript `Blob` interface and `createBlob()` function.

### BigInt Support
- **Added:** 4.3.0
- **Description:** Support for BigInt attributes with integers up to 1000 bits (10^301) with full precision. Can be primary keys or standard attributes. JSON documents support up to 300 digit integers.

### Auto-incrementing Primary Keys
- **Added:** 4.4.0
- **Description:** Primary keys can auto-increment. Keys defined as Any/Int/Long use auto-incrementation (8 bytes) instead of GUIDs (31 bytes).

### Storage Reclamation
- **Added:** 4.5.0
- **Description:** Automatic cleanup when storage runs low (below 40% configurable). Progressively evicts older cache entries, audit logs, and rotated log files.

---

## Real-Time Messaging & Protocols

### MQTT Support
- **Added:** 4.2.0
- **Updated:** 4.3.0 (mTLS support, single-level wildcards '+', retain handling for MQTT v5)
- **Updated:** 4.3.8 (keep-alive feature)
- **Updated:** 4.3.17 (MQTT analytics by QoS level)
- **Updated:** 4.3.6 (connection events), 4.3.8 (error events)
- **Documentation:** First documented in 4.2
- **Description:** Publish/subscribe messaging protocol. Implements QoS 0 and 1, durable sessions.

**Configuration:**
- `mqtt` section added - 4.2.0

### WebSockets
- **Added:** 4.2.0
- **Documentation:** First documented in 4.2
- **Description:** WebSocket support for MQTT transport or custom connection handling

### Server-Sent Events (SSE)
- **Added:** 4.2.0
- **Documentation:** First documented in 4.2
- **Description:** Browser API for connecting to HarperDB and subscribing to data changes over standard HTTP

### Real-Time Subscriptions
- **Added:** 4.2.0
- **Documentation:** First documented in 4.2
- **Description:** Standard interfaces for subscribing to data changes through MQTT, WebSockets, and SSE

### HTTP/2 Support
- **Added:** 4.5.0
- **Configuration:** `http2` option
- **Description:** HTTP/2 support for all API endpoints

---

## Schema & Data Modeling

### GraphQL Schema Definition
- **Added:** 4.2.0
- **Documentation:** First documented in 4.2 (`defining-schemas.md`)
- **Description:** Schema definitions using GraphQL syntax for table and attribute structure. Control over indexed attributes and types. Schemas bundled with applications.

**Example:**
```graphql
type Product @table {
  id: ID! @primaryKey
  name: String! @indexed
  price: Float
  category: String @indexed
}
```

### Relationships and Joins
- **Added:** 4.3.0
- **Documentation:** Enhanced in 4.3
- **Description:** Define relationships (one-to-many, many-to-one, many-to-many) using foreign keys. Automatic "joins" in queries using `@relation` directive.

**Example:**
```
GET /Product?brand.name=Microsoft&sort(price)&select(name,brand{name,size})
```

### Nested Selects
- **Added:** 4.3.0
- **Description:** Nested select support utilizing joins when related records are referenced

### Sorting Support
- **Added:** 4.3.0
- **Description:** Query support for sort order with multiple sort orders for tie-breaking

**Example:**
```
GET /Product?sort(category,-price)
```

### Null Value Indexing
- **Added:** 4.3.0
- **Description:** New tables support indexing null values, enabling queries by null/non-null values
- **Note:** Existing indexes require rebuild for null indexing

**Example:**
```
GET /Table/?attribute=null
```

### Computed Properties
- **Added:** 4.4.0
- **Documentation:** First documented in 4.4
- **Description:** Define properties computed from other properties without storing computed value

**Example:**
```graphql
type Person @table {
  firstName: String
  lastName: String
  fullName: String @computed(from: "firstName + ' ' + lastName")
}
```

### Custom Indexing
- **Added:** 4.4.0
- **Documentation:** First documented in 4.4
- **Description:** Custom indexes defined using computed properties for composite, full-text, and vector indexing

### Vector Indexing (HNSW)
- **Added:** 4.6.0
- **Documentation:** First documented in 4.6
- **Description:** Vector indexing using Hierarchical Navigable Small World algorithm for efficient queries on large semantic datasets. Useful for vector text-embedding data.

---

## Component Architecture

### Component Architecture
- **Added:** 4.2.0
- **Documentation:** First documented in 4.2
- **Description:** Evolution from custom functions to full component architecture. Internal functionality defined as components. Configuration-driven loading. Deployed via NPM and Github references.

**Structure:**
```
/component-name/
  schema.graphql
  package.json
  index.js
  resources/
```

**Configuration:**
- `componentRoot` - 4.2.0 (component directory location)

### Extension API
- **Added:** 4.6.0 (as "Plugin API")
- **Renamed:** 4.6.1 ("Plugin API" → "Extension API")
- **Documentation:** First documented in 4.6
- **Description:** Ergonomic API for creating extension components. Supports dynamic reloading of some files and configuration.

### Data Loader
- **Added:** 4.6.0
- **Updated:** 4.7.2 (detects changes via hash comparison)
- **Documentation:** First documented in 4.6
- **Description:** Load data into HarperDB from JSON files as part of component. Can be deployed and distributed with component.

**Example:**
```javascript
import { loadData } from 'harperdb';
await loadData('./data.json', 'Product');
```

### loadEnv Component
- **Added:** 4.5.0
- **Description:** Built-in component for loading environmental variables from .env file in a component

### Static File Handler
- **Changed:** 4.1.0
- **Updated:** 4.7.2 (uses index.html by default)
- **Breaking Change:** Custom Functions no longer automatically load static file routes. Must register `@fastify/static` plugin.

### Dev Mode
- **Added:** 4.2.0
- **Commands:** `harperdb run /path/to/app` or `harperdb dev /path/to/app`
- **Features:** Console logging, debugging enabled, auto-restart on file changes

### Component Operations
- **Added:** 4.2.0+
- **Documentation:** First documented in 4.2, expanded in 4.6

**Operations:**
- `get_components` - 4.2.0
- `deploy_component` - 4.2.0
- `get_component_file` - 4.2.1
- `drop_component` - 4.2.0+

---

## Authentication & Security

### Session Management
- **Added:** 4.2.0
- **Documentation:** First documented in 4.2
- **Description:** Cookie-based sessions for web client authentication. More secure than storing credentials in browsers.

### mTLS Support
- **Added:** 4.3.0
- **Updated:** 4.4.0 (PKI/mTLS for replication)
- **Documentation:** First documented in 4.3 (`mtls-auth.md`)
- **Description:** mTLS-based authentication for HTTP, WebSockets, and MQTT

### SNI Certificate Support
- **Added:** 4.3.11
- **Updated:** 4.3.12 (multiple hostnames per certificate)
- **Updated:** 4.3.15 (wildcards in hostnames)
- **Description:** Multiple certificates with SNI-based selection for HTTPS/TLS

### Dynamic Certificate Management
- **Added:** 4.4.0
- **Documentation:** Documented in 4.6 (`certificate-management.md`)
- **Description:** Certificates stored in system tables, dynamically managed. Can be added, replaced, deleted without restart. Includes certificates, certificate authorities, and private keys.

### Certificate Revocation
- **Added:** 4.5.0
- **Description:** Certificates can be revoked by configuring nodes with list of revoked certificate serial numbers

### OCSP Support
- **Added:** 4.7.0
- **Documentation:** First documented in 4.7 (`certificate-verification.md`)
- **Description:** OCSP support for invalidating TLS certificates through OCSP server for replication and HTTP

### Password Hashing
- **Added:** 4.5.0
- **Algorithms:**
  - `sha256` (default, good performance and security)
  - `argon2id` (highest security, more CPU intensive)

### Basic Authentication
- **Present:** All versions
- **Documentation:** Documented in 4.1+

### JWT Authentication
- **Present:** All versions
- **Documentation:** Documented in 4.1+

---

## Configuration & Administration

### YAML Configuration
- **Added:** 4.0.0
- **Breaking Change:** Updated from properties file to YAML
- **Migration:** Automatic conversion from pre-existing settings on upgrade
- **Major Refactor:** 4.2.0 (expanded `http` element, moved `threads` to top level, authentication section moved, new sections for `tls`, `mqtt`, `componentRoot`)

### Key Configuration Options

| Option | Added | Description |
|--------|-------|-------------|
| `http.sessionAffinity` | 4.1.0 | Session affinity (deprecated in 4.2.0) |
| `http.compressionThreshold` | 4.2.0 | Compression threshold |
| `http2` | 4.5.0 | Enable HTTP/2 |
| `analytics.aggregatePeriod` | 4.2.0 | Analytics aggregation period |
| `mqtt` section | 4.2.0 | MQTT configuration |
| `securePort` | 4.2.0 | Separate secure port configuration |
| `storage` location | 4.1.0 | Database storage file locations |
| `schemas` location | 4.1.0 | Schema storage location |
| `clustering.republishMessages` | 4.1.0 | Republish messages (default false in 4.2.0) |
| `directURLMapping` | 4.5.0 | Direct URL mapping option |
| `corsAccessControlAllowHeaders` | 4.4.22 | CORS headers configuration |
| `HARPER_SET_CONFIG` | 4.7.2 | Environment variable for config |
| `HARPER_DEFAULT_CONFIG` | 4.7.2 | Environment variable for defaults |

### Worker Threads
- **Added:** 4.1.0
- **Breaking Change:** Shift from processes to worker threads for HTTP request handling
- **Updated:** 4.1.1 (improved default heap limits and thread counts)
- **Benefits:** Better traffic delegation, improved debuggability, reduced memory footprint, IDE debugging support

### Socket Management
- **Added:** 4.2.0
- **Description:** Socket sharing to distribute connections (`SO_REUSEPORT`). Flexible port configuration. WebSockets on 9926 by default (separable or single port with operations API).

### Logging
- **Major Refactor:** 4.0.0 (removed pino and winston dependencies, all logging via stdout/stderr)
- **Updated:** 4.1.0 (condensed into single `hdb.log` file)
- **Major Enhancement:** 4.6.0 (significant expansions to configurability, granular component logging, HTTP logging configuration, Node.js Console API-based, no timestamp in stdout/stderr)

**Logging Categories:** (4.6.0)
- Standard logging (`logging/index.md`)
- Audit logging (`logging/audit-logging.md`)
- Transaction logging (`logging/transaction-logging.md`)

**Auth Event Logging:**
- `logging.auditAuthEvents.logFailed` - 4.2.0
- `logging.auditAuthEvents.logSuccessful` - 4.2.0

### Process Management
- **Changed:** 4.1.0
- **Breaking Change:** Running `harperdb` without command runs in foreground (compatible with systemd). Use `harperdb start` for background process.

### CLI Expansion
- **Major Enhancement:** 4.3.0 (expansive set of commands executing operations from operations API)

**Key Commands:**
- `harperdb status` - 4.1.2 (current running status and cluster status)
- `harperdb list_users` - 4.3.0
- `harperdb run /path/to/app` - 4.2.0 (run application)
- `harperdb dev /path/to/app` - 4.2.0 (dev mode with auto-restart)
- Various operations mapped to CLI - 4.3.0+

### Developer/Production Mode
- **Added:** 4.4.0
- **Description:** Interactive installation provides option for developer or production mode with appropriate defaults

### Startup Status Report
- **Added:** 4.4.0
- **Description:** On startup, HarperDB prints informative status of all running services and listening ports

### Component Status Monitoring
- **Added:** 4.7.0
- **Description:** Collects status from each component from loading and registered status change notifications

### Jobs System
- **Present:** All versions
- **Updated:** 4.3.20 (restart service executed as job for progress tracking)
- **Documentation:** Documented in all versions

---

## SQL Features & Functions

### SQL Function Categories

**Aggregate Functions:** (All versions)
- COUNT, SUM, AVG, MIN, MAX

**Date/Time Functions:** (All versions)
- NOW, GETDATE, EXTRACT, HOUR, MINUTE, MONTH, SECOND, YEAR, GET_SERVER_TIME, OFFSET_UTC

**Logical Functions:** (All versions)
- IF, IIF, IFNULL, NULLIF

**Mathematical Functions:** (All versions)
- ABS, CEIL, EXP, FLOOR, RANDOM, ROUND, SQRT

**String Functions:** (All versions)
- CONCAT, CONCAT_WS, INSTR, LEN, LOWER, UPPER, REPLACE, SUBSTRING, TRIM, REGEXP, REGEXP_LIKE

**Geospatial Functions:** (All versions)
- GEOAREA, GEOCONTAINS, GEOCONVERT, GEOCROSSES, GEODIFFERENCE, GEODISTANCE, GEOEQUAL, GEOLENGTH, GEONEAR
- **Updated:** 4.2.5, 4.2.6 (tolerate null and invalid values)
- **Fixed:** 4.1.0 (GEOJSON query support)
- **Documentation:** Consolidated from 10 separate files to 1 in 4.2

### Query Optimizations
- **Added:** 4.3.0
- **Description:** Numerous improvements to query planning and execution for high performance with broader range of queries

### CRDT (Conflict-Free Replicated Data Type)
- **Added:** 4.3.0
- **Description:** Support for basic CRDT updates allowing individual property updates and merging. Automatic with resource API property updates. Used with `PATCH` requests. Supports explicit incrementation.

### SQL Documentation Structure
- **Version 4.1:** Separate files for INSERT, UPDATE, DELETE, SELECT, joins
- **Version 4.2+:** Consolidated into unified SQL guide with features matrix

---

## Import/Export

### S3 Operations
- **Breaking Change:** 4.1.0 (updated to AWS SDK v3)
- **Required:** Bucket `region` parameter now required
- **Changed:** Nested objects referenced in `key` parameter
- **Changed:** Bucket attribute cannot have trailing slashes

**Operations:**
- `read_from_s3`
- `export_to_s3`

### CSV URL Load
- **Enhanced:** 4.1.0
- **Feature:** Extended to allow additional headers passed to remote server

**Operations:**
- `read_csv_url`

### Export Operations Enhancement
- **Enhanced:** 4.3.0
- **Feature:** `export_local` and `export_to_s3` now support `search_by_conditions`

### Export by Protocol
- **Added:** 4.4.0
- **Description:** Exported resources can be configured to be exported by specific protocol (REST, MQTT, etc.)

---

## Audit & Analytics

### Audit Logs
- **Updated:** 4.0.0 (transaction log operations → audit log operations)
- **Updated:** 4.3.0 (balanced cleanup to reduce resource consumption)
- **Documentation:** Documented in all versions
- **Description:** Audit logs maintained in same database with atomic consistency

**Operations:**
- `get_audit_log`
- `delete_audit_logs_before`

### Transaction Logs (Streams)
- **Added:** 4.0.0
- **Description:** New transaction log operations interfacing with NATS streams

**Operations:**
- `get_transaction_log`

### Analytics

**Base Analytics:** 4.2.0
- `analytics.aggregatePeriod` configuration

**MQTT Analytics:** 4.3.17
- Analytics by QoS level

**Replication Analytics:** 4.3.25
- Replication latency

**HTTP Analytics:** 4.3.27
- Requests by status code

**Resource & Storage Analytics:** 4.5.0
- Page faults, context switches, free space, disk usage

**Blob Analytics:** 4.5.20
- Blob replication and egress transfer

**Dynamic Analytics Querying:** 4.6.11
- Dynamic property querying for `get_analytics`

**Fabric Analytics:** 4.7.0
- New analytics and licensing functionality for Fabric services

**Operations:**
- `get_analytics` - All versions
- `get_analytics` (enhanced) - 4.6.11

---

## Platform Support

### Node.js Version Support

| Version | Node.js Versions | Notes |
|---------|-----------------|-------|
| 4.0.0 | v14-v19 | Primarily tested on v18 |
| 4.1.0 | v14-v19 | Node 18.15.0 |
| 4.3.11 | v14-v22 | Node v22 support |
| 4.3.35 | v14-v23 | Node v23 support |
| 4.4.5+ | v14-v23 | Node v23 support |

### Windows Support
- **Added:** 4.0.0
- **Platforms:** Windows 10 and 11
- **Note:** Native support without container or WSL. Intended for evaluation and development only.

### Platform Binaries
- **Available:** 4.0.0
- **Platforms:** darwin-arm64, darwin-x64, linux-arm64, linux-x64, win32-x64
- **Updated:** 4.1.2 (updated for older glibc versions back to 2.17)

### Docker
- **Updated:** 4.0.0 (updated dockerfile for harperdb.conf)
- **Added:** 4.5.2 (harper-chrome container for Chrome binaries/Puppeteer)
- **Enhanced:** 4.4.8 (multiple node versions)

### OpenShift
- **Improved:** 4.1.1
- **Description:** Improvements to OpenShift container

### Systemd
- **Added:** 4.1.0
- **Description:** Systemd script for HarperDB 4.1

---

## Operations API

### Core Database Operations
*All versions (terminology updated in 4.2.0)*

**Database Operations:**
- `describe_all` - List all databases
- `create_database` - Create database (formerly create_schema)
- `drop_database` - Drop database (formerly drop_schema)
- `describe_database` - Describe database (formerly describe_schema)

**Table Operations:**
- `describe_table`
- `create_table`
- `drop_table`
- `create_attribute`
- `drop_attribute`

**Data Operations:**
- `insert`
- `update`
- `upsert`
- `delete`
- `sql`

**NoSQL Query Operations:**
- `search_by_value`
- `search_by_id` (formerly search_by_hash - 4.2.0)
- `search_by_conditions`

### User & Role Operations
*All versions*

- `add_user`
- `alter_user`
- `drop_user`
- `list_users`
- `add_role`
- `alter_role`
- `drop_role`
- `list_roles`
- `user_info`

### Clustering Operations
*All versions (4.0.0 major changes)*

- `add_node` - 4.0.0 (no longer need host/port)
- `update_node` - 4.0.0
- `remove_node` - 4.0.0
- `configure_cluster` (alias `set_configuration`) - 4.0.0
- `cluster_status` - 4.0.0 (updated statistics)
- `cluster_network` - 4.1.0
- `set_cluster_routes` - 4.0.0
- `get_cluster_routes` - 4.0.0
- `delete_cluster_routes` - 4.0.0

### Component Operations
*Added in 4.2.0*

- `get_components` - 4.2.0
- `deploy_component` - 4.2.0
- `drop_component` - 4.2.0
- `package_component` - 4.2.0
- `get_component_file` - 4.2.1

### System Operations
*Documentation consolidated in 4.6*

- `restart` - All versions (enhanced as job in 4.3.20)
- `system_information`
- `registration_info`
- `get_configuration`
- `set_configuration` - 4.2.0+

### Certificate Operations
*Added in 4.4.0, documented in 4.6*

- Dynamic certificate management through system tables

### Analytics Operations
*Documentation consolidated in 4.6*

- `get_analytics` - All versions (enhanced in 4.6.11)

### Logging Operations
*All versions*

- `get_audit_log`
- `delete_audit_logs_before`
- `get_transaction_log`

### Job Operations
*All versions*

- `get_job`

### Import/Export Operations
*All versions (enhanced over time)*

- `read_csv_file`
- `read_csv_url` - Enhanced 4.1.0
- `read_csv_data`
- `export_local` - Enhanced 4.3.0
- `export_to_s3` - Breaking change 4.1.0, enhanced 4.3.0
- `read_from_s3` - Breaking change 4.1.0

### Additional Operations

**SSH Key Operations:**
- `get_ssh_key` - 4.7.2

**Usage License Operations:**
- `get_usage_licenses` - 4.7.3

**Blob Operations:**
- Blob cleanup operation - 4.5.28

### Describe Operations Enhancements
- **Updated:** 4.1.0 (last updated timestamp)
- **Updated:** 4.4.16 (table size reporting)

---

## Studio

### Local Studio
- **Present:** All versions
- **Major Upgrade:** 4.3.0 (upgraded to match online version studio.harperdb.io with full robust feature set)

### Studio Features by Version

**Version 4.1:**
- Instance configuration
- Instance metrics
- Instance example code
- Manage schemas & browse data
- Manage instance roles
- Manage instance users
- Manage clustering
- Manage functions (Custom Functions)
- Manage charts

**Version 4.2:**
- All 4.1 features
- Updated for new terminology (databases vs schemas)

**Version 4.3:**
- Manage applications (NEW)
- Manage databases & browse data (renamed)
- Manage replication (renamed from clustering)
- Removed: Instance example code
- Removed: Manage functions

**Version 4.4+:**
- Terminology updated to "Harper Studio"
- All 4.3 features

**Version 4.5:**
- Query instance data (NEW) - Query interface

**Enhancements:**
- **4.3.29:** Cache-only mode, cookie auth support, tables without primary key, improved sorting
- **4.3.25:** Fixed loading in HTTP, configuration tab
- **4.5.7:** Login fix

---

## Development Models Evolution

### Custom Functions Model
- **Primary Model:** 4.1
- **Status:** Deprecated in 4.2
- **Documentation:** Documented in 4.1, moved to legacy in 4.2
- **Description:** Original development model with custom routes and functions

**Structure (4.1):**
```
/custom_functions/
  helpers/
  static/
  routes/
  package.json
```

### Applications Model (Schema-Based)
- **Added:** 4.2.0
- **Current Status:** Primary development model
- **Documentation:** First documented in 4.2 (`developers/applications/`)
- **Description:** Schema-based development with GraphQL schema definitions, Resource API, and component architecture

**Structure (4.2+):**
```
/component-name/
  schema.graphql
  package.json
  index.js
  resources/
  static/
```

**Key Documentation Files:**
- `defining-schemas.md` - 4.2
- `define-routes.md` - 4.2
- `defining-roles.md` - 4.4
- `web-applications.md` - 4.4
- `data-loader.md` - 4.6
- `caching.md` - 4.2
- `debugging.md` - 4.2

### Components & Extensions Model
- **Added:** 4.2.0 (Components)
- **Enhanced:** 4.4.0 (expanded component system)
- **Enhanced:** 4.6.0 (Extension API)
- **Documentation:** Moved from `developers/components/` (4.2-4.5) to `reference/components/` (4.6+)

**Component Types:**
- Application components - 4.2.0+
- Built-in components - 4.4.0+ (documented)
- Extension components - 4.6.0+

---

## Migration Notes for Unified Documentation

### Critical Version Boundaries

**4.0.0 - 4.1.x:** Legacy Custom Functions model, pre-Resource API
**4.2.0+:** Modern Applications model with Resource API (major breaking changes)
**4.4.0+:** Native replication, sharding, GraphQL
**4.6.0+:** Extension API, vector indexing, enhanced components

### Recommended Version Callout Format

Following Node.js documentation pattern:

```markdown
## tables global

> Added in: 4.2.0

The `tables` global provides access to tables in the default database.

### Example

\`\`\`javascript
const product = await tables.Product.get(productId);
\`\`\`
```

```markdown
## server.authenticateUser(username, password)

> Added in: 4.5.0

Authenticates a user by verifying the provided password.

### Parameters

- `username` {string} - The username
- `password` {string} - The password to verify

### Returns

- {Object} - User object if authentication successful
- {null} - If authentication failed
```

```markdown
## Blob Storage

> Added in: 4.5.0

HarperDB supports efficient storage and retrieval of large binary objects (blobs).

### createBlob(data)

> Added in: 4.5.0

Creates a new blob from the provided data.
```

```markdown
## Vector Indexing (HNSW)

> Added in: 4.6.0

Hierarchical Navigable Small World (HNSW) algorithm for efficient vector similarity search.
```

### Features That Need Version Callouts

Based on this analysis, the following features should have version callouts in the unified documentation:

**High Priority (Major features):**
- `tables` global (4.2.0)
- `databases` global (4.2.0)
- Resource API (4.2.0)
- REST Interface (4.2.0)
- MQTT support (4.2.0)
- GraphQL (4.4.0)
- Native replication/Plexus (4.4.0)
- Sharding (4.4.0)
- Blob storage (4.5.0)
- Vector indexing (4.6.0)
- Extension API (4.6.0)
- Data loader (4.6.0)
- HTTP/2 (4.5.0)
- OCSP support (4.7.0)

**Medium Priority (Important APIs):**
- All `server` object methods with their respective versions
- Component architecture (4.2.0)
- GraphQL schema definition (4.2.0)
- Relationships and joins (4.3.0)
- Computed properties (4.4.0)
- Custom indexing (4.4.0)
- Session management (4.2.0)
- mTLS (4.3.0)
- Dynamic certificate management (4.4.0)

**Lower Priority (Enhancements):**
- Specific configuration options
- Minor operation updates
- Performance improvements

### Terminology Changes to Document

| Version | Old Term | New Term | Context |
|---------|----------|----------|---------|
| 4.2.0 | schema | database | Database organization |
| 4.2.0 | hash | primary key | Primary key terminology |
| 4.2.0 | search_by_hash | search_by_id | Operation name |
| 4.3.0 | clustering | replication | Data synchronization |
| 4.2.0 | Custom Functions | Applications | Development model |
| 4.4.0 | HarperDB | Harper | Product name |
| 4.6.1 | Plugin API | Extension API | Extension system |

### Breaking Changes to Highlight

**4.0.0:**
- YAML configuration (from properties file)
- NATS-based clustering (from SocketCluster)

**4.1.0:**
- Iterator-based queries (can't access by [index])
- S3 operations require `region` parameter
- Worker threads (from PM2 processes)
- Process management (foreground by default)

**4.2.0:**
- Resource API introduced (major paradigm shift)
- Applications model replaces Custom Functions
- Database terminology changes
- Configuration structure refactored
- Static file handling no longer automatic

---

## Appendix: Complete Version Timeline

### 4.0.0 - Foundation (December 2021)
- NATS-based clustering
- YAML configuration
- Storage engine rewrite
- Windows support
- Transaction logs (streams)

### 4.1.0 - Performance (Early 2022)
- Worker threads
- Iterator-based queries
- Storage location configuration
- Session affinity
- cluster_network operation

### 4.2.0 - Resource API & REST (Mid 2022)
**MAJOR RELEASE**
- Resource API
- REST Interface
- Applications model
- GraphQL schema definitions
- MQTT support
- WebSockets
- Server-Sent Events
- Component architecture
- Session management
- Clone node
- Real-time subscriptions
- Database file structure redesign

### 4.3.0 - Relationships & Optimization (Late 2022)
- Relationships and joins
- Compression
- Storage performance improvements
- Compact database
- CLI expansion
- mTLS support
- Null value indexing
- Query optimizations
- CRDT support
- BigInt support
- OpenAPI specification
- Studio upgrade

### 4.4.0 - Native Replication & GraphQL (Early 2023)
**MAJOR RELEASE**
- Native replication (Plexus)
- Sharding (provisional)
- GraphQL support
- Computed properties
- Custom indexing
- Auto-incrementing primary keys
- Dynamic certificate management
- Replicated operations
- Developer/production mode
- Response object support
- Component system overhaul

### 4.5.0 - Blob Storage & HTTP/2 (Mid 2023)
- Blob storage
- HTTP/2 support
- Storage reclamation
- Password hashing (sha256, argon2id)
- server.authenticateUser API
- Certificate revocation
- Enhanced sharding
- Resource & storage analytics
- Table.getRecordCount()
- Transaction reuse

### 4.6.0 - Vector Indexing & Extensions (Late 2023)
**MAJOR RELEASE**
- Vector indexing (HNSW)
- Extension API
- Data loader
- server.operation() API
- Enhanced logging
- Component restructure
- Resource API enhancements
- Dynamic analytics querying

### 4.7.0 - Security & Monitoring (2024)
- OCSP support
- Component status monitoring
- Enhanced certificate verification
- Fabric analytics
- Data loader change detection
- SSH key operations
- Usage license operations

---

## Conclusion

This comprehensive feature timeline analysis provides a complete reference for adding Node.js-style version callouts to the unified HarperDB reference documentation. The most significant breaking point is **version 4.2.0**, which introduced the modern Resource API and Applications model. Features should be tagged with their first appearance version, and breaking changes should be clearly highlighted.

**Next Steps:**
1. Review current `/docs/` directory structure
2. Map features from this timeline to documentation pages
3. Add version callouts using the recommended format
4. Highlight breaking changes and terminology changes
5. Consider maintaining a "Migration from 4.1" guide for legacy Custom Functions users

---

*Document prepared by Claude Code - 2025-12-16*
