---
title: Core Concepts
---

# Core Concepts

As you begin your journey with Harper, there are a few concepts and definitions that you should understand.

## Components

Harper components are a core Harper concept defined as flexible JavaScript based extensions of the highly extensible core Harper platform. They are executed by Harper directly and have complete access to the Harper [Global APIs](../reference/globals) (such as Resource, databases, and tables).

A key aspect to components are their extensibility; components can be built on other components. For example, a [Harper Application](../developers/applications/) is a component that uses many other components. The [application template](https://github.com/HarperDB/application-template) demonstrates many of Harper's built-in components such as [rest](../reference/components/built-in-extensions#rest) (for automatic REST endpoint generation), [graphqlSchema](../reference/components/built-in-extensions#graphqlschema) (for table schema definitions), and many more.

## Applications

Applications are a subset of components that cannot be used directly and must depend on other extensions. Examples include defining schemas (using [graphqlSchema](../reference/components/built-in-extensions#graphqlschema) built-in extension), defining custom resources (using [jsResource](../reference/components/built-in-extensions#jsresource) built-in extension), hosting static files (using [static](../reference/components/built-in-extensions#static) built-in extension), enabling REST querying of resources (using [rest](../reference/components/built-in-extensions#rest) built-in extension), and running [Next.js](https://github.com/HarperDB/nextjs), [Astro](https://github.com/HarperDB/astro), or [Apollo](https://github.com/HarperDB/apollo) applications through their respective extensions.

## Resources

Resources in Harper encompass databases, tables, and schemas that store and structure data within the system. The concept is central to Harper's data management capabilities, with custom resources being enabled by the built-in jsResource extension. Resources represent the data layer of the Harper ecosystem and provide the foundation for data operations across applications built with the platform.

## Extensions
Extensions are the building blocks of the Harper component system. Applications depend on extensions to provide the functionality the application is implementing. For example, the built-in `graphqlSchema` extension enables applications to define their databases and tables using GraphQL schemas. Furthermore, the `@harperdb/nextjs` and `@harperdb/apollo` extensions are the building blocks that provide support for building Next.js and Apollo applications.

All together, the support for implementing a feature is the extension, and the actual implementation of the feature is the application.

Extensions can also depend on other extensions. For example, the `@harperdb/apollo` extension depends on the built-in `graphqlSchema` extension to create a cache table for Apollo queries. Applications can then use the `@harperdb/apollo` extension to implement an Apollo GraphQL backend server.

## Plugins
Plugins are a new iteration of the existing extension system. They are simultaneously a simplification and an extensibility upgrade. Instead of defining multiple methods (start vs startOnMainThread, handleFile vs setupFile, handleDirectory vs setupDirectory), plugins only have to define a single handleApplication method. Plugins are experimental, and complete documentation is available on the [plugin API](../reference/components/plugins.md) page. In time we plan to deprecate the concept of extensions in favor of plugins, but for now, both are supported.



## Server

Harper is a multi-protocol server, handling incoming requests from clients and serving data from the data model. Harper supports multiple server protocols, with components for serving REST/HTTP (including Server-Sent Events), MQTT, WebSockets, and the Operations API (and custom server components can be added). Harper uses separate layers for the data model and the servers. The data model, which is defined with resources, can be exported and be used as the source for any of the servers. A single table or other resource can then be accessed and modified through REST, MQTT, SSE, or any other server protocol, for a powerful integrated model with multiple forms of access.
Networking in Harper handles different communication protocols including HTTP, WebSocket, and MQTT, as well as event-driven systems. These networking capabilities enable Harper applications to communicate with other services, receive requests, send responses, and participate in real-time data exchange. The networking layer is fundamental to Harper's functionality as a versatile application platform.

\_\_

As you go through Harper, you will pick up more knowledge of other advanced areas along the way, but with these concepts, you're now ready to create your first application.
