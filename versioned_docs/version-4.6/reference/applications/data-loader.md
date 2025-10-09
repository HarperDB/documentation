---
title: Data Loader
---

# Data Loader

The Data Loader is a built-in plugin that provides a reliable mechanism for loading data from JSON or YAML files into Harper tables during component deployment. It is typically used to ensure that specific records exist in a database when deploying components, such as seed data, configuration records, or initial application data.

## Configuration

Enable the Data Loader in your component’s `config.yaml` file by specifying one or more data files:

```yaml
dataLoader:
  files: 'data/*.json'
```

The Data Loader is an Extension and supports the standard `files` configuration option.

## Data File Format

Data files must be structured as JSON or YAML and contain records for a single table.

If you need to load data into multiple tables, create a separate file for each table.

### Basic Example

**`users.json`**

```json
{
	"database": "myapp",
	"table": "users",
	"records": [
		{
			"id": 1,
			"username": "admin",
			"email": "admin@example.com",
			"role": "administrator"
		},
		{
			"id": 2,
			"username": "user1",
			"email": "user1@example.com",
			"role": "standard"
		}
	]
}
```

### Multiple Tables

To load multiple tables, use separate files:
**`users.json`**

```json
{
	"database": "myapp",
	"table": "users",
	"records": [
		{
			"id": 1,
			"username": "admin",
			"email": "admin@example.com"
		}
	]
}
```

**`settings.yaml`**

```yaml
database: myapp
table: settings
records:
  - id: 1
    setting_name: app_name
    setting_value: My Application
  - id: 2
    setting_name: version
    setting_value: '1.0.0'
```

## File Organization

Data files can be referenced in several ways:

**Single File Pattern**

```yaml
dataLoader:
  files: 'data/seed-data.json'
```

**Multiple Files Pattern**

```yaml
dataLoader:
  files:
    - 'data/users.json'
    - 'data/settings.yaml'
    - 'data/initial-products.json'
```

**Glob pattern**

```yaml
dataLoader:
  files: 'data/**/*.{json,yaml,yml}'
```

## Loading Behavior

When Harper starts with a component that includes the Data Loader:

- The Data Loader reads all specified data files (.json, .yaml, .yml).
- For each file, it validates that only one table is specified.
- Records are inserted or updated based on timestamp comparison:
  - New records are inserted if they do not exist.
  - Existing records are updated only if the data file’s modification time is newer than the record’s last updated time.
- This behavior ensures files can be safely reloaded without overwriting newer changes.

If a record with the same primary key already exists, updates occur only when the file is newer.

:::information
Note: The Data Loader can infer table schemas from the provided records, but it is recommended to explicitly define schemas with the `graphqlSchema` component for type safety and better control.
:::

## Best Practices

- **Define schemas first** – Explicit schemas ensure correct types, constraints, and relationships.
- **One table per file** – Each file should only define records for one table.
- **Idempotency** – Write data files so they can be safely reloaded without creating duplicates.
- **Version control** – Commit data files to ensure consistent deployments.
- **Environment-specific data** – Use different data files per environment (development, staging, production).
- **Validate data** – Confirm JSON/YAML syntax and schema compatibility before deployment.
- **Avoid sensitive data** – Do not store credentials or API keys in data files. Use environment variables or secure configuration management instead.

## Example Component Structure

```
my-component/
├── config.yaml
├── data/
│   ├── users.json
│   ├── roles.json
│   └── settings.json
├── schemas.graphql
└── roles.yaml
```

**`config.yaml`**

```yaml
# Load environment variables
loadEnv:
  files: '.env'

# Define schemas
graphqlSchema:
  files: 'schemas.graphql'

# Define roles
roles:
  files: 'roles.yaml'

# Load initial data
dataLoader:
  files: 'data/*.json'

# Enable REST endpoints
rest: true
```

## Related Documentation

- [Data Loader (Application Guide)](../../developers/applications/loading-data) – Step-by-step walkthrough with examples.
- [Bulk Operations](../../developers/operations-api/bulk-operations) – Load data programmatically via the Operations API.
- [Extensions](../components/extensions) – General reference for Harper Extensions.
