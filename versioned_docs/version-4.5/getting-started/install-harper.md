---
title: Install Harper
---

# Install Harper

There are three ways to install a Harper instance: using a package manager like npm, deploying it as a Docker container, and offline installation. Below is a step-by-step tutorial for each method.

## Installing via NPM

Before you begin, ensure you have [Node.js](https://nodejs.org/) LTS version or newer. Node.js comes with npm, which will be used to install Harper.

Open your terminal or command prompt and install Harper globally by executing the command below. Installing globally allows the `harperdb` command to be accessible from anywhere on your machine, making it easier to manage multiple projects.

```bash
npm install -g harperdb
```

Once the installation finishes, simply start your Harper instance by running the command below in your terminal.

```bash
harperdb
```

This launches Harper as a standalone, where you can define your schemas, endpoints, and application logic within a single integrated environment. The first time you set this up, you will need to set up your Harper destination, username, password, config, and hostname.

At this point, your local Harper instance is up and running, giving you the ability to develop and test your database applications using your favorite local development tools, including debuggers and version control systems.

## Installing via Docker

Using Docker to run Harper is an efficient way to manage a containerized instance that encapsulates all of Harper’s functionality. First, ensure that Docker is installed and running on your system. If it isn’t, download it from the [official Docker website](https://docs.docker.com/engine/install/) and complete the installation process.

Next, open your terminal and pull the latest Harper image by running the following command:

```bash
docker pull harperdb/harperdb
```

This command downloads the official Harper image from Docker Hub, ensuring you have the most recent version of the containerized instance. Once the image is downloaded, you can start a new Harper container with the following command:

```bash
docker run -d -p 9925:9925 harperdb/harperdb
```

In this command, the `-d` flag runs the container in detached mode, allowing it to operate in the background, and the `-p 9925:9925` flag maps port 9925 on your local machine to port 9925 within the container, which is Harper’s default port. This port mapping lets you interact with the Harper instance directly from your local environment.

### How to Use this Image

[Harper configuration settings⁠](https://harperdb.io/docs/reference/configuration-file/) can be passed as Docker run environment variables. If no environment variables are provided, Harper will operate with default configuration settings, such as:

- ROOTPATH=/home/harperdb/hdb
- OPERATIONSAPI_NETWORK_PORT=9925
- HDB_ADMIN_USERNAME=HDB_ADMIN
- HDB_ADMIN_PASSWORD=password
- LOGGING_STDSTREAMS=true

These defaults allow you to quickly start an instance, though you can customize your configuration to better suit your needs.

Containers created from this image store all data and Harper configuration at `/home/harperdb/hdb`. To ensure that your data persists beyond the lifecycle of a container, you should mount this directory to a directory on the container host using a Docker volume. This ensures that your database remains available and your settings are not lost when the container is stopped or removed.

:::info
Test your Harper instance is up and running by querying `curl http://localhost:9925/health`
:::

### Example Deployments

To run a Harper container in the background with persistent storage and exposed ports, you can use a command like this:

```bash
docker run -d \
  -v <host_directory>:/home/harperdb/hdb \
  -e HDB_ADMIN_USERNAME=HDB_ADMIN \
  -e HDB_ADMIN_PASSWORD=password \
  -e THREADS=4 \
  -p 9925:9925 \
  -p 9926:9926 \
  harperdb/harperdb
```

Here, the `<host_directory>` should be replaced with an actual directory path on your system where you want to store the persistent data. This command also exposes both the Harper Operations API (port 9925) and an additional HTTP port (9926).
For a more advanced setup, enabling HTTPS and clustering, you can run:

```bash
docker run -d \
  -v <host_directory>:/home/harperdb/hdb \
  -e HDB_ADMIN_USERNAME=HDB_ADMIN \
  -e HDB_ADMIN_PASSWORD=password \
  -e THREADS=4 \
  -e OPERATIONSAPI_NETWORK_PORT=null \
  -e OPERATIONSAPI_NETWORK_SECUREPORT=9925 \
  -e HTTP_SECUREPORT=9926 \
  -e CLUSTERING_ENABLED=true \
  -e CLUSTERING_USER=cluster_user \
  -e CLUSTERING_PASSWORD=password \
  -e CLUSTERING_NODENAME=hdb1 \
  -p 9925:9925 \
  -p 9926:9926 \
  -p 9932:9932 \
  harperdb/harperdb
```

In this setup, additional environment variables disable the unsecure Operations API port and enable secure ports for HTTPS, along with clustering parameters such as the clustering user, password, and node name. The port 9932 is also exposed for Harper clustering communication.

Finally, if you simply wish to check the Harper version using the container, execute:

```bash
docker run --rm harperdb/harperdb /bin/bash -c "harperdb version"
```

This command runs the container momentarily to print the version information, then removes the container automatically when finished.

### Logs and Troubleshooting

To verify that the container is running properly, you can check your running containers with:

```bash
docker ps
```

If you want to inspect the logs to ensure that Harper has started correctly, use this command (be sure to replace `<container_id>` with the actual ID from the previous command):

```bash
docker logs <container_id>
```

Once verified, you can access your Harper instance by opening your web browser and navigating to [http://localhost:9925](http://localhost:9925) (or the appropriate port based on your configuration).

### Raw binary installation

There's a different way to install Harper. You can choose your version and download the npm package and install it directly (you’ll still need Node.js and NPM). Click [this link](https://products-harperdb-io.s3.us-east-2.amazonaws.com/index.html) to download and install the package. Once you’ve downloaded the .tgz file, run the following command from the directory where you’ve placed it:

```bash
npm install -g harperdb-X.X.X.tgz harperdb install
```
