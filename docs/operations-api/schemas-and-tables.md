# Schemas and Tables 


## Describe All
Returns the definitions of all schemas and tables within the database.

<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'describe_all'
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
            "__createdtime__": 1598473228070,
            "__updatedtime__": 1598473228070,
            "hash_attribute": "id",
            "id": "b9cc7292-acf7-40fb-91ba-87012a6f5f84",
            "name": "dog",
            "residence": null,
            "schema": "dev",
            "attributes": [
                {
                    "attribute": "is_adorable"
                },
                {
                    "attribute": "__createdtime__"
                },
                {
                    "attribute": "__updatedtime__"
                },
                {
                    "attribute": "id"
                }
            ],
            "record_count": 0
        }
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Describe Schema
Returns the definitions of all tables within the specified schema.

<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'describe_schema'
</li>


<li>
<b>schema </b><i>(required)</i> -schema where the table you wish to describe lives
</li>


</ul>

### Body

```json
{
    "operation": "describe_schema",
    "schema": "dev"
}
```

### Response: 200
```json
{
    "dog": {
        "__createdtime__": 1598473228070,
        "__updatedtime__": 1598473228070,
        "hash_attribute": "id",
        "id": "b9cc7292-acf7-40fb-91ba-87012a6f5f84",
        "name": "dog",
        "residence": null,
        "schema": "dev",
        "attributes": [
            {
                "attribute": "is_adorable"
            },
            {
                "attribute": "__createdtime__"
            },
            {
                "attribute": "__updatedtime__"
            },
            {
                "attribute": "id"
            }
        ],
        "record_count": 0
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Describe Table
Returns the definition of the specified table.

<ul>
<li>
<b>operation</b> <i> (required) </i> - must always be 'describe_table'
</li>

<li>
<b>table</b> <i>(required)</i> - table you wish to describe
</li>

<li>
<b>schema </b><i>(required)</i> -schema where the table you wish to describe lives
</li>


</ul>

### Body

```json
{
    "operation": "describe_table",
    "table": "dog",
    "schema": "dev"
}
```

### Response: 200
```json
{
    "__createdtime__": 1598473228070,
    "__updatedtime__": 1598473228070,
    "hash_attribute": "id",
    "id": "b9cc7292-acf7-40fb-91ba-87012a6f5f84",
    "name": "dog",
    "residence": null,
    "schema": "dev",
    "attributes": [
        {
            "attribute": "is_adorable"
        },
        {
            "attribute": "__createdtime__"
        },
        {
            "attribute": "__updatedtime__"
        },
        {
            "attribute": "id"
        }
    ],
    "record_count": 0
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Create Schema
Create a new database schema.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>

<li><b>operation</b><i> (required)</i> - must always be create_schema</li>

<li><b>schema</b><i> (required)</i> - name of the schema you are creating</li>

</ul>

### Body

```json
{
    "operation": "create_schema",
    "schema": "dev"
}
```

### Response: 200
```json
{
    "message": "schema 'dev' successfully created"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Drop Schema
Drop an existing database schema. NOTE: Dropping a schema will delete all tables and all of their records in that schema.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li><b>operation</b><i> (required)</i> - this should always be "drop_schema"</li>

<li><b>schema</b><i> (required)</i> - name of the schema you are dropping. </li>
</ul>

### Body

```json
{
    "operation": "drop_schema",
    "schema": "dev"
}
```

### Response: 200
```json
{
    "message": "successfully deleted schema 'dev'"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Create  Table
Create a new database table within the specified schema.

_**Operation is restricted to super_user roles only**_

<ul><li><p><b>operation </b><i>(required)</i> - must always be create_table</p></li><li><p><b>schema</b><i> (required)</i> - name of the schema where you want your table to live</p></li><li><p><b>table </b><i>(required)</i> - name of the table you are creating</p></li><li><p><b>hash_attribute</b><i> (required)</i> - primary key for the table</p></li><li><p><b>attributes</b> <i>(optional)</i> - An array of attributes that specifies the schema for the table, that is the set of attributes for the table. When attributes are supplied the table will not be considered a "dynamic schema" table, and attributes will not be auto-added when records with new properties are inserted. Each attribute is specified as:</p><ul><li><p><b>name </b><i>(required)</i> - The name of the attribute</p></li><li><p><b>indexed </b><i>(optional)</i> - Indicates if the attribute should be indexed</p></li><li><p><b>type </b><i>(optional)</i> - Specifies the data type of the attribute (can be String, Int, Float, Date, ID, Any).</p></li></ul></li><li><p><b>expiration </b><i>(optional)</i> - Specifies the time-to-live or expiration of records in the table before they are evicted (records are not evicted on any timer if not specified). This is specified in seconds.</p></li></ul>

### Body

```json
{
    "operation": "create_table",
    "schema": "dev",
    "table": "dog",
    "hash_attribute": "id"
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
<li><b>operation</b><i> (required)</i> - this should always be "drop_table"</li>

<li><b>schema</b><i> (required)</i> - schema where the table you are dropping lives. </li>

<li><b>table</b><i> (required)</i> - name of the table you are dropping.  </li>

</ul>

### Body

```json
{
    "operation": "drop_table",
    "schema": "dev",
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

<ul><li><p><b>operation </b><i>(required)</i> - must always be create_attribute</p></li><li><p><b>schema</b><i> (required)</i> - name of the schema of the table you want to add your attribute</p></li><li><p><b>table </b><i>(required)</i> - name of the table where you want to add your attribute to live</p></li><li><p><b>attribute</b><i> (required)</i> - name for the attribute</p></li></ul>

### Body

```json
{
    "operation": "create_attribute",
    "schema": "dev",
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
<li><b>operation</b><i> (required)</i> - this should always be "drop_attribute"</li>

<li><b>schema</b><i> (required)</i> - schema where the table you are dropping lives. </li>

<li><b>table</b><i> (required)</i> - table where the attribute you are dropping lives.</li>

<li><b>attribute</b><i> (required)</i> - attribute that you intend to drop.</li>

</ul>

### Body

```json
{
    "operation": "drop_attribute",
    "schema": "dev",
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
