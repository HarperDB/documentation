# Components

Harper is not just a database, but also a highly extensible, JavaScript application platform built on a concept called **components**. Harper components are many things, and at the highest level are defined as JavaScript based _extensions_ of the core Harper platform. They are executed by Harper directly; thus, have complete access to the Harper Global APIs (such as `Resource`, `databases`, and `tables`).

> See the complete [Global APIs](../../technical-details/reference/globals.md) documentation for more information.

A key aspect to components are their extensibility; components can be built on other components. For example, a [Harper Application]() is a component that uses many other components. The [application template]() demonstrates many of Harper's internal components such as `rest` (for automatic REST endpoint generation), `graphqlSchema` (for table schema definitions), and many more.

> Documentation for all internal Harper components can be found [here](#internal-components).

The technical definition of a Harper component is fairly loose. In the absolute, simplest form, a component is any JavaScript module that is compatible with the [default component configuration](#default-component-configuration). For example, a module with a singular `resources.js` file is technically a valid component.

## Component Configuration

Harper components are configured with a **config.yaml** file located in the root of the component module directory. This file is how a component configures other components it depends on. Each entry in the file starts with a component name, and then configuration values are indented below it.

The following properties are available for **all** components.

- `files`
- `path`
- `root`
- `package`

Additional properties can also be configured. For example, the [Harper Next.js Extension](https://github.com/HarperDB/nextjs#options) specifies multiple option that can be included in its configuration. For example, a Next.js app using `@harperdb/nextjs` may specify the following **config.yaml**:

```yaml
'@harperdb/nextjs':
  package: '@harperdb/nextjs'
  files: '/*'
  prebuilt: true
  dev: false
```

### Default Component Configuration

Harper components do not need to specify a **config.yaml**. Harper uses the following default configuration to load components.

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
  path: '.'
static:
  files: 'web/**'
```

If a **config.yaml** is defined, it will **not** be merged with the default config.

## Extensions

Just like Harper provides certain features as internal components, users can create new Harper features by developing custom Components, also known as **extensions**.

A Harper Extension is a extensible Component that is intended to be used by other Components. The internal Components `graphqlSchema` and `jsResource` are both examples of Extensions.

There are two key types of Harper Extensions, **Resource Extension** and **Protocol Extensions**. The key difference is a **Protocol Extensions** can return a **Resource Extension**.

Functionally, what makes an Extension a Component is the contents of `config.yaml`. Unlike the Application Template referenced earlier, which specified multiple Components within the _config.yaml_, an Extension will only specify `extensionModule: <pathToExtension>`. The path must resolve from the root of the Extension module directory.

For example, the [Harper Next.js Extension]() _config.yaml_ specifies `extensionModule: ./extension.js`.

It is also recommended that all Extensions have a _package.json_ that specifies JavaScript package metadata such as name, version, etc. Since Extensions are just JavaScript packages, they can do anything a JavaScript package can normally do. It can be written in TypeScript, and compiled to JavaScript. It can export an executable (using the [bin]() property). It can be published to npm. The possibilities are endless!

<!-- TODO: Write section here about Worker Threads -->

### Resource Extension

A Resource Extension is for processing a certain type of file or directory. For example, the internal [jsResource]() extension handles executing JavaScript files.

These Extensions are comprised of four distinct function exports, `handleFile()`, `handleDirectory()`, `setupFile()`, and `setupDirectory()`. The `handleFile()` and `handleDirectory()` methods are executed on **all worker threads**, and are _executed again during restarts_. The `setupFile()` and `setupDirectory()` methods are only executed **once** on the **main thread** during the initial system start sequence.

> Keep in mind that the CLI command `harperdb restart` or CLI argument `restart=true` only restarts the worker threads. If a Component is deployed using `harperdb deploy`, the code within the `setup{File|Directory}()` methods will not be executed until the system is completely shutdown and turned back on.

Other than their execution behavior, the `{handle|setup}File()` and `{handle|setup}Directory()` methods have identical function definitions (arguments and return value behavior).

#### `{handle|setup}File(contents, urlPath, path, resources): void | Promise<void>`

This method is for processing individual files. It can be async.

> Remember!
> 
> `setupFile()` is executed **once** on the **main thread** during the main start sequence.
> 
> `handleFile()` is executed on **worker threads** and is executed again during restarts.

Parameters:

- **contents** - `Buffer` - The contents of the file
- **urlPath** - `String` - ???
- **path** - `String` - The relative path of the file
  <!-- TODO: Replace the Object type here with a more specific type representing the resources argument of loadComponent() -->
- **resources** - `Object` - A collection of the currently loaded resources

Returns: `void | Promise<void>`

#### `{handle|setup}Directory(urlPath, path, resources): boolean | void | Promise<boolean | void>`

This method is for processing directories. It can be async.

If this function returns or resolves a truthy value, then the Component loading sequence will end and no other entries within the directory will be processed.

> Remember!
> 
> `setupFile()` is executed **once** on the **main thread** during the main start sequence.
> 
> `handleFile()` is executed on **worker threads** and is executed again during restarts.

Parameters:

- **urlPath** - `String` - ???
- **path** - `String` - The relative path of the directory
  <!-- TODO: Replace the Object type here with a more specific type representing the resources argument of loadComponent() -->
- **resources** - `Object` - A collection of the currently loaded resources

Returns: `boolean | void | Promise<boolean | void>`

### Protocol Extension

A Protocol Extension is a more advanced form of a Resource Extension and is mainly used for implementing higher level protocols. For example, the [Harper Next.js Extension]() handles building and running a Next.js project. A Protocol Extension is particularly useful for adding custom networking handlers. See the [`server`]() documentation for more information.

A Protocol Extension is made up of two distinct methods, `start()` and `startOnMainThread()`. Similar to a Resource Extension, the `start()` method is executed on _all worker threads_, and executed again on restarts. The `startOnMainThread()` method is only executed once during the initial system start sequence. These methods have identical `options` object parameter, and can both return a Resource Extension (i.e. an object containing one or more of the methods listed above).

#### `{start|startOnMainThread}({ server, ensureTable, port, securePort, resources, })`

Parameters:

- **options** - `ProtocolOptions`

Returns: `ResourceExtension`

## Internal Components

### rest
### graphql
### graphqlSchema
### roles
### jsResource
### fastifyRoutes
### static
