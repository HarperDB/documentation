# MQTT
HarperDB provides real-time access to data and messaging. This allows clients to monitor and subscribe to data for changes in real-time as well as handling data-oriented messaging.

HarperDB supports MQTT as an interface to this real-time data delivery. It is important to note that MQTT in HarperDB is not just a generic pub/sub hub, but is deeply integrated with the database providing subscriptions directly to database records, and publishing to these records. In this document we will explain how MQTT pub/sub concepts are aligned with and integrated with database functionality.

## WebSockets
HarperDB supports MQTT over standard TCP sockets or over WebSockets
TODO: How to configure
## Topics
In MQTT, messages are published and subscribed to topics. In HarperDB topics are aligned with resource endpoint paths in exactly the same way as the REST endpoints. If you define a table or resource in your schema, with an path/endpoint of "my-resource", that means that this can be addressed as a topic just like a URL path. So a topic of "my-resource/some-id" would correspond to the record in the my-resource table (or custom resource) with a record id of "some-id".

This means that you can subscribe to "my-resource/some-id" and making this subscription means you will receive notification messages for any updates to this record. If this record is modified or deleted, a message will be sent to listeners of this subscription.

The current value of this record is also treated as the "retained" message for this topic. When you subscribe to "my-resource/some-id", you will immediately receive the record for this id, through a "publish" command from the server, as the initial "retained" message that is first delivered. This provides a simple and effective way to get the current state of a record and future updates to that record without having to worry about timing issues of aligning a retrieval and subscription separately.

Similarly, publishing a message to a "topic" also interacts with the database. Publishing a message with "retain" flag enabled is interpreted as an update or put to that record. The published message will replace the current record with the contents of the published message.

If a message is published without a `retain` flag, the message will not alter the record at all, but will still be published to any subscribers to that record.


Content Negotiation


Retain
QoS
Queries (limited QoS)


