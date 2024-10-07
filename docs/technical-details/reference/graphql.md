# GraphQL

HarperDB supports GraphQL in a variety of ways. It can be used for [defining schemas](../../developers/applications/defining-schemas.md), and for querying [Resources](./resource.md).

## Querying

Get started by setting `graphql: true` in `config.yaml`.

This automatically enables a `/graphql` endpoint that can be used for GraphQL queries.

> HarperDB's GraphQL component is inspired by the [GraphQL Over HTTP](https://graphql.github.io/graphql-over-http/draft/#) specification; however, it does not fully implement neither that specification nor the [GraphQL](https://spec.graphql.org/) specification.

Queries can either be `GET` or `POST` requests, and both follow essentially the same request format. `GET` requests must use search parameters, and `POST` requests use the request body.

For example, to request the GraphQL Query:
```graphql
query GetDogs {
	Dog {
		id
		name
	}
}
```
The `GET` request would look like:
```
curl 'http://localhost:9926/graphql?query=query+GetDogs+%7B+Dog+%7B+id+name+%7D+%7D'
```
And the `POST` request would look like:
```
curl 'http://localhost:9926/graphql' \
	-H 'Content-Type: application/json' \
	-d '{ "query": "query GetDogs { Dog { id name } } }" '
```

The HarperDB GraphQL querying system is strictly limited to HarperDB Resources. Queries can only specify HarperDB Resources and their attributes in the selection set. Queries can filter using [arguments](https://graphql.org/learn/queries/#arguments) on the top-level Resource field. HarperDB provides a short form pattern for simple queries, and a long form pattern based off of the [Resource Query API](./resource.md#query) for more complex queries.

Unlike REST queries, GraphQL queries can specify multiple resources simultaneously:

```graphql
query GetDogsAndOwners {
	Dog {
		id
		name
		breed
	}

	Owner {
		id
		name
		occupation
	}
}
```

This will return all dogs and owners in the database. And is equivalent to executing two REST queries:

```
GET /Dog/&select(id,name,breed)
# and
GET /Owner/&select(id,name,occupation)
```

### Request Parameters

There are three request parameters for GraphQL queries: `query`, `operationName`, and `variables`

1. `query` - _Required_ - The string representation of the GraphQL document.
   1. Limited to [Executable Definitions](https://spec.graphql.org/October2021/#ExecutableDefinition) only.
   2. i.e. GraphQL [`query`](https://graphql.org/learn/queries/#fields) or `mutation` (coming soon) operations, and [fragments](https://graphql.org/learn/queries/#fragments).
   3. If an shorthand, unnamed, or singular named query is provided, they will be executed by default. Otherwise, if there are multiple queries, the `operationName` parameter must be used.
2. `operationName` - _Optional_ - The name of the query operation to execute if multiple queries are provided in the `query` parameter
3. `variables` - _Optional_ - A map of variable values to be used for the specified query

### Type Checking

The HarperDB GraphQL Querying system takes many liberties from the GraphQL specification. This extends to how it handle type checking. In general, the querying system does **not** type check. HarperDB uses the `graphql` parser directly, and then performs a transformation on the resulting AST. We do not control any type checking/casting behavior of the parser, and since the execution step diverges from the spec greatly, the type checking behavior is only loosely defined.

In variable definitions, the querying system will ensure non-null values exist (and error appropriately), but it will not do any type checking of the value itself.

For example, the variable `$name: String!` states that `name` should be a non-null, string value.
- If the request does not contain the `name` variable, an error will be returned
- If the request provides `null` for the `name` variable, an error will be returned
- If the request provides any non-string value for the `name` variable, i.e. `1`, `true`, `{ foo: "bar" }`, the behavior is undefined and an error may or may not be returned.
- If the variable definition is changed to include a default value, `$name: String! = "John"`, then when omitted, `"John"` will be used.
  - If `null` is provided as the variable value, an error will still be returned.
  - If the default value does not match the type specified (i.e. `$name: String! = 0`), this is also considered undefined behavior. It may or may not fail in a variety of ways.
- Fragments will generally extend non-specified types, and the querying system will do no validity checking on them. For example, `fragment Fields on Any { ... }` is just as valid as `fragment Fields on MadeUpTypeName { ... }`. See the Fragments sections for more details.

The only notable place the querying system will do some level of type analysis is the transformation of arguments into a query.
- Objects will be transformed into properly nested attributes
- Strings and Boolean values are passed through as their AST values
- Float and Int values will be parsed using the JavaScript `parseFloat` and `parseInt` methods respectively.
- Enums are not supported.

### Fragments

The querying system loosely supports fragments. Both fragment definitions and inline fragments are supported, and are entirely a composition utility. Since this system does very little type checking, the `on Type` part of fragments is entirely pointless. Any value can be used for `Type` and it will have the same effect.

For example, in the query

```graphql
query Get {
	Dog {
		...DogFields
	}
}
```

The fragment can be defined as

```graphql
fragment DogFields on Dog {
	name
	breed
}
```

The `Dog` type in the fragment has no correlation to the `Dog` resource in the query (that correlates to the HarperDB `Dog` resource).

You can literally specify anything in the fragment and it will behave the same way:

```graphql
fragment DogFields on Any { ... } # this is recommended
fragment DogFields on Cat { ... }
fragment DogFields on Animal { ... }
fragment DogFields on LiterallyAnything { ... }
```

As an actual example, fragments should be used for composition:

```graphql
query Get {
	Dog {
		...sharedFields
		breed
	}
	Owner {
		...sharedFields
		occupation
	}
}

fragment sharedFields on Any {
	id
	name
}
```

### Short Form Querying

Any Resource attribute can be used as an argument for a query. In this short form, multiple arguments is treated as multiple equivalency conditions with the default `and` operation.

For example the following query requires an `id` variable to be provided, and the system will strictly search for a `Dog` record matching that id.

```graphql
query GetDog($id: ID!) {
	Dog(id: $id) {
		name
		breed
		owner {
			name
		}
	}
}
```

The REST equivalent would be:
```
GET /Dog/id==0&select(name,breed,owner{name})
# or
GET /Dog/0&select(name,breed,owner{name})
```


Furthermore, if there were multiple variables, arguments as well as searching by a nested attribute

```graphql
query GetDog($name: String!, $ownerName: String!) {
	Dog(name: $name, owner: { name: $ownerName }) {
		name
		breed
		owner {
			name
		}
	}
}
```

Would be equivalent to
```
GET /Dog/name==Fido&owner.name==John&select(name,breed,owner{name})
```

### Long Form Querying

> Coming soon!

### Mutations

> Coming soon!

### Subscriptions

> Coming soon!

### Directives

> Coming soon!