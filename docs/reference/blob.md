---
title: Blob
---

# Blob

Blobs are binary large objects that can be used to store any type of unstructured/binary data and is designed for large content. Blobs support streaming and feature better performance for content larger than about 20KB. Blobs are built off the native JavaScript `Blob` type, and HarperDB extends the native `Blob` type for integrated storage with the database. To use blobs, you would generally want to declare a field as a `Blob` type in your schema:

```graphql
type MyTable {
	id: Any! @primaryKey
	data: Blob
}
```

You can then create a blob which writes the binary data to disk, and can then be included (as a reference) in a record. For example, you can create a record with a blob like:

```javascript
let blob = await createBlob(largeBuffer);
await MyTable.put({ id: 'my-record', data: blob });
```

The `data` attribute in this example is a blob reference, and can be used like any other attribute in the record, but it is stored separately, and the data must be accessed asynchronously. You can retrieve the blob data with the standard `Blob` methods:

```javascript
let buffer = await blob.bytes();
```

If you are creating a resource method, you can return a `Response` object with a blob as the body:

```javascript
export class MyEndpoint extends MyTable {
	async get() {
		return {
			status: 200,
			headers: {},
			body: this.data, // this.data is a blob
		});
	}
}
```

One of the important characteristics of blobs is they natively support asynchronous streaming of data. This is important for both creation and retrieval of large data. When we create a blob with `createBlob`, the returned blob will create the storage entry, but the data will be streamed to storage. This means that you can create a blob from a buffer or from a stream. You can also create a record that references a blob before the blob is fully written to storage. For example, you can create a blob from a stream:

```javascript
let blob = await createBlob(stream);
// at this point the blob exists, but the data is still being written to storage
await MyTable.put({ id: 'my-record', data: blob });
// we now have written a record that references the blob
let record = await MyTable.get('my-record');
// we now have a record that gives us access to the blob. We can asynchronously access the blob's data or stream the data, and it will be available as blob the stream is written to the blob.
let stream = record.data.stream();
```

This can be powerful functionality for large media content, where content can be streamed into storage as it streamed out in real-time to users as it is received.
Alternately, we can also wait for the blob to be fully written to storage before creating a record that references the blob:

```javascript
let blob = await createBlob(stream);
// at this point the blob exists, but the data is was not been written to storage
await blob.save(MyTable);
// we now know the blob is fully written to storage
await MyTable.put({ id: 'my-record', data: blob });
```

Note that this means that blobs are _not_ atomic or [ACID](https://en.wikipedia.org/wiki/ACID) compliant; streaming functionality achieves the opposite behavior of ACID/atomic writes that would prevent access to data as it is being written.

### Error Handling

Because blobs can be streamed and referenced prior to their completion, there is a chance that an error or interruption could occur while streaming data to the blob (after the record is committed). We can create an error handler for the blob to handle the case of an interrupted blob:

```javascript
export class MyEndpoint extends MyTable {
	let blob = this.data;
	blob.on('error', () => {
		// if this was a caching table, we may want to invalidate or delete this record:
  		this.invalidate();
	});
	async get() {
		return {
			status: 200,
			headers: {},
			body: blob
		});
	}
}
```

### Blob `size`

Blobs that are created from streams may not have the standard `size` property available, because the size may not be known while data is being streamed. Consequently, the `size` property may be undefined until the size is determined. You can listen for the `size` event to be notified when the size is available:

```javascript
let record = await MyTable.get('my-record');
let blob = record.data;
blob.size // will be available if it was saved with a known size
let stream blob.stream(); // start streaming the data
if (blob.size === undefined) {
	blob.on('size', (size) => {
		// will be called once the size is available
	})
}

```

See the [configuration](../deployments/configuration) documentation for more information on configuring where blob are stored.
