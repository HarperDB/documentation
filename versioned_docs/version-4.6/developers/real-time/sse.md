---
title: Server-Sent Events (SSE)
---

# Server-Sent Events (SSE)

There are times when you don’t need a two-way connection. The client never needs to send data back, it only needs to stay in sync with what the server knows. For example, a dog adoption dashboard might show the availability of each dog, and all it has to do is keep that list updated in real time.

SSE (Server-Sent Events) is perfect for this. It gives you a persistent one-way stream from the server to the client, using simple HTTP. Harper makes this stream available on any resource path.

## Opening a connection to a record

On the client, you create an `EventSource` that points to the dog you want to follow.

```javascript
const es = new EventSource('https://server/dog/341', { withCredentials: true });
```

When the connection opens, it stays alive until you close it. Messages arrive as events you can listen for.

```javascript
es.onmessage = (event) => {
	const data = JSON.parse(event.data);
	renderDogProfile(data); // update the profile in your UI
};
```

## Handling errors and reconnects

SSE connections will automatically try to reconnect if they drop, but you should still handle errors gracefully.

```javascript
es.onerror = (err) => {
	console.error('sse error', err);
	showConnectionWarning();
};
```

When the user leaves the profile page, close the connection cleanly.

```javascript
es.close();
```

## Adding custom events from the server

By default, connecting to `/dog/341` streams record updates. But Harper also lets you enrich that stream by defining a `connect()` method on the resource. This lets you send your own events alongside updates.

```javascript
export class DogStream extends Resource {
	connect() {
		const outgoing = super.connect();

		// send a friendly reminder every 30 seconds
		const reminder = setInterval(() => {
			outgoing.send({ dogId: '341', notice: 'still looking for a home' });
		}, 30000);

		outgoing.on('close', () => {
			clearInterval(reminder);
		});

		return outgoing;
	}
}
```

Now the client receives both the automatic record updates and the server’s notices.

## Reading server messages on the client

On the client, branch on fields in the incoming event and update different parts of the UI.

```javascript
es.onmessage = (event) => {
	const msg = JSON.parse(event.data);

	if (msg.notice) {
		showNotice(msg.notice);
		return;
	}

	renderDogProfile(msg); // treat as a record update
};
```

## Why choose SSE for your app

- Lightweight and browser-native: just new EventSource().
- Automatic reconnects built into the browser.
- Ideal for dashboards, feeds, and one-way updates.
- Less complex than WebSockets when clients don’t need to send data.

At this point, your adoption dashboard can show dog profiles that stay fresh automatically, display occasional server notices, and handle connection lifecycle gracefully, all without writing a line of custom client transport code.

When you want to adjust TLS, authentication, or ports, do that in your Harper configuration file. See the [Configuration page](../../deployments/configuration) for details.

👉 If you later decide the client should also send messages back (like user comments or notes), [WebSockets](./websockets) give you that two-way channel.
