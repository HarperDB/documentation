# Writing HarperDB Components/Plugins

HarperDB is highly extensible database application platform with support for a rich variety of composable modular components and plugins that can be used and combined to build applications and add functionality to existing applications. Here we describe the different types of components/plugins that can be developed for HarperDB and how to create them.

There are three general categories of components for HarperDB: Server protocol plugins that provide and define ways for clients to access data, resource plugins that handle and interpret different types of files, and consumer data sources that provide a way to access and retrieve data from other sources. Server plugins can be used to implement new protocols like MQTT, AMQP, Kafka, or maybe a retro-style Gopher interface. It can also be used to augment existing protocols like HTTP with "middleware" that can add authentication, analytics, or additional content negotiation, or add layer protocols on top of WebSockets.

Server resource plugins implement support for different types of files that can be used as resources in applications. HarperDB includes support for using JavaScript modules and GraphQL Schemas as resources, but resource plugins could be added to support different file types like HTML templates (like JSX), CSV data, and more.

Consumer data source components are used to retrieve and access data from other sources, and can be very useful if you want to use HarperDB to cache or use data from other databases like MySQL, Postgres, or Oracle, or subscribe to data from messaging brokers (again possibly Kafka, NATS, etc.).

These are not mutually exclusive, you may build components that fulfill any or all of these roles.

## Server Plugins
Server Plugins are implemented as JavaScript packages/modules and interact with HarperDB through a number of possible hooks. Server plugins can be configured at an application (custom function) level or a global level (for all applications). The configuration will define and handle any network ports that the plugin can listen on. A plugin configuration (in a YAML config) looks like:
```yaml
    module: 'package-name'
    port: 9925
```

### Module Initialization
Once a user has configured a plugin, HarperDB will attempt to load the plugin package specified by `module` property. Once loaded, there are several functions that can be exported that will be called by HarperDB:

`export function start(options: { port: number, server: {}})`
If defined, this will be called on the initialization of the plugin. The provided `server` property object includes a set of additional entry points for utilizing or layering on top of other protocols (and when implementing a new protocol, you can add your own entry points). The most common entry is to provide an HTTP middleware layer. This looks like:
```javascript
export function start(options: { port: number, server: {}}) {
	options.server.http(async (request, nextLayer) => {
	    // we can directly return a response here, or do some processing on the request and delegate to the next layer
        let response = await nextLayer(request);
		return response;
	});
}
```
Here, the `request` object will have the following structure (this is based on Node's request, but augmented to conform to a subset of the [WHATWG Request API](https://developer.mozilla.org/en-US/docs/Web/API/Request)):
```typescript
interface Request {
   method: string
   headers: Headers // use request.headers.get(headerName) to get header values
   body: Stream
   data: any // deserialized data from the request body
}
```
The returned `response` object should have the following structure (again, following a structural subset of the [WHATWG Response API](https://developer.mozilla.org/en-US/docs/Web/API/Response)):
```typescript
interface Response {
    status?: number
    headers?: {} // an object with header name/values
    data?: any // object/value that will be serialized into the body
    body?: Stream
}
```

If you were implementing an authentication plugin, you could get authentication information from the request and use it to add the `user` property to the request:
```javascript
import { getUser } from 'harperdb';
export function start(options: { port: number, server: {}, resources: Map}) {
	options.server.http((request, nextLayer) => {
		let authorization = request.headers.authorization;
		if (authorization) {
			// get some token for the user and determine the user
			// if we want to use harperdb's user database
			let user = getUser(username, password);
			request.user = user; // authenticate user object goes on the request	
		}
		// continue on to the next layer
		return nextLayer(request);
	});
	// if you needed to add a login resource, could add it as well:
	resources.set('/login', LoginResource);
}
```

If you were implementing a new protocol, you can directly interact with the sockets and listen for new incoming TCP connections:
```javascript
import { getUser } from 'harperdb';
export function start(options: { port: number, server: {}}) {
	options.server.socket((socket) => {
	});
})
```

### Resource Handling
Typically, servers not only communicate with clients, but serve up meaningful data based on the resources within the server. While resource plugins typically handle defining resources, once resources are defined, they can be consumed by server plugins. Once all resources have been defined, the `resourcesLoaded` function on the server plugin will be called (if present):
```javascript
export function resourcesLoaded(resources: Map) {
	// we can now use these set of resources as the source of data to fulfill client requests and subscriptions
}
```

## Resource Plugins
Resource plugins allow us to handle different files and make them accessible to servers as resources, following the common Resource API. To implement a resource plugin, you export a function called `handleFile`. Users can then configure which files that should be handled by your plugin. For example, if we had implemented an EJS handler, it could be configured as:
```yaml
    module: 'ejs-plugin',
    path: '/templates/*.ejs'
```
And in our plugin module, we could implement `handleFile`:
```javascript
export function handleFile?(contents, relative_path, path, resources) {
	// will be called for each .ejs file.
   // We can then add the generate resource:
   resources.set(relative_path, GeneratedResource);
}
```
We can also implement a handler for directories. This can be useful for implementing a handler for broader frameworks that load their own files, like Next.js or Remix, or a static file handler. HarperDB includes such a plugin for fastify's auto-loader that loads a directory of route definitions. This hook looks like: 
```javascript
export function handleDirectory?(relative_path, path, resources) {
}
```
Note that these hooks are not mutually exclusive. You can write a plugin that implements any or all of these hooks, potentially implementing a custom protocol and file handling.

## Data Source Components
Data source component implement the Resource interface to provide access to various data sources, which may be other APIs, databases, or local storage. Components that implement this interface can then be used as a source for caching tables, can be accessed as part of endpoint implementations, or even used as endpoints themselves. The Resource interface is below.

### Resource API
```typescript
export interface ResourceInterface<Key = any, Record = any> {
get?(key: Key, options?: {}): Promise<UpdatableRecord<Record>>; // or use ResourceId instead of Key
put?(key: Key, record: Record, options?: {}): void;
patch?(key: Key, record: Record, options?: {}): Record;
update?(key: Key): Promise<UpdatableRecord<Record>>;
delete?(key: Key, options?: {}): boolean;
search?(query, options?: {}): AsyncIterable<any>;
subscribe?(query, options?: {}): Subscription;
```

## Trusted/Untrusted
Plugins will also be categorized as trusted or untrusted. For some HarperDB installations, administrators may choose to constrain users to only using trusted plugins for security reasons (such multi-tenancy requirements or added defense in depth). Most installations do not impose such constraints, but this may exist in some situations.

A plugin can be automatically considered trusted if it that conforms to the requirements of [Secure EcmaScript](https://www.npmjs.com/package/ses/v/0.7.0) (basically strict mode code that doesn't modify any global objects), and either does not use any other modules, or only uses modules from other trusted plugins/components. A plugin can be marked as trusted by review by the HarperDB team as well, but developers should not expect that HarperDB can review all plugins. Untrusted plugins can access any other packages/modules, and may have many additional capabilities.