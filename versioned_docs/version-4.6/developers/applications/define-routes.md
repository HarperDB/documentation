---
title: Define Fastify Routes
---

# Define Fastify Routes

Harper gives you a full REST API out of the box, but sometimes you want to shape requests and responses in your own way. That’s where Fastify routes come in. They let you define custom paths and behaviors while still working inside your Harper application.

## Getting Started

Fastify routes are configured in your application’s `config.yaml`. By default, the application template already includes a section like this:

```yaml
fastifyRoutes:
  files: routes/*.js # route definition modules
  path: . # base path, relative to app name
```

This tells Harper to auto-load any files you put in the `routes/` directory.

## Example: Dog Breeds Endpoint

Let’s extend our `Dog` example from earlier. We’ll add a custom route that returns all distinct breeds in our table.

Create a file `routes/breeds.js`:

```javascript
module.exports = async function (fastify, opts) {
	fastify.get('/breeds', async (request, reply) => {
		const results = await fastify.harper.table('Dog').distinct('breed');
		return results;
	});
};
```

Run your app in dev mode and visit:

```
http://localhost:9926/dogs/breeds
```

You’ll see a JSON list of breeds pulled straight from the database.

## What’s Next

This page is designed to get you started quickly. For configuration options, advanced patterns, and security details, see the [Fastify Routes Reference](../../reference/Applications/fastify-routes).
