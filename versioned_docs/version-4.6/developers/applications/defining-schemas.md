---
title: Defining Schemas
---

# Defining Schemas

Schemas in Harper are your way of telling the database what your data should look like. You write them with GraphQL type definitions, and once defined, they make sure your tables exist, have the right fields, and behave consistently. At the same time, schemas remain flexible: by default, they'll still allow extra properties unless you explicitly seal them.

Let’s see how this plays out with a single example table, and then keep evolving it as new requirements come up.

## Start with the Basics

Here’s a simple schema for a `Dog` table:

```graphql
type Dog @table {
	id: ID @primaryKey
	name: String
	breed: String
	age: Int
}
```

This tells Harper that every `Dog` record has an `id`, a `name`, a `breed`, and an `age`. The `id` is the primary key and will be generated automatically. The `name` is a string, age is an `integer`, and so on. You can still store extra fields on a dog (like `favoriteTrick`), unless you decide to lock the table down with `@sealed`.

## Make It Available as an API

Schemas don’t just describe structure, they can also expose data as endpoints. By adding `@export`, you make the `Dog` table directly accessible over REST, MQTT, or other APIs:

```graphql
type Dog @table @export(name: "dogs") {
	id: ID @primaryKey
	name: String
	breed: String
	age: Int
}
```

## Add Derived Fields

Suppose you want to keep track of adoption fees for each dog. Instead of storing the total with tax, you can compute it on the fly. That’s where `@computed` comes in:

```graphql
type Dog @table @export(name: "dogs") {
	id: ID @primaryKey
	name: String
	breed: String
	age: Int
	price: Float
	taxRate: Float
	totalPrice: Float @computed(from: "price + (price * taxRate)")
}
```

Whenever you query a dog and include `totalPrice`, Harper evaluates it based on `price` and `taxRate`. You don’t have to store or update it manually, the schema takes care of it.

## Optimize Queries with Indexes

Indexes make queries faster, especially if you’re filtering or sorting on certain fields. You’ve already seen `@primaryKey` and `@computed`; now let’s add indexing.

For example, if you want to quickly look up dogs by breed, you can add:

```graphql
type Dog @table @export(name: "dogs") {
	# ...
	breed: String @indexed
}
```

And if you want to get fancy, you can even use vector indexing for similarity search. Imagine storing embeddings of each dog’s description:

```graphql
type Dog @table @export(name: "dogs") {
	id: Long @primaryKey
	name: String
	breed: String @indexed
	description: String
	descriptionVector: [Float] @indexed(type: "HNSW", distance: "cosine")
}
```

With this, you can search for dogs that are most similar to a target vector — great for recommendation-style queries.

## Track Creation and Updates

Often you’ll want to know when a record was created or last updated. Harper can handle this automatically:

```graphql
type Dog @table @export(name: "dogs") {
	id: ID @primaryKey
	name: String
	breed: String @indexed
	createdAt: Long @createdTime
	updatedAt: Long @updatedTime
}
```

Every time a dog is added or modified, the timestamps are updated for you.

## Control Flexibility

By default, Harper lets you add extra properties beyond those in the schema. That’s useful in some cases, but sometimes you want strict control. Adding @sealed ensures no additional fields sneak in:

```graphql
type Dog @table @sealed @export(name: "dogs") {
	id: ID @primaryKey
	name: String
	breed: String @indexed
	age: Int
}
```

Now the schema is the final word on what a dog record can contain.

## Putting It All Together

Schemas let you start simple and then layer on what you need:

- a table definition with `@table`,
- external access with `@export`,
- dynamic calculations with `@computed`,
- faster queries with `@indexed`,
- built-in timestamps,
- and optional strictness with `@sealed`.

All of this happens in one place: your schema. And once it’s defined, you can even discover your exported endpoints through:

```bash
GET /openapi
```

which returns a starter OpenAPI description of your API.

👉 With just this `Dog` table, you’ve seen how Harper schemas evolve from a simple definition into a full-featured, query-optimized, externally available API. Define once, and you unlock structure, speed, and flexibility for your applications.

For more details on every directive and option, check out the [reference page on schemas](../../reference/Applications/defining-schemas).
