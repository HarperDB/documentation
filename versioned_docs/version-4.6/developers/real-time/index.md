---
title: Real-Time
---

# Real-Time

Modern applications demand experiences that update instantly; collaboration apps that feel alive, IoT dashboards that react the moment sensors change, and user interfaces that always show the freshest data without reloads. Harper makes this possible by embedding real-time communication directly into the database layer. Instead of bolting on a separate broker or managing multiple systems, you get structured real-time data and messaging as a first-class capability.

Harper real-time is built around database tables. Any declared table can double as a messaging topic, which means you don’t just publish and subscribe, you also persist, query, and synchronize that data across a distributed cluster. This is where Harper is different from a generic pub/sub hub: it treats data as structured records, not raw messages, and it speaks standard protocols so you can connect from any environment.

You can get started with real-time in Harper in a single step by adding a table to your schema:

```graphql
type Dog @table @export
```

From here, clients can subscribe to this topic, publish structured messages, and receive updates in real-time. Content negotiation is built in: one client can publish JSON, while another consumes CBOR or MessagePack. The database handles translation seamlessly.

Harper supports several real-time protocols so you can pick the one that best fits your application architecture:

- [MQTT](./real-time/mqtt) for IoT and event-driven systems, with tight integration to database records.
- [WebSockets](./real-time/websockets) for full-duplex connections and interactive applications.
- [Server Sent Events (SSE)](./real-time/sse) for lightweight one-way streaming to the browser.

Each protocol page in this section gives you background on the protocol itself, shows how Harper implements it, and walks you through how to use it in your apps.

👉 Whether you’re building dashboards, chat apps, or IoT systems, Harper gives you real-time capabilities without extra infrastructure; just connect and start streaming.
