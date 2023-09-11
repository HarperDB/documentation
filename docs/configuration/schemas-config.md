# `schemas`

The `schemas` section is an optional configuration that can be used to define where database files should reside down to the table level.

This configuration should be set before the schema and table have been created.

The configuration will not create the directories in the path, that must be done by the user.


To define where a schema and all its tables should reside use the name of your schema and the `path` parameter.

```yaml
schemas:
  nameOfSchema:
    path: /path/to/schema
```

To define where specific tables within a schema should reside use the name of your schema, the `tables` parameter, the name of your table and the `path` parameter.

```yaml
schemas:
  nameOfSchema:
    tables:
      nameOfTable:
        path: /path/to/table
```

This same pattern can be used to define where the audit log database files should reside. To do this use the `auditPath` parameter.

```yaml
schemas:
  nameOfSchema:
    auditPath: /path/to/schema
```
<br/>

**Setting the schemas section through the command line, environment variables or API**

When using command line variables,environment variables or the API to configure the schemas section a slightly different convention from the regular one should be used. To add one or more configurations use a JSON object array.

Using command line variables:
```bash
--SCHEMAS [{\"nameOfSchema\":{\"tables\":{\"nameOfTable\":{\"path\":\"\/path\/to\/table\"}}}}]
```

Using environment variables:
```bash
SCHEMAS=[{"nameOfSchema":{"tables":{"nameOfTable":{"path":"/path/to/table"}}}}]
```

Using the API:
```json
{
  "operation": "set_configuration",
  "schemas": [{
    "nameOfSchema": {
      "tables": {
        "nameOfTable": {
          "path": "/path/to/table"
        }
      }
    }
  }]
}
```
