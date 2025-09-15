---
title: Harper Use Cases
---

# Harper Use Cases

Harper is designed to cut out infrastructure complexity so you can move faster.  
Here are some common ways developers use Harper in production today — each one showing how Harper’s architecture translates into real-world outcomes.

---

## Online Catalogs & Content Delivery

**Great for:** e-commerce sites, real estate listings, media & content platforms.

Harper’s distributed architecture makes your pages load fast worldwide, improving **SEO** and **conversion rates**.

- Host your frontend directly with the [Next.js Extension](https://github.com/HarperDB/nextjs).
- Support any framework using Harper’s extension system.
- Use Harper’s built-in caching + JavaScript layer to [server-side render pages](https://www.harpersystems.dev/development/tutorials/server-side-rendering-with-multi-tier-cache).
- Keep pages instantly fresh with built-in [WebSocket connections](../developers/real-time#websockets).

:::info
💡 **Why it matters:** Instead of stitching together CDN + DB + API layers, you deliver catalog and content experiences from a single platform.
:::

---

## Data Delivery Networks

**Great for:** live sports updates, flight tracking, software updates.

Harper combines **messaging**, **data storage**, and **application logic** in one system. That means:

- Push real-time updates directly to clients.
- Process and store data without leaving Harper.
- Eliminate extra message brokers or caching systems.

Explore the [real-time docs](../developers/real-time) to see how it works.

:::info
💡 **Why it matters:** You can build real-time data services in hours, not weeks, with fewer moving parts to manage.
:::

---

## Edge Inference Systems

**Great for:** IoT pipelines, sensor networks, edge AI.

Normally, capturing and analyzing streams at the edge requires a patchwork of tools. Harper simplifies this with:

- **Selective replication** between edge and cloud.
- **Self-healing connections** that keep data flowing even in flaky environments.
- The same Harper runtime running at both layers.

:::info
💡 **Why it matters:** One consistent stack across edge and cloud makes AI/ML inference faster, cheaper, and easier to scale.
:::

---

✅ Want to explore more? [Contact us](https://www.harpersystems.dev/contact) and we’ll walk you through building your own use case.
