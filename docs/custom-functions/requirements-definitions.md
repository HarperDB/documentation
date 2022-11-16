# Requirements And Definitions
Before you get started with Custom Functions, here’s a primer on the basic configuration and the structure of a Custom Functions Project.

## Configuration
Custom Functions is enabled by default. If you wish to manage Custom Functions directly, you will find the relevant configuration parameters in your [configuration file](https://harperdb.io/docs/reference/configuration-file/). The available settings are listed below:



* **customFunctions.enabled**
   A boolean value that tells HarperDB to start the Custom Functions server. Set it to **true** to enable custom functions and **false** to disable.

* **customFunctions.network.port**
   This is the port HarperDB will use to start a standalone Fastify Server dedicated to serving your Custom Functions’ routes.

* **customFunctions.root**
  This is the root directory where your Custom Functions projects and their files will live. By default, it’s in your \<ROOTPATH>, but you can locate it anywhere--in a developer folder next to your other development projects, for example.


## Project Structure
**project folder**

The name of the folder that holds your project files serves as the root prefix for all the routes you create.  All routes created in the **dogs** project folder will have a URL like this: **https://my-server-url.com:9926/dogs/my/route**. As such, it’s important that any project folders you create avoid any characters that aren’t URL-friendly. You should avoid URL delimiters in your folder names.


**/routes folder**

Files in the **routes** folder define the requests that your Custom Functions server will handle. They are [standard Fastify route declarations](https://www.fastify.io/docs/latest/Routes/), so if you’re familiar with them, you should be up and running in no time. The default components for a route are the url, method, preValidation, and handler.

```javascript
module.exports = async (server, { hdbCore, logger }) => {
    server.route({
        url: '/',
        method: 'POST',
        preValidation: hdbCore.preValidation,
        handler: hdbCore.request,
    });
}
```

**/helpers folder**

These files are JavaScript modules that you can use in your handlers, or for custom `preValidation` hooks. Examples include calls to third party Authentication services, filters for results of calls to HarperDB, and custom error responses. As modules, you can use standard import and export functionality.

```javascript
"use strict";

const dbFilter = (databaseResultsArray) => databaseResultsArray.filter((result) => result.showToApi === true);

module.exports = dbFilter;
```

**/static folder**

If you’d like to serve your visitors a static website, you can place the html and supporting files into a directory called **static**. The directory must have an **index.html** file, and can have as many supporting resources as are necessary in whatever subfolder structure you prefer within that **static** directory.