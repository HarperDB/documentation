# Component Reference

The technical definition of a Harper component is fairly loose. In the absolute, simplest form, a component is any JavaScript module that is compatible with the [default component configuration](#default-component-configuration). For example, a module with a singular `resources.js` file is technically a valid component.

Harper provides many features as _built-in components_, these can be used directly without installing any other dependencies.

Other features are provided by _custom components_. These can be npm packages such as [@harperdb/nextjs](https://github.com/HarperDB/nextjs) and [@harperdb/apollo](https://github.com/HarperDB/apollo) (which are maintained by Harper), or something maintained by the community. Custom components follow the same configuration rules and use the same APIs that Harper's built-in components do. The only difference is that they must be apart of the component's dependencies.

> Documentation is available for all [built-in](./built-in.md) and [custom](./README.md#custom-components) Harper components.

<!-- TODO: add a callout to a list of third-party components here. Maybe also a link to something like an awesome-harper for community things? -->

## Component Configuration

Harper components are configured with a `config.yaml` file located in the root of the component module directory. This file is how a component configures other components it depends on. Each entry in the file starts with a component name, and then configuration values are indented below it.

```yaml
name:
  option-1: value
  option-2: value
```

It is the entry's `name` that is used for component resolution. It can be one of the [built-in components](./built-in.md), or it must match a package dependency of the component as specified by `package.json`. The [Custom Component Configuration](#custom-component-configuration) section provides more details and examples.

For some built-in components they can be configured with as little as a top-level boolean; for example, the [rest](./built-in.md#rest) extension can be enabled with just:

```yaml
rest: true
```

Other components (built-in or custom), will generally have more configuration options. Some options are ubiquitous to the Harper platform, such as the `files` and `urlPath` options for an [Extension](#resource-extension-configuration), or `package` for a [custom component](#custom-component-configuration). Additionally, [custom options](#protocol-extension-configuration) can also be defined for Extensions.

### Custom Component Configuration

Any custom component **must** be configured with the `package` option in order for Harper to load that component. When enabled, the name of package must match a dependency of the component. For example, to use the `@harperdb/nextjs` extension, it must first be included in `package.json`:

```json
{
  "dependencies": {
    "@harperdb/nextjs": "1.0.0"
  }
}
```

Then, within `config.yaml` it can be enabled and configured using:

```yaml
'@harperdb/nextjs':
  package: '@harperdb/nextjs'
  # ...
```

Since npm allows for a [variety of dependency configurations](https://docs.npmjs.com/cli/configuring-npm/package-json#dependencies), this can be used to create custom references. For example, to depend on a specific GitHub branch, first update the `package.json`:

```json
{
  "dependencies": {
    "harper-nextjs-test-feature": "HarperDB/nextjs#test-feature"
  }
}
```

And now in `config.yaml`:

```yaml
harper-nextjs-test-feature:
  package: '@harperdb/nextjs'
  files: './'
  # ...
```

### Default Component Configuration

Harper components do not need to specify a `config.yaml`. Harper uses the following default configuration to load components.

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

Refer to the [built-in components](./built-in.md) documentation for more information on these fields.

If a `config.yaml` is defined, it will **not** be merged with the default config.

## Extensions

A Harper Extension is a extensible component that is intended to be used by other components. The built-in components [graphqlSchema](./built-in.md#graphqlschema) and [jsResource](./built-in.md#jsresource) are both examples of extensions.

> As of Harper v4.6, a new Extension API has been introduced as a major overhaul of the previous API. The new API is designed to be more flexible, extensible, performant, and easier to use. It is recommended that all new extensions use the new API, and that existing extensions are migrated to the new API as soon as possible. The documentation for the legacy API is still available below in the [Legacy Extensions](#legacy-extensions) section.

Functionally, what makes an extension a component is the contents of `config.yaml`. Unlike the Application Template referenced earlier, which specified multiple components within the `config.yaml`, an extension must specify an `extensionModule` option. This must be a path to the extension module source code. The path must resolve from the root of the extension module directory.

For example, the [Harper Next.js Extension](https://github.com/HarperDB/nextjs) `config.yaml` specifies `extensionModule: ./extension.js`.

If the extension is being written in something other than JavaScript (such as TypeScript), ensure that the path resolves to the built version, (i.e. `extensionModule: ./dist/index.js`)

It is also recommended that all extensions have a `package.json` that specifies JavaScript package metadata such as name, version, type, etc. Since extensions are just JavaScript packages, they can do anything a JavaScript package can normally do. It can be written in TypeScript, and compiled to JavaScript. It can export an executable (using the [bin](https://docs.npmjs.com/cli/configuring-npm/package-json#bin) property). It can be published to npm. The possibilities are endless!

Furthermore, what defines an extension separately from a component is that it exports a `handleComponent()` method.

> An extension cannot export both `handleComponent()` and any of the Legacy extension methods. The component loader will throw an error if both are defined.

The `handleComponent()` method is executed only on worker threads during the component loading sequence. It receives a single, `scope` argument that contains all of the relevant metadata and APIs for interacting with the associated component.

The method can be async and is awaited by the component loader.

However, it is highly recommended to avoid event-loop-blocking operations within the `handleComponent()` method. See the examples section for best practices on how to use the `scope` argument effectively.

### Example: Statically hosting files

This is a functional example of how the `handleComponent()` method and `scope` argument can be used to create a simple static file server extension. This example assumes that the component has a `config.yaml` with the `files` option set to a glob pattern that matches the files to be served.

> This is a simplified form of the [static](./built-in.md#static) built-in component.

```js
export function handleComponent(scope) {
  const staticFiles = new Map();

  scope.options.on('change', (key, value, config) => {
    if (key[0] === 'files' || key[0] === 'urlPath') {
      // If the files or urlPath options change, we need to reinitialize the static files map
      staticFiles.clear();
      logger.info(`Static files reinitialized due to change in ${key.join('.')}`);
    }
  });

  scope.handleEntry((entry) => {
    if (entry.entryType === 'directory') {
      logger.info(`Cannot serve directories. Update the files option to only match files.`);
      return;
    }

    switch (entry.eventType) {
      case 'add':
      case 'change':
        // Store / Update the file contents in memory for serving
        staticFiles.set(entry.urlPath, entry.contents);
        break;
      case 'unlink':
        // Remove the file from memory when it is deleted
        staticFiles.delete(entry.urlPath);
        break;
    }
  });

  scope.server.http((req, next) => {
    if (req.method !== 'GET') return next(req);

    // Attempt to retrieve the requested static file from memory
    const staticFile = staticFiles.get(req.pathname);

    return staticFile ? {
      statusCode: 200,
      body: staticFile,
    } : {
      statusCode: 404,
      body: 'File not found',
    }
  }, { runFirst: true });
}
```

In this example, the entry handler method passed to `handleEntry` will manage the map of static files in memory using their computed `urlPath` and the `contents`. If the config file changes (and thus a new default file or url path is specified) the extension will clear the file map as well to remove artifacts. Furthermore, it uses the `server.http()` middleware to hook into the HTTP request handling.

This example is heavily simplified, but it demonstrates how the different key parts of `scope` can be used together to provide a performant and reactive application experience.

### `handleComponent(scope: Scope): void | Promise<void>`

Parameters:

- **scope** - [`Scope`](#class-scope) - An instance of the `Scope` class that provides access to the component's configuration, resources, and other APIs.

Returns: `void | Promise<void>`

This is the only method an extension module must export. It can be async and is awaited by the component loader. The `scope` argument provides access to the component's configuration, resources, and other APIs.

### Class: `Scope`

- Extends [`EventEmitter`](https://nodejs.org/docs/latest/api/events.html#class-eventemitter)

#### Event: `'close'`

Emitted after the scope is closed via the `close()` method. The scope is not 

#### Event: `'error'`

- **error** - `unknown` - The error that occurred.

#### Event: `'ready'`

Emitted when the Scope is ready to be used after loading the associated config file. It is awaited by the component loader, so it is not necessary to await it within the `handleComponent()` method.

#### `scope.close()`

Returns: `this` - The current `Scope` instance.

Closes all associated entry handlers, the associated `scope.options` instance, emits the `'close'` event, and then removes all other listeners on the instance.

#### `scope.handleEntry([files][, handler])`

Parameters:

- **files** - [`FilesOptions`](#interface-filesoptions) | [`FileAndURLPathConfig`](#interface-fileandurlpathconfig) | `onEntryEventHandler` - *optional*
- **handler** - `onEntryEventHandler` - *optional*

Returns: `EntryHandler` - An instance of the `EntryHandler` class that can be used to handle entries within the scope.

The `handleEntry()` method is the key to handling component entries. This method is used to register an entry event handler, specifically for the `EntryHandler` `'all'` event. The method signature is very flexible, and allows for the following variations:

- `scope.handleEntry()` (with no arguments) Returns the default `EntryHandler` created by the `files` and `urlPath` options in the `config.yaml`.
- `scope.handleEntry(handler)` (where `handler` is an `onEntryEventHandler`) Returns the default `EntryHandler` instance (based on the options within `config.yaml`) and uses the provided `handler` for the `'all'` event.
- `scope.handleEntry(files)` (where `files` is `FilesOptions` or `FileAndURLPathConfig`) Returns a new `EntryHandler` instance that handles the specified `files` configuration.
- `scope.handleEntry(files, handler)` (where `files` is `FilesOptions` or `FileAndURLPathConfig`, and `handler` is an `onEntryEventHandler`) Returns a new `EntryHandler` instance that handles the specified `files` configuration and uses the provided `handler` for the `'all'` event.

For example,

```js
export function handleComponent(scope) {
   // Get the default EntryHandler instance
  const defaultEntryHandler = scope.handleEntry();

  // Assign a handler for the 'all' event on the default EntryHandler
  scope.handleEntry((entry) => { /* ... */ });

  // Create a new EntryHandler for the 'src/**/*.js' files option with a custom `'all'` event handler.
  const customEntryHandler = scope.handleEntry({
    files: 'src/**/*.js',
  }, (entry) => { /* ... */ });

  // Create another custom EntryHandler for the 'src/**/*.ts' files option, but without a `'all'` event handler.
  const anotherCustomEntryHandler = scope.handleEntry({
    files: 'src/**/*.ts',
  });
}
```

And thus, if the previous code was used by a component with the following `config.yaml`:

```yaml
customExtension:
  files: 'web/**/*'
```

Then the default `EntryHandler` instances would be created to handle all entries within the `web` directory.

#### `scope.requestRestart()`

Returns: `void`

Request a Harper restart. This **does not** restart the instance immediately, but rather indicates to the user that a restart is required. This should be called when the extension cannot handle the entry event and wants to indicate to the user that the Harper instance should be restarted. 

This method is called automatically by the `scope` instance if the user has not defined an `scope.options.on('change')` handler or any event handlers for the default `EntryHandler` instance.

#### `scope.resources`

- `Map<string, Resource>` - A map of the currently loaded [Resource](../../technical-details/reference/globals.md#resource) instances.

#### `scope.server`

- `server` - A reference to the [server](../../technical-details/reference/globals.md#server) global API.

#### `scope.options`

- `OptionsWatcher`

An `OptionsWatcher` instance associated with the component using the extension. Emits `'change'` events when the respective extension part of the component's config file is modified.

### Interface: `FilesOption`

- `string` | `string[]` | [`FilesOptionsObject`](#interface-filesoptionsobject)

### Interface: `FilesOptionsObject`

- **source** - `string` | `string[]` - *required* - The glob pattern string or array of strings.
- **ignore** - `string` | `string[]` - *optional* - An array of glob patterns to exclude from matches. This is an alternative way to use negative patterns. Defaults to `[]`.

### Interface: `FileAndURLPathConfig`

- **files** - `FilesOptions` - *required* - A glob pattern string, array of glob pattern strings, or a more expressive glob options object determining the set of files and directories to be resolved for the extension.
- **urlPath** - `string` - *optional* - A base URL path to prepend to the resolved `files` entries.

### Class: `OptionsWatcher`

- Extends [`EventEmitter`](https://nodejs.org/docs/latest/api/events.html#class-eventemitter)

#### Event: `'change'`

- **key** - `string[]` - The key of the changed option split into parts (e.g. `foo.bar` becomes `['foo', 'bar']`).
- **value** - [`ConfigValue`](#interface-configvalue) - The new value of the option.
- **config** - [`ConfigValue`](#interface-configvalue) - The entire configuration object of the extension.

The `'change'` event is emitted whenever an configuration option is changed in the configuration file relative to the component and respective extension. 

Given a component using the following `config.yaml`:

```yaml
customExtension:
  files: 'web/**/*'
otherExtension:
  file: 'index.js'
```

The `scope.options` for the respective extensions `customExtension` and `otherExtension` would emit `'change'` events when the `files` options relative to them are modified.

For example, if the `files` option for `customExtension` is changed to `web/**/*.js`, the following event would be emitted _only_ within the `customExtension` scope:

```js
scope.options.on('change', (key, value, config) => {
  key // ['files']
  value // 'web/**/*.js'
  config // { files: 'web/**/*.js' }
});
```

#### Event: `'close'`

Emitted when the `OptionsWatcher` is closed via the `close()` method. The watcher is not usable after this event is emitted.

#### Event: `'error'`

- **error** - `unknown` - The error that occurred.

#### Event: `'ready'`

- **config** - [`ConfigValue`](#interface-configvalue) | `undefined` - The configuration object of the extension, if present.

This event can be emitted multiple times. It is first emitted upon the initial load, but will also be emitted after restoring a configuration file or configuration object after a `'remove'` event.

#### Event: `'remove'`

The configuration was removed. This can happen if the configuration file was deleted, the configuration object within the file is deleted, or if the configuration file fails to parse. Once restored, the `'ready'` event will be emitted again.

#### `options.close()`

Returns: `this` - The current `OptionsWatcher` instance.

Closes the options watcher, removing all listeners and preventing any further events from being emitted. The watcher is not usable after this method is called.

#### `options.get(key)`

Parameters:
- **key** - `string[]` - The key of the option to get, split into parts (e.g. `foo.bar` is represented as `['foo', 'bar']`).

Returns: [`ConfigValue`](#interface-configvalue) | `undefined`

If the config is defined it will attempt to retrieve the value of the option at the specified key. If the key does not exist, it will return `undefined`.

#### `options.getAll()`

Returns: [`ConfigValue`](#interface-configvalue) | `undefined`

Returns the entire configuration object of the extension. If the config is not defined, it will return `undefined`.

#### `options.getRoot()`

Returns: [`Config`](#interface-config) | `undefined`

Returns the root configuration object of the component. This is the entire configuration object, basically the parsed form of the `config.yaml`. If the config is not defined, it will return `undefined`.

### Interface: `Config`

- `[key: string]` [`ConfigValue`](#interface-configvalue)

An object representing the configuration of the extension.

### Interface: `ConfigValue`

- `string` | `number` | `boolean` | `null` | `undefined` | `ConfigValue[]` | [`Config`](#interface-config)

Any valid configuration value type. Essentially, the primitive types, an array of those types, or an object comprised of values of those types.

### Class: `EntryHandler`

Extends: [`EventEmitter`](https://nodejs.org/docs/latest/api/events.html#class-eventemitter)

#### Event: `'all'`

- **entry** - [`FileEntry`](#interface-fileentry) | [`DirectoryEntry`](#interface-directoryentry) - The entry that was added, changed, or removed.

The `'all'` event is emitted for all entry events, including file and directory events. This is the event that the handler method in `scope.handleEntry` is registered for. The event handler receives an `entry` object that contains the entry metadata, such as the file contents, URL path, and absolute path.

An effective pattern for this event is:

```js
async function handleComponent(scope) {
  scope.handleEntry((entry) => {
    switch(entry.eventType) {
      case 'add':
        // Handle file addition
        break;
      case 'change':
        // Handle file change
        break;
      case 'unlink':
        // Handle file deletion
        break;
      case 'addDir':
        // Handle directory addition
        break;
      case 'unlinkDir':
        // Handle directory deletion
        break;
    }
  });
}
```

#### Event: `'add'`

- **entry** - [`AddFileEvent`](#interface-addfileevent) - The file entry that was added.

The `'add'` event is emitted when a file is created (or the watcher sees it for the first time). The event handler receives an `AddFileEvent` object that contains the file contents, URL path, absolute path, and other metadata.

#### Event: `'addDir'`

- **entry** - [`AddDirEvent`](#interface-adddirevent) - The directory entry that was added.

The `'addDir'` event is emitted when a directory is created (or the watcher sees it for the first time). The event handler receives an `AddDirEvent` object that contains the URL path and absolute path of the directory.

#### Event: `'change'`

- **entry** - [`ChangeFileEvent`](#interface-changefileevent) - The file entry that was changed.

The `'change'` event is emitted when a file is modified. The event handler receives a `ChangeFileEvent` object that contains the updated file contents, URL path, absolute path, and other metadata.

#### Event: `'close'`

Emitted when the entry handler is closed via the [`entryHandler.close()`](#entryhandlerclose) method.

#### Event: `'error'`

- **error** - `unknown` - The error that occurred.

#### Event: `'ready'`

Emitted when the entry handler is ready to be used.

#### Event: `'unlink'`

- **entry** - [`UnlinkFileEvent`](#interface-unlinkfileevent) - The file entry that was deleted.

The `'unlink'` event is emitted when a file is deleted. The event handler receives an `UnlinkFileEvent` object that contains the URL path and absolute path of the deleted file.

#### Event: `'unlinkDir'`

- **entry** - [`UnlinkDirEvent`](#interface-unlinkdirevent) - The directory entry that was deleted.

The `'unlinkDir'` event is emitted when a directory is deleted. The event handler receives an `UnlinkDirEvent` object that contains the URL path and absolute path of the deleted directory.

#### `entryHandler.name`

Returns: `string`

The name of the associated component.

#### `entryHandler.directory`

Returns: `string`

The directory of the associated component. This is the root directory of the component where the `config.yaml` file is located.

#### `entryHandler.close()`

Returns: `this` - The current `EntryHandler` instance.

Closes the entry handler, removing all listeners and preventing any further events from being emitted. The handler can be started again using the [`entryHandler.update()`](#entryhandlerupdateconfig) method.

#### `entryHandler.update(config)`

Parameters:
- **config** - [`FilesOption`](#interface-filesoption) | [`FileAndURLPathConfig`](#interface-fileandurlpathconfig) - The configuration object for the entry handler.

This method will update an existing entry handler to watch new entries. It will close the underlying watcher and create a new one, but will maintain any existing listeners on the EntryHandler instance itself.

This method returns a promise associated with the ready event of the updated handler.

### Interface: `BaseEntry`

- **stats** - [`fs.Stats`](https://nodejs.org/docs/latest/api/fs.html#class-fsstats) | `undefined` - The file system stats for the entry.
- **urlPath** - `string` - The recommended URL path of the entry.
- **absolutePath** - `string` - The absolute path of the entry.

The foundational entry handle event object. The `stats` may or may not be present depending on the event, entry type, and platform.

The `urlPath` is resolved based on the configured pattern (`files:` option) combined with the optional `urlPath` option. This path is generally useful for uniquely representing the entry. It is used in the built-in components such as `jsResource` and `static`.

The `absolutePath` is the file system path for the entry.

### Interface: `FileEntry`

Extends [`BaseEntry`](#interface-baseentry)

- **contents** - `Buffer` - The contents of the file.

A specific extension of the `BaseEntry` interface representing a file entry. We automatically read the contents of the file so the user doesn't have to bother with FS operations. 

There is no `DirectoryEntry` since there is no other important metadata aside from the `BaseEntry` properties. If a user wants the contents of a directory, they should adjust the pattern to resolve files instead.

### Interface: `EntryEvent`

Extends [`BaseEntry`](#interface-baseentry)

- **eventType** - `string` - The type of entry event.
- **entryType** - `string` - The type of entry, either a file or a directory.

A general interface representing the entry handle event objects.

### Interface: `AddFileEvent`

Extends [`EntryEvent`](#interface-entryevent), [FileEntry](#interface-fileentry)

- **eventType** - `'add'`
- **entryType** - `'file'`

Event object emitted when a file is created (or the watcher sees it for the first time).

### Interface: `ChangeFileEvent`

Extends [`EntryEvent`](#interface-entryevent), [FileEntry](#interface-fileentry)

- **eventType** - `'change'`
- **entryType** - `'file'`

Event object emitted when a file is modified.

### Interface: `UnlinkFileEvent`

Extends [`EntryEvent`](#interface-entryevent), [FileEntry](#interface-fileentry)

- **eventType** - `'unlink'`
- **entryType** - `'file'`

Event object emitted when a file is deleted.

#### Interface: `FileEntryEvent`

- `AddFileEvent` | `ChangeFileEvent` | `UnlinkFileEvent`

A union type representing the file entry events. These events are emitted when a file is created, modified, or deleted. The `FileEntry` interface provides the file contents and other metadata.

### Interface: `AddDirEvent`

Extends [`EntryEvent`](#interface-entryevent)

- **eventType** - `'addDir'`
- **entryType** - `'directory'`

Event object emitted when a directory is created (or the watcher sees it for the first time).

### Interface: `UnlinkDirEvent`

Extends [`EntryEvent`](#interface-entryevent)

- **eventType** - `'unlinkDir'`
- **entryType** - `'directory'`

Event object emitted when a directory is deleted.

#### Interface: `DirectoryEntryEvent`

- `AddDirEvent` | `UnlinkDirEvent`

A union type representing the directory entry events. There are no change events for directories since they are not modified in the same way as files.

### Legacy Extensions

As of Harper v4.6, the previous extension API has been marked as **legacy**. The legacy extension API is still supported, but will likely be removed in a future major release.

There are two key types of Legacy Extensions: **Resource Extension** and **Protocol Extensions**. The key difference is a **Protocol Extensions** can return a **Resource Extension**.

Furthermore, what defines an extension separately from a component is that it leverages any of the [Resource Extension](#resource-extension-api) or [Protocol Extension](#protocol-extension-api) APIs.

#### Resource Extension

A Resource Extension is for processing a certain type of file or directory. For example, the built-in [jsResource](./built-in.md#jsresource) extension handles executing JavaScript files.

Resource Extensions are comprised of four distinct function exports, [`handleFile()`](#handlefilecontents-urlpath-absolutepath-resources-void--promisevoid), [`handleDirectory()`](#handledirectoryurlpath-absolutepath-resources-boolean--void--promiseboolean--void), [`setupFile()`](#setupfilecontents-urlpath-absolutepath-resources-void--promisevoid), and [`setupDirectory()`](#setupdirectoryurlpath-absolutepath-resources-boolean--void--promiseboolean--void). The `handleFile()` and `handleDirectory()` methods are executed on **all worker threads**, and are _executed again during restarts_. The `setupFile()` and `setupDirectory()` methods are only executed **once** on the **main thread** during the initial system start sequence.

> Keep in mind that the CLI command `harperdb restart` or CLI argument `restart=true` only restarts the worker threads. If a component is deployed using `harperdb deploy`, the code within the `setupFile()` and `setupDirectory()` methods will not be executed until the system is completely shutdown and turned back on.

Other than their execution behavior, the `handleFile()` and `setupFile()` methods, and `handleDirectory()` and `setupDirectory()` methods have identical function definitions (arguments and return value behavior).

##### Resource Extension Configuration

Any [Resource Extension](#resource-extension) can be configured with the `files` and `path` options. These options control how _files_ and _directories_ are resolved in order to be passed to the extension's `handleFile()`, `setupFile()`, `handleDirectory()`, and `setupDirectory()` methods.

> Harper relies on the [fast-glob](https://github.com/mrmlnc/fast-glob) library for glob pattern matching.

- **files** - `string | string[] | Object` - *required* - A [glob pattern](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax) string, array of glob pattern strings, or a more expressive glob options object determining the set of files and directories to be resolved for the extension. If specified as an object, the `source` property is required. By default, Harper **matches files and directories**; this is configurable using the `only` option.
  - **source** - `string | string[]` - *required* - The glob pattern string or array of strings.
  - **only** - `'all' | 'files' | 'directories'` - *optional* - The glob pattern will match only the specified entry type. Defaults to `'all'`. 
  - **ignore** - `string[]` - *optional* - An array of glob patterns to exclude from matches. This is an alternative way to use negative patterns. Defaults to `[]`.
- **urlPath** - `string` - *optional* - A base URL path to prepend to the resolved `files` entries.
  - If the value starts with `./`, such as `'./static/'`, the component name will be included in the base url path
  - If the value is `.`, then the component name will be the base url path
    - Note: `..` is an invalid pattern and will result in an error
  - Otherwise, the value here will be base url path. Leading and trailing `/` characters will be handled automatically (`/static/`, `/static`, and `static/` are all equivalent to `static`)

For example, to configure the [static](./built-in.md#static) component to serve all HTML files from the `web` source directory on the `static` URL endpoint:

```yaml
static:
  files: 'web/*.html'
  urlPath: 'static'
```

If there are files such as `web/index.html` and `web/blog.html`, they would be available at `localhost/static/index.html` and `localhost/static/blog.html` respectively.

Furthermore, if the component is located in the `test-component` directory, and the `urlPath` was set to `'./static/'` instead, then the files would be served from `localhost/test-component/static/*` instead.

The `urlPath` is optional, for example to configure the [graphqlSchema](./built-in.md#graphqlschema) component to load all schemas within the `src/schema` directory, only specifying a `files` glob pattern is required:

```yaml
graphqlSchema:
  files: 'src/schema/*.schema'
```

The `files` option also supports a more complex options object. These additional fields enable finer control of the glob pattern matching.

For example, to match files within `web`, and omit any within the `web/images` directory, the configuration could be:
```yaml
static:
  files:
    source: 'web/**/*'
    ignore: ['web/images']
```

In order to match only files:

```yaml
test-component:
  files:
    source: 'dir/**/*'
    only: 'files'
```

##### Resource Extension API

In order for an extension to be classified as a Resource Extension it must implement at least one of the `handleFile()`, `handleDirectory()`, `setupFile()`, or `setupDirectory()` methods. As a standalone extension, these methods should be named and exported directly. For example:

```js
// ESM
export function handleFile() {}
export function setupDirectory() {}

// or CJS
function handleDirectory() {}
function setupFile() {}

module.exports = { handleDirectory, setupFile }
```

When returned by a [Protocol Extension](#protocol-extension), these methods should be defined on the object instead:

```js
export function start() {
  return {
    handleFile () {}
  }
}
```

###### `handleFile(contents, urlPath, absolutePath, resources): void | Promise<void>`
###### `setupFile(contents, urlPath, absolutePath, resources): void | Promise<void>`

These methods are for processing individual files. They can be async.

> Remember!
> 
> `setupFile()` is executed **once** on the **main thread** during the main start sequence.
> 
> `handleFile()` is executed on **worker threads** and is executed again during restarts.

Parameters:

- **contents** - `Buffer` - The contents of the file
- **urlPath** - `string` - The recommended URL path of the file
- **absolutePath** - `string` - The absolute path of the file
  <!-- TODO: Replace the Object type here with a more specific type representing the resources argument of loadComponent() -->
- **resources** - `Object` - A collection of the currently loaded resources

Returns: `void | Promise<void>`

###### `handleDirectory(urlPath, absolutePath, resources): boolean | void | Promise<boolean | void>`
###### `setupDirectory(urlPath, absolutePath, resources): boolean | void | Promise<boolean | void>`

These methods are for processing directories. They can be async.

If the function returns or resolves a truthy value, then the component loading sequence will end and no other entries within the directory will be processed.

> Remember!
> 
> `setupFile()` is executed **once** on the **main thread** during the main start sequence.
> 
> `handleFile()` is executed on **worker threads** and is executed again during restarts.

Parameters:

- **urlPath** - `string` - The recommended URL path of the directory
- **absolutePath** - `string` - The absolute path of the directory
  <!-- TODO: Replace the Object type here with a more specific type representing the resources argument of loadComponent() -->
- **resources** - `Object` - A collection of the currently loaded resources

Returns: `boolean | void | Promise<boolean | void>`

#### Protocol Extension

A Protocol Extension is a more advanced form of a Resource Extension and is mainly used for implementing higher level protocols. For example, the [Harper Next.js Extension](https://github.com/HarperDB/nextjs) handles building and running a Next.js project. A Protocol Extension is particularly useful for adding custom networking handlers (see the [`server`](../../technical-details/reference/globals.md#server) global API documentation for more information).

##### Protocol Extension Configuration

In addition to the `files` and `urlPath` [Resource Extension configuration](#resource-extension-configuration) options, and the `package` [Custom Component configuration](#custom-component-configuration) option, Protocol Extensions can also specify additional configuration options. Any options added to the extension configuration (in `config.yaml`), will be passed through to the `options` object of the `start()` and `startOnMainThread()` methods.

For example, the [Harper Next.js Extension](https://github.com/HarperDB/nextjs#options) specifies multiple option that can be included in its configuration. For example, a Next.js app using `@harperdb/nextjs` may specify the following `config.yaml`:

```yaml
'@harperdb/nextjs':
  package: '@harperdb/nextjs'
  files: './'
  prebuilt: true
  dev: false
```

Many protocol extensions will use the `port` and `securePort` options for configuring networking handlers. Many of the [`server`](../../technical-details/reference/globals.md#server) global APIs accept `port` and `securePort` options, so components replicated this for simpler pass-through.

##### Protocol Extension API

A Protocol Extension is made up of two distinct methods, [`start()`](#startoptions-resourceextension--promiseresourceextension) and [`startOnMainThread()`](#startonmainthreadoptions-resourceextension--promiseresourceextension). Similar to a Resource Extension, the `start()` method is executed on _all worker threads_, and _executed again on restarts_. The `startOnMainThread()` method is **only** executed **once** during the initial system start sequence. These methods have identical `options` object parameter, and can both return a Resource Extension (i.e. an object containing one or more of the methods listed above).

###### `start(options): ResourceExtension | Promise<ResourceExtension>`
###### `startOnMainThread(options): ResourceExtension | Promise<ResourceExtension>`

Parameters:

- **options** - `Object` - An object representation of the extension's configuration options.

Returns: `Object` - An object that implements any of the [Resource Extension APIs](#resource-extension-api)
