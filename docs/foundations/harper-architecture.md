---
title: Harper Architecture
---

# Harper Architecture

Before diving deep into APIs and configuration, it helps to understand the big picture of how Harper works.  
Harper uses a **three-layer architecture** designed for distributed, edge-first computing. Each layer builds on the next, letting you start simple and scale as your app grows.

![](/img/v4.6/harper-architecture.png)

At a high level:  
- **Core services** handle data, networking, and files.  
- **Extensions** layer in reusable features (REST, GraphQL, Next.js, etc.).  
- **Applications** bring everything together to deliver user-facing functionality.  

:::info
💡 **Why it matters:** You focus on building your app, while Harper takes care of scaling, networking, and consistency behind the scenes.
:::

---

## Core Services

Harper ships with three essential services:

- **Database** → Fast storage, queries, and transactions.  
- **Networking** → REST/HTTP, WebSockets, MQTT, and cluster communication.  
- **File system** → File operations and serving static assets.  

Think of these as Harper’s foundation—every extension and app builds on them.

---

## Applications & Extensions

Most of your work will happen here.  

### Applications  
Applications sit at the top layer. They’re where you implement user-facing features. Examples:  
- A **Next.js app** served directly from Harper.  
- An **Apollo GraphQL server** exposing APIs.  

Applications don’t re-invent core logic—they declare the extensions they need.

### Extensions  
Extensions are Harper’s plug-in modules. They add reusable features to applications and can depend on each other.  

| **Component**      | **Type**             | **What it adds**               | **Built on**             |
|--------------------|----------------------|--------------------------------|--------------------------|
| `graphqlSchema`    | Built-in Extension   | Define schemas + tables        | database                 |
| `jsResource`       | Built-in Extension   | Custom JS resources            | database                 |
| `rest`             | Built-in Extension   | Auto-generate REST endpoints   | networking               |
| `@harperdb/nextjs` | Custom Extension     | Run Next.js apps               | networking, file-system  |
| `@harperdb/apollo` | Custom Extension     | Apollo GraphQL APIs            | graphqlSchema, networking |

:::info
💡 **Why it matters:** With extensions, you can snap in major capabilities in minutes (like REST APIs or GraphQL), instead of writing server code from scratch.
:::

:::warning
⚠️ **Heads up:** Extensions are gradually being replaced by **Plugins**, a lighter and more powerful model for extending Harper. Plugins are still experimental, but they represent the long-term direction of the platform. You can explore the [Plugin API](../reference/components/plugins.md) if you’d like to get ahead of the curve.  
:::

---

## Resource API

At the heart of Harper is the **Resource API**. It gives you a unified, consistent way to interact with data.  

- `get()` → fetch data  
- `post()` → create data or trigger actions  
- `put()` → replace existing data  
- `patch()` → update part of a record  

Every call is wrapped in a transaction, so multi-table operations stay consistent without extra boilerplate.  

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
