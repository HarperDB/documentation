# REST

HarperDB provides a powerful, efficient, and standard-compliant HTTP REST interface for interacting with tables and other resources. The REST interface is the recommended interface for data access, querying, and manipulation (for HTTP interactions), providing the best performance and HTTP interoperability with different clients.

Resources, including tables, can be configured as RESTful endpoints. The name of the query or the [exported](../applications/defining-schemas.md#export) name of the resource defines the beginning of the endpoint path. From there, a record id or query can be appended. Following uniform interface principles, HTTP methods define different actions with resources. For each method, this describes the default action.

The default path structure provides access to resources at several different levels:
* `/my-resource` - The root path of a resource usually has a description of the the resource (like a describe operation for a table).
* `/my-resource/` - The trailing slash in a path indicates it is a collection of the records. The root collection for a table represents all the records in a table, and usually you will append query parameters to query and search for more specific records.
* `/my-resource/record-id` - This resource locator represents a specific record, referenced by its id. This is typically how you can retrieve, update, and delete individual records.
* `/my-resource/record-id/` - Again, a trailing slash indicates a collection; here it is the collection of the records that begin with the specified id prefix.
* `/my-resource/record-id/with/multiple/parts` - A record id can consist of multiple path segments.

## GET
These can be used to retrieve individual records or perform searches. This handled by the Resource method `get()` (and can be overriden).

### `GET /my-resource/<record-id>`

This can be used to retrieve a record by its primary key. The response will include the record as the body.

#### Caching/Conditional Requests
A `GET` response for a record will include an encoded timestamp of the last modification to this record in the `ETag` request headers (or any accessed record when used in a custom get method). On subsequent requests, a client (that has a cached copy) may include an `If-None-Match` request header with this tag. If the record has not been updated since this date, the response will have a 304 status and no body. This facilitates significant performance gains since the response data doesn't need to serialized and transferred over the network.

### `GET /my-resource/?property=value`

This can be used to search for records by the specified property name and value. See the querying section for more information.

### `GET /my-resource/<record-id>.property`

This can be used to retrieve the specified property of the specified record.

## PUT

This can be used to update a record with a provided record. This is handled by the Resource method `put(record)`.

### `PUT /my-resource/<record-id>`

This will update the record with the specified primary key, with the contents of the record in the request body. The new record should exactly match the provided record (removing any properties that are present in the provided record).

## DELETE
This can be used to delete a record or records.
This is handled by the Resource method `delete()`.

## `DELETE /my-resource/<record-id>`

This will delete a record with the given primary key. This is handled by the Resource's `delete` method.

## `DELETE /my-resource/?property=value`

This will delete all the records that match the provided query.

## POST
This can be used to create new records and make various other types of modifications.
This is handled by the Resource method `post(data)`.

### `POST /my-resource/`
This can be used to create a new record in this table or resource.


## Querying through URL query parameters
URL query parameters provides a powerful language for specifying database queries in HarperDB. This can be used to search by a single property name and value, to find all records with provide value for the given property/attribute. It is important to note that this property must be configured to be indexed to search on it. For example:
```http
GET /my-resource/?property=value
```

We can specify multiple properties that must match:
```http
GET /my-resource/?property=value&property2=another-value
```

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
GET /product/?category=software&price=gt=100&price=lt=200
```

HarperDB has several special query functions, that use "call" syntax. These can be included in the query string as its own query entry (separated from other query conditions with an `&`). These include:
### `select(properties)`
This allows you to specify which properties should be included in the responses. This takes several forms:
* `?select(property)`: This will return the values of the specified property directly in the response (will not be put in an object).
* `?select(property1,property2)`:  This return the records as objects, but limited to the specified properties.
* `?select([property1,property2,...])`: This return the records as arrays of the property values in the specified properties.
* `?select(property1,)`: This can be used to specify that objects should be returned with the single specified property.

To get a list of product names with a category of software:
```http
GET /product/?category=software&select(name)
```

### `limit(start,end)` or `limit(end)`
Specifies a limit on the number of records returned, optionally providing a starting offset.

For example, to find the first twenty records with a `rating` greater than 3, `inStock` equal to true, only returning the `rating` and `name` properties, you could use:
```http
GET /product?rating=gt=3&inStock=true&select(rating,name)&limit(20)
```

### Content Types and Negotiation
HTTP defines a couple of headers for indicating the (preferred) content type of the request and response. The `Content-Type` request header can be used to specify the content type of the request body (for PUT, PATCH, and POST). The `Accept` request header indicates the preferred content type of the response. For general records with object structures, HarperDB supports the following content types:
`application/json` - Common format, easy to read, with great tooling support.
`application/cbor` - Recommended binary format for optimal encoding efficiency and performance.
`application/x-msgpack` - This is also an efficient format, but CBOR is preferable, as has better streaming capabilities and faster time-to-first-byte.
`text/csv` - CSV, inefficient, but good for moving data to and from a spreadsheet.

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
You can specify other content types, and the data will be stored as an record or object that hold the type and contents of the data. For example, if you do:
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
Retrieving a record with `contentType` and `data` properties will likewise return a response with the specified `Content-Type` and body.
If the `Content-Type` is not of the `text` family, the data will be treated as binary data (a Node.js `Buffer`).

You can also use `application/octet-stream` to indicate that the request body should be preserved in binary form. This also useful for uploading to a specific property:
```
PUT /my-resource/33/image
Content-Type: image/gif

...image data...
```
