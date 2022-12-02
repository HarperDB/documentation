# Upgrade a HarperDB Instance

This document describes best practices for upgrading self-hosted HarperDB instances. HarperDB can be upgraded using a combination of npm and built-in HarperDB upgrade scripts.  Whenever upgrading your HarperDB installation it is recommended you make a backup of your data first.
Note: This document applies to self-hosted HarperDB instances only. All [HarperDB Cloud instances](https://harperdb.io/docs/harperdb-cloud/) will be upgraded by the HarperDB Cloud team.

## Upgrading
Upgrading HarperDB is a two-step process. First the latest version of HarperDB must be downloaded from npm, then the HarperDB upgrade scripts will be utilized to ensure the newest features are available on the system.

1) Install the latest version of HarperDB using `npm install -g harperdb`.

   Note `-g` should only be used if you installed HarperDB globally (which is recommended). 
2) Run `harperdb` to initiate the upgrade process.

   HarperDB will then prompt you for all appropriate inputs and then run the upgrade directives.


## Node Version Manager (nvm)

[Node Version Manager (nvm)](http://nvm.sh/) is an easy way to install, remove, and switch between different versions of Node.js as required by various applications. More information, including directions on installing nvm can be found here: https://nvm.sh/.

HarperDB suggests Node version 18.12.0, but will support Node versions 14.0.0 and higher. To install a different version of Node with nvm, run the command:

```bash
nvm install 18.12.0
```

To switch to a version of Node run:

```bash
nvm use 18.12.0
```

To see the current running version of Node run:

```bash
node --version
```

With a handful of different versions of Node.js installed, run nvm with the `ls` argument to list out all installed versions:

```bash
nvm ls
```

When upgrading HarperDB, we recommend also upgrading your Node version. Here we assume you're running on an older version of Node; the execution may look like this:

Switch to the older version of Node that HarperDB is running on (if it is not the current version):

```bash
nvm use 14.19.0
```

Make sure HarperDB is not running:

```bash
harperdb stop
```

Uninstall HarperDB. Note, this step is not required, but will clean up old artifacts of HarperDB. We recommend removing all other HarperDB installations to ensure the most recent version is always running.

```bash
npm uninstall -g harperdb
```

Switch to the newer version of Node:

```bash
nvm use 18.12.0
```

Install HarperDB globally

```bash
npm install -g harperdb
```

Run the upgrade script

```bash
harperdb
```

Start HarperDB

```bash
harperdb run
```