# Host A Static Web UI
We’ve configured the Custom Functions server to automatically serve any static UI files it finds in a project’s **/static** folder.


In order to serve your static UI correctly, your UI project must meet the following requirements:

* Have an index file located at **/static/index.html**

* Correctly path any other files relative to index.html

* If your app makes use of client-side routing, it must have **[project_name]/static** as its base (`basename` for react-router, `base` for vue-router, etc.):

```javascript
<Router basename="/dogs/static">
    <Switch>
        <Route path="/care" component={CarePage} />
        <Route path="/feeding" component={FeedingPage} />
    </Switch>
</Router>
```


Supporting files, like css, js, and images may be located within subfolders or at the root of the **/static** folder, whichever you prefer.



If you’re using a framework (React, Vue, etc.), we recommend dropping the output of your build process (your `dist` or `build` folder) directly into your project’s **/static** folder. The output of the build process is usually optimized and compressed, and will be more performant than raw source code.