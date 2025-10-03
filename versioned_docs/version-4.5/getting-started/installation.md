---
title: Install Harper
---

# Install Harper

You can get Harper running in minutes.  
Choose the option that fits your workflow:

- **npm** → best for local development & quick starts.
- **Docker** → best for containerized environments and team setups.
- **Raw binary** → best if you need a manual or offline install.

---

## Install with npm (fastest way)

Make sure you have [Node.js](https://nodejs.org/) (LTS or newer). Then run:

```bash
npm install -g harperdb
harperdb
```

That’s it! Harper is now running locally.
The first time, you’ll set up your destination, username, password, and [configuration](../deployments/configuration).

✅ Quick check: open http://localhost:9925 or run:

```bash
curl http://localhost:9925/health
```

:::info
💡 Why choose npm: It’s the simplest way to try Harper and build apps right from your laptop.
:::

## Install with Docker

Want Harper in a container? Pull the image:

```bash
docker pull harperdb/harperdb
```

Start a container, mount a volume and pass environment variables:

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

Here, the `<host_directory>` should be replaced with an actual directory path on your system where you want to store the persistent data. This command also exposes both the Harper Operations API (port 9925) and an additional HTTP port (9926).

✅ Quick check:

```bash
curl http://localhost:9925/health
```

:::info
💡 Why choose Docker: Great for consistent team environments, CI/CD pipelines, or deploying Harper alongside other services.
:::

## Install from Raw Binary

Need offline or manual setup? Download the package from [our release index](https://products-harperdb-io.s3.us-east-2.amazonaws.com/index.html), then install:

```bash
npm install -g harperdb-X.X.X.tgz
harperdb install
```

:::info
💡 Why choose Raw Binary: Works without Docker, ideal for controlled environments.
:::

## Next Steps

Once Harper is running, you can:

- [Build your first application](../getting-started/quickstart)
- Explore the [Core Concepts](../foundations/core-concepts)
- Learn about [Harper's architecture](../foundations/harper-architecture)
- Review [Configuration options](../deployments/configuration)

:::info
Need help? Please don’t hesitate to [reach out](https://www.harpersystems.dev/contact).
:::