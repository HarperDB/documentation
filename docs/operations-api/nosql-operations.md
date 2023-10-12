# NoSQL Operations 


## Insert
Adds one or more rows of data to a database table. Primary keys of the inserted JSON record may be supplied on insert. If a primary key is not provided, then a GUID will be generated for each record.

<ul>
<li><b>operation</b><i> (required)</i> - must always be 'insert'</li>

<li><b>database</b><i> (optional)</i> - database where the table you are inserting records into lives. The default is <code>data</code></li>

<li><b>table</b><i> (required)</i> - table where you want to insert records </li>

<li><b>records</b><i> (required)</i> - array of one or more records for insert</li>
</ul>

### Body

```json
{
    "operation": "insert",
    "database": "dev",
    "table": "dog",
    "records": [
        {
            "id": 8,
            "dog_name": "Harper",
            "breed_id": 346,
            "age": 7
        },
        {
            "id": 9,
            "dog_name": "Penny",
            "breed_id": 154,
            "age": 7
        }
    ]
}
```

### Response: 200
```json
{
    "message": "inserted 2 of 2 records",
    "inserted_hashes": [
        8,
        9
    ],
    "skipped_hashes": []
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Update
Changes the values of specified attributes in one or more rows in a database table as identified by the primary key. NOTE: Primary key of the updated JSON record(s) MUST be supplied on update.

<ul>
<li><b>operation</b><i> (required)</i> - must always be 'update'</li>

<li><b>database</b><i> (optional)</i> - database of the table you are updating records in. The default is <code>data</code></li>

<li><b>table</b><i> (required)</i> - table where you want to update records </li>

<li><b>records</b><i> (required)</i> - array of one or more records for update</li>
</ul>

### Body

```json
{
    "operation": "update",
    "database": "dev",
    "table": "dog",
    "records": [
        {
            "id": 1,
            "weight_lbs": 55
        },
        {
            "id": 2,
            "owner": "Kyle B",
            "weight_lbs": 35
        }
    ]
}
```

### Response: 200
```json
{
    "message": "updated 2 of 2 records",
    "update_hashes": [
        1,
        3
    ],
    "skipped_hashes": []
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Upsert
Changes the values of specified attributes for rows with matching primary keys that exist in the table. Adds rows to the database table for primary keys that do not exist or are not provided.

<ul>
<li><b>operation</b><i> (required)</i> - must always be 'update'</li>

<li><b>database</b><i> (optional)</i> - database of the table you are updating records in. The default is <code>data</code></li>

<li><b>table</b><i> (required)</i> - table where you want to update records </li>

<li><b>records</b><i> (required)</i> - array of one or more records for update</li>
</ul>

### Body

```json
{
    "operation": "upsert",
    "database": "dev",
    "table": "dog",
    "records": [
        {
            "id": 8,
            "weight_lbs": 155
        },
        {
            "name": "Bill",
            "breed": "Pit Bull",
            "id": 10,
            "Age": 11,
            "weight_lbs": 155
        },
        {
            "name": "Harper",
            "breed": "Mutt",
            "age": 5,
            "weight_lbs": 155
        }
    ]
}
```

### Response: 200
```json
{
    "message": "upserted 3 of 3 records",
    "upserted_hashes": [
        8,
        10,
        "ea06fc8e-717b-4c6c-b69d-b29014054ab7"
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Delete
Removes one or more rows of data from a specified table.

<ul>
<li><b>operation</b><i> (required)</i> - must always be 'delete'</li>

<li><b>database</b><i> (optional)</i> - database where the table you are deleting records lives. The default is <code>data</code></li>

<li><b>table</b><i> (required)</i> - table where you want to deleting records </li>


<li><b>ids</b><i> (required)</i> - array of one or more primary key values, which identifies records to delete</li>
</ul>

### Body

```json
{
    "operation": "delete",
    "database": "dev",
    "table": "dog",
    "ids": [
        1,
        2
    ]
}
```

### Response: 200
```json
{
    "message": "2 of 2 records successfully deleted",
    "deleted_hashes": [
        1,
        2
    ],
    "skipped_hashes": []
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Search By ID
Returns data from a table for one or more primary keys.

<ul>
<li><p><b>operation</b><i> (required)</i> - must always be 'search_by_id'</p></li>
<li><p><b>database</b> <i> (optional)</i> - database where the table you are searching lives. The default is <code>data</code></p></li>
<li><p><b>table</b> <i> (required)</i> - table you wish to search</p></li>
<li><p><b>ids</b><i> (required) </i>- array of primary keys to retrieve</p></li>
<li><p><b>get_attributes</b><i> (required)</i> - define which attributes you want returned. <i>Use <code>['*']</code> to return all attributes</i></p></li>
</ul>

### Body

```json
{
    "operation": "search_by_id",
    "database": "dev",
    "table": "dog",
    "ids": [
        1,
        2
    ],
    "get_attributes": [
        "dog_name",
        "breed_id"
    ]
}
```

### Response: 200
```json
[
    {
        "dog_name": "Penny",
        "breed_id": 154
    },
    {
        "dog_name": "Harper",
        "breed_id": 346
    }
]
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Search By Value
Returns data from a table for a matching value.

<ul>
<li><p><b>operation </b><i>(required) </i>- must always be 'search_by_value'<br></p></li>
<li><p><b>database </b><i>(optional) </i>- database where the table you are searching lives. The default is <code>data</code><br></p></li>
<li><p><b>table </b><i>(required) </i>- table you wish to search<br></p></li>
<li><p><b>search_attribute </b><i>(required) </i>- attribute you wish to search can be any attribute<br></p></li>
<li><p><b>search_value </b><i>(required) </i>- value you wish to search - wild cards are allowed.<br></p></li>
<li><p><b>get_attributes </b><i>(required) </i>- define which attributes you want returned. Use <code>['*']</code> to return all attributes.</p></li>
</ul>

### Body

```json
{
    "operation": "search_by_value",
    "database": "dev",
    "table": "dog",
    "search_attribute": "owner_name",
    "search_value": "Ky*",
    "get_attributes": [
        "id",
        "dog_name"
    ]
}
```

### Response: 200
```json
[
    {
        "dog_name": "Penny"
    },
    {
        "dog_name": "Kato"
    }
]
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## Search By Conditions
Returns data from a table for one or more matching conditions.

<ul>
<li><p><b>operation </b><i>(required) </i>- must always be 'search_by_conditions'<br></p></li>
<li><p><b>database </b><i>(optional) </i>- database where the table you are searching lives. The default is <code>data</code><br></p></li>
<li><p><b>table </b><i>(required) </i>- table you wish to search<br></p></li>
<li><p><b>operator </b><i>(optional) </i>- the operator used between each condition - 'and', 'or'. The default is 'and'.<br></p></li>
<li><p><b>offset </b><i>(optional) </i>- the number of records that the query results will skip. The default is 0.<br></p></li>
<li><p><b>limit </b><i>(optional) </i>- the number of records that the query results will include. The default is null, resulting in no limit.<br></p></li>
<li><p><b>get_attributes </b><i>(required) </i>- define which attributes you want returned. Use ['*'] to return all attributes.<br></p></li>
<li><p><b>conditions </b><i>(required) </i>- the array of conditions objects, specified below, to filter by. Must include one or more object in the array.<br></p><ul><li><p><b>search_attribute </b><i>(required) </i>- the attribute you wish to search, can be any attribute.<br></p></li><li><p><b>search_type </b><i>(required) </i>- the type of search to perform - 'equals', 'contains', 'starts_with', 'ends_with', 'greater_than', 'greater_than_equal', 'less_than', 'less_than_equal', 'between'.<br></p></li><li><p><b>search_value </b><i>(required) </i>- case-sensitive value you wish to search. If the search_type is 'between' then use an array of two values to search between.</p></li></ul></li></ul>

### Body

```json
{
    "operation": "search_by_conditions",
    "database": "dev",
    "table": "dog",
    "operator": "and",
    "offset": 0,
    "limit": 10,
    "get_attributes": [
        "*"
    ],
    "conditions": [
        {
            "search_attribute": "age",
            "search_type": "between",
            "search_value": [
                5,
                8
            ]
        },
        {
            "search_attribute": "weight_lbs",
            "search_type": "greater_than",
            "search_value": 40
        },
        {
            "search_attribute": "adorable",
            "search_type": "equals",
            "search_value": true
        }
    ]
}
```

### Response: 200
```json
[
    {
        "__createdtime__": 1620227719791,
        "__updatedtime__": 1620227719791,
        "adorable": true,
        "age": 7,
        "breed_id": 346,
        "dog_name": "Harper",
        "id": 2,
        "owner_name": "Stephen",
        "weight_lbs": 55
    },
    {
        "__createdtime__": 1620227719792,
        "__updatedtime__": 1620227719792,
        "adorable": true,
        "age": 7,
        "breed_id": 348,
        "dog_name": "Alby",
        "id": 3,
        "owner_name": "Kaylan",
        "weight_lbs": 84
    },
    {
        "__createdtime__": 1620227719792,
        "__updatedtime__": 1620227719792,
        "adorable": true,
        "age": 6,
        "breed_id": 347,
        "dog_name": "Billy",
        "id": 4,
        "owner_name": "Zach",
        "weight_lbs": 60
    },
    {
        "__createdtime__": 1620227719792,
        "__updatedtime__": 1620227719792,
        "adorable": true,
        "age": 5,
        "breed_id": 250,
        "dog_name": "Gemma",
        "id": 8,
        "owner_name": "Stephen",
        "weight_lbs": 55
    },
    {
        "__createdtime__": 1620227719792,
        "__updatedtime__": 1620227719792,
        "adorable": true,
        "age": 8,
        "breed_id": 104,
        "dog_name": "Bode",
        "id": 11,
        "owner_name": "Margo",
        "weight_lbs": 75
    }
]
```
