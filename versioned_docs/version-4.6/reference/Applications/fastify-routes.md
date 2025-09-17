---
title: Fastify Routes
---

# Fastify Routes

This page documents the configuration, behavior, and advanced usage of Fastify routes in Harper applications. If you are looking for a quick introduction and example, start with [Define Fastify Routes](../../developers/applications/define-routes).

## Configuration

Fastify routes are enabled in your application’s `config.yaml`.

```yaml
fastifyRoutes:
  files: routes/*.js # Location of route definition modules
  path: . # Base path for mounting routes
```

**Options**

- `files`: Glob pattern specifying the location of route definition modules. Default: `routes/*.js`.
- `path`: The base path for mounted routes, relative to the application name.
  - Default: `.` (results in `[ProjectName]/[Route]`)
  - Set to `/` to mount directly at the root.

## Route Definition

Route modules are standard [Fastify auto-loader](https://github.com/fastify/fastify-autoload) plugins. Each file exports an async function that registers one or more routes.

```javascript
module.exports = async function (fastify, opts) {
	fastify.get('/example', async (request, reply) => {
		return { hello: 'world' };
	});
};
```

**Parameters**
Each route handler has access to:

- `request`: The incoming Fastify request object (query params, body, headers, etc.).
- `reply`: The response object, used to send back data or set headers.
- `fastify.harper`: The Harper database client, allowing direct table queries inside handlers.

## URL Structure

By default, routes are mounted as:

```
[Instance URL]:[Port]/[ProjectName]/[RoutePath]
```

Examples:

- Project: `dogs`
- Route file: `routes/breeds.js`
- Handler path: `/breeds`

Resulting URL:

```bash
http://localhost:9926/dogs/breeds
```

If `path: /` is configured, routes are mounted at the root:

```bash
http://localhost:9926/breeds
```

## Examples

**Simple Route**

```javascript
module.exports = async function (fastify, opts) {
	fastify.get('/ping', async (request, reply) => {
		return { pong: true };
	});
};
```

**Querying Harper Tables**

```javascript
module.exports = async function (fastify, opts) {
	fastify.get('/dogs', async (request, reply) => {
		return fastify.harper.table('Dog').all();
	});
};
```

**Route With Params**

```javascript
module.exports = async function (fastify, opts) {
	fastify.get('/dogs/:id', async (request, reply) => {
		const { id } = request.params;
		return fastify.harper.table('Dog').get(id);
	});
};
```

## Advanced Usage

- Custom Middleware: Add validation, logging, or transformations by attaching hooks or decorators.
- Multiple Routes per File: A single route file can register multiple endpoints.
- Fastify Plugins: You can use the entire Fastify ecosystem (e.g., CORS, rate limiting).

## Security Considerations

Fastify routes do not automatically apply Harper’s table-level authentication and authorization. You should explicitly enforce access controls.

Example using JWT:

```javascript
fastify.get('/secure', { preValidation: [fastify.authenticate] }, async (request, reply) => {
	return { secret: true };
});
```

For built-in authentication methods, see [Security](../../developers/security/).

## Error Handling

Use Fastify’s reply API for consistent error responses:

```javascript
fastify.get('/error', async (request, reply) => {
	reply.code(400).send({ error: 'Bad Request' });
});
```
