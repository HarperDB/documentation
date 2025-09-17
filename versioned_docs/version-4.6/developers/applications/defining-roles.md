---
title: Defining Application Roles
---

# Defining Application Roles

Applications are more than just tables and endpoints — they need access rules. Harper lets you define roles directly in your application so you can control who can do what, without leaving your codebase.

Let’s walk through creating a role, assigning it, and seeing it in action.

## Step 1: Declare a Role

First, point Harper to a roles configuration file. Add this to your `config.yaml`:

```yaml
roles:
  files: roles.yaml
```

Then create a simple `roles.yaml` in your application directory. For example, here’s a role that can only read and insert data into the `Dog` table:

```yaml
dog_reader:
  super_user: false
  data:
    Dog:
      read: true
      insert: true
```

When Harper starts up, it will create this role (or update it if it already exists).

## Step 2: Assign the Role

Now that the role exists, assign it to a user. You can do this through the [Users and Roles API](../security/users-and-roles) or via the CLI. Once assigned, the user’s permissions will reflect exactly what you declared in `roles.yaml`.

For example, a user with the `dog_reader` role can insert new dog records, but not delete or update them.

## Step 3: See It in Action

Try it out. Sign in as the user with the `dog_reader` role and attempt the following:

```yaml
# allowed
curl -X POST http://localhost:9926/Dog/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Buddy", "breed": "Husky"}'

# not allowed
curl -X DELETE http://localhost:9926/Dog/<id>
```

The first request succeeds because the role allows `insert`. The second fails because `delete` isn’t permitted. Just like that, you’ve enforced role-based access control inside your app.

## Where to Go Next

This page gave you the basics - declare a role, assign it, and see it work.

For more advanced scenarios, including:

- defining multiple databases per role,
- granting fine-grained attribute-level permissions,
- and the complete structure of `roles.yaml`,

see the [Roles Reference](../../reference/Applications/defining-roles).
