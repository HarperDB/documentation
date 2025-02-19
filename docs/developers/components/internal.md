# Internal Components

Harper provides extended features using internal components. They do **not** need to be installed with a package manager, and simply must be specified in a config to run. These are used throughout many Harper docs, guides, and examples. Unlike external components which have their own semantic versions, internal components follow Harper's semantic version.

- [Internal Components](#internal-components)
	- [fastifyRoutes](#fastifyroutes)
	- [graphql](#graphql)
	- [graphqlSchema](#graphqlschema)
	- [jsResource](#jsresource)
	- [rest](#rest)
	- [roles](#roles)
	- [static](#static)

<!-- ## authentication -->

<!-- ## clustering -->

## fastifyRoutes

Specify custom endpoints using [Fastify](https://fastify.dev/).

This component is a [Resource Extension](./reference.md#resource-extension) and can be configured with the [`files`, `path`, and `root`](./reference.md#resource-extension-configuration) configuration options.

Complete documentation for this feature is available here: [Define Fastify Routes](https://docs.harperdb.io/docs/developers/applications/define-fastify-routes)

```yaml
fastifyRoutes:
  files: './routes/*.js'
```

## graphql

> GraphQL querying is **experimental**, and only partially implements the GraphQL Over HTTP / GraphQL specifications.

Enables GraphQL querying via a `/graphql` endpoint loosely implementing the GraphQL Over HTTP specification.

Complete documentation for this feature is available here: [GraphQL](https://docs.harperdb.io/docs/technical-details/reference/graphql)

```yaml
graphql: true
```

## graphqlSchema

Specify schemas for Harper tables and resources via GraphQL schema syntax.

This component is a [Resource Extension](./reference.md#resource-extension) and can be configured with the [`files`, `path`, and `root`](./reference.md#resource-extension-configuration) configuration options.

Complete documentation for this feature is available here: [Defining Schemas](https://docs.harperdb.io/docs/developers/applications/defining-schemas)

```yaml
graphqlSchema:
  files: './schemas.graphql'
```

## jsResource

Specify custom, JavaScript based Harper resources.

Refer to the Application [Custom Functionality with JavaScript](https://docs.harperdb.io/docs/developers/applications#custom-functionality-with-javascript) guide, or [Resource Class](https://docs.harperdb.io/docs/technical-details/reference/resource) reference documentation for more information on custom resources.

This component is a [Resource Extension](./reference.md#resource-extension) and can be configured with the [`files`, `path`, and `root`](./reference.md#resource-extension-configuration) configuration options.

```yaml
jsResource:
  files: './resource.js'
```

<!-- ## login -->

<!-- ## mqtt -->

<!-- ## operationsApi -->

<!-- ## replication -->

## rest

Enable automatic REST endpoint generation for exported resources with this component.

Complete documentation for this feature is available here: [REST](https://docs.harperdb.io/docs/developers/rest)

```yaml
rest: true
```

This component contains additional options:

To enable `Last-Modified` header support:

```yaml
rest:
  lastModified: true
```

To disable automatic WebSocket support:

```yaml
rest:
  webSocket: false
```

## roles

Specify roles for Harper tables and resources.

This component is a [Resource Extension](./reference.md#resource-extension) and can be configured with the [`files`, `path`, and `root`](./reference.md#resource-extension-configuration) configuration options.

Complete documentation for this feature is available here: [Defining Roles](https://docs.harperdb.io/docs/developers/applications/defining-roles)

```yaml
roles:
  files: './roles.yaml'
```

## static

Specify which files to server statically from the Harper HTTP endpoint. Built using the [send](https://www.npmjs.com/package/send) and [serve-static](https://www.npmjs.com/package/serve-static) modules.

This component is a [Resource Extension](./reference.md#resource-extension) and can be configured with the [`files`, `path`, and `root`](./reference.md#resource-extension-configuration) configuration options.

```yaml
static:
  files: './web/*'
```
