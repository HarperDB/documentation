---
title: WebSockets
---

# WebSockets

There are times when you want more than just notifications about record changes. You need a live connection that stays open, one that lets updates stream from the server and messages flow back from the client. That’s exactly what WebSockets provide, and Harper makes them even more powerful by tying them directly to resources.

Let's imagine you have a dog profile screen open and you want it to stay fresh while the user looks at it. If the record for `dog/341` changes, the page should reflect it right away. A WebSocket gives you a live path from server to client and back again, so the page can breathe in real time.

You begin on the client by opening a connection to the resource path for that record.

```javascript
const ws = new WebSocket('wss://server/dog/341');
```

As soon as it connects, confirm it is alive so you can update any loading indicator.

```javascript
ws.onopen = () => {
	console.log('connected to dog/341');
};
```

Now listen for messages. Each message is JSON that represents either a record update or an event you choose to send from the server.

```javascript
ws.onmessage = (event) => {
	const data = JSON.parse(event.data);
	renderDogProfile(data);
};
```

If the connection has trouble, surface it. Errors are rare but silence is painful during development.

```javascript
ws.onerror = (err) => {
	console.error('websocket error', err);
};
```

When the user navigates away, close the socket so the server can clean up.

```javascript
ws.close(1000, 'leaving dog profile'); // normal closure
```

That already gives you a live profile. Any change to `dog/341` flows to the page without reloads or polling. Sometimes, though, you want more than passive updates. You want the page to send signals to the server, and you want the server to push its own messages alongside record changes.

Send a small message from the client. Keep it simple and structured.

```javascript
ws.send(JSON.stringify({ dogId: '341', note: 'good with kids' }));
```

On the server, define how the resource streams data back to connected clients. You can take full control by implementing `connect(incomingMessages)` on a resource. The method returns a stream. Yield values to push them to the client.

```javascript
export class DogNotes extends Resource {
	async *connect(incomingMessages) {
		for await (const message of incomingMessages) {
			// relay user notes for this dog
			yield { dogId: message.dogId, note: message.note };
		}
	}
}
```

This turns the profile into a small collaborative space. Anyone connected to `dog/341` can post a note and everyone sees it arrive in real time.

Sometimes you want to keep the default behavior for record updates and also add your own messages. Call `super.connect()` to get a convenient stream object that you can send on, and that fires a close event when the client leaves.

```javascript
export class DogStatus extends Resource {
	connect(incomingMessages) {
		const outgoing = super.connect();
		return outgoing;
	}
}
```

Add a very small server message so the client can show connection health. A steady pulse makes debugging simple and gives product a tiny hook for a status badge.

```javascript
const timer = setInterval(() => {
	outgoing.send({ dogId: '341', status: 'connection active' });
}, 1000);
```

Let the server react to what the client sends. Here we echo notes back through the stream so everyone connected stays in sync.

```javascript
incomingMessages.on('data', (message) => {
	outgoing.send({ dogId: message.dogId, note: message.note });
});
```

Clean up properly when the socket closes. No timers left behind.

```javascript
outgoing.on('close', () => {
	clearInterval(timer);
});
```

Return the stream and you are done.

```javascript
return outgoing;
```

Back on the client, keep the message handler tidy. Branch on simple fields and update the page.

```javascript
ws.onmessage = (event) => {
	const msg = JSON.parse(event.data);

	if (msg.note) {
		appendNote(msg.dogId, msg.note);
		return;
	}

	if (msg.status) {
		setConnectionBadge(msg.status);
		return;
	}

	renderDogProfile(msg); // treat as a record update
};
```

At this point the dog profile page is alive. It receives record updates for `dog/341`, it lets users post live notes, and it shows a gentle status pulse so the UI can reflect connection health. All of this runs over one WebSocket to one resource path.

If you need to tune transport details like TLS, ports, or authentication, keep the page focused and link out rather than dumping settings here. See the [Configuration page](../../deployments/configuration) when you are ready to adjust instance settings.

👉 Next up, if you prefer a one way stream where the server talks and the client just listens, move to [Server Sent Events (SSE)](./sse).
