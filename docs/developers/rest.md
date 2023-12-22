# REST

HarperDB provides a powerful, efficient, and standard-compliant HTTP REST interface for interacting with tables and other resources. The REST interface is the recommended interface for data access, querying, and manipulation (for HTTP interactions), providing the best performance and HTTP interoperability with different clients.

Resources, including tables, can be configured as RESTful endpoints. The name of the query or the [exported](applications/defining-schemas.md#export) name of the resource defines the beginning of the endpoint path. From there, a record id or query can be appended. Following uniform interface principles, HTTP methods define different actions with resources. For each method, this describes the default action.

The default path structure provides access to resources at several different levels:

* `/my-resource` - The root path of a resource usually has a description of the resource (like a describe operation for a table).
* `/my-resource/` - The trailing slash in a path indicates it is a collection of the records. The root collection for a table represents all the records in a table, and usually you will append query parameters to query and search for more specific records.
* `/my-resource/record-id` - This resource locator represents a specific record, referenced by its id. This is typically how you can retrieve, update, and delete individual records.
* `/my-resource/record-id/` - Again, a trailing slash indicates a collection; here it is the collection of the records that begin with the specified id prefix.
* `/my-resource/record-id/with/multiple/parts` - A record id can consist of multiple path segments.

## GET

These can be used to retrieve individual records or perform searches. This is handled by the Resource method `get()` (and can be overridden).

### `GET /my-resource/<record-id>`

This can be used to retrieve a record by its primary key. The response will include the record as the body.

#### Caching/Conditional Requests

A `GET` response for a record will include an encoded version, a timestamp of the last modification, of this record in the `ETag` request headers (or any accessed record when used in a custom get method). On subsequent requests, a client (that has a cached copy) may include an `If-None-Match` request header with this tag. If the record has not been updated since this date, the response will have a 304 status and no body. This facilitates significant performance gains since the response data doesn't need to be serialized and transferred over the network.

### `GET /my-resource/?property=value`

This can be used to search for records by the specified property name and value. See the querying section for more information.

### `GET /my-resource/<record-id>.property`

This can be used to retrieve the specified property of the specified record.

## PUT

This can be used to create or update a record with the provided object/data (similar to an "upsert") with a specified key. This is handled by the Resource method `put(record)`.

### `PUT /my-resource/<record-id>`

This will create or update the record with the URL path that maps to the record's primary key. The record will be replaced with the contents of the data in the request body. The new record will exactly match the data that was sent (this will remove any properties that were present in the previous record and not included in the body). Future GETs will return the exact data that was provided by PUT (what you PUT is what you GET). For example:

```http
PUT /MyTable/123
Content-Type: application/json

{ "name": "some data" }
```

This will create or replace the record with a primary key of "123" with the object defined by the JSON in the body. This is handled by the Resource method `put()`.

## DELETE

This can be used to delete a record or records.

## `DELETE /my-resource/<record-id>`

This will delete a record with the given primary key. This is handled by the Resource's `delete` method. For example:

```http
DELETE /MyTable/123
```

This will delete the record with the primary key of "123".

## `DELETE /my-resource/?property=value`

This will delete all the records that match the provided query.

## POST

Generally the POST method can be used for custom actions since POST has the broadest semantics. For tables that are expost\ed as endpoints, this also can be used to create new records.

### `POST /my-resource/`

This is handled by the Resource method `post(data)`, which is a good method to extend to make various other types of modifications. Also, with a table you can create a new record without specifying a primary key, for example:

````http
```http
POST /MyTable/
Content-Type: application/json

{ "name": "some data" }
````

This will create a new record, auto-assigning a primary key, which will be returned in the `Location` header.

## Querying through URL query parameters

URL query parameters provide a powerful language for specifying database queries in HarperDB. This can be used to search by a single attribute name and value, to find all records which provide value for the given property/attribute. It is important to note that this attribute must be configured to be indexed to search on it. For example:

```http
GET /my-resource/?property=value
```

We can specify multiple properties that must match:

```http
GET /my-resource/?property=value&property2=another-value
```

Note that only one of the attributes needs to be indexed for this query to execute.

We can also specify different comparators such as less than and greater than queries using [FIQL](https://datatracker.ietf.org/doc/html/draft-nottingham-atompub-fiql-00) syntax. If we want to specify records with an `age` value greater than 20:

```http
GET /my-resource/?age=gt=20
```

Or less than or equal to 20:

```http
GET /my-resource/?age=le=20
```

The comparison operators include `lt` (less than), `le` (less than or equal), `gt` (greater than), `ge` (greater than or equal), and `ne` (not equal). These comparison operators can also be combined with other query parameters with `&`. For example, if we wanted products with a category of software and price between 100 and 200, we could write:

```http
GET /Product/?category=software&price=gt=100&price=lt=200
```

You can also search for attributes that start with a specific string, by appending a `*` to the attribute value.

### Unions
Conditions can also be applied with `OR` logic, returning the union of records that match either condition. This can be specified by using the `|` operator instead of `&`. For example, to return any product a rating of `5` _or_ a `featured` attribute that is `true`, we could write:
```http
GET /Product/?rating=5|featured=true
```

### Grouping of Operators
Multiple conditions with different operators can be combined with grouping of conditions to indicate the order of operation. Grouping conditions can be done with parenthesis, with standard grouping conventions as used in query and mathematical expressions. For example, a query to find products with a rating of 5 OR a price between 100 and 200 could be written:
```http
GET /Product/?rating=5|(price=gt=100&price=lt=200)
```
Grouping conditions can also be done with square brackets, which function the same as parenthesis for grouping conditions. The advantage of using square brackets is that you can include user provided values that might have parenthesis in them, and use standard URI component encoding functionality, which will safely escape/encode square brackets, but not parenthesis. For example, if we were constructing a query for products with a rating of a 5 and matching one of a set of user provided tags, a query could be built like:
```http
GET /Product/?rating=5&[tag=fast|tag=scalable|tag=efficient]
```
And the tags could be safely generated from user inputs in a tag array like:
```javascript
let url = `/Product/?rating=5[${tags.map(encodeURIComponent).join('|')}]`
```
More complex queries can be created by further nesting groups:
```http
GET /Product/?price=lt=100|[rating=5&[tag=fast|tag=scalable|tag=efficient]&inStock=true]
```

## Query Calls

HarperDB has several special query functions that use "call" syntax. These can be included in the query string as its own query entry (separated from other query conditions with an `&`). These include:

### `select(properties)`

This function allows you to specify which properties should be included in the responses. This takes several forms:

* `?select(property)`: This will return the values of the specified property directly in the response (will not be put in an object).
* `?select(property1,property2)`: This returns the records as objects, but limited to the specified properties.
* `?select([property1,property2,...])`: This returns the records as arrays of the property values in the specified properties.
* `?select(property1,)`: This can be used to specify that objects should be returned with the single specified property.
* `?select(property{subProperty1,subProperty2{subSubProperty,..}},...)`: This can be used to specify which sub-properties should be included in nested objects and joined/references records.

To get a list of product names with a category of software:

```http
GET /Product/?category=software&select(name)
```

### `limit(start,end)` or `limit(end)`

This function specifies a limit on the number of records returned, optionally providing a starting offset.

For example, to find the first twenty records with a `rating` greater than 3, `inStock` equal to true, only returning the `rating` and `name` properties, you could use:

```http
GET /Product/?rating=gt=3&inStock=true&select(rating,name)&limit(20)
```

### `sort(property)`, `sort(+property,-property,...)`

This function allows you to indicate the sort order for the returned results. The argument for `sort()` is one or more properties that should be used to sort. If the property is prefixed with '+' or no prefix, the sort will be performed in ascending order by the indicated attribute/property. If the property is prefixed with '-', it will be sorted in descending order. If the multiple properties are specified, the sort will be performed on the first property, and for records with the same value for that property, the next property will be used to break the tie and sort results. This tie breaking will continue through any provided properties.

For example, to sort by product name (in ascending order):
```http
GET /Product?rating=gt=3&sort(+name)
```
To sort by rating in ascending order, then by price in descending order for products with the same rating:
```http
GET /Product?sort(+rating,-price)
```

## Chained Attributes and Joins
In addition to querying on top-level attributes, you can also query on chained attributes. Most importantly, this provides "join" functionality, allowing related tables to be queried and joined in the results. Chained properties are specified by using dot syntax. In order to effectively leverage join functionality, you need to define a relationship in your schema:
```graphql
type Product @table @export {
	id: ID @primaryKey
	name: String
	brandId: ID @indexed
	brand: Brand @relationship(from: "brandId")
}
type Brand @table @export {
	id: ID @primaryKey
	name: String
	products: [Product] @relationship(to: "brandId")
}
```
And then you could query a product by brand name:
```http
GET /Product/?brand.name=Microsoft
```
This will query for products for which the `brandId` references a `Brand` record with a `name` of `"Microsoft"`.

The `brand` attribute in `Product` is a "computed" attribute from the foreign key (`brandId`), for the many-to-one relationship to the `Brand`. In the schema above, we also defined the reverse one-to-many relationship from a `Brand` to a `Product`, and we could likewise query that:
```http
GET /Brand/?products.name=Keyboard
```
This would return any `Brand` with at least one product with a name `"Keyboard"`. Note, that both of these queries are effectively acting as an "INNER JOIN".

### Nested Select
Computed relationship attributes are not included by default in query results. However, we can include them by specifying them in a select:
```http
GET /Product/?brand.name=Microsoft&select(name,brand)
```
We can also do a "nested" select and specify which sub-attributes to include. For example, if we only wanted to include the name property from the brand, we could do so:
```http
GET /Product/?brand.name=Microsoft&select(name,brand{name})
```
Or to specify multiple sub-attributes, we can comma delimit them. Note that selects can "join" to another table without any constraint/filter on the related/joined table:
```http
GET /Product/?name=Keyboard&select(name,brand{name,id})
```
When selecting properties from a related table without any constraints on the related table, this effectively acts like a "LEFT JOIN" and will omit the `brand` property if the brandId is `null` or references a non-existent brand.

### Content Types and Negotiation

HTTP defines a couple of headers for indicating the (preferred) content type of the request and response. The `Content-Type` request header can be used to specify the content type of the request body (for PUT, PATCH, and POST). The `Accept` request header indicates the preferred content type of the response. For general records with object structures, HarperDB supports the following content types: `application/json` - Common format, easy to read, with great tooling support. `application/cbor` - Recommended binary format for optimal encoding efficiency and performance. `application/x-msgpack` - This is also an efficient format, but CBOR is preferable, as it has better streaming capabilities and faster time-to-first-byte. `text/csv` - CSV, lacks explicit typing, not well suited for heterogeneous data structures, but good for moving data to and from a spreadsheet.

CBOR is generally the most efficient and powerful encoding format, with the best performance, most compact encoding, and most expansive ability to encode different data types like Dates, Maps, and Sets. MessagePack is very similar and tends to have broader adoption. However, JSON can be easier to work with and may have better tooling. Also, if you are using compression for data transfer (gzip or brotli), JSON will often result in more compact compressed data due to character frequencies that better align with Huffman coding, making JSON a good choice for web applications that do not require specific data types beyond the standard JSON types.

Requesting a specific content type can also be done in a URL by suffixing the path with extension for the content type. If you want to retrieve a record in CSV format, you could request:

```http
GET /product/some-id.csv
```

Or you could request a query response in MessagePack:

```http
GET /product/.msgpack?category=software
```

However, generally it is not recommended that you use extensions in paths and it is best practice to use the `Accept` header to specify acceptable content types.

### Specific Content Objects

You can specify other content types, and the data will be stored as a record or object that holds the type and contents of the data. For example, if you do:

```
PUT /my-resource/33
Content-Type: text/calendar

BEGIN:VCALENDAR
VERSION:2.0
...
```

This would store a record equivalent to JSON:

```
{ "contentType": "text/calendar", data: "BEGIN:VCALENDAR\nVERSION:2.0\n...
```

Retrieving a record with `contentType` and `data` properties will likewise return a response with the specified `Content-Type` and body. If the `Content-Type` is not of the `text` family, the data will be treated as binary data (a Node.js `Buffer`).

You can also use `application/octet-stream` to indicate that the request body should be preserved in binary form. This also useful for uploading to a specific property:

```
PUT /my-resource/33/image
Content-Type: image/gif

...image data...
```
