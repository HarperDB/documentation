## Creating a clone of a HarperDB instance

**Leader node** - the instance of HarperDB you are cloning.<br>
**Clone node** - the new node which will be a clone of the leader node.

To run clone node the following environment variables must be set:
* `HDB_LEADER_URL` - The URL of the leader node.
* `HDB_LEADER_CLUSTERING_HOST` - The leader clustering host. This value will be used to added to the clustering routes on the clone node.
* `HDB_LEADER_USERNAME` - The leader node admin username.
* `HDB_LEADER_PASSWORD` - The leader node admin password.

Clone node can be configured through `clone-node-config.yaml`

```yaml
database:
  excludeDatabases:
    - database: dev
  excludeTables:
    - database: prod
      table: dog
```
Set any databases or tables that you wish to exclude from cloning.

```yaml
components:
  skipNodeModules: true
  exclude:
    - name: my-cool-component
```
`skipNodeModules` will not include the node_modules directory when clone node is packaging components in `hdb/components`<br>

`exclude` can be used to set any components that you do not want cloned.

```yaml
clustering:
  nodeName: null
  publishToLeaderNode: true
  subscribeToLeaderNode: true
```
`nodeName` the new node name for the clone node. This must be unique, if one is not provided one will be automatically generated.<br>
`publishToLeaderNode`, `subscribeToLeaderNode` the clustering subscription to set up with the leader node.

```yaml
httpsRejectUnauthorized: false
rootPath: user/dir/hdb
operationsApi:
  network:
    port: 9925
```
Clone node makes http requests to the leader node, `httpsRejectUnauthorized` is used to set if https requests should be verified.<br>
`rootPath` the location of the clone nodes `hdb` directory. By default this is the users home directory.<br>
`port` the port the operations API serve should run on.