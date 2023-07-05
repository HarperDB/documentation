Resources, including tables, can be configured as RESTful endpoints. The name of the query or the exported name of the resource defines the beginning of the endpoint path. From there, a record id or query can be appended. Following uniform interface principles, HTTP methods define different actions with resources. For each method, this describes the default action.

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
A `GET` response for a record will include the date of the last modification to this record in the `Last-Modified` and `ETag` request headers. On subsequent requests, a client (that has a cached copy) may include an `If-Match` request header with this date tag. If the record has not been updated since this date, the response will have a 304 status and no body. 

### `GET /my-resource/?property=value`

This can be used to search for records by the specified property name and value. See the querying section for more information.

### `GET /my-resource/<record-id>.property`

This can be used to retrieve the specified property of the specified record.

## PUT

This can be used to update a record with a provided record. This is handled by the Resource method `put(record)`.

### `PUT /my-resource/<record-id>`

This will update the record with the specified primary key, with the contents of the record in the request body. The new record should exactly match the provided record.

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
`GET /my-resource/?property=value`

We can specify multiple properties that must match:
`GET /my-resource/?property=value&property2=another-value`

We can also specify less than and greater than queries using [FIQL](https://datatracker.ietf.org/doc/html/draft-nottingham-atompub-fiql-00) syntax. If we want to specify records with an `age` value greater than 20:

`GET /my-resource?age=gt=20`

Or less than or equal to 20:

`GET /my-resource?age=le=20`

The comparison operators include `lt` (less than), `le` (less than or equal), `gt` (greater than), `ge` (greater than or equal), and `ne` (not equal).

### Content Types and Negotiation
HTTP defines a couple of headers for indicating the (preferred) content type of the request and response. The `Content-Type` request header can be used to specify the content type of the request body (for PUT, PATCH, and POST). The `Accept` request header indicates the preferred content type of the response. For general records with object structures, HarperDB supports the following content types:
`application/json` - Common format, easy to read, with great tooling support.
`application/cbor` - Recommended binary format for optimal encoding efficiency.
`application/x-msgpack` - This is also an efficient format, but CBOR is preferable.
`text/csv` - CSV, inefficient, but good for moving data to and from a spreadsheet.

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
