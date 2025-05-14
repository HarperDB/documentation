# Harper Concepts

As you begin your journey with Harper, there are a few concepts and definitions that you should understand.

## Components
Harper components are a core Harper concept defined as flexible JavaScript based extensions of the highly extensible core Harper platform. They are executed by Harper directly and have complete access to the Harper [Global APIs](https://docs.harperdb.io/docs/technical-details/reference/globals) (such as Resource, databases, and tables).

A key aspect to components are their extensibility; components can be built on other components. For example, a [Harper Application](https://docs.harperdb.io/docs/developers/applications) is a component that uses many other components. The [application template](https://github.com/HarperDB/application-template) demonstrates many of Harper's built-in components such as [rest](https://docs.harperdb.io/docs/developers/components/built-in#rest) (for automatic REST endpoint generation), graphqlSchema (for table schema definitions), and many more.

## Applications
Applications are a subset of components that cannot be used directly and must depend on other extensions. Examples include defining schemas (using [graphqlSchema](https://docs.harperdb.io/docs/developers/components/built-in#graphqlschema) built-in extension), defining custom resources (using jsResource built-in extension), hosting static files (using static built-in extension), enabling REST querying of resources (using rest built-in extension), and running Next.js, Astro, or Apollo applications through their respective extensions.

## Extensions
A Harper Extension is an extensible component that is intended to be used by other components. The built-in components [graphqlSchema](https://docs.harperdb.io/docs/developers/components/built-in#graphqlschema) and [jsResource](https://docs.harperdb.io/docs/developers/components/built-in#jsresource) are both examples of extensions.

For now, there are two key types of Harper Extensions: Resource Extension and Protocol Extensions. The key difference is that a Protocol Extensions can return a Resource Extension.

### Resource Extension
A resource extension is for processing file and directory entries.  For example, the built-in jsResource extension handles executing JavaScript files, and the built-in graphql extension handles processing graphql schema files defining Harper resources.

### Protocol Extension
A Protocol Extension is a more advanced form of a Resource Extension and is mainly used for implementing higher level protocols. For example, the [Harper Next.js Extension](https://github.com/HarperDB/nextjs) handles building and running a Next.js project by hooking the Next.js server into Harper's underlying HTTP and WS middleware system. A Protocol Extension is particularly useful for adding custom networking handlers (see the [server](https://docs.harperdb.io/docs/technical-details/reference/globals#server) global API documentation for more information).

## Resources
Resources in Harper encompass databases, tables, and schemas that store and structure data within the system. The concept is central to Harper's data management capabilities, with custom resources being enabled by the built-in jsResource extension. Resources represent the data layer of the Harper ecosystem and provide the foundation for data operations across applications built with the platform.

## Networking
Networking in Harper handles different communication protocols including HTTP, WebSocket, and MQTT, as well as event-driven systems. These networking capabilities enable Harper applications to communicate with other services, receive requests, send responses, and participate in real-time data exchange. The networking layer is fundamental to Harper's functionality as a versatile application platform.

## Authentication
Authentication in Harper provides security mechanisms to verify user identities before granting access to system resources and functionality. This concept is essential for securing Harper deployments and ensuring that only authorized users can access sensitive data or perform privileged operations within applications built on the Harper platform.

## Roles
Roles in Harper define permissions and access levels for different users within the system. They work in conjunction with authentication to create a comprehensive security model that controls what authenticated users can do once they access the system. Roles help implement principle of least privilege and segregation of duties within Harper applications.

__

As you go through Harper, you will pick up more knowledge of other advanced areas along the way, but with these concepts, you're now ready to create your first application.