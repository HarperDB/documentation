The Resource class is designed to model different data resources within HarperDB. The Resource class be extended to create new data sources. Resources can exported to define endpoints. Tables themselves extend the Resource class, and can be extended by users.

Conceptually, a Resource class represents a collection of entities or records, and has static methods available for interacting with the collection, like querying a database table. One class represents one collection of records like a table. Instances of a Resource class generally represent a single record or entity at a given point in time. That is Resource instances can represent an atomic transactional view of a resource and facilitate transactional interaction. Therefore there are a distinct resource instances created for every record that is accessed, and the instance methods are used for interaction with individual records.

The RESTful HTTP server and other server interfaces will instantiate/load resources to fulfill incoming requests so resources can be defined as endpoints for external interaction. When resources are used by the server interfaces, they will be executed in transaction and the access checks will be performed before the method is executed.

There are paths that map to the class collection and to individual records. Using a path that does not specify an id like `/MyResource/` is mapped to the Resource class itself, and interactions will use the static methods like `static get()`, `static put()`, `static post()`, etc. Using a path that does specify an id like `/MyResource/3492` will be mapped a Resource instance (where the instance `id` property will be `3492`) and interactions will use the instance methods like `get()`, `put()`, and `post()`.

You can define create classes that extend Resource to define your own data sources, typically to interface with external data sources. In doing this, you will generally be extending and providing implementations for the instance methods below. For example:
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
import { tables } from 'harperdb';
tables.MyCache.sourcedFrom(MyExternalData);
```
You can also extend table classes in the same way, overriding the instance methods for custom functionality:
```javascript
import { tables } from 'harperdb';
const { MyTable } = tables;
export class MyCustomTableInterface extends MyTable {
	get() {
		// we can add properties or change properties before returning data, by using set():
		this.set('newProperty', 'newValue');
		this.existingProperty = 44 // any attributes declared in the schema will exist as first-class properties
		return super.get(); // returns the record, modified with the changes above
	}
	put(data, options) {
		// can change data any way we want
		super.put(data, options);
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

# Resource (Instance) Methods

A Resource class has the following instance methods and properties:
## `id`
This is the primary key associated with this resource

## `request`
This is the request object (if instantiated from an HTTP request) that initiated the interaction with this resource

## `user`
This is a user object for the user that initiated the interaction with this resource.

## Properties/attributes declared in schema
Properties that have been defined in your table's schema can be accessed and modified as direct properties on the Resource instances.

## `get(property?: string)`
This is called to return the record or data for this resource, and is called by HTTP GET requests. This can be optionally called with a `property` to return the specified property value. When defining Resource classes, you can define or override this method to define exactly what should be returned when retrieving a record. The default `get` method (`super.get()`) returns the current record as a plain object.

## `put(record: object, options?: object)`
This will assign the provided record or data to this resource, and is called for HTTP PUT requests. You can define or override this method to define how records should be updated. The default `put` method on tables (`super.put(record)`) writes the record to the table (updating or inserting depending on if the record previously existed) as part of the current transaction.

## `delete(options?)`
This will delete this record or resource, and is called for HTTP DELETE requests. You can define or override this method to define how records should be deleted. The default `delete` method on tables (`super.put(record)`) deletes the record from the table as part of the current transaction.

## `publish(message, options?)`
This will publish a message to this resource, and is called for MQTT publish commands. You can define or override this method to define how messages should be published. The default `publish` method on tables (`super.publish(message)`) records the published message as part of the current transaction; this will not change the data in the record but will notify any subscribers to the record/topic.

## `post(data, options?)`
This is called for HTTP POST requests. You can define this method to provide your own implementation of how POST requests should be handled. Generally this provides a generic mechanism for various types of data updates.

## `subscribe(options)`
This will subscribe to the current resource, and is called for MQTT subscribe commands. You can define or override this method to define how subscriptions should be handled. The default `subscribe` method on tables (`super.publish(message)`) will set up a listener to that will be called for any changes or published messages to this resource.

## `connect(incomingMessages?: AsyncIterable<any>): AsyncIterable<any>`
This is called when a connection is received through WebSockets or Server Sent Events (SSE) to this resource path. This is called with `incomingMessages` as an iterable stream of incoming messages when the connection is from WebSockets, and is called with no arguments when the connection is from a SSE connection. This can return an asynchronous iterable representing the stream of messages to be sent to the client. 

## `set(property, value)`
This will assign the provided value to the designated property in the resource's record. During a write operation, this will indicate that the record has changed and the changes will be saved during commit. During a read operation, this will modify the copy of the record that will be returned by a `get()`.

## `allowCreate()`
This is called to determine if the user has permission to create the current resource. This is called as part of external incoming requests (HTTP). The default behavior for a generic resource is that this requires super-user permission and the default behavior for a table is to check the user's role's insert permission to the table.

## `allowRead()`
This is called to determine if the user has permission to read from the current resource. This is called as part of external incoming requests (HTTP GET). The default behavior for a generic resource is that this requires super-user permission and the default behavior for a table is to check the user's role's read permission to the table.

## `allowUpdate()`
This is called to determine if the user has permission to update the current resource. This is called as part of external incoming requests (HTTP PUT). The default behavior for a generic resource is that this requires super-user permission and the default behavior for a table is to check the user's role's update permission to the table.

## `allowDelete()`
This is called to determine if the user has permission to delete the current resource. This is called as part of external incoming requests (HTTP DELETE). The default behavior for a generic resource is that this requires super-user permission and the default behavior for a table is to check the user's role's delete permission to the table.

## `use(Resource): Resource`
When implementing a resource that uses another resource to fulfill requests, it is recommended that you use that resource by calling the `use` method. This allows a secondary resource to be accessed such that:
* If the resource is a table in the same database, it will be accessed through the same transaction.
* Any timestamps that are accessed during resolution will be used to determine the overall last updated timestamp, which informs the header timestamps (which facilitates accurate client-side caching).
* Request and user information will be communicated so that contextual request information (like headers) can be accessed and any writes are properly attributed to the correct user.

Calling this with another resource or table class will return a version of the class (a subclass) that will operate in the context of the current resource with the behavior described above.

For example, if we had a method to post a comment on a blog, and when this happens we also want to update an array of comment ids on the blog record, but then add the comment to the a separate comment table. We might do this:
```javascript
import { tables } from 'harperdb';

export class BlogPost extends tables.BlogPost {
	post(comment) {
		 // returns the Comments table collection resource for this transaction
		let Comment = this.use(tables.Comment);
		Comment.put(comment); // add a comment record the comment table
		this.comments.push(comment.id); // add the id for the record to our array of comment ids
		// Both of these actions will be committed atomically as part of the same transaction (assuming
		// they are part of the same database)
	}	
}
```

# Resource Static Methods

The Resource class also has static methods that mirror the instance methods. These static methods are called when a request is made to the resource path with no identifer in the path. For example `POST /MyResource/133` will be handled by the Resource instance `post()` method, but `POST /MyResource/` will be handled by the Resource `static post()` method:
```javascript
export MyResource extends Resource {
	post() {
		// handles requests like POST /MyResource/133 where 133 is this.id
	}
	static post() {
		// handles requests like POST /MyResource/
	}
}
```
Likewise the get, put, delete, subscribe, and connect methods all have static equivalents. There is also a `static search()` method for specifically handling `static get()` with query parameters.

The Resource class also has static methods that mirror the instance methods with an initial argument that is the id of the resource instance to act on, and and by default call the instance methods. Generally static methods are the preferred way to interact with resources and call them from application code. These methods are available on user Resource classes and tables.

## `transact(callback: (transactionalTable) => any): Promise`
This executes the callback in a transaction, passing a transactional version of the table, where all the interactions with the table will be accessed or written through a transaction. This returns a promise for when the transaction has committed. The callback itself may be asynchronous (return a promise), allowing for asynchronous activity within the transaction. This is useful for starting a transaction when your code is not already running with a transaction (from an HTTP request handlers, a transaction will typically already be started). For example, if we wanted to run an action on a timer that periodically loads data, we could ensure that the data is loaded in single transactions like this (note that HDB is multi-threaded and if we do a timer-based job, we very likely want it to only run in one thread):
```javascript
import { tables } from 'harperdb';
if (isMainThread) // only on main thread
	setInterval(async () => {
		let someData = fetch(... some URL ...)
		tables.MyTable.transact((MyTable) => {
			for (let item in someData) {
				MyTable.put(item);
			}
		});
	}, 3600000); // every hour
```

## `getResource(path: string): Resource`
This returns the resource instance for the given path or identifier.

## `get(id: string|number)`
This will retrieve a record by id.  For example, if you want to retrieve comments by id in the retrieval of a blog post you could do:
```javascript
	async get() {
		let Comment = this.use(tables.Comment);
		for (let commentId of this.commentIds) {
			let comment = await Comment.get(commentId);
			// now you can do something with the comment record
		}
	}
```

## `put(id: string|number, record: object, options?: object)`
This will assign the provided record or data to this resource.

## `delete(id: string|number, options?)`
Deletes this resources record or data.

## `publish(id: string|number, message, options?)`
Publishes a message to this record.

## `subscribe(id: string|number, options)`
Subscribes to the record/resource.

There are additional methods that are only available on table classes (which are a type of resource).

## `Table.sourcedFrom(Resource, options)`
This defines the source for a table. This allows a table to function as a cache for an external resource. When a table is configured to have a source, any request for a record that is not found in the table will be delegated to the source resource to retrieve and the result will be cached/stored in the table. All writes to the table will also first be delegated to the source (if the source defines write functions like `put`, `delete`, etc.). The options parameter can include an `expiration` property that will configure the table with a time-to-live expiration window for automatic deletion or invalidation of older entries.

If the source resource implements subscription support, real-time invalidation can be performed to ensure the cache is guaranteed to be fresh (and this can eliminate or reduce the need for time-based expiration of data).