# Managing Components

Managing components on on Harper is easy. There are many ways to manage components with Harper, and some are limited to local development as compared to a hosted, managed Harper instance. This page will cover the recommended methods of developing, installing, deploying, and running Harper components.

## Local Development

Harper is designed to be simple to run locally. Generally, Harper should be installed locally on a machine using a global package manager install (i.e. `npm i -g harperdb`).

> Before continuing, ensure Harper is installed and the `harperdb` CLI is available. For more information, review the [installation guide](../../deployments/install-harperdb/README.md).

When developing a component locally there are a number of ways to run it on Harper.

The quickest way to run a component is by using the `dev` or `run` commands (i.e. `harperdb run .`) within the component directory. Stop execution by sending a SIGINT (generally CTRL/CMD+C) signal to the process.

Alternatively, to mimic interfacing with a hosted Harper instance, use operation commands instead.

1. Start up Harper with `harperdb start`
2. "Deploy" the component to the local instance by executing `harperdb deploy_component project=<name>` from within the component directory
   1. Make sure to omit the `target` option so that it _deploys_ to the Harper instance running locally
3. Depending on the needs of the component
   1. If it needs a main thread restart, completely stop and start Harper again with `harperdb stop` and `harperdb start`
   2. If it only needs a worker thread restart, run `harperdb restart` (or include `restart=true` in the deploy command from step 2)
4. If changes need to be made to the component run `harperdb deploy_component project=<name>` again from within the component directory. It will automatically apply any changes.
5. To remove the component use `harperdb drop_component project=<name>`

> Not all [component operations](../operations-api/components.md) are available via CLI. When in doubt, switch to using the Operations API via network requests to the local Harper instance.

## Hosted Harper Instance

TODO

## Advanced

The previous methodologies should be sufficient for most developers, but a more advanced process does exist. The following methods should be executed with caution as they can have unintended side-effects. Always backup any critical Harper instances before continuing.

First, locate the Harper installation **rootPath** directory. Generally, this is `/hdb`. It can be retrieved by running `harperdb get_configuration` and looking for the **rootPath** field.

> For a useful shortcut on UNIX machines run: `harperdb get_configuration json=true | jq ".rootPath" | sed 's/"//g'`

This path is the Harper instance. Within this directory, locate the root config titled **harperdb-config.yaml**, and the components root path. The components root path will be `<rootPath>/components` by default, but it can also be configured. If necessary, use `harperdb get_configuration` again and look for the **componentsRoot** field for the exact path.

### Adding components to root

Similar to how components can specify other components within their **config.yaml**, components can be added to Harper by adding them to the **harperdb-config.yaml**.

The configuration is very similar to that of **config.yaml**. Entries are comprised of a top-level `<name>:`, and an indented `package: <specifier>` field. Any additional component option can also be included as indented fields.

```yaml
status-check:
  package: "@harperdb/status-check"
```

The key difference between this and a component's **config.yaml** is that the name does **not** need to be associated with a **package.json** dependency. When Harper starts up, it transforms these configurations into a **package.json** file, and then executes a form of `npm install`. Thus, the `package: <specifier>` can be any valid dependency syntax such as npm packages, GitHub repos, tarballs, and local directories are all supported.

Given a root config like:

```yaml
myGithubComponent:
  package: HarperDB-Add-Ons/package#v2.2.0 # install from GitHub 
myNPMComponent:
  package: harperdb # install from npm
myTarBall:
  package: /Users/harper/cool-component.tar # install from tarball
myLocal:
  package: /Users/harper/local # install from local path
myWebsite:
  package: https://harperdb-component # install from URL
```

Harper will generate a **package.json** like:

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

npm will install all the components and store them in `<rootPath>/<componentsRoot>`. A symlink back to `<rootPath>/node_modules` is also created for dependency resolution purposes.

The package prefix is automatically added, however you can manually set it in your package reference.

```yaml
myCoolComponent:
  package: file:/Users/harper/cool-component.tar
```

By specifying a file path, Harper _should_ generate a symlink from that location to the **componentsRoot**. In case the symlink is not being generated, the final, advanced method for component loading is to manually create symlinks from the local component source directory to the Harper instance **componentsRoot**. For most UNIX machines this is as simple as: `ln -s <path/to/component/source> <componentsRoot>`.

For example, if the machine had a **componentsRoot** of `/hdb/components`, and the component source was located at `/Users/dev/my-custom-component`, the symlink command would be: `ln -s /Users/dev/my-custom-component /hdb/components`

Now, Harper can be started, stopped, restarted, and the components changes will be picked up automatically!