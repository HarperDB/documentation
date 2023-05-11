# Add-ons & SDKs

HarperDB is highly extensible database application platform with support for a rich variety of composable modular components and plugins that can be used and combined to build applications and add functionality to existing applications. HarperDB tools, plugins, and add-ons can be found in a few places:

* [SDK libraries](https://studio.harperdb.io/resources/sdks/active) are available for connecting to HarperDB from different languages.
* [Drivers](https://studio.harperdb.io/resources/drivers) are available for connecting to HarperDB from different products and tools.
* [HarperDB-Add-Ons repositories](https://github.com/orgs/HarperDB-Add-Ons/repositories) lists various templates and add-ons for HarperDB.
* [HarperDB repositories](https://github.com/orgs/HarperDB-Add-Ons/repositories) includes additional tools for HarperDB.
* You can also [search github.com for ever-growing list of projects that use, or work with, HarperDB](https://github.com/search?q=harperdb&type=repositories)
* [Google Data Studio](google-data-studio.md) is a visualization tool for building charts and tables from HarperDB data. 

## Components/Plugins
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