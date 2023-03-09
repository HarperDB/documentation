# Transaction Logging

HarperDB offers two options for logging transactions executed against a table. The options are similar but utilize different storage layers.

## Transaction log

The transaction log is built upon clustering streams. Clustering streams are per-table message stores that enable data to be propagated across a cluster. HarperDB leverages streams for use with the transaction log. When clustering is enabled all transactions that occur against a table are pushed to its stream, and thus make up the transaction log.

If you would like to use the transaction log, but have not set up clustering yet, please see ["How to Cluster"](clustering/README.md).


## Transaction Log Operations

### read_transaction_log

The `read_transaction_log` operation returns a prescribed set of records, based on given parameters. The example below will give a maximum of 2 records within the timestamps provided.

```json
{
    "operation": "read_transaction_log",
    "schema": "dev",
    "table": "dog",
    "from": 1598290235769,
    "to": 1660249020865,
    "limit": 2
}
```

_See example response below._

### read_transaction_log Response


```json
[
    {
        "operation": "insert",
        "user": "admin",
        "timestamp": 1660165619736,
        "records": [
            {
                "id": 1,
                "dog_name": "Penny",
                "owner_name": "Kyle",
                "breed_id": 154,
                "age": 7,
                "weight_lbs": 38,
                "__updatedtime__": 1660165619688,
                "__createdtime__": 1660165619688
            }
        ]
    },
    {
        "operation": "update",
        "user": "admin",
        "timestamp": 1660165620040,
        "records": [
            {
                "id": 1,
                "dog_name": "Penny B",
                "__updatedtime__": 1660165620036
            }
        ]
    }
]
```

_See example request above._

### delete_transaction_logs_before

The `delete_transaction_logs_before` operation will delete transaction log data according to the given parameters. The example below will delete records older than the timestamp provided.

```json
{
    "operation": "delete_transaction_logs_before",
    "schema": "dev",
    "table": "dog",
    "timestamp": 1598290282817
}
```

_Note: Streams are used for catchup if a node goes down. If you delete messages from a stream there is a chance catchup won't work._

---

## Audit log

The audit log uses a standard HarperDB table to track transactions. For each table a user creates, a corresponding table will be created to track transactions against that table.

Audit log is disabled by default. To use the audit log, set `logging.auditLog` to true in the config file, `harperdb-config.yaml`. Then restart HarperDB for those changes to take place.

## Audit Log Operations

### read_audit_log

The `read_audit_log` operation is flexible, enabling users to query with many parameters. All operations search on a single table. Filter options include timestamps, usernames, and table hash values. Additional examples found in the [HarperDB API documentation](https://api.harperdb.io/).

**Search by Timestamp**

```json
{
    "operation": "read_audit_log",
    "schema": "dev",
    "table": "dog",
    "search_type": "timestamp",
    "search_values": [
        1660585740558
    ]
}
```

There are three outcomes using timestamp.
* `"search_values": []` - All records returned for specified table
* `"search_values": [1660585740558]` - All records after provided timestamp
* `"search_values": [1660585740558, 1760585759710]` - Records "from" and "to" provided timestamp

---

**Search by Username**

```json
{
    "operation": "read_audit_log",
    "schema": "dev",
    "table": "dog",
    "search_type": "username",
    "search_values": [
        "admin"
    ]
}
```

The above example will return all records whose `username` is "admin."

---

**Search by Primary Key**

```json
{
    "operation": "read_audit_log",
    "schema": "dev",
    "table": "dog",
    "search_type": "hash_value",
    "search_values": [
        318
    ]
}
```

The above example will return all records whose primary key (`hash_value`) is 318.
___

### read_audit_log Response

The example that follows provides records of operations performed on a table. One thing of note is that this the `read_audit_log` operation gives you the `original_records`.

```json
{
    "operation": "update",
    "user_name": "HDB_ADMIN",
    "timestamp": 1607035559122.277,
    "hash_values": [
        1,
        2
    ],
    "records": [
        {
            "id": 1,
            "breed": "Muttzilla",
            "age": 6,
            "__updatedtime__": 1607035559122
        },
        {
            "id": 2,
            "age": 7,
            "__updatedtime__": 1607035559121
        }
    ],
    "original_records": [
        {
            "__createdtime__": 1607035556801,
            "__updatedtime__": 1607035556801,
            "age": 5,
            "breed": "Mutt",
            "id": 2,
            "name": "Penny"
        },
        {
            "__createdtime__": 1607035556801,
            "__updatedtime__": 1607035556801,
            "age": 5,
            "breed": "Mutt",
            "id": 1,
            "name": "Harper"
        }
    ]
}
```
### delete_audit_logs_before

Just like with transaction logs, you can clean up your audit logs with the `delete_audit_logs_before` operation. It will delete audit log data according to the given parameters. The example below will delete records older than the timestamp provided.

```json
{
    "operation": "delete_audit_logs_before",
    "schema": "dev",
    "table": "cat",
    "timestamp": 1598290282817
}
```
