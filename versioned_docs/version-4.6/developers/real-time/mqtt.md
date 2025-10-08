---
title: MQTT
---

# MQTT

MQTT is widely used for lightweight, event-driven communication, especially when you need devices and apps to stay updated in real time. In Harper, MQTT is integrated directly into the database, so your topics map to real records instead of being just abstract channels. This makes it possible to persist state, stream updates, and control how data flows across distributed servers, all while using a standard protocol.

To make this concrete, let’s use a `Dog` table for a pet adoption app. Every record in this table automatically becomes an MQTT topic. That means if you store a dog with the ID `123`, you can subscribe to `dog/123` and immediately receive updates whenever that record changes.

```graphql
type Dog @table @export {
	id: ID @id
	name: String
	breed: String
}
```

## Subscribe to a record

When a client subscribes to `dog/123`, Harper first delivers the current record value as a retained message, then streams every update or deletion that follows. This ensures your app always has the latest state without needing a separate fetch.

## Publish updates

Publishing to the same topic updates or notifies subscribers depending on whether the retain flag is used.

- Retained messages update the record, replacing its state.
- Non-retained messages leave the record unchanged but notify subscribers.

This gives you control over whether messages represent state or events.

## Wildcards for multiple records

To follow more than one dog at once, you can subscribe with a trailing multi-level wildcard:

```bash
dog/#
```

This streams notifications for every record in the `Dog` table.

## Configuration

MQTT is enabled by default, but you can adjust ports, TLS, and authentication in your `harperdb-config.yaml`:

```yaml
mqtt:
  network:
    port: 1883
    securePort: 8883
  webSocket: true
  mTLS: false
  requireAuthentication: true
```

For more advanced options (like enabling mTLS or customizing ports), see the [Configuration page](../../deployments/configuration).

👉 If you connect over WebSockets, remember to include the sub-protocol: `Sec-WebSocket-Protocol: mqtt`.

## Event hooks

On the server side, you can hook into MQTT lifecycle events to log or react when clients connect, fail authentication, or disconnect:

```javascript
server.mqtt.events.on('connected', (session, socket) => {
	console.log('client connected with id', session.clientId);
});
```

## Ordering and delivery

Because Harper is distributed, messages can arrive out of order depending on network paths. Delivery rules are:

- **Non-retained messages** - always delivered, even if delayed or out of order.
- **Retained messages** - only the latest state is kept across all nodes.

This lets you handle use cases like chat (where every message matters) and IoT telemetry (where the latest reading matters most).

👉 Next: explore [WebSockets with Harper](./websockets) for full-duplex connections directly in the browser.
