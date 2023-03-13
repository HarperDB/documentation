# Linux Quickstart Install Guide

This document is for getting HarperDB up and running quickly in a development environment. For full instructions on install and configuration of a Linux server, see the [Linux Full Install Guide](linux.md)

---

Install Node Version Manager (nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

Load nvm (or logout and then login)

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

Install Node.js using nvm ([read more about specific Node version requirements here](node-ver-requirement.md))

```bash
nvm install <the node version>
```

### <a id="install"></a> Install and Start HarperDB
Install HarperDB

```bash
npm install -g harperdb
harperdb install --TC_AGREEMENT "yes" --ROOTPATH "/home/ubuntu/hdb" --OPERATIONSAPI_NETWORK_PORT "9925" --HDB_ADMIN_USERNAME "HDB_ADMIN" --HDB_ADMIN_PASSWORD "abc123!"
```

HarperDB will automatically start after installation.