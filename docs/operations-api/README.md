# HarperDB Operations API

The operations API provides a full set of capabilities for configuring, deploying, adminstering, and controlling HarperDB. To send operations to the operations API, you send POST requests to the operations API endpoint, which [defaults to port 9925](../configuration.md), on the root path, where the body is the operations object. These requests need to authenticated, which can be done with [basic auth](../security/basic-auth.md) or [JWT authentication](../security/jwt-auth.md). 

* [Quick Start Examples](quickstart-examples.md)
* [Schemas and Tables](schemas-and-tables.md)
* [NoSQL Operations](nosql-operations.md)
* [Bulk Operations](bulk-operations.md)
* [Users and Roles](users-and-roles.md)
* [Clustering](clustering.md)
* [Custom Functions](custom-functions.md)
* [Registration](registration.md)
* [Jobs](jobs.md)
* [Logs](logs.md)
* [Utilities](utilities.md)
* [Token Authentication](token-authentication.md)
* [SQL Operations](sql-operations.md)
* [Advanced JSON SQL Examples](advanced-json-sql-examples.md)

• <a href="https://olddocs.harperdb.io">Past Release API Documentation</a>