In addition to [defining a database schema](./defining-schemas.md), you can also define roles in your application. Roles are a way to group permissions together and assign them to users as part of HarperDB's [role based access control](../security/users-and-roles.md). An application component may declare roles that should exist for the application in a roles configuration file. To use this, first specify your roles config file in the `config.yaml` in your application directory:

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