The Resource class is designed to model different data resources within HarperDB. The Resource class be extended to create new data sources. Resources can exported to define endpoints. Tables themselves extend the Resource class, and can be extended by users. Generally a Resource class represents a collection of entities or records, and has static methods available for interacting with the collection, like querying a database table. Instances of a Resource class generally represent a single record or entity at a given point in time; that is Resource instances represent an atomic transactional view of a resource and facilitate transactional interaction.

The RESTful HTTP server and other server interfaces will instantiate/load resources to fulfill incoming requests, and so resources can be defined as endpoints for external interaction.

A Resource class has the following methods:
## `get(property?: string)`
This will return the record or data for this resource. This can be optionally called with a `property` to return the specified property value. For HTTP GET requests, this is called.

## `put(record: object, options?: object)`
This will assign the provided record or data to this resource. For HTTP PUT requests, this is called.

## `delete()`
Deletes this resources record or data.

## `publish(message)`
Publishes the message to this resource.

## `post(data)`
Posts to this resource. For HTTP POST requests, this is called, and can be a convenient way to define endpoints with for modifiying data.

## `subscribe()`

A resource class has the following static methods:

## `getResource(path: string): Resource`
This returns the resource instance for the given path or identifier.  