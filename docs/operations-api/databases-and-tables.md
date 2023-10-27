# Databases and Tables 

## Describe All
Returns the definitions of all databases and tables within the database.

<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be <code>describe_all</code>
</li>
</ul>

### Body

```json
{
    "operation": "describe_all"
}
```

### Response: 200
```json
{
    "dev": {
        "dog": {
          "schema": "dev",
          "name": "dog",
          "hash_attribute": "id",
          "audit": true,
          "schema_defined": false,
          "attributes": [
            {
              "attribute": "id",
              "indexed": true,
              "is_primary_key": true
            },
            {
              "attribute": "__createdtime__",
              "indexed": true
            },
            {
              "attribute": "__updatedtime__",
              "indexed": true
            },
            {
              "attribute": "type",
              "indexed": true
            }
          ],
          "clustering_stream_name": "dd9e90c2689151ab812e0f2d98816bff",
          "record_count": 4,
          "last_updated_record": 1697658683698.4504
        }
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Describe database
Returns the definitions of all tables within the specified database.

<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be <code>describe_database</code>
</li>

<li>
<b>database </b><i>(optional)</i> - database where the table you wish to describe lives. The default is <code>data</code>
</li>


</ul>

### Body

```json
{
    "operation": "describe_database",
    "database": "dev"
}
```

### Response: 200
```json
{
    "dog": {
      "schema": "dev",
      "name": "dog",
      "hash_attribute": "id",
      "audit": true,
      "schema_defined": false,
      "attributes": [
        {
          "attribute": "id",
          "indexed": true,
          "is_primary_key": true
        },
        {
          "attribute": "__createdtime__",
          "indexed": true
        },
        {
          "attribute": "__updatedtime__",
          "indexed": true
        },
        {
          "attribute": "type",
          "indexed": true
        }
      ],
      "clustering_stream_name": "dd9e90c2689151ab812e0f2d98816bff",
      "record_count": 4,
      "last_updated_record": 1697658683698.4504
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Describe Table
Returns the definition of the specified table.

<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be <code>describe_table</code>
</li>

<li>
<b>table</b> <i>(required)</i> - table you wish to describe
</li>

<li>
<b>database </b><i>(optional)</i> - database where the table you wish to describe lives. The default is <code>data</code>.
</li>


</ul>

### Body

```json
{
    "operation": "describe_table",
    "table": "dog"
}
```

### Response: 200
```json
{
  "schema": "dev",
  "name": "dog",
  "hash_attribute": "id",
  "audit": true,
  "schema_defined": false,
  "attributes": [
    {
      "attribute": "id",
      "indexed": true,
      "is_primary_key": true
    },
    {
      "attribute": "__createdtime__",
      "indexed": true
    },
    {
      "attribute": "__updatedtime__",
      "indexed": true
    },
    {
      "attribute": "type",
      "indexed": true
    }
  ],
  "clustering_stream_name": "dd9e90c2689151ab812e0f2d98816bff",
  "record_count": 4,
  "last_updated_record": 1697658683698.4504
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Create database
Create a new database.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>

<li><b>operation</b><i> (required)</i> - must always be <code>create_database</code>.</li>

<li><b>database</b><i> (optional)</i> - name of the database you are creating. The default is <code>data</code>.</li>

</ul>

### Body

```json
{
    "operation": "create_database",
    "database": "dev"
}
```

### Response: 200
```json
{
    "message": "database 'dev' successfully created"
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Drop database
Drop an existing database. NOTE: Dropping a database will delete all tables and all of their records in that database.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li><b>operation</b><i> (required)</i> - this should always be <code>drop_database</code>.</li>

<li><b>database</b><i> (required)</i> - name of the database you are dropping.</li>
</ul>

### Body

```json
{
    "operation": "drop_database",
    "database": "dev"
}
```

### Response: 200
```json
{
    "message": "successfully deleted 'dev'"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Create  Table
Create a new table within a database.

_**Operation is restricted to super_user roles only**_

<ul>
<li><p><b>operation </b><i>(required)</i> - must always be <code>create_table</code></p></li>
<li><p><b>database</b><i> (optional)</i> - name of the database where you want your table to live. If the database does not exist, it will be created. If the <code>database</code> property is not provided it will default to <code>data</code>.</p></li>
<li><p><b>table </b><i>(required)</i> - name of the table you are creating</p></li>
<li><p><b>primary_key</b><i> (required)</i> - primary key for the table</p></li>
<li><p><b>attributes</b> <i>(optional)</i> - An array of attributes that specifies the schema for the table, that is the set of attributes for the table. When attributes are supplied the table will not be considered a "dynamic schema" table, and attributes will not be auto-added when records with new properties are inserted. Each attribute is specified as:</p><ul><li><p><b>name </b><i>(required)</i> - The name of the attribute</p></li><li><p><b>indexed </b><i>(optional)</i> - Indicates if the attribute should be indexed</p></li><li><p><b>type </b><i>(optional)</i> - Specifies the data type of the attribute (can be String, Int, Float, Date, ID, Any).</p></li></ul></li><li><p><b>expiration </b><i>(optional)</i> - Specifies the time-to-live or expiration of records in the table before they are evicted (records are not evicted on any timer if not specified). This is specified in seconds.</p></li></ul>

### Body

```json
{
    "operation": "create_table",
    "database": "dev",
    "table": "dog",
    "primary_key": "id"
}
```

### Response: 200
```json
{
    "message": "table 'dev.dog' successfully created."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Drop Table
Drop an existing database table. NOTE: Dropping a table will delete all associated records in that table.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li><b>operation</b><i> (required)</i> - this should always be <code>drop_table</code></li>

<li><b>database</b><i> (optional)</i> - database where the table you are dropping lives. The default is <code>data</code>.</li>

<li><b>table</b><i> (required)</i> - name of the table you are dropping.  </li>

</ul>

### Body

```json
{
    "operation": "drop_table",
    "database": "dev",
    "table": "dog"
}
```

### Response: 200
```json
{
    "message": "successfully deleted table 'dev.dog'"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Create  Attribute
Create a new attribute within the specified table. **The create_attribute operation can be used for admins wishing to pre-define schema values for setting role-based permissions or for any other reason.**

_Note: HarperDB will automatically create new attributes on insert and update if they do not already exist within the schema._

<ul>
<li><p><b>operation </b><i>(required)</i> - must always be <code>create_attribute</code>.</p></li>
<li><p><b>database</b><i> (optional)</i> - name of the database of the table you want to add your attribute. The default is <code>data</code>.</p></li>
<li><p><b>table </b><i>(required)</i> - name of the table where you want to add your attribute to live.</p></li>
<li><p><b>attribute</b><i> (required)</i> - name for the attribute.</p></li>
</ul>

### Body

```json
{
    "operation": "create_attribute",
    "database": "dev",
    "table": "dog",
    "attribute": "is_adorable"
}
```

### Response: 200
```json
{
    "message": "inserted 1 of 1 records",
    "skipped_hashes": [],
    "inserted_hashes": [
        "383c0bef-5781-4e1c-b5c8-987459ad0831"
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Drop Attribute
Drop an existing attribute from the specified table. NOTE: Dropping an attribute will delete all associated attribute values in that table.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li><b>operation</b><i> (required)</i> - this should always be <code>drop_attribute</code>.</li>

<li><b>database</b><i> (optional)</i> - database where the table you are dropping lives. The default is <code>data</code>.</li>

<li><b>table</b><i> (required)</i> - table where the attribute you are dropping lives.</li>

<li><b>attribute</b><i> (required)</i> - attribute that you intend to drop.</li>

</ul>

### Body

```json
{
    "operation": "drop_attribute",
    "database": "dev",
    "table": "dog",
    "attribute": "is_adorable"
}
```

### Response: 200
```json
{
    "message": "successfully deleted attribute 'is_adorable'"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Get Backup
This will return a snapshot of the requested database. This provides a means for backing up the database through the operations API. The response will be the raw database file (in binary format), which can later be restored as a database file by copying into the appropriate hdb/databases directory (with HarperDB not running). The returned file is a snapshot of the database at the moment in time that the get_backup operation begins. This also supports backing up individual tables in a database. However, this is a more expensive operation than backing up a database in whole, and will lose any transactional atomicity between writes across tables, so generally it is recommended that you backup the entire database.

It is important to note that trying to copy a database file that is in use (HarperDB actively running and writing to the file) using standard file copying tools is not safe (the copied file will likely be corrupt), which is why using this snapshot operation is recommended for backups (volume snapshots are also a good way to backup HarperDB databases).

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li><b>operation</b><i> (required)</i> - this should always be <code>get_backup</code></li>

<li><b>database</b><i> (required)</i> - this is the database that will be snapshotted and returned. </li>

<li><b>table</b><i> (optional)</i> - this will specify a specific table to backup.</li>

<li><b>tables</b><i> (optional)</i> - this will specify a specific set of tables to backup.</li>

</ul>

### Body

```json
{
    "operation": "get_backup",
    "database": "dev"
}
```

### Response: 200
```
The database in raw binary data format
```
