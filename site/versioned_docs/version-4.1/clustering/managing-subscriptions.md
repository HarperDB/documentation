---
title: Managing subscriptions
---

# Managing subscriptions

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

_Note: `configure_cluster` will override **any and all** existing subscriptions defined on the local node. This means that before going through the connections in the request and adding the subscriptions, it will first go through **all existing subscriptions the local node has** and remove them. To get all existing subscriptions use `cluster_status`._

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
