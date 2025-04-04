# Getting Started

Harper is designed for quick and simple setup and deployment, with smart defaults that lead to fast, scalable, and globally distributed database applications.

You can easily create a Harper database in the cloud through our studio or install it locally. The quickest way to get Harper up and running is with [Harper Cloud](deployments/harper-cloud/), our database-as-a-service offering. However, Harper is a [database application platform](developers/applications/), and to leverage Harper’s full application development capabilities of defining schemas, endpoints, messaging, and gateway capabilities, you may wish to install and run Harper locally so that you can use your standard local IDE tools, debugging, and version control.

### Installing a Harper Instance

You can simply install Harper with npm (or yarn, or other package managers):

```shell
npm install -g harperdb
```

Here we installed Harper globally (and we recommend this) to make it easy to run a single Harper instance with multiple projects, but you can install it locally (not globally) as well.

You can run Harper by running:

```javascript
harperdb
```

You can now use Harper as a standalone database. You can also create a cloud instance (see below), which is also an easy way to get started.

#### Developing Database Applications with Harper

Harper is more than just a database, with Harper you build "database applications" which package your schema, endpoints, and application logic together. You can then deploy your application to an entire cluster of Harper instances, ready to scale to on-the-edge delivery of data and application endpoints directly to your users. To get started with Harper, take a look at our application development guide, with quick and easy examples:

[Database application development guide](developers/applications/)

### Setting up a Cloud Instance

To set up a Harper cloud instance, simply sign up and create a new instance:

1. [Sign up for the Harper Studio](https://studio.harperdb.io/sign-up)
2. [Create a new Harper Cloud instance](administration/harper-studio/instances.md#Create-a-New-Instance)

Note that a local instance and cloud instance are not mutually exclusive. You can register your local instance in the Harper Studio, and a common development flow is to develop locally and then deploy your application to your cloud instance.

Harper Cloud instance provisioning typically takes 5-15 minutes. You will receive an email notification when your instance is ready.

#### Using the Harper Studio

Now that you have a Harper instance, if you want to use Harper as a standalone database, you can fully administer and interact with our database through the Studio. This section links to appropriate articles to get you started interacting with your data.

1. [Create a database](administration/harper-studio/manage-databases-browse-data.md#create-a-database)
2. [Create a table](administration/harper-studio/manage-databases-browse-data.md#create-a-table)
3. [Add a record](administration/harper-studio/manage-databases-browse-data.md#add-a-record)
4. [Load CSV data](administration/harper-studio/manage-databases-browse-data.md#load-csv-data) (Here’s a sample CSV of the Harper team’s dogs)
5. [Browse data](administration/harper-studio/manage-databases-browse-data.md#browse-table-data)

## Administering Harper

If you are deploying and administering Harper, you may want to look at our [configuration documentation](deployments/configuration.md) and our administrative operations API below.

### Harper APIs

The preferred way to interact with Harper for typical querying, accessing, and updating data (CRUD) operations is through the REST interface, described in the [REST documentation](developers/rest.md).

The Operations API provides extensive administrative capabilities for Harper, and the [Operations API documentation has usage and examples](developers/operations-api/). Generally it is recommended that you use the RESTful interface as your primary interface for performant data access, querying, and manipulation (DML) for building production applications (under heavy load), and the operations API (and SQL) for data definition (DDL) and administrative purposes.

The Harper Operations API is single endpoint, which means the only thing that needs to change across different calls is the body. For example purposes, a basic cURL command is shown below to create a database called dev. To change this behavior, swap out the operation in the `data-raw` body parameter.

```
curl --location --request POST 'https://instance-subdomain.harperdbcloud.com' \
--header 'Authorization: Basic YourBase64EncodedInstanceUser:Pass' \
--header 'Content-Type: application/json' \
--data-raw '{
  "operation": "create_schema",
  "database": "dev"
}'
```

## Support and Learning More

If you find yourself in need of additional support you can submit a [Harper support ticket](https://harperdbhelp.zendesk.com/hc/en-us/requests/new). You can also learn more about available Harper projects by searching [Github](https://github.com/search?q=harperdb).

### Video Tutorials

[Harper video tutorials are available on our YouTube channel](https://www.youtube.com/@harperdbio). Harper and the Harper Studio are constantly changing, as such, there may be small discrepancies in UI/UX.
