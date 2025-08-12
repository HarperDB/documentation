---
title: Harper Concepts
---

# Harper Concepts

As you begin your journey with Harper, there are a few concepts and definitions that you should understand.

## Components

Harper components are a core Harper concept defined as flexible JavaScript based extensions of the highly extensible core Harper platform. They are executed by Harper directly and have complete access to the Harper [Global APIs](../technical-details/reference/globals) (such as Resource, databases, and tables).

A key aspect to components are their extensibility; components can be built on other components. For example, a [Harper Application](../developers/applications/) is a component that uses many other components. The [application template](https://github.com/HarperDB/application-template) demonstrates many of Harper's built-in components such as [rest](../technical-details/reference/components/built-in-extensions#rest) (for automatic REST endpoint generation), [graphqlSchema](../technical-details/reference/components/built-in-extensions#graphqlschema) (for table schema definitions), and many more.

## Applications

Applications are a subset of components that cannot be used directly and must depend on other extensions. Examples include defining schemas (using [graphqlSchema](../technical-details/reference/components/built-in-extensions#graphqlschema) built-in extension), defining custom resources (using [jsResource](../technical-details/reference/components/built-in-extensions#jsresource) built-in extension), hosting static files (using [static](../technical-details/reference/components/built-in-extensions#static) built-in extension), enabling REST querying of resources (using [rest](../technical-details/reference/components/built-in-extensions#rest) built-in extension), and running [Next.js](https://github.com/HarperDB/nextjs), [Astro](https://github.com/HarperDB/astro), or [Apollo](https://github.com/HarperDB/apollo) applications through their respective extensions.

## Resources

Resources in Harper encompass databases, tables, and schemas that store and structure data within the system. The concept is central to Harper's data management capabilities, with custom resources being enabled by the built-in jsResource extension. Resources represent the data layer of the Harper ecosystem and provide the foundation for data operations across applications built with the platform.

## Server

Harper is a multi-protocol server, handling incoming requests from clients and serving data from the data model. Harper supports multiple server protocols, with components for serving REST/HTTP (including Server-Sent Events), MQTT, WebSockets, and the Operations API (and custom server components can be added). Harper uses separate layers for the data model and the servers. The data model, which is defined with resources, can be exported and be used as the source for any of the servers. A single table or other resource can then be accessed and modified through REST, MQTT, SSE, or any other server protocol, for a powerful integrated model with multiple forms of access.
Networking in Harper handles different communication protocols including HTTP, WebSocket, and MQTT, as well as event-driven systems. These networking capabilities enable Harper applications to communicate with other services, receive requests, send responses, and participate in real-time data exchange. The networking layer is fundamental to Harper's functionality as a versatile application platform.

\_\_

As you go through Harper, you will pick up more knowledge of other advanced areas along the way, but with these concepts, you're now ready to create your first application.
