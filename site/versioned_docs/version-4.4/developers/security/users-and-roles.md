---
title: Users & Roles
---

# Users & Roles

Harper utilizes a Role-Based Access Control (RBAC) framework to manage access to Harper instances. A user is assigned a role that determines the user’s permissions to access database resources and run core operations.

## Roles in Harper

Role permissions in Harper are broken into two categories – permissions around database manipulation and permissions around database definition.

**Database Manipulation**: A role defines CRUD (create, read, update, delete) permissions against database resources (i.e. data) in a Harper instance.

1. At the table-level access, permissions must be explicitly defined when adding or altering a role – _i.e. Harper will assume CRUD access to be FALSE if not explicitly provided in the permissions JSON passed to the `add_role` and/or `alter_role` API operations._
1. At the attribute-level, permissions for attributes in all tables included in the permissions set will be assigned based on either the specific attribute-level permissions defined in the table’s permission set or, if there are no attribute-level permissions defined, permissions will be based on the table’s CRUD set.

**Database Definition**: Permissions related to managing databases, tables, roles, users, and other system settings and operations are restricted to the built-in `super_user` role.

**Built-In Roles**

There are three built-in roles within Harper. See full breakdown of operations restricted to only super\_user roles [here](./users-and-roles#role-based-operation-restrictions).

* `super_user` - This role provides full access to all operations and methods within a Harper instance, this can be considered the admin role.
  * This role provides full access to all Database Definition operations and the ability to run Database Manipulation operations across the entire database schema with no restrictions.
* `cluster_user` - This role is an internal system role type that is managed internally to allow clustered instances to communicate with one another.
  * This role is an internally managed role to facilitate communication between clustered instances.
* `structure_user` - This role provides specific access for creation and deletion of data.
  * When defining this role type you can either assign a value of true which will allow the role to create and drop databases & tables. Alternatively the role type can be assigned a string array. The values in this array are databases and allows the role to only create and drop tables in the designated databases.

**User-Defined Roles**

In addition to built-in roles, admins (i.e. users assigned to the super\_user role) can create customized roles for other users to interact with and manipulate the data within explicitly defined tables and attributes.

* Unless the user-defined role is given `super_user` permissions, permissions must be defined explicitly within the request body JSON.
* Describe operations will return metadata for all databases, tables, and attributes that a user-defined role has CRUD permissions for.

**Role Permissions**

When creating a new, user-defined role in a Harper instance, you must provide a role name and the permissions to assign to that role. _Reminder, only super users can create and manage roles._

*   `role` name used to easily identify the role assigned to individual users.

    _Roles can be altered/dropped based on the role name used in and returned from a successful `add_role` , `alter_role`, or `list_roles` operation._
* `permissions` used to explicitly define CRUD access to existing table data.

Example JSON for `add_role` request

```json
{
  "operation":"add_role",
  "role":"software_developer",
  "permission":{
    "super_user":false,
    "database_name":{
      "tables": {
        "table_name1": {
            "read":true,
            "insert":true,
            "update":true,
            "delete":false,
            "attribute_permissions":[
              {
                "attribute_name":"attribute1",
                "read":true,
                "insert":true,
                "update":true
              }
            ]
        },
        "table_name2": {
            "read":true,
            "insert":true,
            "update":true,
            "delete":false,
            "attribute_permissions":[]
        }
      }
    }
  }
}
```

**Setting Role Permissions**

There are two parts to a permissions set:

*   `super_user` – boolean value indicating if role should be provided super\_user access.

    _If `super_user` is set to true, there should be no additional database-specific permissions values included since the role will have access to the entire database schema. If permissions are included in the body of the operation, they will be stored within Harper, but ignored, as super\_users have full access to the database._
*   `permissions`: Database tables that a role should have specific CRUD access to should be included in the final, database-specific `permissions` JSON.

    _For user-defined roles (i.e. non-super\_user roles, blank permissions will result in the user being restricted from accessing any of the database schema._

**Table Permissions JSON**

Each table that a role should be given some level of CRUD permissions to must be included in the `tables` array for its database in the roles permissions JSON passed to the API (_see example above_).

```json
{
  "table_name": { / the name of the table to define CRUD perms for
    "read": boolean, / access to read from this table
    "insert": boolean, / access to insert data to table
    "update": boolean, / access to update data in table
    "delete": boolean, / access to delete row data in table
    "attribute_permissions": [ / permissions for specific table attributes
        {
          "attribute_name": "attribute_name", / attribute to assign permissions to
          "read": boolean, / access to read this attribute from table
          "insert": boolean, / access to insert this attribute into the table
          "update": boolean / access to update this attribute in the table
        }
    ]
}
```

**Important Notes About Table Permissions**

1. If a database and/or any of its tables are not included in the permissions JSON, the role will not have any CRUD access to the database and/or tables.
1. If a table-level CRUD permission is set to false, any attribute-level with that same CRUD permission set to true will return an error.

**Important Notes About Attribute Permissions**

1. If there are attribute-specific CRUD permissions that need to be enforced on a table, those need to be explicitly described in the `attribute_permissions` array.
1. If a non-hash attribute is given some level of CRUD access, that same access will be assigned to the table’s `hash_attribute` (also referred to as the `primary_key`), even if it is not explicitly defined in the permissions JSON.

    _See table\_name1’s permission set for an example of this – even though the table’s hash attribute is not specifically defined in the attribute\_permissions array, because the role has CRUD access to ‘attribute1’, the role will have the same access to the table’s hash attribute._
1. If attribute-level permissions are set – _i.e. attribute\_permissions.length > 0_ – any table attribute not explicitly included will be assumed to have not CRUD access (with the exception of the `hash_attribute` described in #2).

    _See table\_name1’s permission set for an example of this – in this scenario, the role will have the ability to create, insert and update ‘attribute1’ and the table’s hash attribute but no other attributes on that table._
1. If an `attribute_permissions` array is empty, the role’s access to a table’s attributes will be based on the table-level CRUD permissions.

    _See table\_name2’s permission set for an example of this._
1. The `__createdtime__` and `__updatedtime__` attributes that Harper manages internally can have read perms set but, if set, all other attribute-level permissions will be ignored.
1. Please note that DELETE permissions are not included as a part of an individual attribute-level permission set. That is because it is not possible to delete individual attributes from a row, rows must be deleted in full.
   * If a role needs the ability to delete rows from a table, that permission should be set on the table-level.
   * The practical approach to deleting an individual attribute of a row would be to set that attribute to null via an update statement.

## `Role-Based Operation Restrictions <a href="#role-based-operation-restrictions" id="role-based-operation-restrictions"></a>`

The table below includes all API operations available in Harper and indicates whether or not the operation is restricted to super\_user roles.

_Keep in mind that non-super\_user roles will also be restricted within the operations they do have access to by the database-level CRUD permissions set for the roles._

| Databases and Tables | Restricted to Super\_Users |
|----------------------| :------------------------: |
| describe\_all        |                            |
| describe\_database   |                            |
| describe\_table      |                            |
| create\_database     |              X             |
| drop\_database       |              X             |
| create\_table        |              X             |
| drop\_table          |              X             |
| create\_attribute    |                            |
| drop\_attribute      |              X             |

| NoSQL Operations       | Restricted to Super\_Users |
| ---------------------- | :------------------------: |
| insert                 |                            |
| update                 |                            |
| upsert                 |                            |
| delete                 |                            |
| search\_by\_hash       |                            |
| search\_by\_value      |                            |
| search\_by\_conditions |                            |

| SQL Operations | Restricted to Super\_Users |
| -------------- | :------------------------: |
| select         |                            |
| insert         |                            |
| update         |                            |
| delete         |                            |

| Bulk Operations  | Restricted to Super\_Users |
| ---------------- | :------------------------: |
| csv\_data\_load  |                            |
| csv\_file\_load  |                            |
| csv\_url\_load   |                            |
| import\_from\_s3 |                            |

| Users and Roles | Restricted to Super\_Users |
| --------------- | :------------------------: |
| list\_roles     |              X             |
| add\_role       |              X             |
| alter\_role     |              X             |
| drop\_role      |              X             |
| list\_users     |              X             |
| user\_info      |                            |
| add\_user       |              X             |
| alter\_user     |              X             |
| drop\_user      |              X             |

| Clustering              | Restricted to Super\_Users |
| ----------------------- | :------------------------: |
| cluster\_set\_routes    |              X             |
| cluster\_get\_routes    |              X             |
| cluster\_delete\_routes |              X             |
| add\_node               |              X             |
| update\_node            |              X             |
| cluster\_status         |              X             |
| remove\_node            |              X             |
| configure\_cluster      |              X             |

| Components           | Restricted to Super\_Users |
| -------------------- | :------------------------: |
| get\_components      |              X             |
| get\_component\_file |              X             |
| set\_component\_file |              X             |
| drop\_component      |              X             |
| add\_component       |              X             |
| package\_component   |              X             |
| deploy\_component    |              X             |

| Custom Functions                   | Restricted to Super\_Users |
| ---------------------------------- | :------------------------: |
| custom\_functions\_status          |              X             |
| get\_custom\_functions             |              X             |
| get\_custom\_function              |              X             |
| set\_custom\_function              |              X             |
| drop\_custom\_function             |              X             |
| add\_custom\_function\_project     |              X             |
| drop\_custom\_function\_project    |              X             |
| package\_custom\_function\_project |              X             |
| deploy\_custom\_function\_project  |              X             |

| Registration       | Restricted to Super\_Users |
| ------------------ | :------------------------: |
| registration\_info |                            |
| get\_fingerprint   |              X             |
| set\_license       |              X             |

| Jobs                          | Restricted to Super\_Users |
| ----------------------------- | :------------------------: |
| get\_job                      |                            |
| search\_jobs\_by\_start\_date |              X             |

| Logs                              | Restricted to Super\_Users |
| --------------------------------- | :------------------------: |
| read\_log                         |              X             |
| read\_transaction\_log            |              X             |
| delete\_transaction\_logs\_before |              X             |
| read\_audit\_log                  |              X             |
| delete\_audit\_logs\_before       |              X             |

| Utilities               | Restricted to Super\_Users |
| ----------------------- | :------------------------: |
| delete\_records\_before |              X             |
| export\_local           |              X             |
| export\_to\_s3          |              X             |
| system\_information     |              X             |
| restart                 |              X             |
| restart\_service        |              X             |
| get\_configuration      |              X             |
| configure\_cluster      |              X             |

| Token Authentication           | Restricted to Super\_Users |
| ------------------------------ | :------------------------: |
| create\_authentication\_tokens |                            |
| refresh\_operation\_token      |                            |

## Error: Must execute as User

**You may have gotten an error like,** `Error: Must execute as <<username>>`.

This means that you installed Harper as `<<user>>`. Because Harper stores files natively on the operating system, we only allow the Harper executable to be run by a single user. This prevents permissions issues on files.

For example if you installed as user\_a, but later wanted to run as user\_b. User\_b may not have access to the hdb files Harper needs. This also keeps Harper more secure as it allows you to lock files down to a specific user and prevents other users from accessing your files.
