# Clustering

The following operations are available for configuring and managing [HarperDB replication](../replication/README.md).<br>

___If you are using NATS for clustering, please see the [NATS Clustering Operations](clustering-nats.md) documentation.___

## Add Node
Adds a new HarperDB instance to the cluster. If `subscriptions` are provided, it will also create the replication relationships between the nodes. 
If they are not provided a fully replicating system will be created. [Learn more about adding nodes here](../replication/README.md).

_Operation is restricted to super_user roles only_

* operation _(required)_ - must always be `add_node`
* hostname or url _(required)_ - one of these fields is required. You must provide either the `hostname` or the `url` of the node you want to add
* verify_tls _(optional)_ - a boolean which determines if the TLS certificate should be verified. This will allow the HarperDB default self-signed certificates to be accepted. Defaults to `true`
* authorization _(optional)_ - an object or a string which contains the authorization information for the node being added. If it is an object, it should contain `username` and `password` fields. If it is a string, it should use HTTP `Authorization` style credentials
* subscriptions _(optional)_ - The relationship created between nodes. If not provided a fully replicated cluster will be setup. Must be an object array and include `database`, `table`, `subscribe` and `publish`:
  * database - the database to replicate
  * table - the table to replicate
  * subscribe - a boolean which determines if transactions on the remote table should be replicated on the local table
  * publish -  a boolean which determines if transactions on the local table should be replicated on the remote table

### Body
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

### Response: 200
```json
{
    "message": "Successfully added 'server-two' to cluster"
}
```

---

## Update Node
Modifies an existing HarperDB instance in the cluster.

_Operation is restricted to super_user roles only_

_Note: will attempt to add the node if it does not exist_

* operation _(required)_ - must always be `update_node`
* hostname _(required)_ - the `hostname` of the remote node you are updating
* subscriptions _(required)_ - The relationship created between nodes. Must be an object array and include `database`, `table`, `subscribe` and `publish`:
  * database - the database to replicate from
  * table - the table to replicate from
  * subscribe - a boolean which determines if transactions on the remote table should be replicated on the local table
  * publish -  a boolean which determines if transactions on the local table should be replicated on the remote table

### Body
```json
{
  "operation": "update_node",
  "hostname": "server-two",
  "subscriptions": [
      {
      "database": "dev",
      "table": "my-table",
      "subscribe": true,
      "publish": true
      }
  ]
}
```

### Response: 200
```json
{
    "message": "Successfully updated 'server-two'"
}
```

---

## Remove Node
Removes a HarperDB node from the cluster and stops replication, [Learn more about remove node here](../replication/README.md).

_Operation is restricted to super_user roles only_

* operation _(required)_ - must always be `remove_node`
* name _(required)_ - The name of the node you are removing

### Body
```json
{
    "operation": "remove_node",
    "hostname": "server-two"
}
```

### Response: 200
```json
{
    "message": "Successfully removed 'server-two' from cluster"
}
```
---

## Cluster Status
Returns an array of status objects from a cluster. 

`database_sockets` shows the actual websocket connections that exist between nodes.

_Operation is restricted to super_user roles only_

* operation _(required)_ - must always be `cluster_status`

### Body
```json
{
    "operation": "cluster_status"
}
```

### Response: 200
```json
{
  "type": "cluster-status",
  "connections": [
    {
      "url": "wss://server-two:9925",
      "subscriptions": [
        {
          "schema": "dev",
          "table": "my-table",
          "publish": true,
          "subscribe": true
        }
      ],
      "name": "server-two",
      "database_sockets": [
        {
          "database": "dev",
          "connected": true,
          "latency": 0.84197798371315,
          "threadId": 1,
          "nodes": [
            "server-two"
          ]
        }
      ]
    }
  ],
  "node_name": "server-one",
  "is_enabled": true
}
```

---

## Configure Cluster
Bulk create/remove subscriptions for any number of remote nodes. Resets and replaces any existing clustering setup.

_Operation is restricted to super_user roles only_

* operation _(required)_ - must always be `configure_cluster`
* connections _(required)_ - must be an object array with each object following the `add_node` schema.

### Body
```json
{
    "operation": "configure_cluster",
    "connections": [
        {
            "hostname": "server-two",
            "verify_tls": false,
            "authorization": {
              "username": "admin",
              "password": "password2"
            },
            "subscriptions": [
                {
                    "schema": "dev",
                    "table": "my-table",
                    "subscribe": true,
                    "publish": false
                }
            ]
        },
        {
            "hostname": "server-three",
            "verify_tls": false,
            "authorization": {
              "username": "admin",
              "password": "password3"
            },
            "subscriptions": [
                {
                    "schema": "dev",
                    "table": "dog",
                    "subscribe": true,
                    "publish": true
                }
            ]
        }
    ]
}
```

### Response: 200
```json
{
    "message": "Cluster successfully configured."
}
```

---

## Cluster Set Routes
Adds a route/routes to the `replication.routes` configuration. This operation behaves as a PATCH/upsert, meaning it will add new routes to the configuration while leaving existing routes untouched.

_Operation is restricted to super_user roles only_

* operation _(required)_ - must always be `cluster_set_routes`
* routes _(required)_ - the routes field is an array that specifies the routes for clustering. Each element in the array can be either a string or an object with `hostname` and `port` properties.

### Body
```json
{
    "operation": "cluster_set_routes",
    "routes": [
      "wss://server-two:9925",
      {
        "hostname": "server-three",
        "port": 9930
      }
    ]
}
```

### Response: 200
```json
{
    "message": "cluster routes successfully set",
    "set": [
      "wss://server-two:9925",
      {
        "hostname": "server-three",
        "port": 9930
      }
    ],
    "skipped": []
}
```

---

## Cluster Get Routes
Gets the replication routes from the HarperDB config file.

_Operation is restricted to super_user roles only_

* operation _(required)_ - must always be `cluster_get_routes`

### Body
```json
{
    "operation": "cluster_get_routes"
}
```

### Response: 200
```json
[
  "wss://server-two:9925",
  {
    "hostname": "server-three",
    "port": 9930
  }
]
```

---

## Cluster Delete Routes
Removes route(s) from the HarperDB config file. Returns a deletion success message and arrays of deleted and skipped records.

_Operation is restricted to super_user roles only_

* operation _(required)_ - must always be `cluster_delete_routes`
* routes _required_ - Must be an array of route object(s)

### Body

```json
{
  "operation": "cluster_delete_routes",
  "routes": [
    {
      "hostname": "server-three",
      "port": 9930
    }
  ]
}
```

### Response: 200
```json
{
  "message": "cluster routes successfully deleted",
  "deleted": [
    {
      "hostname": "server-three",
      "port": 9930
    }
  ],
  "skipped": []
}
```
