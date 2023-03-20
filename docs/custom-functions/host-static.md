# Host A Static Web UI

The [@fastify/static](https://github.com/fastify/fastify-static) module can be utilized to serve static files.

Install the module in your project by running `npm i @fastify/static` from inside your project directory.

Register `@fastify/static` with the server and set `root` to the absolute path of the directory that contains the static files to serve.

Inside the handler `reply` is decorated with a `sendFile` function, use this function to directly server your static file.

```javascript
module.exports = async (server, { hdbCore, logger }) => {
  server.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
  })
  
  server.route({
    url: '/',
    method: 'GET',
    handler: (request, reply) => {
      reply.sendFile('index.html')
    }
  });
};
```
