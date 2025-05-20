# Package Management

## Install Node Modules
This operation is deprecated, as it is handled automatically by deploy_component and restart.
Executes npm install against specified custom function projects.

_Operation is restricted to super_user roles only_

* operation _(required)_ - must always be `install_node_modules`
* projects _(required)_ - must ba an array of custom functions projects.
* dry_run _(optional)_ - refers to the npm --dry-run flag: [https://docs.npmjs.com/cli/v8/commands/npm-install#dry-run](https://docs.npmjs.com/cli/v8/commands/npm-install#dry-run). Defaults to false.

### Body
```json
{
  "operation": "install_node_modules",
  "projects": [
    "dogs",
    "cats"
  ],
  "dry_run": true
}
```