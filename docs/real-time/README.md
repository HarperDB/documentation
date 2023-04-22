# Real-Time
HarperDB provides real-time access to data and messaging. This allows clients to monitor and subscribe to data for changes in real-time as well as handling data-oriented messaging.

## MQTT
HarperDB supports MQTT as an interface to this real-time data delivery. It is important to note that MQTT in HarperDB is not just a generic pub/sub hub, but is deeply integrated with the database providing subscriptions directly to database records, and publishing to these records. In this document we will explain how MQTT pub/sub concepts are aligned and integrated with database functionality.

### Configuration
HarperDB supports MQTT with its `mqtt` server module and HarperDB supports MQTT over standard TCP sockets or over WebSockets. This is enabled by default, but can be configured in your `harperdb-config.yaml` configuration, allowing you to change which ports it listens on, if secure TSL connections are used, and MQTT is accepted over WebSockets:
```yaml
serverModules:
- module: mqtt
  port: 8883
  secure: true # use TSL
  webSocket: true # will also enable WS support through the default HTTP interface/port
```

## Topics
In MQTT, messages are published to, and subscribed from, topics. In HarperDB topics are aligned with resource endpoint paths in exactly the same way as the REST endpoints. If you define a table or resource in your schema, with an path/endpoint of "my-resource", that means that this can be addressed as a topic just like a URL path. So a topic of "my-resource/some-id" would correspond to the record in the my-resource table (or custom resource) with a record id of "some-id".

This means that you can subscribe to "my-resource/some-id" and making this subscription means you will receive notification messages for any updates to this record. If this record is modified or deleted, a message will be sent to listeners of this subscription.

The current value of this record is also treated as the "retained" message for this topic. When you subscribe to "my-resource/some-id", you will immediately receive the record for this id, through a "publish" command from the server, as the initial "retained" message that is first delivered. This provides a simple and effective way to get the current state of a record and future updates to that record without having to worry about timing issues of aligning a retrieval and subscription separately.

Similarly, publishing a message to a "topic" also interacts with the database. Publishing a message with "retain" flag enabled is interpreted as an update or put to that record. The published message will replace the current record with the contents of the published message.

If a message is published without a `retain` flag, the message will not alter the record at all, but will still be published to any subscribers to that record.


## Content Negotiation
HarperDB is a database, not a generic broker, and therefore highly adept at handling _structured_ data. Data can be published and subscribed in all supported structured/object formats, including JSON, CBOR, and MessagePack, and the data will be stored and handled as structured data. This means that different clients can individually choose which format they prefer, both for inbound and outbound messages. One client could publish in JSON, and another client could choose to receive messages in CBOR.    


Retain
QoS
Queries (limited QoS)


