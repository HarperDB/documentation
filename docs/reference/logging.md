# Logging

HarperDB maintains a log of events that take place throughout operation. Log messages can be used for diagnostics purposes as well as monitoring.

All logs (except for the install log) are stored in the main log file in the hdb directory `<ROOTPATH>/log/hdb.log`. The install log is located in the HarperDB application directory most likely located in your npm directory `npm/harperdb/logs`.

Each log message has several key components for consistent reporting of events. A log message has a format of:
```
<timestamp> [<thread/id> <level> <...other tags>]: <message>
```
The components of a log entry are:
* timestamp - This is the date/time stamp when the event occurred
* thread/id - This reports the name of the thread and the thread id, that the event was reported on. Note that NATS logs are recorded by their process name and there is no thread id for them since they are a separate process. Key threads are:
  * main - This is the thread that is responsible for managing all other threads and routes incoming requests to the other threads
  * http - These are the worker threads that handle the primary workload of incoming HTTP requests to the operations API and custom functions.
  * Clustering* - These are threads and processes that handle replication.
  * job - These are job threads that have been started to handle operations that are executed in a separate job thread.
* level - This is an associated log level that gives a rough guide to the importance and urgency of the message. The available log levels in order of least urgent (and more verbose) are: `trace`, `debug`, `info`, `warn`, `error`, `fatal`, and `notify`.
* tags - Logging from a custom function will include a "custom-function" tag in the log entry.
* message - This is the main message that was reported.  

We try to keep logging to a minimum by default, to do this the default log level is `error`. If you require more information from the logs, increasing the log level down will provide that.

The log level can be changed by modifying `logging.level` in the config file `harperdb-config.yaml`.


## Log File vs Standard Streams

HarperDB logs can optionally be streamed to standard streams. Logging to standard streams (stdout/stderr) is primarily used for container logging drivers. For more traditional installations, we recommend logging to a file. Logging to both standard streams and to a file can be enabled simultaneously.
To log to standard streams effectively, make sure to directly run `harperdb` and don't start it as a separate process (don't use `harperdb start`) and `logging.stdStreams` must be set to true. Note, logging to standard streams only will disable clustering catchup.

## Logging Rotation

Log rotation allows for managing log files, such as compressing rotated log files, archiving old log files, determining when to rotate, and the like. This will allow for organized storage and efficient use of disk space. For more information see “logging” in our [config docs](configuration.md).

## Read Logs via the API

To access specific logs you may query the HarperDB API. Logs can be queried using the `read_log` operation. `read_log` returns outputs from the log based on the provided search criteria.

```json
{
    "operation": "read_log",
    "start": 0,
    "limit": 1000,
    "level": "error",
    "from": "2021-01-25T22:05:27.464+0000",
    "until": "2021-01-25T23:05:27.464+0000",
    "order": "desc"
}
```



