# Getting Started

HarperDB is designed for quick and simple setup and deployment, with smart defaults that lead to fast, scalable, and globally distributed database applications.

This getting started guide will walk through installing HarperDB locally, interacting with data, creating and using [Components](), and more!

> [!NOTE]
> HarperDB Cloud is undergoing redevelopment. Until further notice, local use is the preferred development method.

## Installing HarperDB

Ensure you have at least Node.js v18+ installed; however, we recommend using the latest Node.js LTS version, currently **v22**.

Install HarperDB with any Node.js package manager. It is recommended to install HarperDB globally so there exists only one instance.

```sh
npm install -g harperdb
```

Ensure you have access to the `harperdb` command by running `harperdb version`.

Then, setup HarperDB interactively using `harperdb install` (follow the prompts), or by providing the following command line arguments:

```sh
harperdb install \
  --TC_AGREEMENT yes \
  --HDB_ADMIN_USERNAME HDB_ADMIN \
  --HDB_ADMIN_PASSWORD password123 \
  --ROOTPATH /hdb/ \
  --DEFAULTS_MODE dev \
  --REPLICATION_HOSTNAME localhost
```

If HarperDB is not running after installation, run `harperdb start` to kick it off.

Make sure `HarperDB 4.4.14 successfully started` is output to the terminal.

HarperDB is now running on your machine!

## Introduction to HarperDB Operations API

By default, the HarperDB [Operations API]() is available at `http://localhost:9925`. Using your preferred HTTP Client, lets inspect the HarperDB system:

```sh
curl -X POST http://localhost:9925 \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "system_information",
    "attributes": ["system"]
  }'
```

Expected output:

```
{
   "system" : {
      "arch" : "arm64",
      "codename" : "bookworm",
      "distro" : "Debian GNU/Linux",
      "fqdn" : "699ad551f8c2",
      "hostname" : "699ad551f8c2",
      "kernel" : "6.11.3-200.fc40.aarch64",
      "node_version" : "22.12.0",
      "npm_version" : "10.9.0",
      "platform" : "linux",
      "release" : "12"
   }
}
```

### Set Up

To set up the system, create a **database** called `dev` using the `create_database` operation:

```sh
curl -X POST http://localhost:9925 \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "create_database",
    "database": "dev"
  }'
```

Expected Output:
```json
{ "message": "database 'dev' successfully created" }
```

And a **table** called `dog` using the `create_table` operation:

```sh
curl -X POST http://localhost:9925 \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "create_table",
    "database": "dev",
    "table": "dog",
    "primary_key": "id",
    "attributes": [
      { "name": "id", "type": "ID" },
      { "name": "name", "type": "String" },
      { "name": "breed", "type": "String" },
      { "name": "owner", "type": "String" },
      { "name": "age", "type": "Float" }
    ]
  }'
```

Expected Output:
```json
{ "message": "table 'dev.dog' successfully created." }
```


Verify the `dog` table using the `describe_table` operation:

```sh
curl -X POST http://localhost:9925 \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "describe_table",
    "database": "dev",
    "table": "dog"
  }'
```

Expected output:
```json
{
  "schema": "dev",
  "name": "dog",
  "hash_attribute": "id",
  "audit": true,
  "schema_defined": true,
  "attributes": [
    {
      "attribute": "id",
      "type": "ID",
      "is_primary_key": true
    },
    {
      "attribute": "name",
      "type": "String"
    },
    {
      "attribute": "breed",
      "type": "String"
    },
    {
      "attribute": "owner",
      "type": "String"
    },
    {
      "attribute": "age",
      "type": "Float"
    }
  ],
  "db_size": 57344,
  "sources": [],
  "record_count": 0
}
```

### Inserting Records

With a database and table successfully generated. Now lets add some data!

```sh
curl -X POST http://localhost:9925 \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "insert",
    "database": "dev",
    "table": "dog",
    "records": [
      {
        "id": "1",
        "name": "Harper",
        "breed": "Husky",
        "owner": "Stephen",
        "age": 7
      },
      {
        "id": "2",
        "name": "Kato",
        "breed": "Labrador Retriever",
        "owner": "Kyle",
        "age": 6
      },
      {
        "id": "3",
        "name": "Lincoln",
        "breed": "Shepherd",
        "owner": "Ethan",
        "age": 4
      },
      {
        "id": "4",
        "name": "Tucker",
        "breed": "Husky",
        "owner": "David",
        "age": 2
      }
    ]
  }'
```

Expected Output:
```json
{
  "message": "inserted 4 of 4 records",
  "inserted_hashes": [ "1", "2", "3", "4"],
  "skipped_hashes": []
}
```

Wonderful, now the `dog` table has data in it.

### Querying using Operations API

> HarperDB offers many different querying methodologies. After this guide, explore our documentation for more possibilities.

Using the `search_by_id` operation, lets get the records with ids `"1"` and `"3"`:

```sh
curl -X POST http://localhost:9925 \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "search_by_id",
    "database": "dev",
    "table": "dog",
    "ids": ["1", "3"],
    "get_attributes": ["*"]
  }'
```

Expected output:
```json
[
  {
    "id": "1",
    "name": "Harper",
    "breed": "Husky",
    "owner": "Stephen",
    "age": 7
  },
  {
    "id": "3",
    "name": "Lincoln",
    "breed": "Shepherd",
    "owner": "Ethan",
    "age": 4
  }
]
```

And now slightly more complicated, use the `search_by_conditions` operation to retrieve all dogs ages 5 and up.

```sh
curl -X POST http://localhost:9925 \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "search_by_conditions",
    "database": "dev",
    "table": "dog",
    "conditions": [
      {
        "search_attribute": "age",
        "search_type": "greater_than_equal",
        "search_value": 5
      }
    ],
    "get_attributes": ["*"]
  }'
```

Expected output:
```json
[
  {
    "id": "1",
    "name": "Harper",
    "breed": "Husky",
    "owner": "Stephen",
    "age": 7
  },
  {
    "id": "2",
    "name": "Kato",
    "breed": "Labrador Retriever",
    "owner": "Kyle",
    "age": 6
  }
]
```

### Operations API Conclusion

Great work! You've successfully completed the introduction to the HarperDB Operations API and learned how to:
- Create a database and table
- Insert records
- Query data

In the following section we'll expand on this by leveraging HarperDB's Component system to create an application that enables even more HarperDB features!

## Introduction to HarperDB Components

HarperDB is more than just a database. It is a complete application platform. This part of the guide will dive into creating a small application (also known as a HarperDB Component) that runs inside of HarperDB.

### Prerequisite

Ensure Node.js and HarperDB are installed on the machine. Go back to the [Installing HarperDB](#installing-harperdb) for more information.

If you've just completed the previous section, [Introduction to HarperDB Operations API](#introduction-to-harperdb-operations-api), drop the `dog` table so we can start fresh in this section.

```sh
# Make sure HarperDB is running (harperdb start)
curl -X POST http://localhost:9925 \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "drop_table",
    "database": "dev",
    "table": "dog"
  }'
```

Expected output:
```json
{ "message": "successfully deleted table 'dev.dog'" }
```

Before continuing, shut down HarperDB using `harperdb stop`.

### Create local environment

On your local machine, create a new directory for developing with HarperDB.

```sh
mkdir harperdb-getting-started
cd harperdb-getting-started
```

Generate a new Node.js project by copying the following _package.json_ file.

```json
{
	"name": "harperdb-getting-started",
	"private": true
}
```

Open the `harperdb-getting-started` directory in your preferred editor.

### Create a HarperDB Component

Within the project directory, start by creating a `config.yaml`. This is the main HarperDB Component entrypoint. This is how HarperDB knows this project is a Component.

Add the following content to `config.yaml`:

```yaml
rest: true
graphqlSchema:
  files: 'schema.graphql'
```

The first line, `rest: true`, enables the HarperDB REST API. The second line, `graphqlSchema:`, specifies that HarperDB should look for a `schema.graphql` file for table definitions.

Now, create the `schema.graphql` file:

```graphql
type dog @table(database: "dev") @export {
  id: ID @primaryKey
  name: String
  breed: String
  owner: String
  age: Int
}
```

### Run the component

With the files in place, and HarperDB shutdown (`harperdb stop`). Now run HarperDB at the component directory. If that is your current directory, you can use `.`.

```sh
harperdb run harperdb-getting-started
```

This command will not exit until HarperDB is shutdown, so create a new terminal to continue.

### Inspect the table

Instead of using the Operations API, this time we are going to use the REST interface for the `dog` table.

Get started by making a GET request to `/dog`

```sh
curl http://localhost:9926/dog
```

Expected output:
```json
{
  "recordCount": 0,
  "records": "./",
  "name": "dog",
  "database": "dev",
  "auditSize": 10,
  "attributes": [
    {
      "type": "ID",
      "name": "id",
      "isPrimaryKey": true,
      "attribute": "id"
    },
    {
      "type": "String",
      "name": "name",
      "attribute": "name"
    },
    {
      "type": "String",
      "name": "breed",
      "attribute": "breed"
    },
    {
      "type": "String",
      "name": "owner",
      "attribute": "owner"
    },
    {
      "type": "Int",
      "name": "age",
      "attribute": "age"
    }
  ]
}
```

Querying the table, and omitting the trailing slash `/`, will return its description, similar to the `describe_table` operation.

Next, lets insert a record using the REST interface. Create a PUT request to `/dog/1`. The `1` being the primary key `id` for the record.

```sh
curl -X PUT http://localhost:9926/dog/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Harper",
    "breed": "Husky",
    "owner": "Stephen",
    "age": 7
  }'
```

Now, create a GET request to the same endpoint to see the new record:

```sh
curl http://localhost:9926/dog/1
```

Expected output:
```json
{
  "name": "Harper",
  "breed": "Husky",
  "owner": "Stephen",
  "age": 7,
  "id": "1"
}
```

Insert the remaining records and continue on to the querying section.

```sh
curl -X PUT http://localhost:9926/dog/2 \
  -H "Content-Type: application/json" \
  -d '{
    "id": "2",
    "name": "Kato",
    "breed": "Labrador Retriever",
    "owner": "Kyle",
    "age": 6
  }'

curl -X PUT http://localhost:9926/dog/3 \
  -H "Content-Type: application/json" \
  -d '{
    "id": "3",
    "name": "Lincoln",
    "breed": "Shepherd",
    "owner": "Ethan",
    "age": 4
  }'

curl -X PUT http://localhost:9926/dog/4 \
  -H "Content-Type: application/json" \
  -d '{
    "id": "4",
    "name": "Tucker",
    "breed": "Husky",
    "owner": "David",
    "age": 2
  }'
```

### Querying with the REST API

Start by verifying the `dog` table contains the 4 records added in the previous step:

```sh
curl http://localhost:9926/dog/ # Don't miss the trailing slash!
```

Expected output:
```json
[
  {
    "name": "Harper",
    "breed": "Husky",
    "owner": "Stephen",
    "age": 7,
    "id": "1"
  },
  {
    "id": "2",
    "name": "Kato",
    "breed": "Labrador Retriever",
    "owner": "Kyle",
    "age": 6
  },
  {
    "id": "3",
    "name": "Lincoln",
    "breed": "Shepherd",
    "owner": "Ethan",
    "age": 4
  },
  {
    "id": "4",
    "name": "Tucker",
    "breed": "Husky",
    "owner": "David",
    "age": 2
  }
]
```

Now, like we did in the Operations API section, lets query for all dogs ages 5 and older using the `age` parameter.

```sh
curl http://localhost:9926/dog/?age=ge=5
```

Expected output:
```json
[
  {
    "name": "Harper",
    "breed": "Husky",
    "owner": "Stephen",
    "age": 7,
    "id": "1"
  },
  {
    "id": "2",
    "name": "Kato",
    "breed": "Labrador Retriever",
    "owner": "Kyle",
    "age": 6
  }
]
```

Next, limit the returned fields to only the name and breed using the `select` parameter.

```sh
curl "http://localhost:9926/dog/?age=ge=5&select(name,breed)" # Most terminals have a problem with the `(` and `)` characters. Wrap in quotes to fix.
```

Expected output:
```json
[
  {
    "name": "Harper",
    "breed": "Husky"
  },
  {
    "name": "Kato",
    "breed": "Labrador Retriever"
  }
]
```

The REST query interface is highly capable and very easy to use

### Custom Resource

Throughout this guide, we've only been using a simple `dog` **table** throughout the examples. But HarperDB is much more capable than that! Under the hood of a _table_ is a **Resource**. HarperDB Resources are highly customizable and go hand-in-hand with Components. Lets add one to the `harperdb-getting-started` component.

Add the following lines to the `config.yaml`:

```yaml
jsResource:
  files: 'resources.js'
```

And then create a `resources.mjs`.

> HarperDB will execute this file as part of this component. It has access to multiple, key HarperDB global variables such as `database`, `tables`, and `Resource`. These interfaces enable you to directly interact with the entirety of your HarperDB system. You can perform CRUD operations directly in JavaScript. For this guide, we will demonstrate defining a custom resource that extends from the `dog` table. Explore the complete Component and Application documentation to learn all the different HarperDB capabilities.

Within `resources.js`, define and export a class `PetInfo` that extends from the `dog` table (`database.dev.dog`), and an empty `get()` method.

```js
export class PetInfo extends database.dev.dog {
  get() {

  }
}
```

> The `export` is important for this to become available via the REST endpoint.

Within the `get()` method, add the following logic:

```js
get() {
  const { name, breed, owner, age } = this;

  const html = `<html>
<head>
  <title>Pet Info | ${name}</title>
</head>
<body>
  <h1>Dog: ${name}</h1>
  <p>Breed: ${breed}</p>
  <p>Owner: ${owner}</p>
  <p>Age: ${age}</p>
</body>
</html>`;

  return {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
    body: html
  }
}
```

Since `PetInfo` extends from the `dog` table, when you create a GET request to `PetInfo/1`, the `1` is passed through to the `dog` table and the `this` becomes the record associated with that ID. Thus, by opening `localhost:9926/PetInfo/1` in your browser, the HTML generated by this custom HarperDB Resource will render!

### HarperDB Components Conclusion

This guide only scratches the surface for what you can create with HarperDB. In this section you've learned how to:
- Create a HarperDB Component
- Enable the automatic HarperDB REST interface
- Create, read, and update records with the REST interface
- Specify a table using HarperDB's GraphQL Schema system
- Create custom HarperDB Resource that extends from an existing HarperDB Table

## Next Steps

Explore more of our documentation to see what else is possible with HarperDB!