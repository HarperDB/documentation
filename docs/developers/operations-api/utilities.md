# Utilities

## Delete Records Before

Delete data before the specified timestamp on the specified database table exclusively on the node where it is executed. Any clustered nodes with replicated data will retain that data.

_Operation is restricted to super_user roles only_

* operation _(required)_ - must always be `delete_records_before`
* date _(required)_ - records older than this date will be deleted. Supported format looks like: `YYYY-MM-DDThh:mm:ss.sZ`
* schema _(required)_ - name of the schema where you are deleting your data
* table _(required)_ - name of the table where you are deleting your data

### Body
```json
{
  "operation": "delete_records_before",
  "date": "2021-01-25T23:05:27.464",
  "schema": "dev",
  "table": "breed"
}
```

### Response: 200
```json
{
  "message": "Starting job with id d3aed926-e9fe-4ec1-aea7-0fb4451bd373",
  "job_id": "d3aed926-e9fe-4ec1-aea7-0fb4451bd373"
}
```

---

## Export Local
Exports data based on a given search operation to a local file in JSON or CSV format.

* operation _(required)_ - must always be `export_local`
* format _(required)_ - the format you wish to export the data, options are `json` & `csv`
* path _(required)_ - path local to the server to export the data
* search_operation _(required)_ - search_operation of `search_by_hash`, `search_by_value` or `sql`

### Body
```json
{
  "operation": "export_local",
  "format": "json",
  "path": "/data/",
  "search_operation": {
      "operation": "sql",
      "sql": "SELECT * FROM dev.breed"
  }
}
```

### Response: 200
```json
{
  "message": "Starting job with id 6fc18eaa-3504-4374-815c-44840a12e7e5"
}
```

---

## Export To S3
Exports data based on a given search operation from table to AWS S3 in JSON or CSV format.

* operation _(required)_ - must always be `export_to_s3`
* format _(required)_ - the format you wish to export the data, options are `json` & `csv`
* s3 _(required)_ - details your access keys, bucket, bucket region and key for saving the data to S3
* search_operation _(required)_ - search_operation of `search_by_hash`, `search_by_value` or `sql`

#### Body
```json
{
    "operation": "export_to_s3",
    "format": "json",
    "s3": {
        "aws_access_key_id": "YOUR_KEY",
        "aws_secret_access_key": "YOUR_SECRET_KEY",
        "bucket": "BUCKET_NAME",
        "key": "OBJECT_NAME",
        "region": "BUCKET_REGION"
    },
    "search_operation": {
        "operation": "sql",
        "sql": "SELECT * FROM dev.dog"
    }
}
```

### Response: 200
```json
{
  "message": "Starting job with id 9fa85968-4cb1-4008-976e-506c4b13fc4a",
  "job_id": "9fa85968-4cb1-4008-976e-506c4b13fc4a"
}
```

---

## Install Node Modules
Executes npm install against specified custom function projects.

_Operation is restricted to super_user roles only_

* operation _(required)_ - must always be `install_node_modules`
* projects _(required)_ - must ba an array of custom functions projects.
* dry_run _(optional)_ - refers to the npm --dry-run flag: [https://docs.npmjs.com/cli/v8/commands/npm-install#dry-run](https://docs.npmjs.com/cli/v8/commands/npm-install#dry-run). Defaults to false.

### Body
```json
{
  "operation": "install_node_modules",
  "projects": [
    "dogs",
    "cats"
  ],
  "dry_run": true
}
```

---

## Set Configuration

Modifies the HarperDB configuration file parameters. Must follow with a restart or restart_service operation.

* operation _(required)_ - must always be `set_configuration`
* logging_level _(example/optional)_ - one or more configuration keywords to be updated in the HarperDB configuration file
* clustering_enabled _(example/optional)_ - one or more configuration keywords to be updated in the HarperDB configuration file

### Body
```json
{
  "operation": "set_configuration",
  "logging_level": "trace",
  "clustering_enabled": true
}
```

### Response: 200
```json
{
  "message": "Configuration successfully set. You must restart HarperDB for new config settings to take effect."
}
```