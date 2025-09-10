---
title: Core Concepts
---

# Core Concepts

Before you build your first app with Harper, it helps to understand a few key ideas. These concepts show you how Harper is structured and why it’s flexible enough to power everything from a quick proof-of-concept to a production-ready platform.

## Components

**Components** are the building blocks of Harper.  
They’re JavaScript-based modules that extend Harper’s core, and they can talk directly to Harper’s [Global APIs](../reference/globals) (databases, tables, resources).  

Because components can build on top of each other, they give you composability. For example, a [Harper Application](../developers/applications/) is itself a component, combining smaller pieces like the [rest](../reference/components/built-in-extensions#rest) component extension for automatic REST APIs and the [graphqlSchema](../reference/components/built-in-extensions#graphqlschema) component extension for defining tables.  

:::info
💡 **Why it matters:** Instead of wiring up a backend from scratch, you can piece together pre-built functionality and get to working endpoints fast.  
:::

## Applications

An **application** is a special kind of component that pulls everything together.  
Applications rely on extensions to do the work:  
- Use `graphqlSchema` to define your data tables.  
- Add `rest` to query that data instantly.  
- Plug in `static` to serve files or front-end assets.  

You can even run full frameworks like [Next.js](https://github.com/HarperDB/nextjs) or [Apollo](https://github.com/HarperDB/apollo) as Harper applications.  

:::info
💡 **Why it matters:** Applications are how you ship real products on Harper. They let you stitch resources, APIs, and UI in one place.
:::

## Resources

**Resources** are Harper’s data layer—databases, tables, and schemas. They’re where your app’s data lives. You can define them with GraphQL, extend them with JavaScript, and expose them through any Harper server protocol.  

:::info
💡 **Why it matters:** Whether you’re building SaaS or content apps, everything starts with structured, queryable data. Resources are how Harper manages it.
:::

## Extensions

**Extensions** add features to your applications. Some common ones:  
- `graphqlSchema` for database and table definitions.  
- `@harperdb/nextjs` for Next.js integration.  
- `@harperdb/apollo` for an Apollo GraphQL backend.  

Extensions can depend on each other, so you can layer functionality.  

:::info
💡 **Why it matters:** Instead of reinventing the wheel, you extend Harper with what you need and focus on your business logic.
:::

## Plugins (Experimental)

**Plugins** are the next evolution of extensions—lighter, simpler, and more powerful. They’re still experimental, but they’ll eventually replace extensions. You can explore the [plugin API](../reference/components/plugins.md) if you’re curious.  

:::info
💡 **Why it matters:** Plugins reduce boilerplate and make it easier to extend Harper with custom behavior.
:::

## Server

At the edge of Harper is the **server layer**, which connects your data to the outside world. Harper supports REST/HTTP, WebSockets, MQTT, and more. A single resource can be available through multiple protocols at once—so the same table can power a real-time dashboard, a mobile app, and a backend API.  

:::info
💡 **Why it matters:** You don’t have to choose between protocols. One data model, many ways to access it. 
::: 

---

✅ With these concepts in mind, you’re ready to [build your first application](../getting-started/quickstart.md). That’s where you’ll see how Components, Resources, and Extensions come together in practice.
