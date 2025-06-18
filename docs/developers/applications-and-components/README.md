# Applications and Components

Developing modular, scalable, and feature-rich Harper applications has never been easier through the use of composable components and handlers. This section details everything a developer needs to know about building, managing, and deploying Harper applications.

The key to this system is *composability* and the three hierarchal pieces are **applications**, **components**, and **handlers**.

- **Applications** are composed of one-to-many components or handlers
- **Components** are composed of one-to-many handlers or other components
- **Handlers** are composed of zero-to-many other handlers

<!-- TODO: Insert a simple Excalidraw graphic of the hierarchy. Start with a box called Application that has some representation of one-many components and handlers. Then do the same style for components and handlers. -->

Applications and components overlap quite a bit; importantly, **all applications are components**.

All application development, management, and deployment is done through Harper's set of component APIs and operations (such as the `deploy_component` operation).

Applications are only really different from components in a conceptual sense. However, the distinction is still important for understanding how certain component and handler modules are meant to fit together.

The conceptual difference is that applications are not meant to be composed into anything else.

Consider the example of developing an Apollo GraphQL backend application on Harper. This application would, at a minimum, use the [`@harperdb/apollo`]() handler to integrate Apollo with Harper. This application can further compose other components such as the [`@harperdb/status-check`]() component for monitoring the health of the instance, and the [`@harperdb/prometheus-exporter`]() component for exporting metrics. The application can also define its own custom tables using the [`graphqlSchema`]() handler, define custom resources using the [`jsResource`]() handler, and enable automatic REST endpoint generation using the [`rest`]() handler.

All together, this application is a collection of components and handlers working together seamlessly to provide a performant, scalable, enterprise-grade backend application.

And again, the difference is really only conceptual. The [`@harperdb/status-check`]() component is composed of the [`graphqlSchema`](), [`jsResource`](), and [`rest`]() handlers. It can be deployed completely independently. So can [`@harperdb/prometheus-exporter`](). But, without anything else running on the Harper instance, there really wouldn't be any functionality. In this regard, the simplest Harper applications are generally comprised of a collection of built-in handlers (like the ones mentioned above).

Importantly, either built-in handlers (like [`graphqlSchema`](), [`jsResource`](), and [`rest`]()) or custom handlers (like [`@harperdb/apollo`]()) are truly only functional when used by a component. Visit the [Handlers](../handlers/README.md) section for more information on how to develop, manage, and use handlers as well as a comprehensive list of all built-in and officially-maintained custom handlers.