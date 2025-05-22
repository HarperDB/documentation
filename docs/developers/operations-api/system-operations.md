# System Operations

## Restart
Restarts the Harper instance.

_Operation is restricted to super_user roles only_

* operation _(required)_ - must always be `restart`

### Body
```json
{
  "operation": "restart"
}
```

### Response: 200
```json
{
  "message": "Restarting HarperDB. This may take up to 60 seconds."
}
```
---

## Restart Service
Restarts servers for the specified Harper service.

_Operation is restricted to super_user roles only_

* operation _(required)_ - must always be `restart_service`
* service _(required)_ - must be one of: `http_workers`, `clustering_config` or `clustering`
* replicated _(optional)_ - must be a boolean. If set to `true`, Harper will replicate the restart service operation across all nodes in the cluster. The restart will occur as a rolling restart, ensuring that each node is fully restarted before the next node begins restarting.

### Body
```json
{
  "operation": "restart_service",
  "service": "http_workers"
}
```

### Response: 200
```json
{
  "message": "Restarting http_workers"
}
```

---
## System Information
Returns detailed metrics on the host system.

_Operation is restricted to super_user roles only_

* operation _(required)_ - must always be `system_information`
* attributes _(optional)_ - string array of top level attributes desired in the response, if no value is supplied all attributes will be returned. Available attributes are: ['system', 'time', 'cpu', 'memory', 'disk', 'network', 'harperdb_processes', 'table_size', 'metrics', 'threads', 'replication']

### Body
```json
{
  "operation": "system_information"
}
```
