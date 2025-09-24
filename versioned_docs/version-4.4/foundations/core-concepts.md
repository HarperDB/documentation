---
title: Core Concepts
---

# Core Concepts

Before you build your first app with Harper, it helps to understand a few key ideas. These concepts show you how Harper is structured and why it’s flexible enough to power everything from a quick proof-of-concept to a production-ready platform.

## Components

**Components** are the building blocks of Harper.  
They’re JavaScript-based modules that extend Harper’s core, and they can talk directly to Harper’s [Global APIs](../reference/globals) (databases, tables, resources).

Because components can build on top of each other, they give you composability. For example, both [Applications](../developers/applications/) and [Extensions](../developers/components/reference#extensions) are just kinds of components:

- **Plugins** add individual capabilities, like defining tables or serving static assets.
- **Applications** pull multiple plugins and resources together into a complete product.

:::info
💡 **Why it matters:** Instead of wiring up a backend from scratch, you can piece together pre-built functionality and get to working endpoints fast.  
:::

## Applications (a type of Component)

An **application** is a special kind of component that pulls everything together.  
Applications rely on plugins to do the work:

- Use `graphqlSchema` to define your data tables.
- Add `rest` to query that data instantly.
- Plug in `static` to serve files or front-end assets.

You can even run full frameworks like [Next.js](https://github.com/HarperDB/nextjs) or [Apollo](https://github.com/HarperDB/apollo) as Harper applications.

:::info
💡 **Why it matters:** Applications are how you ship real products on Harper. They let you stitch together resources, APIs, and UI in one place.
:::

## Plugins (formerly Extensions)

**Plugins** are a special kind of component that are not meant to run standalone, but instead add features to applications or other components. These were originally called **extensions** (and the [extension API](../developers/components/reference#extensions) is still supported), but the new plugin API is simultaneously a simplification and extensibility upgrade.

Examples you’ll see in the ecosystem include:

- **Built in extensions**: These are embedded in Harper and work out of the box. Examples include [graphqlSchema](../developers/components/built-in#graphqlschema) for database and table definitions, [rest](../developers/rest) for RESTful access to your data, and [static](../developers/components/built-in#static) for serving files or frontend assets.

- **Custom extensions**: These live outside of Harper and are installed from GitHub or npm. Harper supports a few official ones, and the ecosystem may include community plugins as well. Examples include [@harperdb/nextjs](https://github.com/HarperDB/nextjs) for Next.js integration and [@harperdb/apollo](https://github.com/HarperDB/apollo) for Apollo GraphQL.

:::info
💡 **Why it matters:** Plugins (formerly extensions) give Harper its flexibility. You can compose them into applications to get powerful functionality without writing boilerplate yourself.
:::

## Resources

**Resources** are Harper’s data layer and are implemented using the [`Resource`](../reference/resource/) class.  
They represent databases, tables, and other data entities, and they provide a unified API for accessing, querying, modifying, and monitoring records.

At the simplest level, resources let you:

- Define schemas and tables for your application data.
- Query and update that data through Harper’s APIs.
- Extend the base `Resource` class with JavaScript to define custom data sources or behaviors.

Each `Resource` instance can represent a single record or a collection of records at a given point in time.  
Static methods on the `Resource` class handle common operations like parsing paths, running transactions, and enforcing access controls, while instance methods give you a transactional view of individual records.

:::info
💡 **Why it matters:** Whether you’re working with standard tables or custom-defined resources, everything in Harper’s data layer builds on the same model. This gives you consistency when modeling data and flexibility to extend it with your own logic. For full details, see the [Resource reference documentation](../reference/resource/).
:::

## Server

At the edge of Harper is the **server layer**, which connects your data to the outside world. Harper supports REST/HTTP, WebSockets, MQTT, and more. A single resource can be available through multiple protocols at once—so the same table can power a real-time dashboard, a mobile app, and a backend API.

:::info
💡 **Why it matters:** You don’t have to choose between protocols. One data model, many ways to access it.
:::

---

✅ With these concepts in mind, you’re ready to [build your first application](../getting-started/quickstart). That’s where you’ll see how Components, Resources, and Extensions come together in practice.
