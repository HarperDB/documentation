# HarperDB CLI

The HarperDB command line interface (CLI) is used to administer [self-installed HarperDB instances](../install-harperdb/).

## Installing HarperDB

To install HarperDB with CLI prompts, run the following command:

```bash
harperdb install
```

Alternatively, HarperDB installations can be automated with environment variables or command line arguments; [see a full list of configuration parameters here](configuration/README.md). Note, when used in conjunction, command line arguments will override environment variables.

#### Environment Variables

```bash
#minimum required parameters for no additional CLI prompts
export TC_AGREEMENT=yes
export HDB_ADMIN_USERNAME=HDB_ADMIN
export HDB_ADMIN_PASSWORD=password
export ROOTPATH=/tmp/hdb/
export OPERATIONSAPI_NETWORK_PORT=9925
harperdb install
```

#### Command Line Arguments

```bash
#minimum required parameters for no additional CLI prompts
harperdb install --TC_AGREEMENT yes --HDB_ADMIN_USERNAME HDB_ADMIN --HDB_ADMIN_PASSWORD password --ROOTPATH /tmp/hdb/ --OPERATIONSAPI_NETWORK_PORT 9925
```

***

## Starting HarperDB

To start HarperDB after it is installed, run the following command:

```bash
harperdb start
```

***

## Stopping HarperDB

To stop HarperDB once it is running, run the following command:

```bash
harperdb stop
```

***

## Restarting HarperDB

To restart HarperDB once it is running, run the following command:

```bash
harperdb restart
```

***

## Managing HarperDB Service(s)

The following commands are used to start, restart, or stop one or more HarperDB service without restarting the full application:

```bash
harperdb start --service harperdb,"custom functions",ipc
harperdb stop --service harperdb
harperdb restart --service "custom functions"
```

The following services are managed via the above commands:

* HarperDB
* Custom Functions
* IPC
* Clustering

***

## Getting the HarperDB Version

To check the version of HarperDB that is installed run the following command:

```bash
harperdb version
```

## Get all available CLI commands

To display all available HarperDB CLI commands along with a brief description run:

```bash
harperdb help
```

## Get the status of HarperDB and clustering

To display the status of the HarperDB process, the clustering hub and leaf processes, the clustering network and replication statuses, run:

```bash
harperdb status
```

## Backups
HarperDB uses a transactional commit process that ensures that data on disk is always transactionally consistent with storage. This means that HarperDB maintains safety of database integrity in the event of a crash. It also means that you can use any standard volume snapshot tool to make a backup of a HarperDB database. Database files are stored in the hdb/schemas directory (organized schema directories). As long as the snapshot is an atomic snapshot of these database files, the data can be copied/movied back into the schemas directory to restore a previous backup (with HarperDB shut down) , and database integrity will be preserved. Note that simply copying an in-use database file (using `cp`, for example) is _not_ a snapshot, and this would progressively read data from the database at different points in time, which yields unreliable copy that likely will not be usable. Standard copying is only reliable for a database file that is not in use.