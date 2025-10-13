---
title: Install and Connect Harper
---

# Install and Connect Harper

The recommended approach for efficiently developing applications with Harper is to install Harper locally for efficient development of an application and deploy it to [Harper Fabric](https://fabric.harper.fast), our distributed data application platform service. However, you can also develop directly in Fabric, if you want to quickly try it out. You can also run a self-hosted Harper server, and manage it with our Fabric studio management UI.

## Install with npm

The fastest way to get Harper running locally is to install with npm. Make sure you have [Node.js](https://nodejs.org/) (LTS or newer). Then run:

```bash
npm install -g harperdb
harperdb
```

The first time, you’ll set up your destination, username, password, and [configuration](../deployments/configuration). That’s it! Harper is now running locally.

✅ Quick check: open http://localhost:9925, which will launch the studio UI for managing your local server, or run this for a quick health check:

```bash
curl http://localhost:9925/health
```

Harper can also be [installed with our Docker image or you can download Harper for manual or offline installation](../deployments/install-harper).

## Manage and Deploy with Fabric

Fabric is our service for managing and deploying Harper on a distributed network. Fabric makes it easy to create new Harper "clusters", the Harper application platform running on distributed nodes, and deploy your application to this service. Fabric has a management interface, and provides a UI for managing your deployments and even your local instance that you just installed. You can sign up for Fabric for free, and create a free Harper cluster to deploy your application:

- Go to [Fabric](https://fabric.harper.fast) and sign-up for a new account.
  - You will need to agree to the terms of service and verify your email address.
- Once you have created an account, you can create an organization. This will allow you to collaboratively managing your Harper services with others. This will also define the host domain that will be used.
- You can now create a new Harper cluster or instance:
  - Create a free Harper cluster for trying out Harper.
  - Purchase a Harper cluster with higher performance, scalability, and limits.
  - Add your own local instance to manage everything in one place.
- Once you have a Harper cluster, you will be ready to create a new application directly on Fabric, or be ready to deploy an application to Fabric.

Once Harper is running or you are connected to Fabric, we recommend that you walk through the steps of [building your first application](../getting-started/quickstart) and learn more about Harper's concepts and architecture:

- [Build your first application](../getting-started/quickstart)
- Explore the [Core Concepts](../foundations/core-concepts)
- Learn about [Harper's architecture](../foundations/harper-architecture)
- Review [Configuration options](../deployments/configuration)

:::info
Need help? Please don’t hesitate to [reach out](https://www.harpersystems.dev/contact).
:::
