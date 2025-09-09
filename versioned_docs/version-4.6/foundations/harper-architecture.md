---
title: Harper Architecture
---

# Harper Architecture

For conceptual definitions of components, applications, extensions, and other Harper Concepts, [see this page](../foundations/core-concepts.md).

Harper employs a three-layer architecture designed for distributed edge computing. Each layer serves a distinct purpose: core services provide essential platform capabilities, extensions offer reusable middleware components, and applications deliver complete user-facing functionality.

This layered approach enables developers to build complex data applications without managing low-level infrastructure concerns. Applications focus on business logic while leveraging extensions that handle common patterns. Extensions, in turn, build upon optimized core services that manage fundamental operations like data storage, networking, and file handling.

The architecture's strength lies in its composition model. Applications declare dependencies on extensions, which automatically provide access to the core services they need. This creates clean separation of concerns while enabling powerful combinations of functionality through simple dependency declarations.


<!-- ADD IMAGE -->
![](/img/v4.6/harper-architecture.png)

## Core Services

Harper provides three core services that form the foundation:

- **database**: Data storage, retrieval, and transaction management
- **networking**: HTTP/HTTPS server, request handling, and inter-node communication
- **file-system**: File operations and static asset serving


## Component Architecture
### Applications

Applications are the top layer and represent the implementation of specific user-facing features. They depend on extensions to provide the functionality they need. Examples include Next.js applications that serve web interfaces or Apollo GraphQL servers that provide GraphQL APIs.

### Extensions

Extensions provide the support for implementing features and serve as building blocks for applications. They can depend on other extensions. For example, `@harperdb/apollo` depends on `graphqlSchema` to create cache tables for Apollo queries.

Components are classified as either built-in (included with Harper) or custom (external packages).

| **Component** | **Type** | **Purpose** | **Dependencies** |
|----------|----------|----------|----------|
| graphqlSchema    | Built-in Extension    | Schema-driven database design   | database    |
| jsResource    | Built-in Extension   | Custom JavaScript resources   | database    |
|rest    | Built-in Extension    |RESTful endpoint generation    | networking    |
| @harperdb/nextjs   | Custom Extension   | Next.js framework support    | networking, file-system    |
| @harperdb/apollo    | Custom Extension    | Apollo GraphQL server    | graphqlSchema, networking    |


## Resource API

Harper's Resource API provides a unified interface for data access. Resources correspond to HTTP methods:

- `get()` - retrieve data
- `post()` - create data or custom actions
- `put()` - replace data
- `patch()` - update data

Resource methods are automatically wrapped in transactions and committed when the method completes. This enables consistent multi-table operations and automatic change tracking.

## Transaction Model

All HTTP requests operate within automatic transaction contexts. Resource methods can access multiple tables with guaranteed consistency through shared database snapshots. Changes are tracked automatically and committed together when the request completes successfully.