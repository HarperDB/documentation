HarperDB is more than just a database, developing database applications allows you package your schema, endpoints, and application logic together and deploy to an entire cluster of HarperDB instances, ready to scale to on-the-edge delivery of data. To create a HarperDB application, you can simple create a new empty project folder (if you plan to use git, you can initialize it).

And we go into our new application folder and start HarperDB running our new application (you don't need anything in it to get started!):
```shell
harperdb run .
```
### Create a Table
This is a database application, so naturally a first step is create a table. The easiest way to do that is through a GraphQL Schema (GraphQL Schemas are the quickest way to define tables in HarperDB, but does not mean you are required to, or even necessarily should, use GraphQL to query). Create a `schema.graphql` in your editor in the root of the application directory, and add a type for a table; the one thing we need in the table definition is a primary key:
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

HarperDB's [operation API](https://api.harperdb.io/) is also available for full administrative control over your new HarperDB instance and tables.

Next, let's add an endpoint. This will make our table available through a standard RESTful URL. To do this, we add a new query to the `Query` type. The `Query` type is the standard way to define available entry points through a GraphQL schema:
```graphql
type Query {
	Dog: Dog
}
```
This defines an entry point (and is not limited to GraphQL!) and now we have a full REST api for /dog ([http://localhost:9926/Dog](http://localhost:9926/Dog) by default. We can PUT or POST data into this table using this new path, and then GET (or DELETE) from it as well. You can even go directly to this URL in the browser (will ask you to login) to view data or modify data. If you added a record through the studio, trying visiting /Dog/<id> to see that record in your browser, for example. Or try a curl command like:
`curl http://localhost:9926/Dog/<id> --header 'Authorization: Basic YourBase64EncodedInstanceUser:Pass'`

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
	owner: String
    age: Int
	tricks: [String]
}
```
Now we can start querying. Again, we just simply access the endpoint with query parameters (basic GET requests), like:
```
http://localhost:9926/Dog/?name=Harper
http://localhost:9926/Dog/?breed=Labrador
http://localhost:9926/Dog/?breed=Husky&name=Balto&sort(name)&select(id,name,breed)
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
So far we have built an application entirely through schema configuration. However, if your application requires more custom functionality, you will probably want to employ JavaScript custom functions/modules to implement more specific features and interactions. Let's take a look at how we can use JavaScript to extend and define "resources" for custom functionality. Let's add a property to the dog records when they are returned, that includes their age in human years. In HarperDB, data is accessed through our Resource API, a standard interface to access data sources, tables, and make them available to endpoints. Database tables are Resource classes, and so extending the function of a table is as simple as extending their class.

To define as resources as endpoints, we need to create a `resources.js` module and then any exported Resource classes are added as an endpoint (this can be done in lieu of, or in addition to, the endpoints defined in the `Query` type in the schema.graphql). Resource classes have methods that correspond to standard HTTP/REST methods, like `get`, `post`, `patch`, and `put` to implement specific handling for any of these methods (for tables they all have default implementations). To do this, we import the table class, extend it, and export it:

```javascript
// resources.js:
import { tables } from 'harperdb'; // the tables holds all our database tables 
const { Dog } = tables; // get the Dog table

export class DogWithHumanAge extends Dog {
	get(property) {
		this.set('humanAge', 15 + dog.age * 5); // silly calculation of human age equivalent
		return super.get(property);
	}
}
```
And now we have a /DogWithHumanAge endpoint just like /Dog, but with the computed `humanAge` property.

Often we may want to incorporate data from other tables or data sources in your data models. Next, let's say that we want a `Breed` table that holds detailed information about each breed, and we want to add that information to the returned dog object. We might define the Breed table as (back in schema.graphql):
```graphql
type Breed @table {
    name: String @primaryKey
    description: String @indexed
    lifespan: Int
	averageWeight: Int
}
```
And next we will use this table in our `get()` method. To do this correctly, we specify that we want use this table in our resource. This is important because it ensures that we are accessing the data atomically, in a consistent snapshot across tables, it provides automatically tracking of most recently updated timestamps across resources for caching purposes, allows for sharing of contextual metadata (like user who requested the data), and ensure transactional atomicity for any writes (not needed in this get operation, but important for other operations). With our own snapshot of the breed table we can then access data from it:


resource.js:
```javascript
const { Dog, Breed } = tables; // get the Breed table too
export class DogWithBreed extends Dog {
	async get() {
		let breedDescription = await this.use(Breed).get(this.breed);
		// since breedDescription is not defined on the schema, we need to use set() to add the property 
		this.set('breedDescription', breedDescription);
		return super.get();
	}
}
```

Here we have focused on customizing how we retrieve data, but we may also want to define custom actions for writing data. While HTTP PUT method has a specific definition (replace current record, although you can override it), a common method for custom actions is through the HTTP POST method, which is handled by our Resource's post() method. Let's say that we want to define a POST handler that adds a new trick to the `tricks`  array. We might do it like this, and specify an action to be able to differentiate actions:
```javascript
export class CustomDog extends Dog {
	async post(content) {
		if (content.action === 'add-trick')
			this.tricks.push(content.trick);
	}
}
```

We can also define custom authorization capabilities. For example, we might want to specify that only the owner of a dog can make updates to a dog. We could add logic to our `post` method or `put` method to do this, but we may want to separate the logic so these methods can be called separately without authorization checks. The Resource API defines allowRead, allowUpdate, allowCreate, and allowDelete, or to easily configure individual capabilities. For example, we might do this:
```javascript
export class CustomDog extends Dog {
	allowUpdate(user) {
		return this.owner === user.username;
	}
}
```
Any methods that are not defined will fall back to HarperDB's default authorization procedure based on users' roles.

## Define Custom Data Sources
We can also directly implement the Resource class and use it to create new data sources from scratch that can be used as endpoints. Custom resources can also be used as caching sources. Let's say that we defined a `Breed` table that was a cache of information about breeds from another source. We could implement a caching table like:
```javascript
import { tables, Resource } from 'harperdb';
const { Breed } = tables; // our Breed table
class BreedSource extends Resource { // define a data source
	async get() {
		return (await this.fetch(`http://best-dog-site.com/${this.id}`)).json();
	}
}
// define that our breed table is a cache of data from the data source above, with a specified expiration
Breed.sourcedFrom(BreedSource, { expiration: 3600 }); 
```

HarperDB provides a powerful JavaScript API with significant capabilities that go well beyond a getting started guide. See our documentation for more information on using the [`harperdb` module](../reference/harperdb.md) and the [Resource interface](../reference/resource.md).


