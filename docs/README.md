# Documentation

HarperDB's documentation covers installation, getting started, administrative operation APIs, security, and much more. Browse the topics at left, or choose one of the commonly used documentation sections below.

## Getting Started

HarperDB is designed for quick and simple set up and deployment, with smart defaults that lead to fast, scalable, and globally distributed database applications. Getting started with HarperDB is easy and fast.

You can easily create a HarperDB database in the cloud through our studio or install it locally. The quickest way to get up and running with HarperDB is with [HarperDB Cloud](../harperdb-cloud/README.md), our database-as-a-service offering. However, HarperDB is a database application platform, and to leverage HarperDB’s full application development capabilities of defining schemas, endpoints, messaging, and gateway capabilities, you may wish to install and run HarperDB locally so that you can use standard IDE tools, debugging, and version control.

### Installing a HarperDB Instance

You can simply install HarperDB with npm (or yarn, or other package managers):
```shell
npm install -g harperdb
```
Here we installed HarperDB globally (and we recommend this) to make it easy to run a single HarperDB instance with multiple projects, but you can install it locally (not globally) as well.

You can run HarperDB by running:
```javascript
harperdb
```

You can now use as HarperDB as a standalone database. You can also create a cloud instance (see below), which is an extremely quick and easy way to get started.

#### Database Application Platform

HarperDB is more than just a database, developing database applications allows you package your schema, endpoints, and application logic together and deploy to an entire cluster of HarperDB instances, ready to scale to on-the-edge delivery of data. To create a HarperDB application, take a look at our [database application development guide](../applications/README.md), it quick and easy to get started.

### Setting up a Cloud Instance
To set up a HarperDB cloud instance, simply sign up and create a new instance:
1. [Sign up for the HarperDB Studio](https://studio.harperdb.io/sign-up)
2. [Create a new HarperDB Cloud instance](../harperdb-studio/instances.md#Create-a-New-Instance)

Note that a local instance and cloud instance are not mutually exclusive. You can register you local instance in your cloud studio, and a common development flow is to develop locally and then deploy your application to your cloud instance.

HarperDB Cloud instance provisioning typically takes 5-15 minutes. You will receive an email notification when your instance is ready.

#### Using the HarperDB Studio

Now that you have a HarperDB instance, if you want to use HarperDB as a standalone database, you can fully administer and interact with our database through the Studio. This section links to appropriate articles to get you started interacting with your data.

1. [Create a schema](../harperdb-studio/manage-schemas-browse-data.md#Create-a-Schema)
2. [Create a table](../harperdb-studio/manage-schemas-browse-data.md#create-a-table)
3. [Add a record](../harperdb-studio/manage-schemas-browse-data.md#add-a-record)
4. [Load CSV data](../harperdb-studio/manage-schemas-browse-data.md#load-csv-data) (Here’s a sample CSV of the HarperDB team’s dogs)
5. [Query data via SQL](../harperdb-studio/query-instance-data.md)

## Administering HarperDB

If you are deploying and administering HarperDB, you may want to look at our [configuration documentation](../configuration.md) and our administrative operations API below.

### Using the HarperDB Operations API

The complete HarperDB Operations API documentation is available at api.harperdb.io, and provides important administrative functions. Generally it is recommended that use the RESTful interface described in the [database application development guide](../applications/README.md) as your primary interface for scalable and performant data interaction for building production applications, and the operations API for administrative purposes.

The HarperDB Studio features an example code builder that generates API calls in the programming language of your choice for operations. For example purposes, a basic cURL command is shown below to create a schema called dev.

```
curl --location --request POST 'https://instance-subdomain.harperdbcloud.com' \
--header 'Authorization: Basic YourBase64EncodedInstanceUser:Pass' \
--header 'Content-Type: application/json' \
--data-raw '{
"operation": "create_schema",
"schema": "dev"
}'
```

## Support and Learning More
See our [support documentation](../support.md) for more information on getting help, and you can also learn more about available HarperDB projects by searching [Github](https://github.com/search?q=harperdb).

### Video Tutorials

[HarperDB video tutorials are available within the HarperDB Studio](../harperdb-studio/resources.md#video-tutorials). HarperDB and the HarperDB Studio are constantly changing, as such, there may be small discrepancies in UI/UX.

