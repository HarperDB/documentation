# Built-In Components

Harper provides extended features using built-in components. They do **not** need to be installed with a package manager, and simply must be specified in a config to run. These are used throughout many Harper docs, guides, and examples. Unlike external components which have their own semantic versions, built-in components follow Harper's semantic version.

- [Built-In Components](#built-in-components)
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

This component is a [Resource Extension](./reference.md#resource-extension) and can be configured with the [`files` and `urlPath`](./reference.md#resource-extension-configuration) configuration options.

Complete documentation for this feature is available here: [Define Fastify Routes](https://docs.harperdb.io/docs/developers/applications/define-fastify-routes)

```yaml
fastifyRoutes:
  files: 'routes/*.js'
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

This component is a [Resource Extension](./reference.md#resource-extension) and can be configured with the [`files` and `urlPath`](./reference.md#resource-extension-configuration) configuration options.

Complete documentation for this feature is available here: [Defining Schemas](https://docs.harperdb.io/docs/developers/applications/defining-schemas)

```yaml
graphqlSchema:
  files: 'schemas.graphql'
```

## jsResource

Specify custom, JavaScript based Harper resources.

Refer to the Application [Custom Functionality with JavaScript](https://docs.harperdb.io/docs/developers/applications#custom-functionality-with-javascript) guide, or [Resource Class](https://docs.harperdb.io/docs/technical-details/reference/resource) reference documentation for more information on custom resources.

This component is a [Resource Extension](./reference.md#resource-extension) and can be configured with the [`files` and `urlPath`](./reference.md#resource-extension-configuration) configuration options.

```yaml
jsResource:
  files: 'resource.js'
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

This component is a [Resource Extension](./reference.md#resource-extension) and can be configured with the [`files` and `urlPath`](./reference.md#resource-extension-configuration) configuration options.

Complete documentation for this feature is available here: [Defining Roles](https://docs.harperdb.io/docs/developers/applications/defining-roles)

```yaml
roles:
  files: 'roles.yaml'
```

## static

Specify files to serve statically from the Harper HTTP endpoint.

Use the [Resource Extension](./reference.md#resource-extension) configuration options [`files` and `urlPath`](./reference.md#resource-extension-configuration) to specify the files to be served.

As specified by Harper's Resource Extension docs, the `files` option can be any glob pattern or a glob options object. This extension will serve all files matching the pattern, so make sure to be specific.

To serve the entire `web` directory, specify `files: 'web/**'`.

To serve only the html files within `web`, specify `files: 'web/*.html'` or `files: 'web/**/*.html'`.

The `urlPath` option is the base URL path entries will be resolved to. For example, a `urlPath: 'static'` will serve all files resolved from `files` to the URL path `localhost/static/`.

Given the `config.yaml`:

```yaml
static:
  files: 'web/*.html'
  urlPath: 'static'
```

And the file directory structure:

```
component/
├─ web/
│  ├─ index.html
│  ├─ blog.html
├─ config.yaml

```

The HTML files will be available at `localhost/static/index.html` and `localhost/static/blog.html` respectively.