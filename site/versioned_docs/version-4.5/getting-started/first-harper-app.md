---
title: Create Your First Application
---

# Create Your First Application
Now that you've set up Harper, let's build a simple API. Harper lets you build powerful APIs with minimal effort. In just a few minutes, you'll have a functional REST API with automatic validation, indexing, and querying—all without writing a single line of code.

## Setup Your Project
Start by cloning the Harper application template:

```bash
git clone https:/github.com/HarperDB/application-template my-app
cd my-app
```

## Creating our first Table
The core of a Harper application is the database, so let's create a database table.

A quick and expressive way to define a table is through a [GraphQL Schema](https:/graphql.org/learn/schema). Using your editor of choice, edit the file named `schema.graphql` in the root of the application directory, `my-app`, that we created above. To create a table, we will need to add a `type` of `@table` named `Dog` (and you can remove the example table in the template):

```graphql
type Dog @table {
	# properties will go here soon
}
```

And then we'll add a primary key named `id` of type `ID`:

_(Note: A GraphQL schema is a fast method to define tables in Harper, but you are by no means required to use GraphQL to query your application, nor should you necessarily do so)_

```graphql
type Dog @table {
	id: ID @primaryKey
}
```

Now we tell Harper to run this as an application:

```bash
harperdb dev . # tell Harper cli to run current directory as an application in dev mode
```
Harper will now create the `Dog` table and its `id` attribute we just defined. Not only is this an easy way to create a table, but this schema is included in our application, which will ensure that this table exists wherever we deploy this application (to any Harper instance).

## Adding Attributes to our Table
Next, let's expand our `Dog` table by adding additional typed attributes for dog `name`, `breed` and `age`.
```graphql
type Dog @table {
	id: ID @primaryKey
	name: String
	breed: String
	age: Int
}
```

This will ensure that new records must have these properties with these types.

Because we ran `harperdb dev .` earlier (dev mode), Harper is now monitoring the contents of our application directory for changes and reloading when they occur. This means that once we save our schema file with these new attributes, Harper will automatically reload our application, read `my-app/schema.graphql` and update the `Dog` table and attributes we just defined. The dev mode will also ensure that any logging or errors are immediately displayed in the console (rather only in the log file).

As a document database, Harper supports heterogeneous records, so you can freely specify additional properties on any record. If you do want to restrict the records to only defined properties, you can always do that by adding the sealed directive:

```graphql
type Dog @table @sealed {
	id: ID @primaryKey
	name: String
	breed: String
	age: Int
	tricks: [String]
}
```

## Adding an Endpoint
Now that we have a running application with a database (with data if you imported any data), let's make this data accessible from a RESTful URL by adding an endpoint. To do this, we simply add the `@export` directive to our `Dog` table:

```graphql
type Dog @table @export {
	id: ID @primaryKey
	name: String
	breed: String
	age: Int
	tricks: [String]
}
```

By default the application HTTP server port is `9926` (this can be [configured here](../deployments/configuration#http)), so the local URL would be http:/localhost:9926/Dog/ with a full REST API. We can PUT or POST data into this table using this new path, and then GET or DELETE from it as well (you can even view data directly from the browser). If you have not added any records yet, we could use a PUT or POST to add a record. PUT is appropriate if you know the id, and POST can be used to assign an id:

```json
POST /Dog/
Content-Type: application/json

{
	"name": "Harper",
	"breed": "Labrador",
	"age": 3,
	"tricks": ["sits"]
}
```

With this a record will be created and the auto-assigned id will be available through the `Location` header. If you added a record, you can visit the path `/Dog/<id>` to view that record. Alternately, the curl command curl `http:/localhost:9926/Dog/<id>` will achieve the same thing.

## Authenticating Endpoints
Now that you've created your first API endpoints, it's important to ensure they're protected. Without authentication, anyone could potentially access, misuse, or overload your APIs, whether by accident or malicious intent. Authentication verifies who is making the request and enables you to control access based on identity, roles, or permissions. It’s a foundational step in building secure, reliable applications.

Endpoints created with Harper automatically support `Basic`, `Cookie`, and `JWT` authentication methods. See the documentation on [security](../developers/security/) for more information on different levels of access.

By default, Harper also automatically authorizes all requests from loopback IP addresses (from the same computer) as the superuser, to make it simple to interact for local development. If you want to test authentication/authorization, or enforce stricter security, you may want to disable the [`authentication.authorizeLocal` setting](../deployments/configuration#authentication).

### Content Negotiation
These endpoints support various content types, including `JSON`, `CBOR`, `MessagePack` and `CSV`. Simply include an `Accept` header in your requests with the preferred content type. We recommend `CBOR` as a compact, efficient encoding with rich data types, but `JSON` is familiar and great for web application development, and `CSV` can be useful for exporting data to spreadsheets or other processing.

Harper works with other important standard HTTP headers as well, and these endpoints are even capable of caching interaction:

```
Authorization: Basic <base64 encoded user:pass>
Accept: application/cbor
If-None-Match: "etag-id" # browsers can automatically provide this
```

## Querying

Querying your application database is straightforward and easy, as tables exported with the `@export` directive are automatically exposed via [REST endpoints](../developers/rest). Simple queries can be crafted through [URL query parameters](https:/en.wikipedia.org/wiki/Query_string).

In order to maintain reasonable query speed on a database as it grows in size, it is critical to select and establish the proper indexes. So, before we add the `@export` declaration to our `Dog` table and begin querying it, let's take a moment to target some table properties for indexing. We'll use `name` and `breed` as indexed table properties on our `Dog` table. All we need to do to accomplish this is tag these properties with the `@indexed` directive:

```graphql
type Dog @table {
  id: ID @primaryKey
  name: String @indexed
  breed: String @indexed
  owner: String
  age: Int
  tricks: [String]
}
```

And finally, we'll add the `@export` directive to expose the table as a RESTful endpoint

```graphql
type Dog @table @export {
	id: ID @primaryKey
	name: String @indexed
	breed: String @indexed
	owner: String
	age: Int
	tricks: [String]
}
```

Now we can start querying. Again, we just simply access the endpoint with query parameters (basic GET requests), like:

```
http:/localhost:9926/Dog/?name=Harper
http:/localhost:9926/Dog/?breed=Labrador
http:/localhost:9926/Dog/?breed=Husky&name=Balto&select(id,name,breed)
```

Congratulations, you now have created a secure database application backend with a table, a well-defined structure, access controls, and a functional REST endpoint with query capabilities! See the [REST documentation for more information on HTTP access](../developers/rest) and see the [Schema reference](../developers/applications/defining-schemas) for more options for defining schemas.

> Additionally, you may now use GraphQL (over HTTP) to create queries. See the documentation for that new feature [here](../../technical-details/reference/graphql).


## Key Takeaway
Harper's schema-driven approach means you can build production-ready APIs in minutes, not hours. Start with pure schema definitions to get 90% of your functionality, then add custom code only where needed. This gives you the best of both worlds: rapid development with the flexibility to customize when required.