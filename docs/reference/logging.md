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


HarperDB leverages [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/), a process manager for Node.js applications, for logging. HarperDB has multiple process groups, in most cases each one gets its own log file. Below is a description of each one of those process groups and corresponding log files.

---

### install.log
Because the `hdb/log` directory does not exist when first installing HarperDB the install log is located in the HarperDB application directory most likely located in your npm directory `npm/harperdb/logs`. The install log will contain any logs related to install.

### hdb.log
Captures logs from all `HarperDB` processes. These processes are responsible for running HarperDB’s operations API and the majority of business logic that goes into executing these requests.

This log is one of the more active logs and is a great place to start if the API responds with an error or if you’re note sure what log file to begin with.

### jobs.log
This log captures logs from all job processes. Some requests to HarperDB need a bit of time to run (for example csv data loads), in this scenario HarperDB starts a ‘job’. A job is a background process that is responsible for a single request. Each job gets a unique ID which is returned when the job is started. All job logs are written to the one log file `jobs.log`. To distinguish the logs apart the job ID is used in the log `process_name`.

If a job is started and an ID is returned but the job fails to complete, this is a good place to look.

### custom_functions.log
All logs within your Custom Function code will come here. Logging in Custom Functions is an essential part of the development process. The Custom Functions template includes a logger module which can be used to write to the `custom_functions.log` file. More information can be found [here](https://harperdb.io/docs/custom-functions/debugging-a-custom-function/).

### cli.log
Commands that are run from the command line–run, restart, stop, upgrade and register–are not managed by pm2. Any logs that are generated when running one of these commands will end up in the `cli.log`.

### pm2.log
PM2 is a daemon that is responsible for managing the majority of HarperDB’s processes. This daemon will log to the `pm2.log` file. If a pm2 managed process is started, stopped, restarted or terminated the event will be logged in this log. This log is native to the pm2 module, so it will not have any logs related to HarperDB operations.

### clustering_hub.log
The clustering hub log tracks all logs for the local hub server. The hub server's main job is to connect with hub servers on other HarperDB nodes. When routes (host and port of remote node) are added to the cluster the hub server will log whether it was able to connect to that route (remote node) or not. This can be helpful when setting up or debugging clustering connections.

### clustering_leaf.log
The clustering leaf log is the log for the local leaf server. The leaf server manages streams, streams are **table** message stores that connect to other streams on other HarperDB nodes. Stream to stream communication is what enables propagation of data across the cluster. The `clustering_leaf.log` is a good place to look if there is an issue with a subscription between tables on different nodes.

### clustering_ingest_service.log
The ingest service manages a stream called the work queue. The work queue has connections to streams (table message stores) on other HarperDB nodes. When a transaction occurs on a remote stream it is replicated to another node's work queue. The work queue manages all remote CRUD transactions at the table level. This log is great for tracking the propagation of data across the cluster to see if it is transacting on a particular node.

### clustering_reply_service.log
The reply service is responsible for processing requests from other nodes that want to add, update or delete subscriptions on its instance. It is also used for generating its cluster status. If there is an issue with any of these operations this is a good place to start.

### ipc.log
Because HarperDB runs multiple processes it needs to utilize interprocess communication. The `ipc.log` tracks this communication. If you are getting inconsistent results between processes this log could be helpful.

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



