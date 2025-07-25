# Operations API

The operations API provides a full set of capabilities for configuring, deploying, administering, and controlling Harper. To send operations to the operations API, you send a POST request to the operations API endpoint, which [defaults to port 9925](../../deployments/configuration.md#operationsapi), on the root path, where the body is the operations object. These requests need to authenticated, which can be done with [basic auth](../security/basic-auth.md) or [JWT authentication](../security/jwt-auth.md). For example, a request to create a table would be performed as:

```http
POST http://my-harperdb-server:9925/
Authorization: Basic YourBase64EncodedInstanceUser:Pass
Content-Type: application/json

{
    "operation": "create_table",
    "table": "my-table"
}
```

The operations API reference is available below and categorized by topic:

* [Quick Start Examples](quickstart-examples.md)
* [Databases and Tables](databases-and-tables.md)
* [NoSQL Operations](nosql-operations.md)
* [Bulk Operations](bulk-operations.md)
* [Users and Roles](users-and-roles.md)
* [Clustering](clustering.md)
* [Clustering with NATS](clustering-nats.md)
* [Components](components.md)
* [Registration](registration.md)
* [Jobs](jobs.md)
* [Logs](logs.md)
* [System Operations](system-operations.md)
* [Configuration](configuration.md)
* [Certificate Management](certificate-management.md)
* [Token Authentication](token-authentication.md)
* [SQL Operations](sql-operations.md)
* [Advanced JSON SQL Examples](advanced-json-sql-examples.md)
* [Analytics](analytics.md)

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
