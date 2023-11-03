# Clone Node

Clone node is a configurable node script that can be pointed to another instance of HarperDB and create a full clone.

To start clone node run `harperdb` as you would normally but have the clone node environment variables set (see below).

To run clone node the following environment variables must be set:

* `HDB_LEADER_URL` - The URL of the leader node's operation API (usually port 9925).
* `HDB_LEADER_CLUSTERING_HOST` - The leader clustering host. This value will be added to the clustering routes on the clone node.
* `HDB_LEADER_USERNAME` - The leader node admin username.
* `HDB_LEADER_PASSWORD` - The leader node admin password.

For example:
```
HDB_LEADER_URL=https://node-1.my-domain.com:9925 HDB_LEADER_CLUSTERING_HOST=node-1.my-domain.com HDB_LEADER_USERNAME=... HDB_LEADER_PASSWORD=... harperdb
```

Clone node can be configured through `clone-node-config.yaml`, which should be located in the `ROOTPATH` directory of your clone. If no configuration is supplied, default values will be used.

**Leader node** - the instance of HarperDB you are cloning.\
**Clone node** - the new node which will be a clone of the leader node.

The following configuration is used exclusively by clone node.

```yaml
databaseConfig:
  excludeDatabases:
    - database: dev
  excludeTables:
    - database: prod
      table: dog
```

Set any databases or tables that you wish to exclude from cloning.

```yaml
componentConfig:
  skipNodeModules: true
  exclude:
    - name: my-cool-component
```

`skipNodeModules` will not include the node\_modules directory when clone node is packaging components in `hdb/components`.

`exclude` can be used to set any components that you do not want cloned.

```yaml
clusteringConfig:
  publishToLeaderNode: true
  subscribeToLeaderNode: true
```

`publishToLeaderNode`, `subscribeToLeaderNode` the clustering subscription to set up with the leader node.

```yaml
httpsRejectUnauthorized: false
```

Clone node makes http requests to the leader node, `httpsRejectUnauthorized` is used to set if https requests should be verified.

Any HarperDB configuration can also be used in the `clone-node-config.yaml` file and will be applied to the cloned node, for example:

```yaml
rootPath: null
operationsApi:
  network:
    port: 9925
clustering:
  nodeName: null
  logLevel: info
logging:
  level: error
```

_Note: any required configuration needed to install/run HarperDB will be default values or auto-generated unless it is provided in the config file._

### Fully connected clone

A fully connected topology is when all nodes are replicating (publish and subscribing) with all other nodes. A fully connected clone maintains this topology with addition of the new node. When a clone is created, replication is added between the leader and the clone and any nodes the leader is replicating with. For example, if the leader is replicating with node-a and node-b, the clone will replicate with the leader, node-a and node-b.

To run clone node with the fully connected option simply pass the environment variable `HDB_FULLY_CONNECTED=true`

## Cloning steps

When run clone node will execute the following steps:

1. Clone any user defined tables and the hdb\_role and hdb\_user system tables.
2. Install Harperdb overtop of the cloned tables.
3. Clone the configuration, this includes:
   * Copy the clustering routes and clustering user.
   * Copy component references.
   * Using any provided clone config to populate new cloud node harperdb-config.yaml
4. Clone any components in the `hdb/component` directory.
5. Start the cloned HarperDB Instance.
6. Cluster all cloned tables.

## Custom database and table pathing

Currently, clone node will not clone a table if it has custom pathing configured. In this situation the full database that the table is located in will not be cloned.

If a database has custom pathing (no individual table pathing) it will be cloned, however if no custom pathing is provided in the clone config the database will be stored in the default database directory.

To provide custom pathing for a database in the clone config follow this configuration:

```yaml
databases: 
  <name-of-db>:
    path: /Users/harper/hdb
```

`<name-of-db>` the name of the database which will be located at the custom path.\
`path` the path where the database will reside.
