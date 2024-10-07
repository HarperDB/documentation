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

### Request Parameters

There are three request parameters for GraphQL queries: `query`, `operationName`, and `variables`

1. `query` - _Required_ - The string representation of the GraphQL document.
   1. Limited to [Executable Definitions](https://spec.graphql.org/October2021/#ExecutableDefinition) only.
   2. i.e. GraphQL [`query`](https://graphql.org/learn/queries/#fields) or `mutation` (coming soon) operations, and [fragments](https://graphql.org/learn/queries/#fragments).
   3. If an shorthand, unnamed, or singular named query is provided, they will be executed by default. Otherwise, if there are multiple queries, the `operationName` parameter must be used.
2. `operationName` - _Optional_ - The name of the query operation to execute if multiple queries are provided in the `query` parameter
3. `variables` - _Optional_ - A map of variable values to be used for the specified query

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
```

Furthermore, if there were multiple arguments as well as searching by a nested attribute

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