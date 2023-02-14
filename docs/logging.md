# Logging

HarperDB maintains a log of events that take place throughout operation. Log messages can be used for diagnostics purposes as well as monitoring.

All logs (except for the install log) are stored in the hdb directory `<ROOTPATH>/log`. The install log is located in the HarperDB application directory most likely located in your npm directory `npm/harperdb/logs`.

Each log message has an associated log level that gives a rough guide to the importance and urgency of the message. The available log levels in order of least urgent (and more verbose) are: `trace`, `debug`, `info`, `warn`, `error`, `fatal`, and `notify`.

We try to keep logging to a minimum by default, to do this the default log level is `error`. If you require more information from the logs, dropping the log level down will provide that.

The log level can be changed by modifying `logging.level` in the config file `harperdb-config.yaml`.

The HarperDB log writes messages as JSON objects, each containing the following attributes:

* process: The name of the process being logged, such as “Run” 
* level: The severity of the message. Possible options are `trace`, `debug`, `info`, `warn`, `error`, `fatal`, and `notify`. 
* timestamp: The timestamp of the message in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) format. 
* message: The message that supports the purpose of the log.

```json
{
    "process": "Run",
    "level": "notify",
    "timestamp": "2022-08-17T21:09:05.852Z",
    "message": "HarperDB successfully started"
}
```


HarperDB leverages [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/), a process manager for Node.js applications, for logging. HarperDB has multiple process groups, in some cases each one gets its own log file. Below is a description of each one of those process groups and corresponding log files.

---

### install.log
Because the `hdb/log` directory does not exist when first installing HarperDB the install log is located in the HarperDB application directory most likely located in your npm directory `npm/harperdb/logs`. The install log will contain any logs related to install.

### hdb.log
Captures logs from all `HarperDB` processes. These processes are responsible for running HarperDB’s operations API and the majority of business logic that goes into executing these requests.

This log is one of the more active logs and is a great place to start if the API responds with an error or if you’re not sure what log file to begin with.

### clustering_hub.log
The clustering hub log tracks all logs for the local hub server. The hub server's main job is to connect with hub servers on other HarperDB nodes. When routes (host and port of remote node) are added to the cluster the hub server will log whether it was able to connect to that route (remote node) or not. This can be helpful when setting up or debugging clustering connections.

### clustering_leaf.log
The clustering leaf log is the log for the local leaf server. The leaf server manages streams, streams are **table** message stores that connect to other streams on other HarperDB nodes. Stream to stream communication is what enables propagation of data across the cluster. The `clustering_leaf.log` is a good place to look if there is an issue with a subscription between tables on different nodes.

---

## Log File vs Standard Streams

HarperDB logs can optionally be streamed to standard streams. Logging to standard streams (stdout/stderr) is primarily used for container logging drivers. For more traditional installations, we recommend logging to a file. Logging to both standard streams and to a file can be enabled simultaneously.
To log to standard streams effectively, both `operationsApi.foreground` and `logging.stdStreams` must be set to true. Note, logging to standard streams only will disable clustering catchup.

## Logging Rotation

Log rotation is managed by a pm2 module called logrotate. The various settings allow for managing log files, such as compressing rotated log files, archiving old log files, determining when to rotate, and the like. This will allow for organized storage and efficient use of disk space. For more information see “logging” in our [config docs](configuration.md).

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



