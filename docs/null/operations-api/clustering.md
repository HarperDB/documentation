# Clustering 


## Cluster Set Routes
Adds a route/routes to either the hub or leaf server cluster configuration.

<i><b>Operation is restricted to super_user roles only</b></i>

<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'cluster_set_routes'
</li>

<li>
<b>server</b> <i> (required) </i> - must always be 'hub', or 'leaf.'
</li>

<li>
<b>routes</b> <i> (required) </i> - must always be an objects array with a host and port.
</li>
</ul>

### Body

```json
{
    "operation": "cluster_set_routes",
    "server": "hub",
    "routes": [
        {
            "host": "3.22.181.22",
            "port": 12345
        },
        {
            "host": "3.137.184.8",
            "port": 12345
        },
        {
            "host": "18.223.239.195",
            "port": 12345
        },
        {
            "host": "18.116.24.71",
            "port": 12345
        }
    ]
}
```

### Response: 200
```json
{
    "message": "cluster routes successfully set",
    "set": [
        {
            "host": "3.22.181.22",
            "port": 12345
        },
        {
            "host": "3.137.184.8",
            "port": 12345
        },
        {
            "host": "18.223.239.195",
            "port": 12345
        },
        {
            "host": "18.116.24.71",
            "port": 12345
        }
    ],
    "skipped": []
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Cluster Get Routes
Gets all the hub and leaf server routes from the config file.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'cluster_get_routes'
</li>

</ul>

### Body

```json
{
    "operation": "cluster_get_routes"
}
```

### Response: 200
```json
{
    "hub": [
        {
            "host": "3.22.181.22",
            "port": 12345
        },
        {
            "host": "3.137.184.8",
            "port": 12345
        },
        {
            "host": "18.223.239.195",
            "port": 12345
        },
        {
            "host": "18.116.24.71",
            "port": 12345
        }
    ],
    "leaf": []
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Cluster Delete Routes
Removes route(s) from hub and/or leaf server routes array in config file. Returns a deletion success message and arrays of deleted and skipped records.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'cluster_delete_routes'
</li>

<li>
<b>routes </b><i>(required)</i> - Must be an array of route object(s). 
</li>

</ul>

### Body

```json
{
    "operation": "cluster_delete_routes",
    "routes": [
        {
            "host": "18.116.24.71",
            "port": 12345
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
            "host": "18.116.24.71",
            "port": 12345
        }
    ],
    "skipped": []
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Add Node
Registers an additional HarperDB instance with associated subscriptions. Learn more about HarperDB clustering here: https://harperdb.io/docs/clustering/.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'add_node'
</li>
<li>
<b>node_name</b> <i> (required) </i> - The NODE_NAME of the remote node. Must match exactly. 
</li>
<li>
<b>start_time</b> <i> (optional) </i> - How far back to go to get transactions from node being added. Must be in UTC YYYY-MM-DDTHH:mm:ss.sssZ format.
</li>
<li>
<b>subscriptions</b> <i> (required) </i> - The relationship created between nodes. Must be an object array and include 'schema,' 'table,' subscribe,' and 'publish.'
</li>
</ul>

### Body

```json
{
    "operation": "add_node",
    "node_name": "ec2-3-22-181-22",
    "start_time": "2022-08-29T09:07:21-07:00",
    "subscriptions": [
        {
            "schema": "dev",
            "table": "dog",
            "subscribe": false,
            "publish": true
        }
    ]
}
```

### Response: 200
```json
{
    "message": "Successfully added 'ec2-3-22-181-22' to manifest"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Update Node
Modifies an existing HarperDB instance registration and associated subscriptions. Learn more about HarperDB clustering here: https://harperdb.io/docs/clustering/. 

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'update_node'
</li>
<li>
<b>node_name</b> <i> (required) </i> - The NODE_NAME of the remote node. Must match exactly. 
</li>
<li>
<b>start_time</b> <i> (optional) </i> - How far back to go to get transactions from node being updated. Must be in UTC YYYY-MM-DDTHH:mm:ss.sssZ format.
</li>
<li>
<b>subscriptions</b> <i> (required) </i> - The relationship created between nodes. Must be an object array and include 'schema,' 'table,' subscribe,' and 'publish.'
</li>
</ul>

### Body

```json
{
    "operation": "update_node",
    "node_name": "ec2-18-223-239-195",
    "start_time": "2022-08-28T09:07:21-07:00",
    "subscriptions": [
        {
            "schema": "dev",
            "table": "dog",
            "subscribe": true,
            "publish": false
        }
    ]
}
```

### Response: 200
```json
{
    "message": "Successfully updated 'ec2-3-22-181-22'"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Cluster Status
Returns an array of status objects from a cluster. A status object will contain the clustering node name, whether or not clustering is enabled, and a list of possible connections. Learn more about HarperDB clustering here: https://harperdb.io/docs/clustering/.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'cluster_status'
</li>
</ul>

### Body

```json
{
    "operation": "cluster_status"
}
```

### Response: 200
```json
{
    "node_name": "ec2-18-221-143-69",
    "is_enabled": true,
    "connections": [
        {
            "node_name": "ec2-3-22-181-22",
            "status": "open",
            "ports": {
                "clustering": 12345,
                "operations_api": 9925
            },
            "latency_ms": 13,
            "uptime": "30d 1h 18m 8s",
            "subscriptions": [
                {
                    "schema": "dev",
                    "table": "dog",
                    "publish": true,
                    "subscribe": true
                }
            ]
        }
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Cluster Network
Returns an object array of enmeshed nodes. Each node object will contain the name of the node, the amount of time (in milliseconds) it took for it to respond, the names of the nodes it is enmeshed with and the routes set in its config file. Learn more about HarperDB clustering here: [https://harperdb.io/docs/clustering/](https://harperdb.io/docs/clustering/).

_**Operation is restricted to super_user roles only**_

<ul><li><p><b>operation</b> <i>(required) </i>- Must always be <code>cluster_network</code>.</p></li><li><p><b>timeout</b> (<i>optional</i>) - The amount of time in milliseconds to wait for a response from the network. Must be a number.</p></li><li><p><b>connected_nodes</b> (<i>optional</i>) - Omit <code>connected_nodes</code> from the response. Must be a boolean. Defaults to <code>false.</code></p></li><li><p><b>routes</b> (<i>optional</i>) - Omit <code>routes</code>from the response. Must be a boolean. Defaults to <code>false</code>.</p></li></ul>

### Body

```json
{
    "operation": "cluster_network"
}
```

### Response: 200
```json
{
    "nodes": [
        {
            "name": "local_node",
            "response_time": 4,
            "connected_nodes": ["ec2-3-142-255-78"],
            "routes": [
                {
                    "host": "3.142.255.78",
                    "port": 9932
                }
            ]
        },
        {
            "name": "ec2-3-142-255-78",
            "response_time": 57,
            "connected_nodes": ["ec2-3-12-153-124", "ec2-3-139-236-138", "local_node"],
            "routes": []
        }
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Remove Node
Unregisters a HarperDB instance and associated subscriptions. Learn more about HarperDB clustering here: https://harperdb.io/docs/clustering/.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'remove_node'
</li>
<li>
<b>name</b> <i> (required) </i> - The name of the node you are de-registering.  Must match exactly. 
</li>
</ul>

### Body

```json
{
    "operation": "remove_node",
    "node_name": "ec2-3-22-181-22"
}
```

### Response: 200
```json
{
    "message": "Successfully removed 'ec2-3-22-181-22' from manifest"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Configure Cluster
Bulk create/remove subscriptions for any number of remote nodes. Resets and replaces any existing clustering setup.
Learn more about HarperDB clustering here: https://harperdb.io/docs/clustering/.

<i><b>Operation is restricted to super_user roles only</b></i>

<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'configure_cluster'
</li>
<li>
<b>connections</b> <i> (required) </i> - must be an object array with each object containing node_name and subscriptions for that node
</li>
</ul>

### Body

```json
{
    "operation": "configure_cluster",
    "connections": [
        {
            "node_name": "ec2-3-137-184-8",
            "subscriptions": [
                {
                    "schema": "dev",
                    "table": "dog",
                    "subscribe": true,
                    "publish": false
                }
            ]
        },
        {
            "node_name": "ec2-18-223-239-195",
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
