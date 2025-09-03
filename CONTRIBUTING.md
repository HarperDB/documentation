# Contributing

## Prerequisites

Before contributing, please ensure you have the following installed:

- Node.js (version 22)
- npm (version 10 - included with Node.js)

## Set Up

1. Install the dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Make and test your changes
4. Format your code:

```bash
npm run format
```

5. Push changes to a branch and create a pull request

## Site Organization

This site is powered by Docusaurus and leverages the file-system based versioning capabilities of the framework.

There are two directories where actual documentation content lives.

The first, `docs/` contains the "latest" or "next" version of the documentation. We do not publish or render this directory, and the content here is meant to represent on-going development.

The second, `versioned_docs` contains all of the specific Harper version documentation organized by minor version. The latest version within this directory maps to the default path on the site. For example, if the latest version is `versioned_docs/version-4.6/` then the page https://docs.harperdb.io/docs/getting-started/first-harper-app maps to the file `site/versioned_docs/version-4.6/getting-started/first-harper-app.md`. And for the previous 4.5 version the page http://localhost:3000/docs/4.5/getting-started/first-harper-app can be found at `site/versioned_docs/version-4.5/getting-started/first-harper-app.md`.

Depending on the specific change, you may need to make updates to similar files across multiple version directories as well as the root `docs/`.

The site organization is ever evolving so make sure to revisit this file over time to stay up to date with the latest structure.
