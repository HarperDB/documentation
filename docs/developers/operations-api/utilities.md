# Utilities

## Delete Records Before

Delete data before the specified timestamp on the specified database table exclusively on the node where it is executed. Any clustered nodes with replicated data will retain that data.

_Operation is restricted to super\_user roles only_\\

* operation _(required)_ - must always be delete\_records\_before
* date _(required)_ - records older than this date will be deleted. Supported format looks like: _YYYY-MM-DDThh:mm:ss.sZ_
* schema _(required)_ - name of the schema where you are deleting your data
* table _(required)_ - name of the table where you are deleting your data
* **Body**
* ```json
  {
      "operation": "delete_records_before",
      "date": "2021-01-25T23:05:27.464",
      "schema": "dev",
      "table": "breed"
  }
  ```
* **Response: 200**
* ```json
  {
      "message": "Starting job with id d3aed926-e9fe-4ec1-aea7-0fb4451bd373"
  }
  ```
* ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
* #### Export Local
* Exports data based on a given search operation to a local file in JSON or CSV format.
*
  * operation _(required)_ - must always be export\_local
  * format _(required)_ - the format you wish to export the data, options are json & csv
  * path _(required)_ - path local to the server to export the data
  * search\_operation _(required)_ - search\_operation of search\_by\_hash, search\_by\_value or sql
  * **Body**
  * ```json
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
  * **Response: 200**
  * ```json
    {
        "message": "Starting job with id 6fc18eaa-3504-4374-815c-44840a12e7e5"
    }
    ```
  * ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
  * #### Export To S3
  * Exports data based on a given search operation from table to AWS S3 in JSON or CSV format.
  *
    * operation _(required)_ - must always be export\_to\_s3
    * format _(required)_ - the format you wish to export the data, options are json & csv
    * s3 _(required)_ - details your access keys, bucket, bucket region and key for saving the data to S3
    * search\_operation _(required)_ - search\_operation of search\_by\_hash, search\_by\_value or sql
  * **Body**
  * ```json
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
  * **Response: 200**
  * ```json
    {
        "message": "Starting job with id 9fa85968-4cb1-4008-976e-506c4b13fc4a"
    }
    ```
  * ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
  * #### Install Node Modules
  * Executes npm install against specified custom function projects
  * _Operation is restricted to super\_user roles only_
  *
    * operation _(required)_ - must always be install\_node\_modules
    * projects _(required)_ - must ba an array of custom functions projects.
    * dry\_run _(optional)_ - refers to the npm --dry-run flag: [https://docs.npmjs.com/cli/v8/commands/npm-install#dry-run](https://docs.npmjs.com/cli/v8/commands/npm-install#dry-run). Defaults to false.
  * Body{ "operation": "install\_node\_modules", "projects": \[ "dogs", "cats" ], "dry\_run": true}Response: 200{ "dogs": { "npm\_output": { "added": 0, "removed": 0, "changed": 0, "audited": 0, "funding": 0 }, "npm\_error": null }, "cats": { "npm\_output": { "added": 0, "removed": 0, "changed": 0, "audited": 0, "funding": 0 }, "npm\_error": null \}}⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃Audit Node ModulesExecutes command npm audit against specified components._Operation is restricted to super\_user roles only_
  *
    * operation _(required)_ - must always be audit\_node\_modulesprojects _(required)_ - must be an array of custom functions projects.
    * dry\_run _(optional)_ - refers to the npm --dry-run flag: [https://docs.npmjs.com/cli/v8/commands/npm-install#dry-run](https://docs.npmjs.com/cli/v8/commands/npm-install#dry-run). Defaults to false.
  * Body{ "operation": "audit\_node\_modules", "projects": \[ "dogs", "cats" ], "dry\_run": true}Response: 200{ "dogs": { "npm\_output": { "auditReportVersion": 2, "vulnerabilities": {}, "metadata": { "vulnerabilities": { "info": 0, "low": 0, "moderate": 0, "high": 0, "critical": 0, "total": 0 }, "dependencies": { "prod": 1, "dev": 0, "optional": 0, "peer": 0, "peerOptional": 0, "total": 0 } } }, "npm\_error": null }, "cats": { "npm\_output": { "auditReportVersion": 2, "vulnerabilities": {}, "metadata": { "vulnerabilities": { "info": 0, "low": 0, "moderate": 0, "high": 0, "critical": 0, "total": 0 }, "dependencies": { "prod": 1, "dev": 0, "optional": 0, "peer": 0, "peerOptional": 0, "total": 0 } } }, "npm\_error": null \}}⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃System InformationReturns detailed metrics on the host system. A deeper dive into the return object can be found here: https://systeminformation.io/general.html.\_Operation is restricted to super\_user roles only\_operation _(required)_ - must always be 'system\_information'attributes _(optional)_ - string array of top level attributes desired in the response, if no value is supplied all attributes will be returned. Available attributes are: \['system', 'time', 'cpu', 'memory', 'disk', 'network', 'harperdb\_processes', 'table\_size']Body{ "operation": "system\_information"}Response: 200{ "system": { "platform": "linux", "distro": "Ubuntu", "release": "18.04.4 LTS", "codename": "Bionic Beaver", "kernel": "5.3.0-46-generic", "arch": "x64", "hostname": "kyle3", "node\_version": "12.16.2", "npm\_version": "6.14.4" }, "time": { "current": 1587050190861, "uptime": 328, "timezone": "GMT-0600", "timezoneName": "Mountain Daylight Time" }, "cpu": { "manufacturer": "Intel®", "brand": "Core™ i7-6700HQ", "vendor": "GenuineIntel", "speed": "2.60", "cores": 4, "physicalCores": 2, "processors": 1, "cpu\_speed": { "min": 2.59, "max": 2.59, "avg": 2.59, "cores": \[ 2.59, 2.59, 2.59, 2.59 ] }, "current\_load": { "avgload": 0.09, "currentload": 11.070059788440902, "currentload\_user": 9.824467269661199, "currentload\_system": 1.1697071899432776, "currentload\_nice": 0.07588532883642496, "currentload\_idle": 88.9299402115591, "currentload\_irq": 0, "cpus": \[ { "load": 11.661726565394591, "load\_user": 10.361862418179573, "load\_system": 1.2628133876744474, "load\_nice": 0.037050759540570584, "load\_idle": 88.33827343460541, "load\_irq": 0 }, { "load": 10.828103474667076, "load\_user": 9.640287769784173, "load\_system": 1.1816929435175265, "load\_nice": 0.006122761365375784, "load\_idle": 89.17189652533293, "load\_irq": 0 }, { "load": 10.980608062641464, "load\_user": 9.567504740931057, "load\_system": 1.1653514406313084, "load\_nice": 0.2477518810790971, "load\_idle": 89.01939193735853, "load\_irq": 0 }, { "load": 10.815272215938618, "load\_user": 9.73313361660502, "load\_system": 1.0699110445388684, "load\_nice": 0.012227554794729924, "load\_idle": 89.18472778406138, "load\_irq": 0 } ] } }, "memory": { "total": 8118206464, "free": 4686876672, "used": 3431329792, "active": 2435858432, "available": 5682348032, "swaptotal": 1073737728, "swapused": 0, "swapfree": 1073737728 }, "disk": { "io": { "rIO": 38902, "wIO": 3786, "tIO": 42688 }, "read\_write": { "rx": 1000512512, "wx": 60686848, "tx": 1061199360, "ms": 0 }, "size": \[ { "fs": "/dev/sda1", "type": "ext4", "size": 12301357056, "used": 9956159488, "use": 80.94, "mount": "/" }, { "fs": "/dev/sda15", "type": "vfat", "size": 109422592, "used": 3756032, "use": 3.43, "mount": "/boot/efi" } ] }, "network": { "default\_interface": "eth0", "latency": { "url": "google.com", "ok": true, "status": 301, "ms": 72 }, "interfaces": \[ { "iface": "lo", "ifaceName": "lo", "ip4": "127.0.0.1", "ip6": "::1", "mac": "", "operstate": "unknown", "type": "virtual", "duplex": "", "speed": -1, "carrierChanges": 0 }, { "iface": "eth0", "ifaceName": "eth0", "ip4": "172.17.105.9", "ip6": "fe80::9ff5:a444:9e2c:5ef5", "mac": "00:15:5d:00:68:04", "operstate": "up", "type": "wired", "duplex": "full", "speed": 10000, "carrierChanges": 1 } ], "stats": \[ { "iface": "eth0", "operstate": "up", "rx\_bytes": 2669790, "rx\_dropped": 0, "rx\_errors": 0, "tx\_bytes": 88141, "tx\_dropped": 0, "tx\_errors": 0 } ], "connections": \[ { "protocol": "tcp", "localaddress": "127.0.0.53", "localport": "53", "peeraddress": "0.0.0.0", "peerport": "\*", "state": "LISTEN", "pid": -1, "process": "" }, { "protocol": "tcp", "localaddress": "127.0.0.1", "localport": "631", "peeraddress": "0.0.0.0", "peerport": "\*", "state": "LISTEN", "pid": -1, "process": "" }, { "protocol": "tcp", "localaddress": "172.17.105.9", "localport": "39248", "peeraddress": "172.217.1.206", "peerport": "80", "state": "TIME\_WAIT", "pid": -1, "process": "" }, { "protocol": "tcp", "localaddress": "172.17.105.9", "localport": "45940", "peeraddress": "199.232.10.49", "peerport": "443", "state": "ESTABLISHED", "pid": 2221, "process": "gnome-software" }, { "protocol": "tcp", "localaddress": "127.0.0.1", "localport": "59176", "peeraddress": "127.0.0.1", "peerport": "12345", "state": "ESTABLISHED", "pid": 2154, "process": "node" }, { "protocol": "tcp", "localaddress": "127.0.0.1", "localport": "59174", "peeraddress": "127.0.0.1", "peerport": "12345", "state": "ESTABLISHED", "pid": 2148, "process": "node" }, { "protocol": "tcp", "localaddress": "172.17.105.9", "localport": "56698", "peeraddress": "8.43.85.13", "peerport": "443", "state": "CLOSE\_WAIT", "pid": 2221, "process": "gnome-software" }, { "protocol": "tcp", "localaddress": "172.17.105.9", "localport": "56702", "peeraddress": "8.43.85.13", "peerport": "443", "state": "CLOSE\_WAIT", "pid": 2221, "process": "gnome-software" }, { "protocol": "tcp6", "localaddress": "127.0.0.1", "localport": "63342", "peeraddress": "::", "peerport": "\*", "state": "LISTEN", "pid": 1817, "process": "java" }, { "protocol": "tcp6", "localaddress": "::", "localport": "31283", "peeraddress": "::", "peerport": "\*", "state": "LISTEN", "pid": 2137, "process": "node" }, { "protocol": "tcp6", "localaddress": "::1", "localport": "3350", "peeraddress": "::", "peerport": "\*", "state": "LISTEN", "pid": -1, "process": "" }, { "protocol": "tcp6", "localaddress": "::1", "localport": "631", "peeraddress": "::", "peerport": "\*", "state": "LISTEN", "pid": -1, "process": "" }, { "protocol": "tcp6", "localaddress": "::", "localport": "12345", "peeraddress": "::", "peerport": "\*", "state": "LISTEN", "pid": 2191, "process": "node" }, { "protocol": "tcp6", "localaddress": "127.0.0.1", "localport": "6942", "peeraddress": "::", "peerport": "\*", "state": "LISTEN", "pid": 1817, "process": "java" }, { "protocol": "tcp6", "localaddress": "::", "localport": "9925", "peeraddress": "::", "peerport": "\*", "state": "LISTEN", "pid": 2137, "process": "node" }, { "protocol": "tcp6", "localaddress": "127.0.0.1", "localport": "12345", "peeraddress": "127.0.0.1", "peerport": "59174", "state": "ESTABLISHED", "pid": 2198, "process": "node" }, { "protocol": "tcp6", "localaddress": "172.17.105.9", "localport": "9925", "peeraddress": "172.17.105.1", "peerport": "51771", "state": "ESTABLISHED", "pid": 2148, "process": "node" }, { "protocol": "tcp6", "localaddress": "127.0.0.1", "localport": "12345", "peeraddress": "127.0.0.1", "peerport": "59176", "state": "ESTABLISHED", "pid": 2198, "process": "node" } ] }, "harperdb\_processes": { "core": \[ { "pid": 2137, "parentPid": 1817, "name": "node", "pcpu": 0.09332392506771676, "pcpuu": 0.08497788298849006, "pcpus": 0.008346042079226701, "pmem": 0.9, "priority": 19, "mem\_vsz": 420178500, "mem\_rss": 76388, "nice": 0, "started": "2020-04-16 09:14:13", "state": "sleeping", "tty": "", "user": "kyle", "command": "node", "params": "/home/kyle/WebstormProjects/harperdb/server/hdb\_express.js", "path": "/usr/bin" }, { "pid": 2148, "parentPid": 2137, "name": "node", "pcpu": 0.13884779095440786, "pcpuu": 0.11077474032428168, "pcpus": 0.028073050630126176, "pmem": 1, "priority": 19, "mem\_vsz": 315389400, "mem\_rss": 84636, "nice": 0, "started": "2020-04-16 09:14:14", "state": "sleeping", "tty": "", "user": "kyle", "command": "node", "params": "/home/kyle/WebstormProjects/harperdb/server/hdb\_express.js", "path": "/usr/bin" }, { "pid": 2154, "parentPid": 2137, "name": "node", "pcpu": 0.08953026957715916, "pcpuu": 0.08270168969415549, "pcpus": 0.006828579883003665, "pmem": 1, "priority": 19, "mem\_vsz": 315388840, "mem\_rss": 82612, "nice": 0, "started": "2020-04-16 09:14:14", "state": "sleeping", "tty": "", "user": "kyle", "command": "node", "params": "/home/kyle/WebstormProjects/harperdb/server/hdb\_express.js", "path": "/usr/bin" } ], "clustering": \[ { "pid": 2170, "parentPid": 2137, "name": "node", "pcpu": 0.018209546354676438, "pcpuu": 0.015174621962230366, "pcpus": 0.003034924392446073, "pmem": 0.5, "priority": 19, "mem\_vsz": 606912, "mem\_rss": 39860, "nice": 0, "started": "2020-04-16 09:14:15", "state": "sleeping", "tty": "", "user": "kyle", "command": "node", "params": "/home/kyle/WebstormProjects/harperdb/server/socketcluster/Server.js", "path": "/usr/bin" }, { "pid": 2184, "parentPid": 2170, "name": "node", "pcpu": 0.013657159766007329, "pcpuu": 0.012139697569784292, "pcpus": 0.0015174621962230365, "pmem": 0.4, "priority": 19, "mem\_vsz": 670988, "mem\_rss": 37884, "nice": 0, "started": "2020-04-16 09:14:15", "state": "sleeping", "tty": "", "user": "kyle", "command": "node", "params": "/home/kyle/WebstormProjects/harperdb/server/socketcluster/broker.js {\\"id\\":0,\\"debug\\":null,\\"socketPath\\":\\"/tmp/socketcluster/socket\_server\_61253374f8/b0\\",\\"expiryAccuracy\\":5000,\\"downgradeToUser\\":false,\\"brokerControllerPath\\":\\"/home/kyle/WebstormProjects/harperdb/server/socketcluster/broker.js\\",\\"processTermTimeout\\":10000}", "path": "/usr/bin" }, { "pid": 2191, "parentPid": 2170, "name": "node", "pcpu": 0.0037936554905575915, "pcpuu": 0.003034924392446073, "pcpus": 0.0007587310981115183, "pmem": 0.3, "priority": 19, "mem\_vsz": 564444, "mem\_rss": 29012, "nice": 0, "started": "2020-04-16 09:14:16", "state": "sleeping", "tty": "", "user": "kyle", "command": "node", "params": "/home/kyle/WebstormProjects/harperdb/node\_modules/socketcluster/default-workercluster-controller.js", "path": "/usr/bin" }, { "pid": 2198, "parentPid": 2191, "name": "node", "pcpu": 0.060698487848921456, "pcpuu": 0.057663563456475386, "pcpus": 0.003034924392446073, "pmem": 0.9, "priority": 19, "mem\_vsz": 856396, "mem\_rss": 71580, "nice": 0, "started": "2020-04-16 09:14:16", "state": "sleeping", "tty": "", "user": "kyle", "command": "node", "params": "/home/kyle/WebstormProjects/harperdb/server/socketcluster/worker/ClusterWorker.js", "path": "/usr/bin" } ] }, "replication": { "ingest": { "stream": { "messages": 0, "bytes": 0, "first\_seq": 0, "first\_ts": "0001-01-01T00:00:00Z", "last\_seq": 0, "last\_ts": "0001-01-01T00:00:00Z", "consumer\_count": 1 }, "consumer": { "num\_ack\_pending": 0, "num\_redelivered": 0, "num\_waiting": 0, "num\_pending": 0 } } \}}⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃RestartRestarts the HarperDB instance._Operation is restricted to super\_user roles only_\
    operation _(required)_ - must always be 'restart'Body{ "operation": "restart"}Response: 200{ "message": "Restarting HarperDB. This may take up to 60 seconds."}⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃Restart ServiceRestarts servers for the specified HarperDB service. Returns a restarting message.\_Operation is restricted to super\_user roles only\_operation _(required)_ - must always be 'restart\_service'service _(required)_ - service to restart, such as: harperdb, ipc, custom\_functions, clustering, and others. Must be a string.
* Body{ "operation": "restart\_service", "service": "http\_workers"}Response: 200{ "message": "Restarting http\_workers"}⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃Get ConfigurationReturns the HarperDB configuration parameters. Read more about the configuration file here: https://harperdb.io/docs/reference/configuration-file/.\_Operation is restricted to super\_user roles only\_operation _(required)_ - must always be 'get\_configuration'Body{ "operation": "get\_configuration"}Response: 200{ "http": { "compressionThreshold": 1200, "cors": false, "corsAccessList": \[ null ], "keepAliveTimeout": 30000, "port": 9926, "securePort": null, "sessionAffinity": null, "timeout": 120000 }, "threads": 11, "authentication": { "authorizeLocal": true, "cacheTTL": 30000, "enableSessions": true, "operationTokenTimeout": "1d", "refreshTokenTimeout": "30d" }, "analytics": { "aggregatePeriod": 60 }, "clustering": { "enabled": true, "hubServer": { "cluster": { "name": "harperdb", "network": { "port": 12345, "routes": null } }, "leafNodes": { "network": { "port": 9931 } }, "network": { "port": 9930 } }, "leafServer": { "network": { "port": 9940, "routes": null }, "streams": { "maxAge": null, "maxBytes": null, "maxMsgs": null, "path": "/Users/david/hdb/clustering/leaf" } }, "logLevel": "error", "nodeName": "local", "republishMessages": false, "databaseLevel": false, "tls": { "certificate": "/Users/david/hdb/keys/certificate.pem", "certificateAuthority": "/Users/david/hdb/keys/ca.pem", "privateKey": "/Users/david/hdb/keys/privateKey.pem", "insecure": true, "verify": true }, "user": "cluster\_user" }, "componentsRoot": "/Users/david/hdb/components", "localStudio": { "enabled": false }, "logging": { "auditAuthEvents": { "logFailed": false, "logSuccessful": false }, "auditLog": true, "auditRetention": "3d", "file": true, "level": "warn", "root": "/Users/david/hdb/log", "rotation": { "enabled": false, "compress": false, "interval": null, "maxSize": null, "path": "/Users/david/hdb/log" }, "stdStreams": false }, "mqtt": { "network": { "port": 1883, "securePort": 8883 }, "webSocket": true, "requireAuthentication": true }, "operationsApi": { "network": { "cors": true, "corsAccessList": \[ "\*" ], "port": 9925, "securePort": null } }, "rootPath": "/Users/david/hdb", "storage": { "writeAsync": false, "caching": true, "compression": false, "noReadAhead": true, "path": "/Users/david/hdb/database", "prefetchWrites": true }, "tls": { "certificate": "/Users/david/hdb/keys/certificate.pem", "certificateAuthority": "/Users/david/hdb/keys/ca.pem", "privateKey": "/Users/david/hdb/keys/privateKey.pem" \}}⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃Set Configuration
* Modifies the HarperDB configuration file parameters. Must follow with a restart or restart\_service operation.\
  Read more about HarperDB configuration here: [https://harperdb.io/docs/reference/configuration-file/](https://harperdb.io/docs/reference/configuration-file/).
* _**Operation is restricted to super\_user roles only**_
*
  * operation _(required)_ - must always be 'set\_configuration'\\
  * logging\_level\_(example/optional)\_ -\
    one or more [configuration keywords](https://docs.harperdb.io/docs/configuration) to be updated in the HarperDB configuration file\\
  * clustering\_enabled\_(example/optional)\_ -\
    one or more [configuration keywords](https://docs.harperdb.io/docs/configuration) to be updated in the HarperDB configuration file
* **Body**
* ```json
  {
  	"operation": "set_configuration",
      "logging_level": "trace",
      "clustering_enabled": true
  }
  ```
* **Response: 200**
* ```json
  {
      "message": "Configuration successfully set. You must restart HarperDB for new config settings to take effect."
  }
  ```