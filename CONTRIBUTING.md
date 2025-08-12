# Contributing

## Prerequisites

Before contributing, please ensure you have the following installed:

- Node.js (version 22)
- npm (version 10 - included with Node.js)

## Set Up

1. Install the dependencies:

```bash
npm install
npm run site:install
```

2. Start the development server:

```bash
npm run site:dev
```

3. Make and test your changes
4. Format your code:

```bash
npm run format
```

5. Push changes to a branch and create a pull request

## Site Organization

This site is powered by Docusaurus and leverages the file-system based versioning capabilities of the framework.

All published content is available within the `site/` directory. Specific pages are organized into subdirectories based on their version.

The root of the site is mapped to the `site/versioned_docs/version-4.6` directory.

So for example the page https://docs.harperdb.io/docs/getting-started/first-harper-app maps to the file `site/versioned_docs/version-4.6/getting-started/first-harper-app.md`. And then the previous 4.5 version of it can be found at `site/versioned_docs/version-4.5/getting-started/first-harper-app.md`. Not all files exist across all versions, and generally you only need to update content across versions 4.6 and 4.5 unless you're specifically targeting an older version.

The root `docs/` directory contains doc files intended for the next version release so depending on your intended changes you may want to copy them to the respective files within that directory too.

The site organization is ever evolving so make sure to revisit this file over time to stay up to date with the latest structure.
