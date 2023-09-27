# Utilities 


## Delete Records Before
Delete data before the specified timestamp on the specified database table  exclusively on the node where it is executed. Any clustered nodes with replicated data will retain that data.

<i><b>Operation is restricted to super_user roles only</b></i>
<br/>
<ul>

<li><b>operation </b><i>(required)</i> - must always be delete_records_before</li>

<li><b>date </b><i>(required)</i> - records older than this date will be deleted. Supported format looks like: <i>YYYY-MM-DDThh:mm:ss.sZ</i></li>

<li><b>schema</b><i> (required)</i> - name of the schema where you are deleting your data</li>

<li><b>table </b><i>(required)</i> - name of the table where you are deleting your data</li>

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
    "message": "Starting job with id d3aed926-e9fe-4ec1-aea7-0fb4451bd373"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Export Local
Exports data based on a given search operation to a local file in JSON or CSV format.

<ul>

<li><b>operation </b><i>(required)</i> - must always be export_local</li>

<li><b>format</b><i> (required)</i> - the format you wish to export the data, options are json & csv</li>

<li><b>path </b><i>(required)</i> - path local to the server to export the data</li>

<li><b>search_operation </b><i>(required)</i> - search_operation of search_by_hash, search_by_value or sql</li>

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


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Export To S3
Exports data based on a given search operation from table to AWS S3 in JSON or CSV format.

<ul><li><p><b>operation </b><i>(required)</i> - must always be export_to_s3</p></li><li><p><b>format</b><i> (required)</i> - the format you wish to export the data, options are json & csv</p></li><li><p><b>s3 </b><i>(required)</i> - details your access keys, bucket, bucket region and key for saving the data to S3</p></li><li><p><b>search_operation </b><i>(required)</i> - search_operation of search_by_hash, search_by_value or sql</p></li></ul>

### Body

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
    "message": "Starting job with id 9fa85968-4cb1-4008-976e-506c4b13fc4a"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Install Node Modules
Executes npm install against specified custom function projects

<i><b>Operation is restricted to super_user roles only</b></i>

<ul>

<li><b>operation </b><i>(required)</i> - must always be install_node_modules</li>

<li><b>projects </b><i>(required)</i> - must ba an array of custom functions projects.</li>

<li><b>dry_run </b><i>(optional)</i> - refers to the npm --dry-run flag: <a href="https://docs.npmjs.com/cli/v8/commands/npm-install#dry-run">https://docs.npmjs.com/cli/v8/commands/npm-install#dry-run<a/>. Defaults to false.</li>

</ul>

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

### Response: 200
```json
{
    "dogs": {
        "npm_output": {
            "added": 0,
            "removed": 0,
            "changed": 0,
            "audited": 0,
            "funding": 0
        },
        "npm_error": null
    },
    "cats": {
        "npm_output": {
            "added": 0,
            "removed": 0,
            "changed": 0,
            "audited": 0,
            "funding": 0
        },
        "npm_error": null
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Audit Node Modules
Executes command npm audit against specified components.

<i><b>Operation is restricted to super_user roles only</b></i>

<ul>

<li><b>operation </b><i>(required)</i> - must always be audit_node_modules</li>

<li><b>projects </b><i>(required)</i> - must be an array of custom functions projects.</li>

<li><b>dry_run </b><i>(optional)</i> - refers to the npm --dry-run flag: <a href="https://docs.npmjs.com/cli/v8/commands/npm-install#dry-run">https://docs.npmjs.com/cli/v8/commands/npm-install#dry-run<a/>. Defaults to false.</li>

</ul>

### Body

```json
{
    "operation": "audit_node_modules",
    "projects": [
        "dogs",
        "cats"
    ],
    "dry_run": true
}
```

### Response: 200
```json
{
    "dogs": {
        "npm_output": {
            "auditReportVersion": 2,
            "vulnerabilities": {},
            "metadata": {
                "vulnerabilities": {
                    "info": 0,
                    "low": 0,
                    "moderate": 0,
                    "high": 0,
                    "critical": 0,
                    "total": 0
                },
                "dependencies": {
                    "prod": 1,
                    "dev": 0,
                    "optional": 0,
                    "peer": 0,
                    "peerOptional": 0,
                    "total": 0
                }
            }
        },
        "npm_error": null
    },
    "cats": {
        "npm_output": {
            "auditReportVersion": 2,
            "vulnerabilities": {},
            "metadata": {
                "vulnerabilities": {
                    "info": 0,
                    "low": 0,
                    "moderate": 0,
                    "high": 0,
                    "critical": 0,
                    "total": 0
                },
                "dependencies": {
                    "prod": 1,
                    "dev": 0,
                    "optional": 0,
                    "peer": 0,
                    "peerOptional": 0,
                    "total": 0
                }
            }
        },
        "npm_error": null
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## System Information
Returns detailed metrics on the host system. A deeper dive into the return object can be found here: https://systeminformation.io/general.html.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'system_information'
</li>


<li>
<b>attributes </b><i>(optional)</i> - string array of top level attributes desired in the response, if no value is supplied all attributes will be returned. Available attributes are: ['system', 'time', 'cpu', 'memory', 'disk', 'network', 'harperdb_processes', 'table_size']
</li>

</ul>

### Body

```json
{
    "operation": "system_information"
}
```

### Response: 200
```json
{
    "system": {
        "platform": "linux",
        "distro": "Ubuntu",
        "release": "18.04.4 LTS",
        "codename": "Bionic Beaver",
        "kernel": "5.3.0-46-generic",
        "arch": "x64",
        "hostname": "kyle3",
        "node_version": "12.16.2",
        "npm_version": "6.14.4"
    },
    "time": {
        "current": 1587050190861,
        "uptime": 328,
        "timezone": "GMT-0600",
        "timezoneName": "Mountain Daylight Time"
    },
    "cpu": {
        "manufacturer": "Intel®",
        "brand": "Core™ i7-6700HQ",
        "vendor": "GenuineIntel",
        "speed": "2.60",
        "cores": 4,
        "physicalCores": 2,
        "processors": 1,
        "cpu_speed": {
            "min": 2.59,
            "max": 2.59,
            "avg": 2.59,
            "cores": [
                2.59,
                2.59,
                2.59,
                2.59
            ]
        },
        "current_load": {
            "avgload": 0.09,
            "currentload": 11.070059788440902,
            "currentload_user": 9.824467269661199,
            "currentload_system": 1.1697071899432776,
            "currentload_nice": 0.07588532883642496,
            "currentload_idle": 88.9299402115591,
            "currentload_irq": 0,
            "cpus": [
                {
                    "load": 11.661726565394591,
                    "load_user": 10.361862418179573,
                    "load_system": 1.2628133876744474,
                    "load_nice": 0.037050759540570584,
                    "load_idle": 88.33827343460541,
                    "load_irq": 0
                },
                {
                    "load": 10.828103474667076,
                    "load_user": 9.640287769784173,
                    "load_system": 1.1816929435175265,
                    "load_nice": 0.006122761365375784,
                    "load_idle": 89.17189652533293,
                    "load_irq": 0
                },
                {
                    "load": 10.980608062641464,
                    "load_user": 9.567504740931057,
                    "load_system": 1.1653514406313084,
                    "load_nice": 0.2477518810790971,
                    "load_idle": 89.01939193735853,
                    "load_irq": 0
                },
                {
                    "load": 10.815272215938618,
                    "load_user": 9.73313361660502,
                    "load_system": 1.0699110445388684,
                    "load_nice": 0.012227554794729924,
                    "load_idle": 89.18472778406138,
                    "load_irq": 0
                }
            ]
        }
    },
    "memory": {
        "total": 8118206464,
        "free": 4686876672,
        "used": 3431329792,
        "active": 2435858432,
        "available": 5682348032,
        "swaptotal": 1073737728,
        "swapused": 0,
        "swapfree": 1073737728
    },
    "disk": {
        "io": {
            "rIO": 38902,
            "wIO": 3786,
            "tIO": 42688
        },
        "read_write": {
            "rx": 1000512512,
            "wx": 60686848,
            "tx": 1061199360,
            "ms": 0
        },
        "size": [
            {
                "fs": "/dev/sda1",
                "type": "ext4",
                "size": 12301357056,
                "used": 9956159488,
                "use": 80.94,
                "mount": "/"
            },
            {
                "fs": "/dev/sda15",
                "type": "vfat",
                "size": 109422592,
                "used": 3756032,
                "use": 3.43,
                "mount": "/boot/efi"
            }
        ]
    },
    "network": {
        "default_interface": "eth0",
        "latency": {
            "url": "google.com",
            "ok": true,
            "status": 301,
            "ms": 72
        },
        "interfaces": [
            {
                "iface": "lo",
                "ifaceName": "lo",
                "ip4": "127.0.0.1",
                "ip6": "::1",
                "mac": "",
                "operstate": "unknown",
                "type": "virtual",
                "duplex": "",
                "speed": -1,
                "carrierChanges": 0
            },
            {
                "iface": "eth0",
                "ifaceName": "eth0",
                "ip4": "172.17.105.9",
                "ip6": "fe80::9ff5:a444:9e2c:5ef5",
                "mac": "00:15:5d:00:68:04",
                "operstate": "up",
                "type": "wired",
                "duplex": "full",
                "speed": 10000,
                "carrierChanges": 1
            }
        ],
        "stats": [
            {
                "iface": "eth0",
                "operstate": "up",
                "rx_bytes": 2669790,
                "rx_dropped": 0,
                "rx_errors": 0,
                "tx_bytes": 88141,
                "tx_dropped": 0,
                "tx_errors": 0
            }
        ],
        "connections": [
            {
                "protocol": "tcp",
                "localaddress": "127.0.0.53",
                "localport": "53",
                "peeraddress": "0.0.0.0",
                "peerport": "*",
                "state": "LISTEN",
                "pid": -1,
                "process": ""
            },
            {
                "protocol": "tcp",
                "localaddress": "127.0.0.1",
                "localport": "631",
                "peeraddress": "0.0.0.0",
                "peerport": "*",
                "state": "LISTEN",
                "pid": -1,
                "process": ""
            },
            {
                "protocol": "tcp",
                "localaddress": "172.17.105.9",
                "localport": "39248",
                "peeraddress": "172.217.1.206",
                "peerport": "80",
                "state": "TIME_WAIT",
                "pid": -1,
                "process": ""
            },
            {
                "protocol": "tcp",
                "localaddress": "172.17.105.9",
                "localport": "45940",
                "peeraddress": "199.232.10.49",
                "peerport": "443",
                "state": "ESTABLISHED",
                "pid": 2221,
                "process": "gnome-software"
            },
            {
                "protocol": "tcp",
                "localaddress": "127.0.0.1",
                "localport": "59176",
                "peeraddress": "127.0.0.1",
                "peerport": "12345",
                "state": "ESTABLISHED",
                "pid": 2154,
                "process": "node"
            },
            {
                "protocol": "tcp",
                "localaddress": "127.0.0.1",
                "localport": "59174",
                "peeraddress": "127.0.0.1",
                "peerport": "12345",
                "state": "ESTABLISHED",
                "pid": 2148,
                "process": "node"
            },
            {
                "protocol": "tcp",
                "localaddress": "172.17.105.9",
                "localport": "56698",
                "peeraddress": "8.43.85.13",
                "peerport": "443",
                "state": "CLOSE_WAIT",
                "pid": 2221,
                "process": "gnome-software"
            },
            {
                "protocol": "tcp",
                "localaddress": "172.17.105.9",
                "localport": "56702",
                "peeraddress": "8.43.85.13",
                "peerport": "443",
                "state": "CLOSE_WAIT",
                "pid": 2221,
                "process": "gnome-software"
            },
            {
                "protocol": "tcp6",
                "localaddress": "127.0.0.1",
                "localport": "63342",
                "peeraddress": "::",
                "peerport": "*",
                "state": "LISTEN",
                "pid": 1817,
                "process": "java"
            },
            {
                "protocol": "tcp6",
                "localaddress": "::",
                "localport": "31283",
                "peeraddress": "::",
                "peerport": "*",
                "state": "LISTEN",
                "pid": 2137,
                "process": "node"
            },
            {
                "protocol": "tcp6",
                "localaddress": "::1",
                "localport": "3350",
                "peeraddress": "::",
                "peerport": "*",
                "state": "LISTEN",
                "pid": -1,
                "process": ""
            },
            {
                "protocol": "tcp6",
                "localaddress": "::1",
                "localport": "631",
                "peeraddress": "::",
                "peerport": "*",
                "state": "LISTEN",
                "pid": -1,
                "process": ""
            },
            {
                "protocol": "tcp6",
                "localaddress": "::",
                "localport": "12345",
                "peeraddress": "::",
                "peerport": "*",
                "state": "LISTEN",
                "pid": 2191,
                "process": "node"
            },
            {
                "protocol": "tcp6",
                "localaddress": "127.0.0.1",
                "localport": "6942",
                "peeraddress": "::",
                "peerport": "*",
                "state": "LISTEN",
                "pid": 1817,
                "process": "java"
            },
            {
                "protocol": "tcp6",
                "localaddress": "::",
                "localport": "9925",
                "peeraddress": "::",
                "peerport": "*",
                "state": "LISTEN",
                "pid": 2137,
                "process": "node"
            },
            {
                "protocol": "tcp6",
                "localaddress": "127.0.0.1",
                "localport": "12345",
                "peeraddress": "127.0.0.1",
                "peerport": "59174",
                "state": "ESTABLISHED",
                "pid": 2198,
                "process": "node"
            },
            {
                "protocol": "tcp6",
                "localaddress": "172.17.105.9",
                "localport": "9925",
                "peeraddress": "172.17.105.1",
                "peerport": "51771",
                "state": "ESTABLISHED",
                "pid": 2148,
                "process": "node"
            },
            {
                "protocol": "tcp6",
                "localaddress": "127.0.0.1",
                "localport": "12345",
                "peeraddress": "127.0.0.1",
                "peerport": "59176",
                "state": "ESTABLISHED",
                "pid": 2198,
                "process": "node"
            }
        ]
    },
    "harperdb_processes": {
        "core": [
            {
                "pid": 2137,
                "parentPid": 1817,
                "name": "node",
                "pcpu": 0.09332392506771676,
                "pcpuu": 0.08497788298849006,
                "pcpus": 0.008346042079226701,
                "pmem": 0.9,
                "priority": 19,
                "mem_vsz": 420178500,
                "mem_rss": 76388,
                "nice": 0,
                "started": "2020-04-16 09:14:13",
                "state": "sleeping",
                "tty": "",
                "user": "kyle",
                "command": "node",
                "params": "/home/kyle/WebstormProjects/harperdb/server/hdb_express.js",
                "path": "/usr/bin"
            },
            {
                "pid": 2148,
                "parentPid": 2137,
                "name": "node",
                "pcpu": 0.13884779095440786,
                "pcpuu": 0.11077474032428168,
                "pcpus": 0.028073050630126176,
                "pmem": 1,
                "priority": 19,
                "mem_vsz": 315389400,
                "mem_rss": 84636,
                "nice": 0,
                "started": "2020-04-16 09:14:14",
                "state": "sleeping",
                "tty": "",
                "user": "kyle",
                "command": "node",
                "params": "/home/kyle/WebstormProjects/harperdb/server/hdb_express.js",
                "path": "/usr/bin"
            },
            {
                "pid": 2154,
                "parentPid": 2137,
                "name": "node",
                "pcpu": 0.08953026957715916,
                "pcpuu": 0.08270168969415549,
                "pcpus": 0.006828579883003665,
                "pmem": 1,
                "priority": 19,
                "mem_vsz": 315388840,
                "mem_rss": 82612,
                "nice": 0,
                "started": "2020-04-16 09:14:14",
                "state": "sleeping",
                "tty": "",
                "user": "kyle",
                "command": "node",
                "params": "/home/kyle/WebstormProjects/harperdb/server/hdb_express.js",
                "path": "/usr/bin"
            }
        ],
        "clustering": [
            {
                "pid": 2170,
                "parentPid": 2137,
                "name": "node",
                "pcpu": 0.018209546354676438,
                "pcpuu": 0.015174621962230366,
                "pcpus": 0.003034924392446073,
                "pmem": 0.5,
                "priority": 19,
                "mem_vsz": 606912,
                "mem_rss": 39860,
                "nice": 0,
                "started": "2020-04-16 09:14:15",
                "state": "sleeping",
                "tty": "",
                "user": "kyle",
                "command": "node",
                "params": "/home/kyle/WebstormProjects/harperdb/server/socketcluster/Server.js",
                "path": "/usr/bin"
            },
            {
                "pid": 2184,
                "parentPid": 2170,
                "name": "node",
                "pcpu": 0.013657159766007329,
                "pcpuu": 0.012139697569784292,
                "pcpus": 0.0015174621962230365,
                "pmem": 0.4,
                "priority": 19,
                "mem_vsz": 670988,
                "mem_rss": 37884,
                "nice": 0,
                "started": "2020-04-16 09:14:15",
                "state": "sleeping",
                "tty": "",
                "user": "kyle",
                "command": "node",
                "params": "/home/kyle/WebstormProjects/harperdb/server/socketcluster/broker.js {\"id\":0,\"debug\":null,\"socketPath\":\"/tmp/socketcluster/socket_server_61253374f8/b0\",\"expiryAccuracy\":5000,\"downgradeToUser\":false,\"brokerControllerPath\":\"/home/kyle/WebstormProjects/harperdb/server/socketcluster/broker.js\",\"processTermTimeout\":10000}",
                "path": "/usr/bin"
            },
            {
                "pid": 2191,
                "parentPid": 2170,
                "name": "node",
                "pcpu": 0.0037936554905575915,
                "pcpuu": 0.003034924392446073,
                "pcpus": 0.0007587310981115183,
                "pmem": 0.3,
                "priority": 19,
                "mem_vsz": 564444,
                "mem_rss": 29012,
                "nice": 0,
                "started": "2020-04-16 09:14:16",
                "state": "sleeping",
                "tty": "",
                "user": "kyle",
                "command": "node",
                "params": "/home/kyle/WebstormProjects/harperdb/node_modules/socketcluster/default-workercluster-controller.js",
                "path": "/usr/bin"
            },
            {
                "pid": 2198,
                "parentPid": 2191,
                "name": "node",
                "pcpu": 0.060698487848921456,
                "pcpuu": 0.057663563456475386,
                "pcpus": 0.003034924392446073,
                "pmem": 0.9,
                "priority": 19,
                "mem_vsz": 856396,
                "mem_rss": 71580,
                "nice": 0,
                "started": "2020-04-16 09:14:16",
                "state": "sleeping",
                "tty": "",
                "user": "kyle",
                "command": "node",
                "params": "/home/kyle/WebstormProjects/harperdb/server/socketcluster/worker/ClusterWorker.js",
                "path": "/usr/bin"
            }
        ]
    },
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
            "num_waiting": 0,
            "num_pending": 0
          }
      }
  }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Restart
Restarts the HarperDB instance.

<i><b>Operation is restricted to super_user roles only</b></i><br/>
<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'restart'
</li>
</ul>

### Body

```json
{
    "operation": "restart"
}
```

### Response: 200
```json
{
    "message": "Restarting HarperDB. This may take up to 60 seconds."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Restart Service
Restarts servers for the specified HarperDB service. Returns a restarting message. 

<i><b>Operation is restricted to super_user roles only</b></i>
<li>
<b>operation</b> <i> (required) </i> - must always be 'restart_service'
</li>

<li>
<b>service </b><i>(required)</i> - service to restart, such as: harperdb, ipc, custom_functions, clustering, and others. Must be a string. 
</li>

</ul>

### Body

```json
{
    "operation": "restart_service",
    "service": "http_workers"
}
```

### Response: 200
```json
{
    "message": "Restarting http_workers"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Get Configuration
Returns the HarperDB configuration parameters. Read more about the configuration file here: https://harperdb.io/docs/reference/configuration-file/.

<i><b>Operation is restricted to super_user roles only</b></i>

<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'get_configuration'
</li>
</ul>

### Body

```json
{
    "operation": "get_configuration"
}
```

### Response: 200
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
    "sessionAffinity": null,
    "timeout": 120000
  },
  "threads": 11,
  "authentication": {
    "authorizeLocal": true,
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
        "path": "/Users/david/hdb/clustering/leaf"
      }
    },
    "logLevel": "error",
    "nodeName": "local",
    "republishMessages": false,
    "databaseLevel": false,
    "tls": {
      "certificate": "/Users/david/hdb/keys/certificate.pem",
      "certificateAuthority": "/Users/david/hdb/keys/ca.pem",
      "privateKey": "/Users/david/hdb/keys/privateKey.pem",
      "insecure": true,
      "verify": true
    },
    "user": "cluster_user"
  },
  "componentsRoot": "/Users/david/hdb/components",
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
    "level": "warn",
    "root": "/Users/david/hdb/log",
    "rotation": {
      "enabled": false,
      "compress": false,
      "interval": null,
      "maxSize": null,
      "path": "/Users/david/hdb/log"
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
  "rootPath": "/Users/david/hdb",
  "storage": {
    "writeAsync": false,
    "caching": true,
    "compression": false,
    "noReadAhead": true,
    "path": "/Users/david/hdb/database",
    "prefetchWrites": true
  },
  "tls": {
    "certificate": "/Users/david/hdb/keys/certificate.pem",
    "certificateAuthority": "/Users/david/hdb/keys/ca.pem",
    "privateKey": "/Users/david/hdb/keys/privateKey.pem"
  }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Set Configuration
Modifies the HarperDB configuration file parameters. Must follow with a restart or restart_service operation.  
Read more about HarperDB configuration here: [https://harperdb.io/docs/reference/configuration-file/](https://harperdb.io/docs/reference/configuration-file/).

_**Operation is restricted to super_user roles only**_

<ul><li><p><b>operation</b> <i>(required) </i>- must always be 'set_configuration'<br></p></li><li><p><b>logging_level</b><i>(example/optional)</i> -<br>one or more <a href="https://docs.harperdb.io/docs/configuration">configuration keywords</a> to be updated in the HarperDB configuration file<br></p></li><li><p><b>clustering_enabled</b><i>(example/optional)</i> -<br>one or more <a href="https://docs.harperdb.io/docs/configuration">configuration keywords</a> to be updated in the HarperDB configuration file</p></li></ul>

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

