The Resource class is designed to model different data resources within HarperDB. The Resource class be extended to create new data sources. Resources can exported to define endpoints. Tables themselves extend the Resource class, and can be extended by users.

Conceptually, a Resource class provides an interface for accessing, querying, modifying, and monitoring a set of entities or records. Instances of a Resource class can represent a single record or entity, or a collection of records, at a given point in time, that you can interact with through various methods or queries. A Resource instances can represent an atomic transactional view of a resource and facilitate transactional interaction. Therefore there are a distinct resource instances created for every record or query that is accessed, and the instance methods are used for interaction with the data.

The RESTful HTTP server and other server interfaces will instantiate/load resources to fulfill incoming requests so resources can be defined as endpoints for external interaction. When resources are used by the server interfaces, they will be executed in transaction and the access checks will be performed before the method is executed.

Paths (URL, MQTT topics) are mapped to different resource instances. Using a path that does specify an id like `/MyResource/3492` will be mapped a Resource instance where the instance's id will be `3492`, and interactions will use the instance methods like `get()`, `put()`, and `post()`. Using the root path (`/MyResource/`) will map to a Resource instance with id of `null`.

You can define create classes that extend Resource to define your own data sources, typically to interface with external data sources (the Resource base class is available as a global variable in the HarperDB JS environment). In doing this, you will generally be extending and providing implementations for the instance methods below. For example:
```javascript
export class MyExternalData extends Resource {
	get() {
		// fetch data from an external source, using our primary key
		this.fetch(this.id)
	}
	put(data) {
		// send the data into the external source
	}
	delete() {
		// delete an entity in the external data source 
	}
	subscribe(options) {
		// if the external data source is capable of real-time notification of changes, can subscribe
	}
}
// we can export this class from resources.json as our own endpoint, or use this as the source for
// a HarperDB data to store and cache the data coming from this data source:
tables.MyCache.sourcedFrom(MyExternalData);
```
You can also extend table classes in the same way, overriding the instance methods for custom functionality. The `tables` object is a global variable in the HarperDB JavaScript environment, along with `Resource`:
```javascript
const { MyTable } = tables;
export class MyCustomTableInterface extends MyTable {
	get() {
		// we can add properties or change properties before returning data:
		this.newProperty = 'newValue';
		this.existingProperty = 44;
		return super.get(); // returns the record, modified with the changes above
	}
	put(data) {
		// can change data any way we want
		super.put(data);
	}
	delete() {
		super.delete(); 
	}
	post(data) {
		// providing a post handler (for HTTP POST requests) is a common way to create additional
		// actions that aren't well described with just PUT or DELETE
	}
}

```

# Global Variables

## `tables`
This is an object with all the tables in the default database (the default database is "data"). Each table that has been declared or created will be available as a (standard) property on this object, and the value will be the table class that can be used to interact with that table. The table classes implement the Resource API.

## `databases`
This is an object with all the databases that have been defined in HarperDB (in the running instance). Each database that has been declared or created will be available as a (standard) property on this object. The property values are an object with the tables in that database, where each property is a table, like the `tables` object. In fact, `databases.data === tables` should always be true.

## `Resource`
This is the Resource base class. This can be directly extended for custom resources, and is the base class for all tables.

## `server`
This object provides extension points for extension components that wish to implement new server functionality (new protocols, authentication, etc.). See the [extensions documentation for more information](../components/writing-extensions.md).

## `transaction`
This provides a function for starting transactions. See the transactions section below for more information.

## `contentTypes`
This provides an interface for defining new content type handlers. See the [content type documentation](./content-types.md) for more information.

## TypeScript Support
While these objects/methods are all available as global variables, it is easier to get TypeScript support (code assistance, type checking) for these interfaces by explicitly `import`ing them. This can be done by setting up a package link to the main HarperDB package in your app:
```
# you may need to go to your harperdb directory and set it up as a link first
npm link harperdb
```
And then you can import any of the main HarperDB APIs you will use, and your IDE should understand the full typings associated with them:
```
import { databases, tables, Resource } from 'harperdb';
```

# Resource Class (Instance) Methods

## Properties/attributes declared in schema
Properties that have been defined in your table's schema can be accessed and modified as direct properties on the Resource instances.

## `get(query?)`
This is called to return the record or data for this resource, and is called by HTTP GET requests. This can be optionally called with a `query` to return specified property values. When defining Resource classes, you can define or override this method to define exactly what should be returned when retrieving a record. The default `get` method (`super.get()`) returns the current record as a plain object.

## `getId(): string|number`
Returns the primary key value for this resource.

## `put(record: object)`
This will assign the provided record or data to this resource, and is called for HTTP PUT requests. You can define or override this method to define how records should be updated. The default `put` method on tables (`super.put(record)`) writes the record to the table (updating or inserting depending on if the record previously existed) as part of the current transaction.

## `delete(query?)`
This will delete this record or resource, and is called for HTTP DELETE requests. You can define or override this method to define how records should be deleted. The default `delete` method on tables (`super.put(record)`) deletes the record from the table as part of the current transaction.

## `publish(message)`
This will publish a message to this resource, and is called for MQTT publish commands. You can define or override this method to define how messages should be published. The default `publish` method on tables (`super.publish(message)`) records the published message as part of the current transaction; this will not change the data in the record but will notify any subscribers to the record/topic.

## `post(data)`
This is called for HTTP POST requests. You can define this method to provide your own implementation of how POST requests should be handled. Generally this provides a generic mechanism for various types of data updates.

## `subscribe(subscriptionRequest): Promise<Subscription>`
This will subscribe to the current resource, and is called for MQTT subscribe commands. You can define or override this method to define how subscriptions should be handled. The default `subscribe` method on tables (`super.publish(message)`) will set up a listener to that will be called for any changes or published messages to this resource.

The returned (promise resolves to) Subscription object is an `AsyncIterable` that you can use a `for await` to iterate through. It also has `queue` property which holds (an array of) any messages that are ready to be delivered immediately (if you have specified a start time, previous count, or there is a retained message, these may be immediately returned).

## `connect(incomingMessages?: AsyncIterable<any>): AsyncIterable<any>`
This is called when a connection is received through WebSockets or Server Sent Events (SSE) to this resource path. This is called with `incomingMessages` as an iterable stream of incoming messages when the connection is from WebSockets, and is called with no arguments when the connection is from a SSE connection. This can return an asynchronous iterable representing the stream of messages to be sent to the client. 

## `set(property, value)`
This will assign the provided value to the designated property in the resource's record. During a write operation, this will indicate that the record has changed and the changes will be saved during commit. During a read operation, this will modify the copy of the record that will be returned by a `get()`.

## `allowCreate(user)`
This is called to determine if the user has permission to create the current resource. This is called as part of external incoming requests (HTTP). The default behavior for a generic resource is that this requires super-user permission and the default behavior for a table is to check the user's role's insert permission to the table.

## `allowRead(user)`
This is called to determine if the user has permission to read from the current resource. This is called as part of external incoming requests (HTTP GET). The default behavior for a generic resource is that this requires super-user permission and the default behavior for a table is to check the user's role's read permission to the table.

## `allowUpdate(user)`
This is called to determine if the user has permission to update the current resource. This is called as part of external incoming requests (HTTP PUT). The default behavior for a generic resource is that this requires super-user permission and the default behavior for a table is to check the user's role's update permission to the table.

## `allowDelete(user)`
This is called to determine if the user has permission to delete the current resource. This is called as part of external incoming requests (HTTP DELETE). The default behavior for a generic resource is that this requires super-user permission and the default behavior for a table is to check the user's role's delete permission to the table.

## `getContext(): Context`
Returns the context for this resource. The context contains information about the current transaction, the user that initiated this action, and other metadata that should be retained through the life of an action.

# Resource Static Methods

The Resource class also has static methods that mirror the instance methods with an initial argument that is the id of the record to act on. The static methods are generally the preferred and most convenient method for interacting with tables outside of methods that are directly extending a table. 

The get, put, delete, subscribe, and connect methods all have static equivalents. There is also a `static search()` method for specifically handling searching a table with query parameters. By default, the Resource static methods default to calling the instance methods. Again, generally static methods are the preferred way to interact with resources and call them from application code. These methods are available on all user Resource classes and tables.


## `get(id: string|number, context?: Resource|Context)`
This will retrieve a record by id.  For example, if you want to retrieve comments by id in the retrieval of a blog post you could do:
```javascript
const { MyTable } = tables; 
...
// in class:
	async get() {
		for (let commentId of this.commentIds) {
			let comment = await Comment.get(commentId, this);
			// now you can do something with the comment record
		}
	}
```

## `put(record: object, context?: Resource|Context)`
This will save the provided record or data to this resource.

## `delete(id: string|number, context?: Resource|Context)`
Deletes this resources record or data.

## `publish(message: object, context?: Resource|Context)`
Publishes the given message to the record entry specified by the id.

## `subscribe(subscriptionRequest, context?: Resource|Context): Promise<Subscription>`
Subscribes to the record/resource.

## `search(query: Search, context?: Resource|Context)`
This will perform a query on this table or collection. The query parameter can be used to specify the desired query.

## `primaryKey`
This property indicates the name of the primary key attribute for a table. You can get the primary key for a record using this property name. For example:
```
let record34 = await Table.get(34);
record34[Table.primaryKey] -> 34
```

There are additional methods that are only available on table classes (which are a type of resource).

## `Table.sourcedFrom(Resource, options)`
This defines the source for a table. This allows a table to function as a cache for an external resource. When a table is configured to have a source, any request for a record that is not found in the table will be delegated to the source resource to retrieve and the result will be cached/stored in the table. All writes to the table will also first be delegated to the source (if the source defines write functions like `put`, `delete`, etc.). The options parameter can include an `expiration` property that will configure the table with a time-to-live expiration window for automatic deletion or invalidation of older entries.

If the source resource implements subscription support, real-time invalidation can be performed to ensure the cache is guaranteed to be fresh (and this can eliminate or reduce the need for time-based expiration of data).


## Context and Transactions
Whenever you implement an action that is calling other resources, it is recommended that you provide the "context" for the action. This allows a secondary resource to be accessed such in accessed through the same transaction, preserving atomicity and isolation.
This also allows timestamps that are accessed during resolution will be used to determine the overall last updated timestamp, which informs the header timestamps (which facilitates accurate client-side caching). The context also maintains user, session, and request metadata information that is communicated so that contextual request information (like headers) can be accessed and any writes are properly attributed to the correct user.

When using an export resource class, the REST interface will automatically create a context for you with a transaction and request metadata, and you can pass this to other actions by simply including `this` as the source argument (second argument) to the static methods.

For example, if we had a method to post a comment on a blog, and when this happens we also want to update an array of comment ids on the blog record, but then add the comment to the a separate comment table. We might do this:
```javascript
const { Comment } = tables;

export class BlogPost extends tables.BlogPost {
	post(comment) {
		// add a comment record to the comment table, using this resource as the source for the context
		Comment.put(comment, this); 
		this.comments.push(comment.id); // add the id for the record to our array of comment ids
		// Both of these actions will be committed atomically as part of the same transaction
	}	
}
```

## `transaction(context?, callback: (context) => any): Promise<any>`
This executes the callback in a transaction, providing a context that can be used for any resource methods that are called. This returns a promise for when the transaction has committed. The callback itself may be asynchronous (return a promise), allowing for asynchronous activity within the transaction. This is useful for starting a transaction when your code is not already running with a transaction (from an HTTP request handlers, a transaction will typically already be started). For example, if we wanted to run an action on a timer that periodically loads data, we could ensure that the data is loaded in single transactions like this (note that HDB is multi-threaded and if we do a timer-based job, we very likely want it to only run in one thread):
```javascript
import { tables } from 'harperdb';
const { MyTable } = tables; 
if (isMainThread) // only on main thread
	setInterval(async () => {
		let someData = await (await fetch(... some URL ...)).json();
		transaction((context) => {
			for (let item in someData) {
				MyTable.put(item, context);
			}
		});
	}, 3600000); // every hour
```
You can provide your own context object for the transaction to attach to. If you call `transaction` with a context that already has a transaction started, it will simply use the current transaction, execute the callback and immediately return (this can be useful for ensuring that a transaction has started).

## `getResource(path: string): Resource`
This returns the resource instance for the given path or identifier.


## TypeScript
The main interface 