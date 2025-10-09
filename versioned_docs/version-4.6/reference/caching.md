---
title: Caching
---

# Caching

Harper includes integrated support for caching data from Harper and 3rd party sources. With built-in caching, distributed high-performance responsiveness, and low latency, Harper can function as a data caching server.

Cached data is stored in standard tables as queryable structured data. Data can be consumed in one format (e.g., JSON, CSV) and returned in another (e.g., MessagePack with selected properties). Harper also attaches timestamps and tags for caching control, supporting downstream caching.

## Table Configuration

### Defining a Cache Table

Schema example (`schema.graphql`):

```graphql
type MyCache @table(expiration: 3600) @export {
	id: ID @primaryKey
}
```

- `@table(expiration: 3600)` defines a caching table with TTL.
- Expiration is measured in seconds.
- Expiration needed for passive caches (no active invalidation).
- Expiration is optional if you provide notifications for invalidation.

### Expiration Properties

You may configure one or multiple expiration values:

- **expiration**: Time until a record is considered stale.
- **eviction**: Time after expiration before a record is removed (default = `0`).
- **scanInterval**: Interval for scanning expired records (default = `¼ * (expiration + eviction)`).

Additional expiration semantics:

- **stale expiration**: Request may trigger origin fetch; stale record may still be returned.
- **must-revalidate expiratio**n: Request must fetch from origin before returning.
- **eviction expiration**: When record is removed from the table.

## External Data Source

### Defining a Resource

Extend the `Resource` class in `resources.js`:

```javascript
class ThirdPartyAPI extends Resource {
	async get() {
		return (await fetch(`https://some-api.com/${this.getId()}`)).json();
	}
}
```

### Linking to a Cache Table

```javascript
const { MyCache } = tables;
MyCache.sourcedFrom(ThirdPartyAPI);
```

Behavior:

- Accessing `/MyCache/some-id`:
  - If cached and valid → return.
  - If missing or expired → call `get()`, fetch from source, store result, then return.

Prevents cache stampede by ensuring concurrent requests wait for a single resolution.

## Eviction and Indexing

- Eviction = removal of cached copy only.
- Evicted records remain in indexes.
- Index data is preserved as "partial" records.
- If query matches an evicted record → record is fetched on demand.

## Timestamps

```javascript
class ThirdPartyAPI extends Resource {
	async get() {
		let response = await fetch(`https://some-api.com/${this.getId()}`);
		this.getContext().lastModified = response.headers.get('Last-Modified');
		return response.json();
	}
}
```

- `context.lastModified` stores record timestamp.

## Expiration Control

Set expiration dynamically:

```javascript
class ThirdPartyAPI extends Resource {
	async get() {
		const context = this.getContext();
		let headers = new Headers();
		if (context.replacingVersion) headers.set('If-Modified-Since', new Date(context.replacingVersion).toUTCString());

		let response = await fetch(`https://some-api.com/${this.getId()}`, { headers });
		let cacheInfo = response.headers.get('Cache-Control');
		let maxAge = cacheInfo?.match(/max-age=(\d)/)?.[1];
		if (maxAge) context.expiresAt = Date.now() + maxAge * 1000;

		if (response.status === 304) return context.replacingRecord;
	}
}
```

## Active Caching and Invalidation

### Passive Cache

- Relies on expiration timers.
- May contain stale data temporarily.

### Active Cache

- Data source notifies cache of changes.
- Cache updates immediately.

### Invalidate Example

```javascript
const { MyTable } = tables;
export class MyTableEndpoint extends MyTable {
	async post(data) {
		if (data.invalidate) this.invalidate();
	}
}
```

## Subscriptions

### Implementing Subscribe

```javascript
class ThirdPartyAPI extends Resource {
  async *subscribe() {
    setInterval(async () => {
      let update = (await fetch(`https://some-api.com/latest-update`)).json();
      yield {
        type: 'put',
        id: update.id,
        value: update.value,
        timestamp: update.timestamp
      };
    }, 1000);
  }
}
```

### Supported Event Types

- `put`: Record updated (with `value`).
- `invalidate`: Record invalidated (no value sent).
- `delete`: Record deleted.
- `message`: Message passed (no record change).
- `transaction`: Batch of events (`writes` property).

### Event Object Properties

- `type`: Event type.
- `id`: Primary key of updated record.
- `value`: Updated record (for `put`, `message`).
- `writes`: Array of events (for transaction).
- `table`: Table name (within transactions).
- `timestamp`: Time of change.

### Multithreading

- By default, subscribe runs on one thread.
- Use `subscribeOnThisThread` to scale:
  ```javascript
  class ThirdPartyAPI extends Resource {
  	static subscribeOnThisThread(threadIndex) {
  		return threadIndex < 2; // run on two threads
  	}
  }
  ```

### Stream Alternative

```javascript
class ThirdPartyAPI extends Resource {
	subscribe() {
		const subscription = super.subscribe();
		setupListeningToRemoteService().on('update', (event) => {
			subscription.send(event);
		});
		return subscription;
	}
}
```

## Downstream Caching

- Use REST interface for layered caching.
- Timestamps provide `ETag` headers.
- Clients can use `If-None-Match` for 304 responses.
- Subscription-based updates propagate to downstream caches.

## Write-Through Caching

### Writing Methods

```javascript
class ThirdPartyAPI extends Resource {
	async put(data) {
		await fetch(`https://some-api.com/${this.getId()}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}
	async delete() {
		await fetch(`https://some-api.com/${this.getId()}`, { method: 'DELETE' });
	}
}
```

Writes:

- Forwarded to origin source.
- Stored in cache.

## Loading from Source in Other Methods

Use `ensureLoaded()`:

```javascript
class MyCache extends tables.MyCache {
	async post(data) {
		await this.ensuredLoaded();
		this.quantity = this.quantity - data.purchases;
	}
}
```

## Passive-Active Updates

Transactional updates using `context`:

```javascript
const { Post, Comment } = tables;
class BlogSource extends Resource {
	async get() {
		const post = await (await fetch(`https://my-blog-server/${this.getId()}`)).json();
		for (let comment of post.comments) {
			await Comment.put(comment, this);
		}
		return post;
	}
}
Post.sourcedFrom(BlogSource);
```

## Cache-Control Header

- PUT / POST:
  `Cache-Control: max-age=86400` → record cached until stale.
- GET:
  - `only-if-cached`: Return if cached, else `504`.
  - `no-store`: Do not retrieve from source.
  - `no-cache`: Do not use cached record.
  - `stale-if-error`: Allow stale if origin fails.
  - `must-revalidate`: Forbid stale return even on error.

## Caching Flow

### Read Flow

1. Create resource instance.
2. If cached:
   - If fresh → return immediately.
   - If stale → fetch from source, update cache asynchronously, return value.
3. If not cached:
   - If another request pending → wait for result.
   - Else → fetch, cache, return.

### Write-Through Flow

1. Resource instance created.
2. `put()` or `post()` recorded in transaction.
3. Transaction commits:
   - Write sent to source.
   - Source confirms.
   - Record written to cache table.
4. Response returned after local commit.
