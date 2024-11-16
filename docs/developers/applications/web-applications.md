# Web Applications on HarperDB

HarperDB is an efficient, capable, and robust platform for developing web applications, with numerous capabilities designed
specifically for optimized web application delivery. In addition, there are a number of tools and frameworks that can be used
with HarperDB to create web applications with standard best-practice design and development patterns. Running these frameworks
on HarperDB can unlock tremendous scalability and performance benefits by leveraging HarperDB's built-in multi-threading,
caching, and distributed design.

## Web Application Frameworks

With built in caching mechanisms, and an easy to use JavaScript API for interacting with data, creating full-featured applications
using popular frameworks is a simple and straightforward process.

Get started today with one of our examples:

- [Next.js](https://github.com/HarperDB/nextjs-example)
- [React SSR](https://github.com/HarperDB/react-ssr-example)
- [Vue SSR](https://github.com/HarperDB/vue-ssr-example)
- [Svelte SSR](https://github.com/HarperDB/svelte-ssr-example)
- [Solid SSR](https://github.com/HarperDB/solid-ssr-example)

## Cookie Support

HarperDB includes support for authenticated sessions using cookies. This allows you to create secure, authenticated web applications
using best-practice security patterns, that allow users to login and maintain a session without any credential storage on the client side
that can be compromised. A login endpoint can be defined by exporting a resource and calling the `login` method on the request object. For example:

```javascript
export class Login extends Resource {
	async post(data) {
	  const { username, password } = data;
	  await request.login(username, password);
	  return { message: 'Logged in!' };
	}
}
```

This endpoint can be called from the client side using a standard fetch request, a cookie will be returned, and the session will be maintained by HarperDB.
This allows web applications to directly with HarperDB and database resources, without needing to go through extra layers of authentication handling.

## Browser Caching Negotiation

Browsers support caching negotiation with revalidation, which allows requests for locally cached data to be sent to servers with a tag or timestamp. HarperDB REST functionality can fully interact with these headers, and return `304 Not Modified` response based on prior `Etag` sent in headers. It is highly recommended that you utilize the [REST interface](../rest.md) for accessing tables, as it facilitates this downstream browser caching. Timestamps are recorded with all records and are then returned [as the `ETag` in the response](../rest.md#cachingconditional-requests). Utilizing this browser caching can greatly reduce the load on your server and improve the performance of your web application.

## More Resources

Make sure to check out our developer videos too:

- [Next.js on HarperDB | Step-by-Step Guide for Next Level Next.js Performance](https://youtu.be/GqLEwteFJYY)
- [Server-side Rendering (SSR) with Multi-Tier Cache Demo](https://youtu.be/L-tnBNhO9Fc)