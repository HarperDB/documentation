# Getting Started

HarperDB is designed for quick and simple set up and deployment, with smart defaults that lead to fast, scalable, and distributed database applications.

You can easily create a HarperDB database in the cloud through our studio or install it locally. The quickest way to get up and running with HarperDB is with [HarperDB Cloud](../harperdb-cloud/README.md), our database-as-a-service offering. However, HarperDB is a database application platform, and to leverage HarperDB’s full application development capabilities of defining schemas, endpoints, messaging, and gateway capabilities, you may wish to install and run HarperDB locally so that you can use standard IDE tools, debugging, and version control.

### Installing a HarperDB Instance

You can simply install HarperDB with npm (or yarn, or other package managers):
```shell
npm install -g harperdb
```
Here we installed HarperDB globally (and we recommend this) to make it easy to run a single HarperDB instance with multiple projects, but you can install it locally as well.

Now we can create a new application folder:
```shell
harperdb create-app --template dog-blog
```

And we go into our new application folder and start HarperDB running our new application:
```shell
harperdb run .
```
or
```shell
npm start 
```

### Setting up a Cloud Instance
To set up a HarperDB cloud instance, simply sign up and create a new instance:
1. [Sign up for the HarperDB Studio](https://studio.harperdb.io/sign-up)
2. [Create a new HarperDB Cloud instance](../harperdb-studio/instances.md#Create-a-New-Instance)

Note that a local instance and cloud instance are not mutually exclusive. You can register you local instance in your cloud studio, and a common development flow is to develop locally and then deploy your application to your cloud instance.

HarperDB Cloud instance provisioning typically takes 5-15 minutes. You will receive an email notification when your instance is ready.

### Create a Table
This is a database application, so naturally a first step is create a table. The easiest way to do that is through a GraphQL Schema (GraphQL Schemas are the quickest way to define tables in HarperDB, but does not mean you are required to, or even necessarily should, use GraphQL to query). Open up `schema.graphql` in your editor (in the root of the application directory or from the file picker in Studio), and add a type for a table; the one thing we need in the table definition is a primary key:
```graphql
type Dog @table {
	id: ID @primaryKey
}
```
Once we save this, HarperDB will automatically reload our application, and read this schema and create the necessary tables and attributes. Not only is this an easy way to get create a table, but this configuration is included in our application to ensure that this table exists where ever (any HarperDB instance) that we deploy this application.

Next, let's add some attributes. This can be helpful to ensure the integrity of our records. Here we define that a dog post will need to have a name, breed, and an age, with appropriate types:

```graphql
type Dog @table {
	id: ID @primaryKey
    name: String
    breed: String
    age: Int
}
```
This will ensure that new records must have these properties (with these types). Note that this is does _not_ preclude the flexibility of having other properties. As a NoSQL database, HarperDB supports flexible, heterogeneous records, and you can freely add additional properties on any record. If you want to restrict the records to _only_ defined properties, you can do so by adding the `sealed` directive:
```graphql
type Dog @table @sealed {
    ...
```

If you are using the studio, we can now [add records](../harperdb-studio/manage-schemas-browse-data.md#add-a-record) to this new table in the studio, or even [upload CSV data](../harperdb-studio/manage-schemas-browse-data.md#load-csv-data). Give it a try, and add some data to your table. And the table will also be available in our application code (we will get to that!).

Next, let's add an endpoint. This will make our table available through a standard RESTful URL. To do this, we add a new query to the `Query` type. The `Query` type is the standard way to define available entry points through a GraphQL schema: 
```graphql
type Query {
	Dog: Dog
}
```
This defines an entry point (and is not limited to GraphQL!) and now we have a full REST api for /dog ([http://localhost:9926/Dog](http://localhost:9926/Dog) by default. We can PUT or POST data into this table using this new path, and then GET (or DELETE) from it as well. You can even go directly to this URL in the browser (will ask you to login) to view data or modify data. If you added a record through the studio, trying visiting /Dog/<id> to see that record in your browser, for example.

Additionally, these endpoints automatically support multiple forms of authentication like Basic, Cookie, and JWT, and content types including JSON, CBOR, MessagePack and CSV. Simply include an `Accept` header in your requests with the preferred content type. We recommend CBOR as a compact, efficient encoding with rich data types, but JSON is familiar and great for web application development. HarperDB works with other important standard HTTP headers as well, and these endpoints are even capable of caching interaction:
```javascript
Authorization: Basic <base64 encoded user:pass>
Accept: application/cbor
If-Modified-Since: Wed, 01 Mar 2023 14:45:49 GMT # browsers can automatically provide this
```

When defining endpoints, you may also want to define specific access abilities. By default, endpoints will follow HarperDB's [role-based security model](https://docs.harperdb.io/docs/security/users-and-roles). However, we can explicitly set different access levels on endpoints:
```graphql
type Query {
	Dog: Dog @allowGet(role: "public")
}
```
See the documentation on security directives for more information on different levels of access.

## Querying
Querying is extremely easy through REST endpoints, simple queries can be crafted through URL query parameters. But first, we need to define properties that we want indexed (you don't want users querying your table through un-indexed properties as it would get much slower as your database grows in size). Let's define the name and breed as searchable/indexed properties:
```graphql
type Dog @table {
	id: ID @primaryKey
    name: String @indexed
    breed: String @indexed
    age: Int
}
```
Now we can start querying. Again, we just simply access the endpoint with query parameters (basic GET requests), like:
```
http://localhost:9926/Dog?name=Harper
http://localhost:9926/Dog?breed=Labrador
http://localhost:9926/Dog?breed=Husky&name=Balto&sort(name)&select(id,name,breed)
```

Congratulations, you now have created a secure database application backend with a table, a well-defined structure, access controls, and a functional REST endpoint with query capabilities!

## Deploy
Next, if you have created this locally and have a cloud instance as well, we could deploy our local app to the cloud:
```shell
harperdb deploy .
#
npm run deploy
```

Now that you have deployed to your cloud instance, you can start scaling and expanding your application by choosing to expand your HarperDB cluster/mesh to more regions. Simply choose to add additional instances on other regions, and expand your deployed mesh. Provide your registered URL/hostname as the entry URL, and the global traffic manager/load balancer will distribute incoming requests to the appropriate server. Your application will be deployed and distributed to all the nodes in your mesh. Your application is ready to horizontally and globally scale!

## Custom Functionality with JavaScript
So far we have built an application entirely through schema configuration. However, if your application requires more custom functionality, you will probably want to employ JavaScript custom functions/modules to implement more specific features and interactions. Let's take a look at how we can use JavaScript to extend and define "resources" for custom functionality. Let's add a property to the dog records when they are returned, that includes their age in human years. In HarperDB, data is accessed through our Resource API, a standard interface to access data sources, tables, and make them available to endpoints. Database tables are Resource classes, and so extending the function of a table is as simple as extending their class. And when we export a Resource (like a table) this is automatically added as an endpoint (this can be done in lieu of, or in addition to, the endpoints defined in the `Query` type in the schema.graphql). To do this, we import the table class, extend it, and export it:

```javascript
import { tables } from 'harperdb'; // the tables holds all our database tables 
const { Dog } = tables; // get the Dog table

export class DogWithHumanAge extends Dog {
	async getById(id) {
		let dog = await super.getById(id); // get the original record
		dog = Object.assign({}, dog); // make a copy of it (we don't want to modify the original)
		dog.humanAge = 15 + dog.age * 5; // silly calculation of human age equivalent
		return dog;
	}
}
```
And now we have a /DogWithHumanAge endpoint just like /Dog, but with the computed `humanAge` property.

Resource classes have methods that correspond to all standard HTTP/REST methods, like `get`, `post`, `patch`, and `put` to implement specific handling for any of these methods (for tables they all have default implementations).

We can also directly implement the Resource class and use it to create new data sources from scratch that can be used as endpoints. Custom resources can also be used as caching sources. Let's say that we defined a `Breed` table that was a cache of information about breeds from another source. We could implement a caching table like:
```javascript
import { tables, Resource } from 'harperdb';
const { Breed } = tables; // our Breed table
class BreedSource extends Resource { // define a data source
	get(breed) {
		return this.fetch(`http://best-dog-site.com/${breed}`);
	}
}
// define that our breed table is a cache of data from the data source above, with a specified expiration
Breed.cachedFrom(BreedSource, { expiration: 3600 }); 
```

HarperDB provides a powerful JavaScript API with significant capabilities that go well beyond a getting started guide. See our documentation for more information.


### Video Tutorials

[HarperDB video tutorials are available within the HarperDB Studio](../harperdb-studio/resources.md#video-tutorials). HarperDB and the HarperDB Studio are constantly changing, as such, there may be small discrepancies in UI/UX.
