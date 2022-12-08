# How to Cluster

To create a cluster you must have two or more nodes* (aka instances) of HarperDB running.

**A node is a single instance/installation of HarperDB. A node of HarperDB can operate independently with clustering on or off.*


Below are the steps, in order, that should be taken to set up a HarperDB cluster.

---

### Creating a Cluster User

Inter-node authentication takes place via HarperDB users. There is a special role type called `cluster_user` that exists by default and limits the user to only clustering functionality.

A `cluster_user` must be created and added to the `harperdb-config.yaml` file for clustering to be enabled.

All nodes that are intended to be clustered together need to share the same `cluster_user` credentials (i.e. username and password).

There are multiple ways a `cluster_user` can be created, they are:

1) Through the operations API by calling `add_user`

```json
{
    "operation": "add_user",
    "role": "cluster_user",
    "username": "cluster_account",
    "password": "letsCluster123!",
    "active": true
}
```


When using the API to create a cluster user the `harperdb-config.yaml` file must be updated with the username of the new cluster user.

This can be done through the API by calling `set_configuration` or by editing the `harperdb-config.yaml` file.

```json
{
    "operation": "set_configuration",
    "clustering_user": "cluster_account"
}
```


In the `harperdb-config.yaml` file under the top-level `clustering` element there will be a user element. Set this to the name of the cluster user.

```yaml
clustering:
  user: cluster_account
```


_Note: When making any changes to the `harperdb-config.yaml` file, HarperDB must be restarted for the changes to take effect._

2) Upon installation using **command line variables**. This will automatically set the user in the `harperdb-config.yaml` file.

_Note: Using command line or environment variables for setting the cluster user only works on install._

```
harperdb install --CLUSTERING_USER cluster_account --CLUSTERING_PASSWORD letsCluster123!
```

3) Upon installation using **environment variables**. This will automatically set the user in the `harperdb-config.yaml` file.

```
CLUSTERING_USER=cluster_account CLUSTERING_PASSWORD=letsCluster123
```

---

### Naming a Node
Node name is the name given to a node. It is how nodes are identified within the cluster and must be unique to the cluster.

The name cannot contain any of the following characters: `.,*>` . Dot, comma, asterisk, greater than, or whitespace.

The name is set in the `harperdb-config.yaml` file using the `clustering.nodeName` configuration element.

_Note: If you want to change the node name make sure there are no subscriptions in place before doing so. After the name has been changed a full restart is required._

There are multiple ways to update this element, they are:

1) Directly editing the `harperdb-config.yaml` file.

```yaml
clustering:
  nodeName: Node1
```

_Note: When making any changes to the `harperdb-config.yaml` file HarperDB must be restarted for the changes to take effect._

2) Calling `set_configuration` through the operations API

```json
{
    "operation": "set_configuration",
    "clustering_nodeName":"Node1"
}
```

3) Using command line variables.

```
harperdb --CLUSTERING_NODENAME Node1
```

4) Using environment variables.

```
CLUSTERING_NODENAME=Node1
```

---

### Enabling Clustering

Clustering does not run by default; it needs to be enabled.

To enable clustering the `clustering.enabled` configuration element in the `harperdb-config.yaml` file must be set to `true`.

There are multiple ways to update this element, they are:

1) Directly editing the `harperdb-config.yaml` file and setting enabled to `true`
```yaml
clustering:
  enabled: true
```

_Note: When making any changes to the `harperdb-config.yaml` file HarperDB must be restarted for the changes to take effect._

2) Calling `set_configuration` through the operations API

```json
{
    "operation": "set_configuration",
    "clustering_enabled": true
}
```

_Note: When making any changes to HarperDB configuration HarperDB must be restarted for the changes to take effect._


3) Using **command line variables**.

```
harperdb --CLUSTERING_ENABLED true
```

4) Using **environment variables**.

```
CLUSTERING_ENABLED=true
```

An efficient way to **install HarperDB**, **create the cluster user**, **set the node name** and **enable clustering** in one operation is to combine the steps using command line and/or environment variables. Here is an example using command line variables.

```
harperdb install --CLUSTERING_ENABLED true --CLUSTERING_NODENAME Node1 --CLUSTERING_USER cluster_account --CLUSTERING_PASSWORD letsCluster123!
```

---

### Understanding Routes

A route is a connection between two nodes. It is how the clustering network is established.

Routes do not need to cross connect all nodes in the cluster. You can select a leader node or a few leaders and all nodes connect to them, you can chain, etc… As long as there is one route connecting a node to the cluster all other nodes should be able to reach that node.

Using routes the clustering servers will create a mesh network between nodes. This mesh network ensures that if a node drops out all other nodes can still communicate with each other. That being said, we recommend designing your routing with failover in mind, this means not storing all your routes on one node but dispersing them throughout the network.

A simple route example is a two node topology, if Node1 adds a route to connect it to Node2, Node2 does not need to add a route to Node1. That one route configuration is all that’s needed to establish a bidirectional connection between the nodes.

A route consists of a `port` and a `host`.

`port` - the clustering port of the remote instance you are creating the connection with. This is going to be the `clustering.hubServer.cluster.network.port` in the HarperDB configuration on the node you are connecting with.

`host` - the host of the remote instance you are creating the connection with.This can be an IP address or a URL.

Routes are set in the `harperdb-config.yaml` file using the `clustering.hubServer.cluster.network.routes` element, which expects an object array, where each object has two properties, `port` and `host`.

```yaml
clustering:
  hubServer:
    cluster:
      network:
        routes:
          - host: 3.62.184.22
            port: 9932
          - host: 3.735.184.8
            port: 9932
```

![figure 1](/Users/terraroush/documentation/images/clustering/figure1.png "diagram displaying a three node cluster")

This diagram shows one way of using routes to connect a network of nodes. Node2 and Node3 do not reference any routes in their config. Node1 contains routes for Node2 and Node3, which is enough to establish a network between all three nodes.

There are multiple ways to set routes, they are:

1) Directly editing the `harperdb-config.yaml` file (refer to code snippet above). 
2) Calling `cluster_set_routes` through the API.

```json
{
    "operation": "cluster_set_routes",
    "server": "hub",
    "routes":[ {"host": "3.735.184.8", "port": 9932} ]
}
```

_Note: When making any changes to HarperDB configuration HarperDB must be restarted for the changes to take effect._

3) From the command line.
```bash
--CLUSTERING_HUBSERVER_CLUSTER_NETWORK_ROUTES "[{\"host\": \"3.735.184.8\", \"port\": 9932}]"
```

4) Using environment variables.

```bash
CLUSTERING_HUBSERVER_CLUSTER_NETWORK_ROUTES=[{"host": "3.735.184.8", "port": 9932}]
```

The API also has `cluster_get_routes` for getting all routes in the config and `cluster_delete_routes` for deleting routes.
```json
{
    "operation": "cluster_delete_routes",
    "routes":[ {"host": "3.735.184.8", "port": 9932} ]
}
```

---

### Subscriptions

A subscription defines how data should move between two nodes. They are exclusively table level and operate independently. They connect a table on one node to a table on another node, the subscription will apply to a matching schema name and table name on both nodes.

_Note: ‘local’ and ‘remote’ will often be referred to. In the context of these docs ‘local’ is the node that is receiving the API request to create/update a subscription and remote is the other node that is referred to in the request, the node on the other end of the subscription._

A subscription consists of:

`schema` - the name of the schema that the table you are creating the subscription for belongs to.
`table` - the name of the table the subscription will apply to.
`publish` - a boolean which determines if transactions on the local table should be replicated on the remote table.
`subscribe` - a boolean which determines if transactions on the remote table should be replicated on the local table.

#### Publish subscription

![figure 2](/Users/terraroush/documentation/images/clustering/figure2.png "diagram example of a publish subscription from the perspective of Node1")

This diagram is an example of a `publish` subscription from the perspective of Node1.

The record with id 2 has been inserted in the dog table on Node1, after it has completed that insert it is sent to Node 2 and inserted in the dog table there.

#### Subscribe subscription

![figure 3](/Users/terraroush/documentation/images/clustering/figure3.png "diagram example of a subscribe subscription from the perspective of Node1")

This diagram is an example of a `subscribe` subscription from the perspective of Node1.

The record with id 3 has been inserted in the dog table on Node2, after it has completed that insert it is sent to Node1 and inserted there.

#### Subscribe and Publish

![figure 4](/Users/terraroush/documentation/images/clustering/figure4.png "diagram shows both subscribe and publish but publish is set to false")

This diagram shows both subscribe and publish but publish is set to false. You can see that because subscribe is true the insert on Node2 is being replicated on Node1 but because publish is set to false the insert on Node1 is **_not_** being replicated on Node2.

![figure 5](/Users/terraroush/documentation/images/clustering/figure5.png "shows both subscribe and publish set to true")

This shows both subscribe and publish set to true. The insert on Node1 is replicated on Node2 and the update on Node2 is replicated on Node1.

### Creating subscriptions

Subscriptions can be added, updated, or removed through the API.

_Note: The schema and tables in the subscription must exist on either the local or the remote node. Any schema and tables that do not exist on one particular node, for example, the local node, will be automatically created on the local node._

To add a single node and create one or more subscriptions use `add_node`.

```json
{
    "operation": "add_node",
    "node_name": "Node2",
    "subscriptions": [
        {
            "schema": "dev",
            "table": "dog",
            "publish": false,
            "subscribe": true
        },
        {
            "schema": "dev",
            "table": "chicken",
            "publish": true,
            "subscribe": true
        }
    ]
}
```

This is an example of adding Node2 to your local node. Subscriptions are created for two tables, dog and chicken.

To update one or more subscriptions with a single node use `update_node`.

```json
{
    "operation": "update_node",
    "node_name": "Node2",
    "subscriptions": [
        {
            "schema": "dev",
            "table": "dog",
            "publish": true,
            "subscribe": true
        }
    ]
}
```

This call will update the subscription with the dog table. Any other subscriptions with Node2 will not change.

To add or update subscriptions with one or more nodes in one API call use `configure_cluster`.


```json
{
    "operation": "configure_cluster",
    "connections": [
        {
            "node_name": "Node2",
            "subscriptions": [
                {
                    "schema": "dev",
                    "table": "chicken",
                    "publish": false,
                    "subscribe": true
                },
                {
                    "schema": "prod",
                    "table": "dog",
                    "publish": true,
                    "subscribe": true
                }
            ]
        },
        {
            "node_name": "Node3",
            "subscriptions": [
                {
                    "schema": "dev",
                    "table": "chicken",
                    "publish": true,
                    "subscribe": false
                }
            ]
        }
    ]
}
```

_Note: `configure_cluster`  will override **any and all** existing subscriptions defined on the local node. This means that before going through the connections in the request and adding the subscriptions, it will first go through **all existing subscriptions the local node has** and remove them. To get all existing subscriptions use `cluster_status`._

#### Start time

There is an optional property called `start_time` that can be passed in the subscription. This property accepts an ISO formatted UTC date.

`start_time` can be used to set from what time you would like to source transactions from a table when creating or updating a subscription.

```json
{
    "operation": "add_node",
    "node_name": "Node2",
    "subscriptions": [
        {
            "schema": "dev",
            "table": "dog",
            "publish": false,
            "subscribe": true,
            "start_time": "2022-09-02T20:06:35.993Z"
        }
    ]
}
```

This example will get all transactions on Node2’s dog table starting from `2022-09-02T20:06:35.993Z` and replicate them locally on the dog table.

If no start time is passed it defaults to the current time.

_Note: start time utilizes clustering to back source transactions. For this reason it can only source transactions that occurred when clustering was enabled._

#### Remove node

To remove a node and all its subscriptions use `remove_node`.

```json
{
    "operation":"remove_node",
    "node_name":"Node2"
}
```

#### Cluster status

To get the status of all connected nodes and see their subscriptions use `cluster_status`.

```json
{
    "node_name": "Node1",
    "is_enabled": true,
    "connections": [
        {
            "node_name": "Node2",
            "status": "open",
            "ports": {
                "clustering": 9932,
                "operations_api": 9925
            },
            "latency_ms": 65,
            "uptime": "11m 19s",
            "subscriptions": [
                {
                    "schema": "dev",
                    "table": "dog",
                    "publish": true,
                    "subscribe": true
                }
            ],
            "system_info": {
                "hdb_version": "4.0.0",
                "node_version": "16.17.1",
                "platform": "linux"
            }
        }
    ]
}
```

#### Transactions

Transactions that are replicated across the cluster are:
* Insert 
* Update 
* Upsert 
* Delete 
* Bulk loads 
  * CSV data load

  * CSV file load

  * CSV URL load

  * Import from S3

When adding or updating a node any schemas and tables in the subscription that don’t exist on the remote node will be automatically created.

**Destructive schema operations do not replicate across a cluster**. Those operations include `drop_schema`, `drop_table`, and `drop_attribute`. If the desired outcome is to drop schema information from any nodes then the operation(s) will need to be run on each node independently.

Users and roles are not replicated across the cluster.

---

### Queueing

HarperDB has built-in resiliency for when network connectivity is lost within a subscription. When connections are reestablished, a catchup routine is executed to ensure data that was missed, specific to the subscription, is sent/received as defined.

---

### Topologies

HarperDB clustering creates a mesh network between nodes giving end users the ability to create an infinite number of topologies. subscription topologies can be simple or as complex as needed.

![figure 6](/Users/terraroush/documentation/images/clustering/figure6.png "example topology of mesh network")
