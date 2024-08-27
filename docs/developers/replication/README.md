HarperDB's replication system is designed to provide fast and robust distributed data replication across multiple nodes. This allows you to create a distributed database that can be used for high availability, disaster recovery, and data locality. HarperDB's replication system is designed to be simple to use and easy to configure, with the ability to add and remove nodes, define replicated data, and monitor the status of the replication system.

## Replication Overview
HarperDB replication is a peer-to-peer system where each node in the cluster is capable of both sending and subscribing to data. HarperDB nodes connect to each other through WebSockets and can both send and receive data to and from other nodes in the cluster. By default, HarperDB will automatically manage these connections and subscriptions between nodes to ensure that data consistency is maintained across the cluster. HarperDB uses robust secure connections to ensure that data is transmitted securely between nodes.

## Replication Configuration
To connect your nodes, you need to provide hostnames or URLs for the nodes to connect to each other. This can be done via configuration or through operations. To configure replication, you can specify connection information the `replication` section of the harperdb-config.yaml. Here, you can specify the host name of the current node, and routes to connect to other nodes, for example:

```yaml
replication:
  hostname: server-one
  routes:
    - server-two
    - server-three
```

In this example, the current node is `server-one`, and it will connect to `server-two` and `server-three`. Routes to other nodes can also be configured with URLs or ports:
```yaml
replication:
  hostname: server-one
  routes:
    - wss://server-two:9925 # URL based route
    - hostname: server-three # define a hostname and port
      port: 9930
```

You can also use the operations API to dynamically add and remove nodes from the cluster. This is useful for adding new nodes to a running cluster or removing nodes that are no longer needed. For example (note this is the basic form, you would also need to provide the necessary credentials for the operation, see the section on securing connections for more details):

```json
{
  "operation": "add_node",
  "hostname": "server-two"
}

```
These operations can also be useful for dynamically generating certificates as needed.

HarperDB will also automatically replicate node information to other nodes in a cluster (gossip-style discovery). This means that you only need to connect to one node in an existing cluster, and HarperDB will automatically detect and connect to other nodes in the cluster (bidirectionally).

By default, HarperDB will replicate all the data in all the databases. You can configure which databases are replicated, and then override this behavior on a per-table basis. For example, you can indicate which databases should be replicated by default, here indicating you want to replicate the `data` and `system` databases:

```yaml
replication:
  databases:
    - data
    - system
```

By default, all tables within a replicated database will be replicated. Transactions are replicated atomically, which may involve data across multiple tables. However, you can also configure replication for individual tables, and disable and exclude replication for specific tables in a database by setting `replicate` to `false` in the table definition:
```graphql
type LocalTableForNode @table(replicate: false) {
  id: ID!
  name: String!
}
```
You can also control which nodes data is replicated to, and how many nodes data is replicated to. By default, HarperDB will replicate data to all nodes in the cluster, but you can control where data is replicated to with the [sharding configuration and APIs](./sharding.md).

By default replication will connect on the operations API network interface/port (9925 by default). You can configure the replication port in the `replication` section. For example, to change the replication port to 9930:

```yaml
replication:
  securePort: 9930
```
This will change the replication port to 9930 and the operations API port will be on a separate port, remaining on 9925.

## Securing Connections

HarperDB supports the highest levels of security through public key infrastructure based security and authorization. Depending on your security configuration, you can configure HarperDB in several different ways to build a connected cluster.

### Provide your own certificates
You can provide your own signed certificates to secure connections. If you already have certificates for HarperDB server to handle incoming connections, whether they are signed by a public authority (like LetsEncrypt or Digicert) or through a corporate certificate authority, you can use these certificates to authenticate nodes with each other, providing a simple and highly secure way to configure HarperDB. These certificates simply need to have the subject common name (CN) that matches host name of the node. To configure HarperDB to use your own certificates, you can add the certificates through the `add_certificate` operation, or specify the paths to the certificates in the `replication` section of the `harperdb-config.yaml` file. You can specify the path to the certificate and private key if the certificate will verify against the publicly trusted certificate authority, or you can additionally specify a certificate authority if the certificate is self-signed or signed by a private certificate authority (and you have the public CA key). For example:

```yaml
replication:
  certificate: /path/to/certificate.pem
  certificateAuthority: /path/to/ca.pem
  privateKey: /path/to/privateKey.pem
```

With this in place, HarperDB will load the provided certificates into the certificate table and use these to secure and authenticate connections between nodes.

### Cross-generated certificates
HarperDB can also generate its own certificates for secure connections. This is useful for setting up secure connections between nodes when no existing certificates are available, and can be used in development, testing, or production environments. Certificates will be automatically requested and signed between nodes to support a form of distributed certificate generation and signing. To establish secure connections between nodes using cross-generated certificates, you simply use the `add_node` operation over SSL, and specify the temporary authentication credentials to use for connecting and authorizing the certificate generation and signing. For example:

```json
{
  "operation": "add_node",
  "hostname": "server-two",
  "verify_tls": false,
  "authorization": {
    "username": "admin",
    "password": "password"
  }
}
```
This will connect to `server-two`, with secure WebSockets, using the provided credentials. Note, that assuming you are working with a fresh install, you will need to set `verify_tls` to `false` to allow the self-signed certificate to be accepted. Once the connection is established, HarperDB will automatically create a certificate signing request, send that to server-two, which will then sign the certificate and return the CA and signed certificate. This will be stored and used for future connections between the nodes. The credentials will not be stored, and will be discarded as immediately.
The `authorization` property can also be a string using HTTP `Authorization` style credentials, allowing the credentials to be in the form of `Basic` auth, or `Token` auth and can be used to provide a JWT token for authentication with the necessary permissions to generate and sign certificates.

Note that use may also use the `set_node` operation, which is an alias for `add_node`.

### Removing Nodes
Nodes can be removed from the cluster using the `remove_node` operation. This will remove the node from the cluster, and stop replication to and from the node. For example:

```json
{
  "operation": "remove_node",
  "hostname": "server-two"
}
```

### Insecure Connection IP-based Authentication
You can completely disable secure connections and use IP addresses to authenticate nodes with each other. This can be useful for development and testing, or within a secure private network, but should never be used for production with publicly accessible servers. To disable secure connections, simply configure replication within an insecure port, either by configuring the operations API to run on an insecure port or replication to run on an insecure port. And then set up IP-based routes to connect to other nodes:

```yaml
replication:
  port: 9930
  routes:
    - 127.0.0.2
    - 127.0.0.3
```
Note that in this example, we are using loop back addresses, which can be a convenient way to run multiple nodes on a single machine for testing and development.

### Explicit Subscriptions
By default, HarperDB will automatically manage connections and subscriptions between nodes, creating the necessary subscriptions to ensure data consistency across the cluster, employing data routing as necessary to handle node failures. However, you can also explicitly subscribe to other nodes, and manage the connections and subscriptions yourself. This can be useful for advanced configurations, or for debugging and testing. However, using explicit subscriptions means that HarperDB will no longer be managing subscriptions to ensure data consistency. With explicit subscriptions, there is no guarantee of data consistency if the subscriptions do not fully replicate in all directions, or if a node goes down there is no guarantee that the same data was replicated to all nodes before a crash.

To explicitly subscribe to another node, you can use the node operations like the `add_node` operation, and specify a set of subscriptions.

In this example we are adding a node named `server-two` and specifying that we want to publish (send) transactions on the `dev.my-table` table to the `server-two` node, but not receive any transactions on `dev.my-table` from `server-two`.
```json
{
  "operation": "add_node",
  "hostname": "server-two", 
  "subscriptions": [{
    "database": "dev",
    "table": "my-table",
    "publish": true,
    "subscribe": false
  }]
}
```

To update an explicit subscription you can use the `update_node` operation.

Here we are updating the subscription to receive transactions on the `dev.my-table` table from the `server-two` node.

```json
{
  "operation": "update_node",
  "hostname": "server-two", 
  "subscriptions": [{
    "database": "dev",
    "table": "my-table",
    "publish": true,
    "subscribe": true
  }]
}
```

### Monitoring Replication
You can monitor the status of replication through the operations API. You can use the `cluster_status` operation to get the status of replication. For example:

```json
{
  "operation": "cluster_status"
}
```

### Database Initial Synchronization and Resynchronization
When a new node is added to the cluster, if its database has not previously been synced, it will initially download the database from the first node it connects to. This will copy every record from the source database to the new node. Once the initial synchronization is complete, the new node enter replication mode, and receive records from each node as they are created, updated, or delete. If a node goes down and comes back up, it will also resynchronize with the other nodes in the cluster, to ensure that it has the most up-to-date data.

The initial download can be a time-consuming process, depending on the size of the database and the network speed between the nodes. You may consider using the clone node functionality to perform fast cloning of a node, or using the backup and restore functionality to move data between nodes. With a cloned database, when the nodes connect, they will resume from the last transaction.

You may also specify a `start_time` in the `add_node` to specify that when a database connects, that it does not download the entire database, but only data since a given starting time. 

#### Advanced Configuration
You can also check the configuration of the replication system, including the current known nodes and certificates, by querying the hdb_nodes and hdb_certificate table:

```json
{
  "operation": "search_by_value",
  "database": "system",
  "table": "hdb_nodes",
  "search_attribute": "name",
  "search_value": "*"
}
```