# Add-ons & SDKs

HarperDB is highly extensible database application platform with support for a rich variety of composable modular components and plugins that can be used and combined to build applications and add functionality to existing applications. HarperDB Plugins and Add-Ons can be found in our [Add-Ons repositories](https://github.com/orgs/HarperDB-Add-Ons/repositories) and SDKs can be found in the [HarperDB Marketplace](../harperdb-studio/resources.md#harperdb-marketplace).

There are three general categories of components for HarperDB: Server protocol plugins that provide and define ways for clients to access data, resource plugins that handle and interpret different types of files, and consumer data sources that provide a way to access and retrieve data from other sources.

Server resource plugins implement support for different types of files that can be used as resources in applications. HarperDB includes support for using JavaScript modules and GraphQL Schemas as resources, but resource plugins may add support for different file types like HTML templates (like JSX), CSV data, and more.

Consumer data source components are used to retrieve and access data from other sources.

## Server Plugins
Server plugins can be easily be added and configured by simply adding an entry to your harperdb-config.yaml's `serverPlugins`:
```yaml
serverPlugins:
  - package: 'HarperDB-Add-Ons/package-name' # this can be any valid github or npm reference
    port: 4321
```

## Writing Plugins
You can write your own plugins to build new functionality on HarperDB. See the [writing plugins documentation](./writing-plugins.md) for more information.