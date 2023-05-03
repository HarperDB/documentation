# Real-Time
HarperDB provides real-time access to data and messaging. This allows clients to monitor and subscribe to data for changes in real-time as well as handling data-oriented messaging. HarperDB supports multiple standardized protocols to facilitate diverse standards-based client interaction. 

## Content Negotiation
HarperDB is a database, not a generic broker, and therefore highly adept at handling _structured_ data. Data can be published and subscribed in all supported structured/object formats, including JSON, CBOR, and MessagePack, and the data will be stored and handled as structured data. This means that different clients can individually choose which format they prefer, both for inbound and outbound messages. One client could publish in JSON, and another client could choose to receive messages in CBOR.

# Protocols
## MQTT
HarperDB supports MQTT as an interface to this real-time data delivery. It is important to note that MQTT in HarperDB is not just a generic pub/sub hub, but is deeply integrated with the database providing subscriptions directly to database records, and publishing to these records. In this document we will explain how MQTT pub/sub concepts are aligned and integrated with database functionality.

### Configuration
HarperDB supports MQTT with its `mqtt` server module and HarperDB supports MQTT over standard TCP sockets or over WebSockets. This is enabled by default, but can be configured in your `harperdb-config.yaml` configuration, allowing you to change which ports it listens on, if secure TSL connections are used, and MQTT is accepted over WebSockets:
```yaml
serverModules:
- module: mqtt
  port: 1883
  securePort: 8883 # for TSL
  webSocket: true # will also enable WS support through the default HTTP interface/port
```
Note that if you are using WebSockets for MQTT, the sub-protocol should be set to "mqtt" (this is required by the MQTT specification, and should be included by any conformant client): `Sec-WebSocket-Protocol: mqtt`.

## Topics
In MQTT, messages are published to, and subscribed from, topics. In HarperDB topics are aligned with resource endpoint paths in exactly the same way as the REST endpoints. If you define a table or resource in your schema, with an path/endpoint of "my-resource", that means that this can be addressed as a topic just like a URL path. So a topic of "my-resource/some-id" would correspond to the record in the my-resource table (or custom resource) with a record id of "some-id".

This means that you can subscribe to "my-resource/some-id" and making this subscription means you will receive notification messages for any updates to this record. If this record is modified or deleted, a message will be sent to listeners of this subscription.

The current value of this record is also treated as the "retained" message for this topic. When you subscribe to "my-resource/some-id", you will immediately receive the record for this id, through a "publish" command from the server, as the initial "retained" message that is first delivered. This provides a simple and effective way to get the current state of a record and future updates to that record without having to worry about timing issues of aligning a retrieval and subscription separately.

Similarly, publishing a message to a "topic" also interacts with the database. Publishing a message with "retain" flag enabled is interpreted as an update or put to that record. The published message will replace the current record with the contents of the published message.

If a message is published without a `retain` flag, the message will not alter the record at all, but will still be published to any subscribers to that record.

TODO: Documentation about queries and QoS. 

## WebSockets
WebSockets are supported through the REST interface and go through the `connect(incomingMessages)` method on resources. By default, making a WebSockets connection to a URL will subscribe to the referenced resource. For example, making a WebSocket connection to `new WebSocket('wss://server/my-resource/341')` will access the resource defined for 'my-resource' and the resource id of 341 and connect to it. On the web platform this could be:
```javascript
let ws = new WebSocket('wss://server/my-resource/341');
ws.onmessage = (event) => {
	// received a notification from the server
	let data = JSON.parse(event.data);
};
```


By default, the resources will make a subscription to that resource, monitoring any changes to the records or messages published to it, and will return events on the WebSockets connection. You can also override `connect(incomingMessages)` with your own handler. The `connect` method simply needs to return an iterable (asynchronous iterable) that represents the stream of messages to be sent to the client. One easy way to create an iterable stream is to define the `connect` method as a generator and `yield` messages as they become available. For example, a simple WebSockets echo server for a resource could be written:
```javascript
export class Echo extends Resource {
	static async *connect(incomingMessages) {
		for await (let message of incomingMessages) { // wait for each incoming message from the client
			// and send the message back to the client
			yield message;
		}
	}
```
You can also call the default `connect` and it will provide a convenient streaming iterable with events for the outgoing messages, with a `send` method that you can call to send messages on the iterable, and a `close` event for determining when the connection is closed. The incoming messages iterable is also an event emitter, and you can listen for `data` events to get the incoming messages using event style:
```javascript
export class Example extends Resource {
	static connect(incomingMessages) {
		let outgoingMessages = super.connect();
		let timer = setInterval(() => {
			  outgoingMessages.send({greeting: 'hi again!'});
		}, 1000);  // send a message once a second
		incomingMessages.on('data', (message) => {
			// another way of echo-ing the data back to the client
			outgoingMessages.send(message);
		});
		outgoingMessages.on('close', () => {
			// make sure we end the timer once the connection is closed
			clearInterval(timer);
		});
		return outgoingMessages;
	}
```

## Server Sent Events
Server Sent Events (SSE) are also supported through the REST server interface, and provide a simple and efficient mechanism for web-based applications to receive real-time updates. For consistency of push delivery, SSE connections go through the `connect()` method on resources, much like WebSockets. The primary difference is that `connect` is called without any `incomingMessages` argument, since SSE is a one-directional transport mechanism. This can be used much like WebSockets, specifying a resource URL path will connect to that resource, and by default provides a stream of messages for changes and messages for that resource. For example, you can connect to receive notification in a browser for a resource like: 
```javascript
let eventSource = new EventSource('https://server/my-resource/341', { withCredentials: true });
eventSource.onmessage = (event) => {
	// received a notification from the server
	let data = JSON.parse(event.data);
};
```

