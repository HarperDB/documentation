Resources, including tables, can be configured as RESTful endpoints. The name of the query or the exported name of the resource defines the beginning of the endpoint path. From there, a record id or query can be appended.

Following uniform interface principles, HTTP methods define different actions with resources. For each method, this describes the default action.

## GET
These can be used to retrieve individual records or perform searches. This handled by the Resource static method `get(recordId, request)`. 

### `GET /my-resource/<record-id>`

This can be used to retrieve a record by its primary key. The response will include the record as the body.

This is handled by the Resource's `getById` method.

#### Caching/Conditional Requests
A `GET` response for a record will include the data of the last modification to this record in the `Last-Modified` request header. On subsequent requests, a client (that has a cached copy) may include an `If-Modified-Since` request header with this date. If the record has not been updated since this date, the response will have a 304 status and no body. 

### `GET /my-resource/?property=value`

This can be used to search for records by the specified property name and value.

### `GET /my-resource/<record-id>/property`

This can be used to retrieve the specified property of the specified record.

## PUT

This can be used to update a record with a provided record. This is handled by the Resource `static` method `put(recordId, request)`.

### `PUT /my-resource/<record-id>`

This will update the record with the specified primary key, with the contents of the record in the request body. The new record should exactly match the provided record.

## DELETE
This can be used to delete a record or records.
This is handled by the Resource `static` method `delete(recordId, request)`.

## `DELETE /my-resource/<record-id>`

This will delete a record with the given primary key. This is handled by the Resource's `delete` method.

## `DELETE /my-resource/?property=value`

This will delete all the records that match the provided query.

## POST
This can be used to create new records and make various other types of modifications.
This is handled by the Resource `static` method `post(recordId, request)`.

### `POST /my-resource`
This can be used to create a new record in this table or resource.


### Content Types and Negotiation
HTTP defines a couple of headers for indicating the (preferred) content type of the request and response. The `Content-Type` request header can be used to specify the content type of the request body (for PUT, PATCH, and POST). The `Accept` request header indicates the preferred content type of the response. For general records with object structures, HarperDB supports the following content types:
application/json - Common format.
application/cbor - Recommended binary format for optimal encoding efficiency.
application/x-msgpack - This is also an efficient format, but CBOR is preferable.
text/csv - CSV, inefficient, but good for moving data to a spreadsheet.

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
