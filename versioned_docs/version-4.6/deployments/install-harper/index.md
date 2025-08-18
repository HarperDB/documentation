---
title: Install Harper
---

# Install Harper

## Install Harper

This documentation contains information for installing Harper locally. Note that if you’d like to get up and running quickly, you can try a [managed instance with Harper Cloud](https://studio.harperdb.io/sign-up). Harper is a cross-platform database; we recommend Linux for production use, but Harper can run on Windows and Mac as well, for development purposes. Installation is usually very simple and just takes a few steps, but there are a few different options documented here.

Harper runs on Node.js, so if you do not have it installed, you need to do that first (if you have installed, you can skip to installing Harper, itself). Node.js can be downloaded and installed from [their site](https://nodejs.org/). For Linux and Mac, we recommend installing and managing Node versions with [NVM, which has instructions for installation](https://github.com/nvm-sh/nvm). Generally NVM can be installed with the following command:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

And then logout and login, and then install Node.js using nvm. We recommend using LTS, but support all currently maintained Node versions (which is currently version 14 and newer, and make sure to always uses latest minor/patch for the major version):

```bash
nvm install --lts
```

#### `Install and Start Harper <a href="#install" id="install"></a>`

Then you can install Harper with NPM and start it:

```bash
npm install -g harperdb
harperdb
```

Harper will automatically start after installation. Harper's installation can be configured with numerous options via CLI arguments, for more information visit the [Harper Command Line Interface](./harper-cli) guide.

If you are setting up a production server on Linux, [we have much more extensive documentation on how to configure volumes for database storage, set up a systemd script, and configure your operating system to use as a database server in our linux installation guide](install-harper/linux).

## With Docker

If you would like to run Harper in Docker, install [Docker Desktop](https://docs.docker.com/desktop/) on your Mac or Windows computer. Otherwise, install the [Docker Engine](https://docs.docker.com/engine/install/) on your Linux server.

Once Docker Desktop or Docker Engine is installed, visit our [Docker Hub page](https://hub.docker.com/r/harperdb/harperdb) for information and examples on how to run a Harper container.

## Offline Install

If you need to install Harper on a device that doesn't have an Internet connection, you can choose your version and download the npm package and install it directly (you’ll still need Node.js and NPM):

[Download Install Package](https://products-harperdb-io.s3.us-east-2.amazonaws.com/index.html)

Once you’ve downloaded the .tgz file, run the following command from the directory where you’ve placed it:

```bash
npm install -g harperdb-X.X.X.tgz harperdb install
```

## Installation on Less Common Platforms

Harper comes with binaries for standard AMD64/x64 or ARM64 CPU architectures on Linux, Windows (x64 only), and Mac (including Apple Silicon). However, if you are installing on a less common platform (Alpine, for example), you will need to ensure that you have build tools installed for the installation process to compile the binaries (this is handled automatically), including:

- [Go](https://go.dev/dl/): version 1.19.1
- GCC
- Make
- Python v3.7, v3.8, v3.9, or v3.10
