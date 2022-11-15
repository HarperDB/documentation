# Define Helpers

Helpers are functions for use within your routes. You may want to use the same helper in multiple route files, so this allows you to write it once, and include it wherever you need it.



* To use your helpers, they must be exported from your helper file. Please use any standard export mechanisms available for your module system. We like ESM, ECMAScript Modules. Our example below exports using `module.exports`.

* To include the helper in your route file, you must import. With ESM, you'd use a `require` statement.


Below is code from the customValidation helper that is referenced in [Define Routes](https://harperdb.io/developers/documentation/custom-functions/define-routes/). It takes the request and the logger method from the route declaration, and makes a call to an external API to validate the headers. The API in this example is just returning a list of ToDos, but it could easily be replaced with a call to a real authentication service.


```javascript
const authRequest = (options) => {
   return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
         res.setEncoding('utf8');
         let responseBody = '';
         
         res.on('data', (chunk) => {
           responseBody += chunk;
         });
   
         res.on('end', () => {
           resolve(JSON.parse(responseBody));
         });
       });
   
       req.on('error', (err) => {
         reject(err);
       });
   
       req.end();
   });
};

const customValidation = async (request,logger) => {
    const options = {
        hostname: 'jsonplaceholder.typicode.com',
        port: 443,
        path: '/todos/1',
        method: 'GET',
        headers: { authorization: request.headers.authorization },
    };

    const result = await authRequest(options);
    
   /*
   *  throw an authentication error based on the response body or statusCode
   */
   if (result.error) {
      const errorString = result.error || 'Sorry, there was an error authenticating your request';
      logger.error(errorString);
      throw new Error(errorString);
   }
   return request;
};

module.exports = customValidation;
```
