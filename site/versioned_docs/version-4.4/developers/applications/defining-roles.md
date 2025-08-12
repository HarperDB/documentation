---
title: Defining Roles
---

In addition to [defining a database schema](./defining-schemas), you can also define roles in your application. Roles are a way to group permissions together and assign them to users as part of Harper's [role based access control](../security/users-and-roles). An application component may declare roles that should exist for the application in a roles configuration file. To use this, first specify your roles config file in the `config.yaml` in your application directory:

```yaml
roles:
  files: roles.yaml
```
Now you can create a roles.yaml in your application directory:
```yaml
declared-role:
  super_user: false # This is a boolean value that indicates if the role is a super user or not
  # Now we can grant the permissions to databases, here we grant permissions to the default data database
  data: # This is the same structure as role object that is used in the roles operations APIs
    TableOne:
      read: true
      insert: true
    TableTwo:
      read: true
      insert: false
      update: true
      delete: true
      attributes:
        name:
          read: true
          insert: false
          update: true
```

With this in place, where Harper starts up, it will create the roles in the roles.yaml file if they do not already exist. If they do exist, it will update the roles with the new permissions. This allows you to manage your roles in your application code and have them automatically created or updated when the application starts.

The structure of the roles.yaml file is:
```yaml
<role-name>:
  permission: # contains the permissions for the role, this structure is optional, and you can place flags like super_user here as a shortcut
    super_user: <boolean>
  <database-name>: # each database with permissions can be added as named properties on the role
  tables: # this structure is optional, and table names can be placed directly under the database as a shortcut 
    <table-name>:
      read: <boolean> # indicates if the role has read permission to this table
      insert: <boolean> # indicates if the role has insert permission to this table
      update: <boolean> # indicates if the role has update permission to this table
      delete: <boolean> # indicates if the role has delete permission to this table
      attributes:
        <attribute-name>: # individual attributes can have permissions as well
          read: <boolean>
          insert: <boolean>
          update: <boolean>
```