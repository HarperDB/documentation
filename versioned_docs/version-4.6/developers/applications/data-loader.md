---
title: Data Loader
---

# Data Loader

Now that you’ve set up your first application, let’s bring it to life with some data. Applications are only as useful as the information they hold, and Harper makes it simple to seed your database with initial records, configuration values, or even test users, without needing to write a custom script. This is where the Data Loader comes in.

Think of the Data Loader as your shortcut for putting essential data in place from day one. Whether it’s a set of default settings, an admin user account, or sample data for development, the Data Loader ensures that when your application is deployed, it’s immediately usable.

In this section, we’ll add a few dogs to our `Dog` table so our application starts with meaningful data.

## Creating a Data File

First, let’s make a `data` directory in our app and create a file called `dogs.json`:

```json
{
	"database": "myapp",
	"table": "Dog",
	"records": [
		{
			"id": 1,
			"name": "Harper",
			"breed": "Labrador",
			"age": 3,
			"tricks": ["sit"]
		},
		{
			"id": 2,
			"name": "Balto",
			"breed": "Husky",
			"age": 5,
			"tricks": ["run", "pull sled"]
		}
	]
}
```

This file tells Harper: _“Insert these two records into the `Dog` table when this app runs.”_

## Connecting the Data Loader

Next, let’s tell Harper to use this file when running the application. Open `config.yaml` in the root of your project and add:

```yaml
dataLoader:
  files: 'data/dogs.json'
```

That’s it. Now the Data Loader knows where to look.

## Running with Data

Go ahead and start your app again:

```bash
harperdb dev .
```

This time, when Harper runs, it will automatically read `dogs.json` and load the records into the Dog table. You don’t need to write any import scripts or SQL statements, it just works.

You can confirm the data is there by hitting the endpoint you created earlier:

```bash
curl http://localhost:9926/Dog/
```

You should see both `Harper` and `Balto` returned as JSON.

### Updating Records

What happens if you change the data file? Let’s update Harper’s age from 3 to 4 in `dogs.json.`

```json
{
	"id": 1,
	"name": "Harper",
	"breed": "Labrador",
	"age": 4,
	"tricks": ["sit"]
}
```

When you save the file, Harper will notice the change and reload. The next time you query the endpoint, Harper’s age will be updated.

The Data Loader is designed to be safe and repeatable. If a record already exists, it will only update when the file is newer than the record. This means you can re-run deployments without worrying about duplicates.

### Adding More Tables

If your app grows and you want to seed more than just dogs, you can create additional files. For example, a `settings.yaml` file:

```yaml
database: myapp
table: Settings
records:
  - id: 1
    setting_name: app_name
    setting_value: Dog Tracker
  - id: 2
    setting_name: version
    setting_value: '1.0.0'
```

Then add it to your config:

```yaml
dataLoader:
  files:
    - 'data/dogs.json'
    - 'data/settings.yaml'
```

Harper will read both files and load them into their respective tables.

## Key Takeaway

With the Data Loader, your app doesn’t start empty. It starts ready to use. You define your schema, write a simple data file, and Harper takes care of loading it. This keeps your applications consistent across environments, safe to redeploy, and quick to get started with.

In just a few steps, we’ve gone from an empty Dog table to a real application with data that’s instantly queryable.

## Related Documentation

- [Data Loader Reference](../../reference/applications/data-loader) – Complete configuration and format options.
- [Bulk Operations](../operations-api/bulk-operations) - For loading data via the Operations API
