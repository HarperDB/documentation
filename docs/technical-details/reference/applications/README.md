# Applications

Components are a fundamental aspect to the Harper platform. They enable developers to extend the core platform with new functionality, whether that be through applications or extensions. This document details the technical differences between application and extensions, how to configure them, and a comprehensive reference of the Extension API.

Remember, extensions included within Harper are referred to and documented as [built-in extensions](./built-in.md). Any other component is referred to as a **custom component**.

> The full list of officially maintained, open source custom components is available in the [Custom Components](./README.md#custom-components) section.

## Component Configuration

There is a key technical differentiation between applications and extensions.

In the absolute, simplest form, an application is any JavaScript package that is compatible with the [default application configuration](#default-application-configuration). For example, a package with a singular `resources.js` file is technically a valid component (and will be handled by the [`jsResource`](./built-in.md#jsresource) built-in extension automatically). Generally, most applications will define a `config.yaml` file that specifies the various extensions it depends on.

Extensions _require_ a `config.yaml` file with a singular, `extensionModule` option. This is further defined in the [Extension API](#extension-api) section below.

The `config.yaml` file must be located in the root of the component package directory. 

For applications, each entry in the file starts with an extension name, and then configuration values are indented below it.

```yaml
name:
  option-1: value
  option-2: value
```

It is the entry's `name` that is used for component resolution. It can be one of the [built-in extensions](./built-in.md), or it must match a package dependency of the component as specified by `package.json`. The [Custom Component Configuration](#custom-component-configuration) section provides more details and examples.

Some extensions can be configured with as little as a top-level boolean. For example, the [rest](./built-in.md#rest) extension can be enabled with just:

```yaml
rest: true
```

Other extensions will generally have more configuration options. Some options are ubiquitous to the Harper platform, such as the `files` and `urlPath` options for an [Extension](#resource-extension-configuration), or `package` for a [custom component](#custom-component-configuration). Additionally, [custom options](#protocol-extension-configuration) can also be defined for Extensions.

### Custom Extension Configuration

Any **custom** extension **must** be configured with the `package` option in order for Harper to load that extension. The name and `package` value correspond to the key/value pair in the applications' `package.json` dependency list. For example, to use the `@harperdb/nextjs` extension, it should be defined within `config.yaml` as:

```yaml
'@harperdb/nextjs':
  package: '^1.0.0'
  # ...
```

And within `package.json` as:

```json
{
  "dependencies": {
	"@harperdb/nextjs": "^1.0.0"
  }
}
```

Since npm allows for a [variety of dependency configuration values](https://docs.npmjs.com/cli/configuring-npm/package-json#dependencies), this is not limited to just a version string. You may use GitHub references, tarballs, or even local paths. Just ensure to update the value in _both_ the `package.json` and `config.yaml` files.

> We are actively working to improve this developer experience, and will soon support a more streamlined version management approach.

For example, to update the `@harperdb/nextjs` extension to a custom branch:

```yaml
'@harperdb/nextjs':
  package: 'HarperDB/nextjs#test-feature'
  # ...
```


```json
{
  "dependencies": {
	"@harperdb/nextjs": "HarperDB/nextjs#test-feature"
  }
}
```

### Default Application Configuration

Applications do not _need_ to specify a `config.yaml`. Harper uses the following default configuration to load components.

```yaml
rest: true
graphql: true
graphqlSchema:
  files: '*.graphql'
roles:
  files: 'roles.yaml'
jsResource:
  files: 'resources.js'
fastifyRoutes:
  files: 'routes/*.js'
  urlPath: '.'
static:
  files: 'web/**'
```

Refer to the [built-in extensions](./built-in.md) documentation for more information on these fields.

If a `config.yaml` is defined, it will **not** be merged with the default config.