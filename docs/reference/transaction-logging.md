# Transaction Logging

HarperDB offers two options for logging transactions executed against a table. Both options are similar but utilize different storage layers.

## Transaction log

The transaction log is built upon clustering streams. Clustering streams are per-table message stores that enable data to be propagated across a cluster. HarperDB leverages streams for use with the transaction log. When clustering is enabled all transactions that occur against a table are pushed to its stream, and thus make up the transaction log.

To use the transaction log, clustering must be enabled. You can enable clustering by setting `clustering.enabled` to `true` in the config file, `harperdb-config.yaml`.

## Transaction Log Operations

The `read_transaction_log` operation returns a prescribed set of records, based on given parameters. The example below will give a maximum of 10 records within the timestamps provided.

```json
{
    "operation": "read_transaction_log",
    "schema": "dev",
    "table": "dog",
    "from": 1560249020865,
    "to": 1660585656639,
    "limit": 10
}
```

To free up space, the `delete_transaction_logs_before` operation will delete transaction log data according to the given parameters. The example below will delete records older than the timestamp provided.

```json
{
    "operation": "delete_transaction_logs_before",
    "schema": "dev",
    "table": "dog",
    "timestamp": 1598290282817
}
```

Mention - streams are used for catchup if a node goes down, if you delete messages from a stream there is a chance catchup won't work


Audit log
The audit log uses a standard HarperDB table to track transactions. Each table a user creates a corresponding table will be created to track transactions against that table.

Audit log is disabled by default, to enable it set….

___

---









Transaction logs supply a history of data including transactions that occur in tables such as, but not limited to, insert or update. The logs can be useful for diagnostic and auditing purposes. 

There are two operations, `read_transaction_log` and `read_audit_log`, that return a prescribed set of records; along with two corresponding operations that allow you to free up space, `delete_transaction_logs_before` and `delete_audit_logs_before`. _Note: If a table is dropped, those logs will be dropped as well._

## read_transaction_log vs read_audit_log

While the reasons to use and the responses from each read operation are similar, there are some key differences. 
`read_audit_log` uses a HarperDB system table to track transactions when `logging.auditLog` is enabled; whereas `read_transaction_log` uses NATS/Clustering to track transactions. This means if you are a Clustering user, `read_transaction_log` is a great tool for accessing a table's data history, although you may still use `read_audit_log`. Conversely, if you're not using Clustering, `read_audit_log` is the tool for you, and you cannot use `read_transaction_log`. 

It should be stated that to use `read_audit_log`, you must enable `logging.auditLog` in the config file, `harperdb-config.yaml`. By default, this configuration is disabled.

|                                    | read_audit_log | read_transaction_log |
|------------------------------------|----------------|----------------------|
| auditLog must be enabled           | x              |                      |
| clustering must be enabled         |                | x                    |
| cluster user                       | x              | x                    |
| non cluster user                   | x              |                      |
| filter results with "limit"        |                | x                    |
| search by timestamp                | x              | x                    |
| search by timestamp with specifics | x              |                      |
| search by username                 | x              |                      |
| search by hash value               | x              |                      |
| log record with original records   | x              |                      |


## read_audit_log Operation Parameters

The `read_audit_log` is flexible, enabling users to query with many parameters. All operations search on a single table. Filter options include timestamps, usernames, and table hash values. Additional examples found in the [HarperDB API documentation](https://api.harperdb.io/).

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

**Search by Hash Value**

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

The above example will return all records whose `hash_value` is 318.

## read_transaction_log Operation Parameters

The `read_transaction_log` enabling users to query with `to`, `from`, and `limit`. All operations search on a single table. Additional examples found in the [HarperDB API documentation](https://api.harperdb.io/).

```json
{
    "operation": "read_transaction_log",
    "schema": "dev",
    "table": "dog",
    "from": 1560249020865,
    "to": 1660585656639,
    "limit": 10
}
```

The above example will give a maximum of 10 records within the timestamps provided.

## Transaction Log Metadata

Each transaction log record, obtained by either `read_audit_log`, or `read_transaction_log` may contain the following attributes:

* operation: The core operation executed on the table. 
* timestamp: The time the operation was executed in Unix Epoch in microseconds format. 
* hash_values: An array of the hash_value(s) of the records affected by the transaction. 
* records: An array of a copy of the newly created/changed records that are stored in the table after the transaction has executed. This attribute will not be included for delete operation records. 

Another difference between the two read operations, is that a record obtained with `read_audit_log` may also contain:

* original_records: An array of a copy of the records before the transaction was executed. This attribute will not be included for insert operation records.

## Example Transaction Log Messages

### Insert Records

```json
{
    "operation": "insert",
    "user_name": "HDB_ADMIN",
    "timestamp": 1607035556801.436,
    "hash_values": [
        1,
        2
    ],
    "records": [
        {
            "id": 1,
            "name": "Harper",
            "breed": "Mutt",
            "age": 5,
            "__updatedtime__": 1607035556801,
            "__createdtime__": 1607035556801
        },
        {
            "id": 2,
            "name": "Penny",
            "breed": "Mutt",
            "age": 5,
            "__updatedtime__": 1607035556801,
            "__createdtime__": 1607035556801
        }
    ]
}
```

### Update Records

_Note: Example log messages received when using `read_transaction_log` will result in the same as below, but without `original_records`._

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

### Delete Records

_Note: Example log messages received when using `read_transaction_log` will result in the same as below, but without `original_records`._

```json
{
    "operation": "delete",
    "user_name": "HDB_ADMIN",
    "timestamp": 1607035560774.546,
    "hash_values": [
        2
    ],
    "original_records": [
        {
            "__createdtime__": 1607035556801,
            "__updatedtime__": 1607035559121,
            "age": 7,
            "breed": "Mutt",
            "id": 2,
            "name": "Penny"
        }
    ]
}
```