# `clustering`

The `clustering` section configures the clustering engine, this is used to replicate data between instances of HarperDB.

Clustering offers a lot of different configurations, however in a majority of cases the only options you will need to pay attention to are:

- `clustering.enabled` Enable the clustering processes.
- `clustering.hubServer.cluster.network.port` The port other nodes will connect to. This port must be accessible from other cluster nodes.
- `clustering.hubServer.cluster.network.routes`The connections to other instances.
- `clustering.nodeName` The name of your node, must be unique within the cluster.
- `clustering.user` The name of the user credentials used for Inter-node authentication.


`enabled` - _Type_: boolean; _Default_: false

Enable clustering.

_Note: If you enabled clustering but do not create and add a cluster user you will get a validation error. See `user` description below on how to add a cluster user._

```yaml
clustering:
  enabled: true  
```

`clustering.hubServer.cluster`

Clustering’s `hubServer` facilitates the HarperDB mesh network and discovery service.

```yaml
clustering:
  hubServer:
    cluster:
      name: harperdb
      network:
        port: 9932
        routes:
          - host: 3.62.184.22
            port: 9932
          - host: 3.735.184.8
            port: 9932
```

`name` - _Type_: string, _Default_: harperdb

The name of your cluster. This name needs to be consistent for all other nodes intended to be meshed in the same network.

<div style="padding-left: 30px;">

`port` - _Type_: integer, _Default_: 9932

The port the hub server uses to accept cluster connections

`routes` - _Type_: array, _Default_: null

An object array that represent the host and port this server will cluster to. Each object must have two properties `port` and `host`. Multiple entries can be added to create network resiliency in the event one server is unavailable. Routes can be added, updated and removed either by directly editing the `harperdb-config.yaml` file or by using the `cluster_set_routes` or `cluster_delete_routes` API endpoints.
</div>

<div style="padding-left: 60px;">

`host` - _Type_: string

The host of the remote instance you are creating the connection with.

`port` - _Type_: integer

The port of the remote instance you are creating the connection with. This is likely going to be the `clustering.hubServer.cluster.network.port` on the remote instance.

</div>

`clustering.hubServer.leafNodes`

```yaml
clustering:
  hubServer:
    leafNodes:
      network:
        port: 9931
```

`port` - _Type_: integer; _Default_: 9931

The port the hub server uses to accept leaf server connections.

`clustering.hubServer.network`

```yaml
clustering:
  hubServer:
    network:
      port: 9930
```

`port` - _Type_: integer; _Default_: 9930

Use this port to connect a client to the hub server, for example using the NATs SDK to interact with the server.

`clustering.leafServer`

Manages streams, streams are ‘message stores’ that store table transactions.

```yaml
clustering:
  leafServer:
    network:
      port: 9940
      routes:
        - host: 3.62.184.22
          port: 9931
        - host: node3.example.com
          port: 9931
    streams:
      maxAge: 3600
      maxBytes: 10000000
      maxMsgs: 500
      path: /user/hdb/clustering/leaf
```

`port` - _Type_: integer; _Default_: 9940

Use this port to connect a client to the leaf server, for example using the NATs SDK to interact with the server.

`routes` - _Type_: array; _Default_: null

An object array that represent the host and port the leaf node will directly connect with. Each object must have two properties `port` and `host`. Unlike the hub server, the leaf server will establish connections to all listed hosts. Routes can be added, updated and removed either by directly editing the `harperdb-config.yaml` file or by using the `cluster_set_routes` or `cluster_delete_routes` API endpoints.

<div style="padding-left: 30px;">

`host` - _Type_: string

The host of the remote instance you are creating the connection with.

`port` - _Type_: integer

The port of the remote instance you are creating the connection with. This is likely going to be the `clustering.hubServer.cluster.network.port` on the remote instance.
</div>

<br/>

`clustering.leafServer.streams`

`maxAge` - _Type_: integer; _Default_: null

The maximum age of any messages in the stream, expressed in seconds.

`maxBytes` - _Type_: integer; _Default_: null

The maximum size of the stream in bytes. Oldest messages are removed if the stream exceeds this size.

`maxMsgs` - _Type_: integer; _Default_: null

How many messages may be in a stream. Oldest messages are removed if the stream exceeds this number.

`path` - _Type_: string; _Default_: &lt;ROOTPATH>/clustering/leaf

The directory where all the streams are kept.

---
`logLevel` - _Type_: string; _Default_: error

Control the verbosity of clustering logs.

```yaml
clustering:
  logLevel: error
```

There exists a log level hierarchy in order as `trace`, `debug`, `info`, `warn`, and `error`. When the level is set to `trace` logs will be created for all possible levels. Whereas if the level is set to `warn`, the only entries logged will be `warn` and `error`. The default value is `error`.


`nodeName` - _Type_: string; _Default_: null

The name of this node in your HarperDB cluster topology. This must be a value unique from the rest of the cluster node names.

_Note: If you want to change the node name make sure there are no subscriptions in place before doing so. After the name has been changed a full restart is required._

```yaml
clustering:
  nodeName: great_node
```

`tls`

Transport Layer Security default values are automatically generated on install.

```yaml
clustering:
  tls:
    certificate: ~/hdb/keys/certificate.pem
    certificateAuthority: ~/hdb/keys/ca.pem
    privateKey: ~/hdb/keys/privateKey.pem
    insecure: true
    verify: true
```

`certificate` - _Type_: string; _Default_: &lt;ROOTPATH>/keys/certificate.pem

Path to the certificate file.

`certificateAuthority` - _Type_: string; _Default_: &lt;ROOTPATH>/keys/ca.pem

Path to the certificate authority file.

`privateKey` - _Type_: string; _Default_: &lt;ROOTPATH>/keys/privateKey.pem

Path to the private key file.

`insecure` - _Type_: boolean; _Default_: true

When true, will skip certificate verification. For use only with self-signed certs.

`republishMessages` - _Type_: boolean; _Default_: true

When true, all transactions that are received from other nodes are republished to this node's stream. When subscriptions are not fully connected between all nodes, this ensures that messages are routed to all nodes through intermediate nodes. This also ensures that all writes, whether local or remote, are written to the NATS transaction log. However, there is additional overhead with republishing, and setting this is to false can provide better data replication performance. When false, you need to ensure all subscriptions are fully connected between every node to every other node, and be aware that the NATS transaction log will only consist of local writes.

`verify` - _Type_: boolean; _Default_: true

When true, hub server will verify client certificate using the CA certificate.

---

`user` - _Type_: string; _Default_: null

The username given to the `cluster_user`. All instances in a cluster must use the same clustering user credentials (matching username and password).

Inter-node authentication takes place via a special HarperDB user role type called `cluster_user`.

The user can be created either through the API using an `add_user` request with the role set to `cluster_user`, or on install using environment variables `CLUSTERING_USER=cluster_person` `CLUSTERING_PASSWORD=pass123!` or CLI variables `harperdb --CLUSTERING_USER cluster_person` `--CLUSTERING_PASSWORD` `pass123!`

```yaml
clustering:
  user: cluster_person    
```
