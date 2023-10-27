# Utilities

### Restart

Restarts HarperDB.

_Operation is restricted to super\_user roles only_

```json
{
  "operation": "restart"
}
```
---
### Restart Service

Restarts servers for the specified HarperDB service.

_Operation is restricted to super\_user roles only_

* operation _(required)_ - must always be `restart_service`.
* service _(required)_ - service to restart, options are:
  * `http_workers`
  * `clustering`
  * `clustering_config`
---
### Delete Records Before

Delete data before the specified timestamp on the specified database table exclusively on the node where it is executed. Any clustered nodes with replicated data will retain that data.

_Operation is restricted to super\_user roles only_

* operation _(required)_ - must always be `delete_records_before`.
* date _(required)_ - records older than this date will be deleted. Supported format looks like: _YYYY-MM-DDThh:mm:ss.sZ_
* database _(optional)_ - name of the database where you are deleting your data. Will default to `data`.
* table _(required)_ - name of the table where you are deleting your data.

#### Body
```json
{
  "operation": "delete_records_before",
  "date": "2021-01-25T23:05:27.464",
  "database": "dev",
  "table": "breed"
}
  ```
#### Response: 200
```json
{
  "message": "Starting job with id d3aed926-e9fe-4ec1-aea7-0fb4451bd373"
}
 ```
---
### Export Local
Exports data based on a given search operation to a local file in JSON or CSV format.

* operation _(required)_ - must always be `export_local`
* format _(required)_ - the format you wish to export the data, options are json & csv
* path _(required)_ - path local to the server to export the data
* search\_operation _(required)_ - search\_operation of search\_by\_hash, search\_by\_value or sql
#### Body
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
#### Response: 200
```json
{
  "message": "Starting job with id 6fc18eaa-3504-4374-815c-44840a12e7e5",
  "job_id": "6fc18eaa-3504-4374-815c-44840a12e7e5"
}
```
---

### Export To S3
Exports data based on a given search operation from table to AWS S3 in JSON or CSV format.

* operation _(required)_ - must always be `export_to_s3`.
* format _(required)_ - the format you wish to export the data, options are `json` & `csv`.
* s3 _(required)_ - details your access keys, bucket, bucket region and key for saving the data to S3.
* search\_operation _(required)_ - `search_operation` of `search_by_hash`, `search_by_value` or `sql`.

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
#### Response: 200
```json
{
  "message": "Starting job with id 9fa85968-4cb1-4008-976e-506c4b13fc4a",
  "job_id": "9fa85968-4cb1-4008-976e-506c4b13fc4a"
}
```
---
### Install Node Modules
Executes npm install against specified custom function projects

_Operation is restricted to super\_user roles only_

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
### System Information

Returns detailed metrics on the host system. A deeper dive into the return object can be found here: https://systeminformation.io/general.html.

_Operation is restricted to super\_user roles only_

* operation _(required)_ - must always be `system_information`.
#### Body
```json
{
  "operation": "system_information"
}
```
#### Response: 200
```json
{
  "system": {
    "platform": "darwin",
    "distro": "macOS",
    "release": "14.0",
    "codename": "Sonoma",
    "kernel": "23.0.0",
    "arch": "x64",
    "hostname": "MBP-2.lan",
    "fqdn": "MBP-2.lan",
    "node_version": "20.8.0",
    "npm_version": "10.1.0"
  },
  "time": {
    "current": 1698430848261,
    "uptime": 605082,
    "timezone": "GMT-0400",
    "timezoneName": "America/New_York"
  },
  "cpu": {
    "manufacturer": "Intel",
    "brand": "Core™ i7-8750H",
    "vendor": "GenuineIntel",
    "speed": 2.2,
    "speedMin": 2.2,
    "speedMax": 2.2,
    "cores": 12,
    "physicalCores": 6,
    "performanceCores": 12,
    "efficiencyCores": 0,
    "processors": 1,
    "flags": "fpu glim64 tsctmr avx1.0 rdrand f16c",
    "virtualization": true,
    "cpu_speed": {
      "min": 2.2,
      "max": 2.2,
      "avg": 2.2,
      "cores": [
        2.2,
        2.2,
        2.2
      ]
    },
    "current_load": {
      "avgLoad": 0.55,
      "currentLoad": 6.507083048292656,
      "currentLoadUser": 4.6255845052939595,
      "currentLoadSystem": 1.881498542998696,
      "currentLoadNice": 0,
      "currentLoadIdle": 93.49291695170734,
      "currentLoadIrq": 0,
      "currentLoadSteal": 0,
      "currentLoadGuest": 0,
      "rawCurrentLoad": 293439930,
      "rawCurrentLoadUser": 208592880,
      "rawCurrentLoadSystem": 84847050,
      "rawCurrentLoadNice": 0,
      "rawCurrentLoadIdle": 4216106480,
      "rawCurrentLoadIrq": 0,
      "rawCurrentLoadSteal": 0,
      "rawCurrentLoadGuest": 0,
      "cpus": [
        {
          "load": 20.523577635020136,
          "loadUser": 13.480090369929377,
          "loadSystem": 7.043487265090759,
          "loadNice": 0,
          "loadIdle": 79.47642236497987,
          "loadIrq": 0,
          "loadSteal": 0,
          "loadGuest": 0,
          "rawLoad": 76882740,
          "rawLoadUser": 50497350,
          "rawLoadSystem": 26385390,
          "rawLoadNice": 0,
          "rawLoadIdle": 297724170,
          "rawLoadIrq": 0,
          "rawLoadSteal": 0,
          "rawLoadGuest": 0
        },
        {
          "load": 0.5630032315262257,
          "loadUser": 0.39461924675543625,
          "loadSystem": 0.16838398477078942,
          "loadNice": 0,
          "loadIdle": 99.43699676847378,
          "loadIrq": 0,
          "loadSteal": 0,
          "loadGuest": 0,
          "rawLoad": 2119220,
          "rawLoadUser": 1485400,
          "rawLoadSystem": 633820,
          "rawLoadNice": 0,
          "rawLoadIdle": 374294250,
          "rawLoadIrq": 0,
          "rawLoadSteal": 0,
          "rawLoadGuest": 0
        }
      ]
    }
  },
  "memory": {
    "total": 17179869184,
    "free": 200392704,
    "used": 16979476480,
    "active": 5965402112,
    "available": 11214467072,
    "swaptotal": 5368709120,
    "swapused": 3894411264,
    "swapfree": 1474297856,
    "writeback": null,
    "dirty": null,
    "rss": 1176166400,
    "heapTotal": 83496960,
    "heapUsed": 78708944,
    "external": 3722905,
    "arrayBuffers": 146757
  },
  "disk": {
    "io": {
      "rIO": 47597923,
      "wIO": 13504514,
      "tIO": 61102437,
      "rWaitTime": 0,
      "wWaitTime": 0,
      "tWaitTime": 0,
      "rWaitPercent": null,
      "wWaitPercent": null,
      "tWaitPercent": null
    },
    "read_write": {
      "rx": 358183473152,
      "wx": 201397522432,
      "tx": 559580995584,
      "ms": 0
    },
    "size": [
      {
        "fs": "/dev/disk1s5s1",
        "type": "APFS",
        "size": 250685575168,
        "used": 9818411008,
        "available": 77943095296,
        "use": 11.19,
        "mount": "/",
        "rw": false
      }
    ]
  },
  "network": {
    "default_interface": "en0",
    "latency": {
      "url": "google.com",
      "ok": true,
      "status": 301,
      "ms": 244
    },
    "interfaces": [
      {
        "iface": "lo0",
        "ifaceName": "lo0",
        "default": false,
        "ip4": "177.0.0.1",
        "ip4subnet": "277.0.0.0",
        "ip6": "::1",
        "ip6subnet": "ffff:ffff:ffff:ffff::",
        "mac": "",
        "operstate": "unknown",
        "type": "wired",
        "duplex": "full",
        "speed": null,
        "carrierChanges": 0
      }
    ],
    "stats": [
      {
        "iface": "en0",
        "operstate": "up",
        "rx_bytes": 41534464072,
        "rx_dropped": 0,
        "rx_errors": 0,
        "tx_bytes": 2583970506,
        "tx_dropped": 0,
        "tx_errors": 0
      }
    ],
    "connections": []
  },
  "harperdb_processes": {
    "core": [
      {
        "pid": 29,
        "parentPid": 34,
        "name": "node harperdb.js",
        "cpu": 7.8,
        "cpuu": 0,
        "cpus": 0,
        "mem": 6.8,
        "priority": 31,
        "memVsz": 43335672,
        "memRss": 1148236,
        "nice": 0,
        "started": "2023-10-27 14:20:11",
        "state": "sleeping",
        "tty": "ttys002",
        "user": "david",
        "command": "node harperdb.js",
        "params": "--LOGGING_LEVEL trace",
        "path": ""
      }
    ],
    "clustering": [
      {
        "pid": 2919,
        "parentPid": 2903,
        "name": "nats-server",
        "cpu": 0,
        "cpuu": 0,
        "cpus": 0,
        "mem": 0.1,
        "priority": 31,
        "memVsz": 35395268,
        "memRss": 15800,
        "nice": 0,
        "started": "2023-10-27 14:20:22",
        "state": "sleeping",
        "tty": "ttys002",
        "user": "david",
        "command": "nats-server",
        "params": "-c /Users/hdb/clustering/leaf.json",
        "path": "/Users/Desktop/harperdb/dependencies/darwin-x64"
      },
      {
        "pid": 2917,
        "parentPid": 2903,
        "name": "nats-server",
        "cpu": 0,
        "cpuu": 0,
        "cpus": 0,
        "mem": 0.1,
        "priority": 31,
        "memVsz": 35392684,
        "memRss": 11356,
        "nice": 0,
        "started": "2023-10-27 14:20:18",
        "state": "sleeping",
        "tty": "ttys002",
        "user": "harper",
        "command": "nats-server",
        "params": "-c /Users/hdb/clustering/hub.json",
        "path": "/Users/Desktop/harperdb/dependencies/darwin-x64"
      }
    ]
  },
  "table_size": [],
  "metrics": {},
  "threads": [
    {
      "threadId": 1,
      "name": "Clustering Reply Service",
      "heapTotal": 57307136,
      "heapUsed": 54153224,
      "externalMemory": 3399363,
      "arrayBuffers": 118215,
      "sinceLastUpdate": 182,
      "idle": 1000.9556090000005,
      "active": 0.116231047835754,
      "utilization": 0.00011610660013191449
    },
    {
      "threadId": 2,
      "name": "http",
      "heapTotal": 81661952,
      "heapUsed": 77778672,
      "externalMemory": 3722712,
      "arrayBuffers": 146564,
      "sinceLastUpdate": 349,
      "idle": 1000.9485199999981,
      "active": 0.13058799980353797,
      "utilization": 0.00013044723315069307
    }
  ],
  "replication": {
    "ingest": {
      "stream": {
        "messages": 0,
        "bytes": 0,
        "first_seq": 0,
        "first_ts": "0001-01-01T00:00:00Z",
        "last_seq": 0,
        "last_ts": "0001-01-01T00:00:00Z",
        "consumer_count": 1
      },
      "consumer": {
        "num_ack_pending": 0,
        "num_redelivered": 0,
        "num_waiting": 2,
        "num_pending": 0
      }
    }
  }
}
```
---
### Set Configuration

Modifies the HarperDB configuration file parameters. Must follow with a restart or restart_service operation.

_Operation is restricted to super\_user roles only_

* operation _(required)_ - must always be `set_configuration`
* logging_level _(example/optional)_ - one or more configuration keywords to be updated in the HarperDB configuration file.
* clustering_enabled _(example/optional)_ - one or more configuration keywords to be updated in the HarperDB configuration file.

#### Body
```json
{
  "operation": "set_configuration",
  "logging_level": "trace",
  "clustering_enabled": true
}
```
#### Response: 200
```json
{
  "message": "Configuration successfully set. You must restart HarperDB for new config settings to take effect."
}
```
---

### Get Configuration

Returns the HarperDB configuration parameters.

_Operation is restricted to super\_user roles only_.

* operation _(required)_ - must always be `get_configuration`.

#### Body
```json
{
  "operation": "get_configuration"
}
```

#### Response 200
```json
{
    "http": {
        "compressionThreshold": 1200,
        "cors": false,
        "corsAccessList": [
            null
        ],
        "keepAliveTimeout": 30000,
        "port": 9926,
        "securePort": null,
        "timeout": 120000
    },
    "threads": 11,
    "authentication": {
        "cacheTTL": 30000,
        "enableSessions": true,
        "operationTokenTimeout": "1d",
        "refreshTokenTimeout": "30d"
    },
    "analytics": {
        "aggregatePeriod": 60
    },
    "clustering": {
        "enabled": true,
        "hubServer": {
            "cluster": {
                "name": "harperdb",
                "network": {
                    "port": 12345,
                    "routes": null
                }
            },
            "leafNodes": {
                "network": {
                    "port": 9931
                }
            },
            "network": {
                "port": 9930
            }
        },
        "leafServer": {
            "network": {
                "port": 9940,
                "routes": null
            },
            "streams": {
                "maxAge": null,
                "maxBytes": null,
                "maxMsgs": null,
                "path": "/Users/hdb/clustering/leaf"
            }
        },
        "logLevel": "info",
        "nodeName": "local",
        "republishMessages": false,
        "tls": {
            "certificate": "/Users/certificate.pem",
            "certificateAuthority": "/Users/ca.pem",
            "privateKey": "/Users/privateKey.pem",
            "insecure": true,
            "verify": true
        },
        "user": "cluster_user"
    },
    "componentsRoot": "/Users/hdb/components",
    "localStudio": {
        "enabled": false
    },
    "logging": {
        "auditAuthEvents": {
            "logFailed": false,
            "logSuccessful": false
        },
        "auditLog": true,
        "auditRetention": "3d",
        "file": true,
        "level": "trace",
        "root": "/Users/hdb/log",
        "rotation": {
            "enabled": false,
            "compress": false,
            "interval": null,
            "maxSize": null,
            "path": "/Users/hdb/log"
        },
        "stdStreams": false
    },
    "mqtt": {
        "network": {
            "port": 1883,
            "securePort": 8883
        },
        "webSocket": true,
        "requireAuthentication": true
    },
    "operationsApi": {
        "network": {
            "cors": true,
            "corsAccessList": [
                "*"
            ],
            "port": 9925,
            "securePort": null
        }
    },
    "rootPath": "/Users/hdb",
    "storage": {
        "writeAsync": false,
        "caching": true,
        "compression": false,
        "noReadAhead": true,
        "path": "/Users/hdb/database",
        "prefetchWrites": true
    },
    "tls": {
        "certificate": "/Users/certificate.pem",
        "certificateAuthority": "/Users/ca.pem",
        "privateKey": "/Users/privateKey.pem"
    }
}
```