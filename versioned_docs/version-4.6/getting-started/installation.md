---
title: Install Harper
---

# Install Harper

You can get Harper running in minutes.  
Choose the option that fits your workflow:  

- **NPM** → best for local development & quick starts.  
- **Docker** → best for containerized environments and team setups.  
- **Raw binary** → best if you need a manual or offline install.  

---

## Install with NPM (fastest way)

Make sure you have [Node.js](https://nodejs.org/) (LTS or newer). Then run:

```bash
npm install -g harperdb
harperdb
```

That’s it! Harper is now running locally.
The first time, you’ll set up your destination, username, password, and config.

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

Start a container:

```bash
docker run -d -p 9925:9925 harperdb/harperdb
```

✅ Quick check:
```bash
curl http://localhost:9925/health
```

For persistent storage and secure configs, mount a volume and pass environment variables:
```bash
docker run -d \
  -v <host_directory>:/home/harperdb/hdb \
  -e HDB_ADMIN_USERNAME=HDB_ADMIN \
  -e HDB_ADMIN_PASSWORD=password \
  -p 9925:9925 \
  harperdb/harperdb
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
- [Build your first application](../getting-started/quickstart.md)
- Explore the [Core Concepts](../foundations/core-concepts.md)
- Learn about [Harper's architecture](../foundations/harper-architecture.md)

:::info
Need help? Please don’t hesitate to [reach out](https://www.harpersystems.dev/contact).
:::