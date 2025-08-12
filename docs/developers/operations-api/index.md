---
title: Operations API
---

# Operations API

The operations API provides a full set of capabilities for configuring, deploying, administering, and controlling Harper. To send operations to the operations API, you send a POST request to the operations API endpoint, which [defaults to port 9925](../../deployments/configuration#operationsapi), on the root path, where the body is the operations object. These requests need to authenticated, which can be done with [basic auth](../security/basic-auth) or [JWT authentication](../security/jwt-auth). For example, a request to create a table would be performed as:

```http
POST https://my-harperdb-server:9925/
Authorization: Basic YourBase64EncodedInstanceUser:Pass
Content-Type: application/json

{
    "operation": "create_table",
    "table": "my-table"
}
```

The operations API reference is available below and categorized by topic:

* [Quick Start Examples](quickstart-examples)
* [Databases and Tables](databases-and-tables)
* [NoSQL Operations](nosql-operations)
* [Bulk Operations](bulk-operations)
* [Users and Roles](users-and-roles)
* [Clustering](clustering)
* [Clustering with NATS](clustering-nats)
* [Components](components)
* [Registration](registration)
* [Jobs](jobs)
* [Logs](logs)
* [System Operations](system-operations)
* [Configuration](configuration)
* [Certificate Management](certificate-management)
* [Token Authentication](token-authentication)
* [SQL Operations](sql-operations)
* [Advanced JSON SQL Examples](advanced-json-sql-examples)
* [Analytics](analytics)

• [Past Release API Documentation](https://olddocs.harperdb.io)

## More Examples

Here is an example of using `curl` to make an operations API request:

```bash
curl --location --request POST 'https://instance-subdomain.harperdbcloud.com' \
--header 'Authorization: Basic YourBase64EncodedInstanceUser:Pass' \
--header 'Content-Type: application/json' \
--data-raw '{
"operation": "create_schema",
"schema": "dev"
}'
```
