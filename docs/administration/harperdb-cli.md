# HarperDB CLI

The HarperDB command line interface (CLI) is used to administer self-installed HarperDB instances.

## Installing HarperDB
To install HarperDB with CLI prompts; run the following command:

harperdb install
Alternatively, HarperDB installations can be automated with environment variables or command line arguments; see a full list of configuration parameters here. Note, when used in conjunction, command line arguments will override environment variables.

Environment Variables
#minimum required parameters for no additional CLI prompts
export TC_AGREEMENT=yes
export HDB_ADMIN_USERNAME=HDB_ADMIN
export HDB_ADMIN_PASSWORD=password
export HDB_ROOT=/tmp/hdb/
export SERVER_PORT=9925
harperdb install
Command Line Arguments
#minimum required parameters for no additional CLI prompts
harperdb install --TC_AGREEMENT yes --HDB_ADMIN_USERNAME HDB_ADMIN --HDB_ADMIN_PASSWORD password --HDB_ROOT /tmp/hdb/ --SERVER_PORT 9925
Starting HarperDB
To run HarperDB after it is installed; run the following command:

harperdb run
Stopping HarperDB
To stop HarperDB once it is running run the following command:

harperdb stop
Restarting HarperDB
To restart HarperDB once it is running run the following command:

harperdb restart
Managing HarperDB Service(s)
The following commands are used to run, restart, or stop one or more HarperDB service without restarting the full application:

harperdb run --service harperdb,"custom functions",ipc
harperdb stop --service harperdb
harperdb restart --service "custom functions"
The following services are managed via this command:

HarperDB
Custom Functions
IPC
Clustering
Clustering Connector
Getting the HarperDB Version
To check the version of HarperDB that is installed run the following command:

harperdb version