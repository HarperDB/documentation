---
title: Operations API
---

# Operations API

Think of the Operations API as the command center for Harper. It’s the layer that lets you create databases and tables, insert and query data, monitor system health, and even fine-tune configuration, all through JSON calls. Instead of jumping between tools or UIs, the API gives you everything you need to shape your data story programmatically.

To show you how it works, we’ll use a familiar example: building a database for our company’s dogs 🐶. Step by step, we’ll go from nothing to a working system, and along the way, you’ll see how easy it is to extend Harper as your needs grow.

For full details on every operation, check out the [Operations API reference](../../reference/operations-api/). But for now, let’s walk through the journey.

## Step 1: Create a Database

Everything in Harper starts with a database. Think of it as the logical container for your tables and data. If you don’t explicitly create one, Harper defaults to a database called data. But let’s create our own to keep things organized.

```json
{
  "operation": "create_database",
  "database": "dev"
}
```

If successful, Harper responds with:

```json
{
  "message": "database 'dev' successfully created"
}
```

👉 See more in the [Databases and Tables reference](../../reference/operations-api/databases-and-tables)

## Step 2: Create a Table

Inside our database, we’ll create a table to store information about dogs. Every table needs a primary key. In Harper, this is often an `id`.

```json
{
  "operation": "create_table",
  "database": "dev",
  "table": "dog",
  "primary_key": "id"
}
```

Response:

```json
{
  "message": "table 'dev.dog' successfully created."
}
```

Just like that, you now have a table ready to accept records.

## Step 3: Insert Data

Let’s add our first record: Penny, a dog we care about.

```json
{
  "operation": "insert",
  "database": "dev",
  "table": "dog",
  "records": [
    {
      "id": 1,
      "dog_name": "Penny",
      "owner_name": "Kyle",
      "breed_id": 154,
      "age": 7,
      "weight_lbs": 38
    }
  ]
}
```

Response:

```json
{
  "message": "inserted 1 of 1 records",
  "inserted_hashes": [1],
  "skipped_hashes": []
}
```

Harper makes inserts painless. If you add new attributes not defined in the schema, Harper will create them automatically unless you’ve locked things down with explicit attributes.

More examples in the [NoSQL Operations reference](../../reference/operations-api/nosql-operations).

## Step 4: Query Data

Now that we have data, let’s retrieve it. You can query using NoSQL operations like `search_by_id` or `search_by_value`, or you can use SQL.

**NoSQL Example**:
```json
{
  "operation": "search_by_id",
  "database": "dev",
  "table": "dog",
  "ids": [1],
  "get_attributes": ["dog_name", "owner_name"]
}
```

Response:
```json
[
  {
    "dog_name": "Penny",
    "owner_name": "Kyle"
  }
]
```

**SQL Example:**
```json
{
  "operation": "sql",
  "sql": "SELECT * FROM dev.dog WHERE id = 1"
}
```

Response:
```json
[
  {
    "id": 1,
    "dog_name": "Penny",
    "owner_name": "Kyle",
    "age": 7,
    "weight_lbs": 38,
    "breed_id": 154
  }
]
```

👉 Explore more in the [SQL Operations reference](../../reference/operations-api/sql-operations)

## Step 5: Update Data

Dogs grow and change, and so does data. Updating Penny’s name is as simple as:

```json
{
  "operation": "update",
  "database": "dev",
  "table": "dog",
  "records": [
    {
      "id": 1,
      "dog_name": "Penny B"
    }
  ]
}
```

Response:

```json
{
  "message": "updated 1 of 1 records",
  "update_hashes": [1],
  "skipped_hashes": []
}
```

## Step 6: Monitor Jobs and Logs

Harper tracks background jobs (like CSV imports) and system logs (like errors or warnings).

**Check a job:**

```json
{
  "operation": "get_job",
  "id": "4a982782-929a-4507-8794-26dae1132def"
}
```

**Read logs:**
```json
{
  "operation": "read_log",
  "limit": 100,
  "level": "error"
}
```

This is critical when you’re troubleshooting imports or watching for application errors. See [Jobs](../../reference/operations-api/jobs) and [Logs](../../reference/operations-api/logs) for full coverage.

## Step 7: Tune Configuration and Restart

As workloads grow, you might want to adjust configuration. For example, increasing logging verbosity or enabling clustering.

```json
{
  "operation": "set_configuration",
  "logging_level": "trace",
  "clustering_enabled": true
}
```

Changes require a restart:

```json
{
  "operation": "restart"
}
```

Full details in the [Configuration](../../reference/operations-api/configuration) and [System Operations](../../reference/operations-api/system-operations) docs.

## Step 8: Secure Your Instance

Harper gives you fine-grained control over who can do what. You can create roles, assign permissions, and manage users.

Add a role:

```json
{
  "operation": "add_role",
  "role": "developer",
  "permission": {
    "dev": {
      "tables": {
        "dog": {
          "read": true,
          "insert": true,
          "update": true,
          "delete": false
        }
      }
    }
  }
}
```

Add a user:

```json
{
  "operation": "add_user",
  "role": "developer",
  "username": "hdb_user",
  "password": "password",
  "active": true
}
```

For token-based authentication:

```json
{
  "operation": "create_authentication_tokens",
  "username": "hdb_user",
  "password": "password"
}
```

More in [Users and Roles](../../reference/operations-api/users-and-roles) and [Token Authentication](../../reference/operations-api/token-authentication).

## Step 9: Advanced Operations

Finally, Harper provides deeper operational tools when you need them:
- Backups with `get_backup`
- Audit logs with `read_audit_log`
- License management with `set_license`

See the [full Operations API reference](../../reference/operations-api/) for every option.

___

From creating a database and table to inserting data, querying with SQL or NoSQL, monitoring logs, tuning the system, and locking down security, the Operations API gives you the complete toolkit to run Harper programmatically.

It’s simple to start small (one table, one record) and grow into advanced scenarios as your application evolves. And since everything is JSON, you can automate workflows from day one.