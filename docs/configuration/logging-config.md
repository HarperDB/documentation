# `logging`

The `logging` section configures HarperDB logging across all HarperDB functionality. HarperDB leverages pm2 for logging. Each process group gets their own log file which is located in `logging.root`.

`auditLog` - _Type_: boolean; _Default_: false

Enabled table transaction logging.

```yaml
logging:
  auditLog: false
```

To access the audit logs, use the API operation `read_audit_log`. It will provide a history of the data, including original records and changes made, in a specified table.
```json
{
  "operation": "read_audit_log",
  "schema": "dev",
  "table": "dog"
}
````
`file` - _Type_: boolean; _Default_: true

Defines whether or not to log to a file.

```yaml
logging:
  file: true
```

`level` - _Type_: string; _Default_: error

Control the verbosity of logs.

```yaml
logging:
  level: error
```
There exists a log level hierarchy in order as `trace`, `debug`, `info`, `warn`, `error`, `fatal`, and `notify`. When the level is set to `trace` logs will be created for all possible levels. Whereas if the level is set to `fatal`, the only entries logged will be `fatal` and `notify`. The default value is `error`.

`root` - _Type_: string; _Default_: &lt;ROOTPATH>/log

The path where the log files will be written.

```yaml
logging:
  root: ~/hdb/log
```

`rotation`

Rotation provides the ability for a user to systematically rotate and archive the `hdb.log` file. To enable `interval` and/or `maxSize` must be set.

**_Note:_** `interval` and `maxSize` are approximates only. It is possible that the log file will exceed these values slightly before it is rotated.

```yaml
logging:
  rotation:
    enabled: true
    compress: false
    interval: 1D
    maxSize: 100K
    path: /user/hdb/log
```
<div style="padding-left: 30px;">

`enabled` - _Type_: boolean; _Default_: false

Enables logging rotation.

`compress` - _Type_: boolean; _Default_: false

Enables compression via gzip when logs are rotated.

`interval` - _Type_: string; _Default_: null

The time that should elapse between rotations. Acceptable units are D(ays), H(ours) or M(inutes).

`maxSize` - _Type_: string; _Default_: null

The maximum size the log file can reach before it is rotated. Must use units M(egabyte), G(igabyte), or K(ilobyte).

`path` - _Type_: string; _Default_: &lt;ROOTPATH>/log

Where to store the rotated log file. File naming convention is `HDB-YYYY-MM-DDT-HH-MM-SSSZ.log`.

</div>


`stdStreams` - _Type_: boolean; _Default_: false

Log HarperDB logs to the standard output and error streams. The `operationsApi.foreground` flag must be enabled in order to receive the stream.

```yaml
logging:
  stdStreams: false
```
