# Components

Harper **components** extend the core platform to provide additional features. Components are classified as either **applications** or **extensions**, and mimic a caller/callee relationship. Like a function, extensions are useless on their own, and are only functional when used by an application.

Applications can be as simple as defining table schemas, or as complex as a full Next.js application.

Extensions are custom feature implementations using the [Harper Extension API](./reference.md#extension-api).

Most applications will use multiple extensions. For example, the [application template](https://github.com/HarperDB/application-template) demonstrates many of Harper's built-in extensions such as `rest` (for automatic REST endpoint generation), `graphqlSchema` (for table schema definitions), and much more.

Harper provides many features through [built-in extensions](./built-in.md). Review the linked documentation page for a comprehensive list of all built-in extensions, such as `rest`, `graphqlSchema`, and `jsResource`.

## Custom Components

The following list is all of Harper's officially maintained, open source, custom components. They are all available on npm and GitHub.

### Applications

- [`@harperdb/status-check`](https://github.com/HarperDB/status-check)
- [`@harperdb/prometheus-exporter`](https://github.com/HarperDB/prometheus-exporter)
- [`@harperdb/acl-connect`](https://github.com/HarperDB/acl-connect)

### Extensions

- [`@harperdb/nextjs`](https://github.com/HarperDB/nextjs)
- [`@harperdb/apollo`](https://github.com/HarperDB/apollo)
- [`@harperdb/astro`](https://github.com/HarperDB/astro)
