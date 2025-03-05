# Harper Docs

{% hint style="info" %}
[Connect with our team!](https://www.harpersystems.dev/contact)
{% endhint %}

## What is Harper? Performance, Simplicity, and Scale.

Harper is an all-in-one backend technology that fuses database technologies, caching, application hosting, and messaging functions into a single system. Unlike traditional architectures where each piece runs independently and incurs extra costs and latency from serialization and network operations between processes, Harper systems can handle workloads seamlessly and efficiently.

Harper simplifies scaling with clustering and native data replication. At scale, architectures tend to include 4 to 16 redundant, geo-distributed nodes located near every user population center. This ensures that every user experiences minimal network latency and maximum reliability in addition to the already rapid server responses.

<figure><img src="../images/harperstack.jpg" alt="Comparison of Harper&#x27;s all-in-one technology (left) versus traditional multi-system approaches (right), highlighting Harper&#x27;s speed, simplicity, and efficiency with no intermediary processes, against the latency and complexity of legacy strategies."><figcaption></figcaption></figure>

## Understanding the Paradigm Shift

Have you ever combined MongoDB with Redis, Next.js with Postgres, or perhaps Fastify with anything else? The options seem endless. It turns out that the cost of serialization, network hops, and intermediary processes in these systems adds up to 50% of the total system resources used (often more). Not to mention the hundreds of milliseconds of latency they can add.

What we realized is that networking systems together in this way is inefficient and only necessary because a fused technology did not exist. So, we built Harper, a database fused with a complete JavaScript application system. It’s not only orders of magnitude more performant than separated systems, but it’s also easier to deploy and manage at scale.

## Build With Harper

Start by running Harper locally with [npm](https://www.npmjs.com/package/harperdb) or [Docker](https://hub.docker.com/r/harperdb/harperdb).

Since technology tends to be built around the storage, processing, and transfer of data, start by [defining your schema](developers/applications/#creating-our-first-table) with the `schema.graphql` file in the root of the application directory.

If you would like to [query](developers/applications/#adding-an-endpoint) this data, add the `@export` directive to our data schema and test out the [REST](developers/rest.md), [MQTT](developers/real-time.md#mqtt), or [WebSocket](developers/real-time.md#websockets) endpoints.

When you are ready for something a little more advanced, start [customizing your application](developers/applications/#custom-functionality-with-javascript).

Finally, when it’s time to deploy, explore [replication](developers/replication/) between nodes.

If you would like to jump into the most advanced capabilities, learn about [components](developers/components/).

For a more comprehensive deep dive, take a look at our [Getting Started Guide](getting-started.md).

{% hint style="warning" %}
Need help? Please don’t hesitate to [reach out](https://www.harpersystems.dev/contact).
{% endhint %}

## Popular Use Cases

With so much functionality built in, the use cases span nearly all application systems. Some of the most popular are listed below, motivated by new levels of performance and system simplicity.

### Online Catalogs & Content Delivery

For use cases like e-commerce, real estate listing, and content-oriented sites, Harper’s breakthroughs in performance and distribution pay dividends in the form of better SEO and higher conversion rates. One common implementation leverages Harper’s [Next.js Component](https://github.com/HarperDB/nextjs) to host modern, performant frontend applications. Other implementations leverage the built-in caching layer and JavaScript application system to [server-side render pages](https://www.harpersystems.dev/development/tutorials/server-side-rendering-with-multi-tier-cache) that remain fully responsive because of built-in WebSocket connections.

### Data Delivery Networks

For use cases like real-time sports updates, flight tracking, and zero-day software update distribution, Harper is rapidly gaining popularity. Harper’s ability to receive and broadcast messages while simultaneously handling application logic and data storage streamlines operations and eliminates the need for multiple separate systems. To build an understanding of our messaging system function, refer to our [real-time documentation](developers/real-time.md).

### Edge Inference Systems

Capturing, storing, and processing real-time data streams from client and IoT systems typically requires a stack of technology. Harper’s selective data replication and self-healing connections make for an ideal multi-tier system where edge and cloud systems both run Harper, making everything more performant.

[We’re happy](https://www.harpersystems.dev/contact) to walk you through how to do this.

## Getting Started

<table data-column-title-hidden data-view="cards"><thead><tr><th></th><th></th><th data-hidden></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><a href="getting-started.md"><strong>Getting Started Guide</strong></a></td><td>Get up and running with Harper</td><td></td><td><a href="getting-started.md">getting-started.md</a></td></tr><tr><td><a href="deployments/install-harperdb/"><strong>Quick Install Harper</strong></a></td><td>Run Harper on your on hardware</td><td></td><td><a href="deployments/install-harperdb/">install-harperdb</a></td></tr><tr><td><a href="deployments/harper-cloud/"><strong>Try Harper Cloud</strong></a></td><td>Spin up an instance in minutes to get going fast</td><td></td><td><a href="deployments/harper-cloud/">harper-cloud</a></td></tr></tbody></table>

## Building with Harper

<table data-column-title-hidden data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><a href="developers/applications/"><strong>Harper Applications</strong></a></td><td>Build your a fully featured Harper Component with custom functionality</td><td><a href="developers/applications/">applications</a></td></tr><tr><td><a href="developers/rest.md"><strong>REST Queries</strong></a></td><td>The recommended HTTP interface for data access, querying, and manipulation</td><td><a href="developers/rest.md">rest.md</a></td></tr><tr><td><a href="developers/operations-api/"><strong>Operations API</strong></a></td><td>Configure, deploy, administer, and control your Harper instance</td><td><a href="developers/operations-api/">operations-api</a></td></tr></tbody></table>

<table data-card-size="large" data-view="cards"><thead><tr><th></th><th></th><th data-hidden></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><a href="developers/clustering/"><strong>Clustering &#x26; Replication</strong></a></td><td>The process of connecting multiple Harper databases together to create a database mesh network that enables users to define data replication patterns.</td><td></td><td><a href="developers/clustering/">clustering</a></td></tr><tr><td><a href="administration/harperdb-studio/"><strong>Explore the Harper Studio</strong></a></td><td>The web-based GUI for Harper. Studio enables you to administer, navigate, and monitor all of your Harper instances in a simple, user friendly interface.</td><td></td><td><a href="administration/harperdb-studio/">harperdb-studio</a></td></tr></tbody></table>
