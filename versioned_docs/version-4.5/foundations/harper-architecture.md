---
title: Harper Architecture
---

# Harper Architecture

Before diving deep into APIs and configuration, it helps to understand the big picture of how Harper works.  
Harper uses a **three-layer architecture** designed for distributed, edge-first computing. Each layer builds on the next, letting you start simple and scale as your app grows.

![](/img/v4.6/harper-architecture.png)

At a high level:

- **Core services** handle data, networking, and files.
- **Plugins** layer in reusable features (REST, GraphQL, Next.js, etc.).
- **Applications** bring everything together to deliver user-facing functionality.

:::info
💡 **Why it matters:** You focus on building your app, while Harper takes care of scaling, networking, and consistency behind the scenes.
:::

---

## Core Services

Harper ships with three essential services:

- **Database** → Fast storage, queries, and transactions.
- **Networking** → REST/HTTP, WebSockets, MQTT, and cluster communication.
- **Component Management** → The system that loads, configures, and connects components (applications, plugins, resources) so they work together consistently.

Think of these as Harper’s foundation—every extension and app builds on them.

---

## Applications & Extensions

Most of your work will happen here.

### Applications

Applications sit at the top layer. They’re where you implement user-facing features. Examples:

- A **Next.js app** served directly from Harper.
- A **basic app** from the [Getting Started guide](../getting-started/quickstart) that defines a schema, adds a table, and automatically exposes REST endpoints with the `rest` extension.

Applications don’t re-invent core logic—they declare the plugins they need.

### Component Configuration

Every Harper project starts with a **root configuration**.  
This configuration declares which components (applications, plugins/extensions, resources) should be loaded and how they should be initialized.

Some components are self-contained, while others include configuration that ties into additional components. For example:

- An application in the root config might load the `rest` plugin.
- The `rest` plugin exposes data from the database, so its configuration links to `graphqlSchema`.
- `graphqlSchema` defines the tables that the database service makes available.

This layering of configuration is what makes Harper composable: by declaring one component in your root config, you can enable entire sets of functionality.

:::info
💡 **Why it matters:** Instead of wiring everything manually, you declare the root config, and Harper initializes the components in the right relationships.  
:::

---

## Resource API

At the heart of Harper is the **Resource API**. It gives you a unified, consistent way to interact with data.

- `get()` → fetch data
- `post()` → create data or trigger actions
- `put()` → replace existing data
- `patch()` → update part of a record

Every call is wrapped in a transaction, so multi-table operations stay consistent without extra boilerplate.

For the complete API, see the [Resource reference](../reference/resource).

:::info
💡 **Why it matters:** You can build reliable features—like signups, payments, or analytics—without hand-rolling transaction logic.
:::

---

## Transaction Model

All requests run inside automatic transactions:

- Read/write across multiple tables in a single request.
- Automatic change tracking.
- Guaranteed consistency at commit.

:::info
💡 **Why it matters:** You don’t have to think about database race conditions or half-finished writes—Harper guarantees integrity by default.
:::

---

✅ With this architecture in mind, you can see how Harper scales from “hello world” to complex, distributed applications. Next, try putting it into practice by [building your first app](../developers/applications/).
