# Installing Components

Components can be easily added by adding a new top level element to your harperdb-config.yaml file.

The configuration comprises of two values:
* component name - can be anything, as long as it follows valid YAML syntax.
* package - a reference to your component. 

```yaml
myComponentName:
  package: HarperDB-Add-Ons/package
```

Under the hood HarperDB is calling npm install on all components, this means that the package value can be any valid npm 
reference such as a github repo, an npm package, a tarball, a local directory or a website.

```yaml
myGithubComponent:
  package: HarperDB-Add-Ons/package#v2.2.0 # install from github 
myNPMComponent:
  package: harperdb # install from NPM
myTarBall:
  package: /Users/harper/cool-component.tar # install from tarball
myLocal:
  package: /Users/harper/local # install from local path
myWebsite:
  package: https://harperdb-component # install from URL
```

When HarperDB is run or restarted it checks to see if there are any new or updated components.
If there are it will dynamically create a package.json file in the `rootPath` directory and call `npm install`.

NPM will install all the components in `<ROOTPATH>/node_moduels`.

The package.json file that is created will look something like this.
```json
{
  "dependencies": {
    "myGithubComponent": "github:HarperDB-Add-Ons/package#v2.2.0",
    "myNPMComponent": "npm:harperdb",
    "myTarBall": "file:/Users/harper/cool-component.tar",
    "myLocal": "file:/Users/harper/local",
    "myWebsite": "https://harperdb-component"
  }
}
```
The package prefix is automatically added, however you can manually set it in your package reference.
```yaml
myCoolComponent:
  package: file:/Users/harper/cool-component.tar
```

## Installing components using the operations API

To add a component using the operations API use the `deploy_component` operation.

```json
{
  "operation": "deploy_component",
  "project": "my-cool-component",
  "package": "HarperDB-Add-Ons/package/mycc"
}
```

Another option is to pass `deploy_component` a base64-encoded string representation of your component as a .tar file.
HarperDB can generate this via the `package_component` operation.

`bypass_config` is an optional boolean that defaults to `false`. If `true` it will not add the component to harperdb-config.yaml
and will deploy the component to your `<ROOTPATH>/components` directory.


```json
{
  "operation": "deploy_component",
  "project": "my-cool-component",
  "bypass_config": true,
  "payload": "NzY1IAAwMDAwMjQgADAwMDAwMDAwMDAwIDE0NDIwMDQ3...."
}
```