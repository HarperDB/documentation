---
title: Caching
---
# Caching

In the [quickstart guide](../../getting-started/first-harper-app.md), you built a working Dog API in just a few minutes. That API is now ready to store and query data. But what happens when your application also needs to pull in data from other systems—say, a third-party service that provides dog breed information?

If you hit that external API every time a user makes a request, you’ll pay the cost in speed, reliability, and maybe even money. That’s where Harper’s built-in caching comes in. Harper lets you cache external data in the same tables and APIs you’re already using, so your app feels fast, reliable, and cost-efficient without you writing glue code.

## Step 1: Add a Cache Table
Caching in Harper works just like creating any other table. Open up your `schema.graphql` and add a cache table alongside your `Dog` table:

```graphql
type BreedCache @table(expiration: 3600) @export {
  id: ID @primaryKey
}
```
Here, `expiration: 3600` means cached entries expire after an hour. Harper will automatically evict old data and refresh it when needed. By exporting this table, you instantly get a REST API for it at `http://localhost:9926/BreedCache/`.

## Step 2: Connect to an External Source
Now let’s say you want to enrich your Dog records with breed details from an external API. Instead of hitting that API directly every time, we’ll connect it to the `BreedCache` table.

Open `resources.js` and define a resource:

```javascript
class BreedAPI extends Resource {
  async get() {
    return (await fetch(`https://dog-api.com/${this.getId()}`)).json();
  }
}

const { BreedCache } = tables;
BreedCache.sourcedFrom(BreedAPI);
```

That’s it. When your app calls /BreedCache/husky, Harper will:

- Check if “husky” is already in the cache.
- If not (or if it’s expired), fetch it from https://dog-api.com/husky.
- Store it in BreedCache so the next request is instant.

Harper even prevents “cache stampedes”: if multiple users request the same breed at the same time, only one fetch goes out to the source.

## Step 3: Use the Cache in Your API
Now you can combine your Dogs with cached breed info. For example, imagine you added a “breed” attribute to your Dog table earlier:

```graphql
type Dog @table @export {
  id: ID @primaryKey
  name: String
  breed: String @indexed
  age: Int
}
```

You can enrich a Dog API request by querying both Dog and BreedCache. The Dog table is your source of truth, while BreedCache ensures you never block on slow or flaky external APIs.

## Step 4: Keep Your Cache Fresh
By default, caches are passive: they refresh only when requested and expired. Sometimes that’s fine. Other times, you’ll want them to stay in sync as soon as data changes at the source. Harper supports both:

- Passive caching: great for data that doesn’t change often (like dog breed characteristics).
- Active caching: connect to a subscription or webhook so Harper gets notified when the source changes. Your cache updates immediately, and your users always see fresh data.

You can even invalidate records manually, or implement write-through caching so updates flow both ways.

## Step 5: Layer Caches for Your Users

Caching doesn’t stop at Harper. Because every Harper cache table is a REST API, your clients can cache responses downstream too. Harper automatically tags responses with ETag headers so browsers or edge caches can hold onto data longer. That means your app is fast all the way down—from the source, to Harper, to the client.

## Why This Matters

With Harper, caching is not a bolt-on. You don’t need Redis, a CDN, and custom scripts to glue everything together. You just define a schema and a source, and Harper handles:

- Expiration and eviction policies
- Preventing cache stampedes
- Active vs passive updates
- Downstream caching with HTTP headers

In minutes, you’ve gone from “slow and costly API calls” to a fully distributed, low-latency, schema-driven cache layer.

## Next Steps

Try expanding your Dog API with a BreedCache table and connect it to a real dog breed service. Then experiment with expiration times, or try active caching if your data source supports subscriptions.

👉 See the Schema reference for all caching directives and to explore how to build custom caching strategies.