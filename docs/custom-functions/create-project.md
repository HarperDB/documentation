# Create an in-place Project

One easy way to manage Custom Functions is through [HarperDB Studio](../harperdb-studio/manage-functions.md). You can read more about [managing Custom Functions through the HarperDB Studio here](../harperdb-studio/manage-functions.md).

To manually create a project, you have three options:

1.  **use the add\_custom\_function\_project operation**

    This operation creates a new project folder, and populates it with templates for the routes, helpers, and static subfolders.

```json
{
   "operation": "add_custom_function_project",
   "project": "dogs"
}
```

1.  **clone our public gitHub project template**

    _This requires a local installation. Remove the .git directory for a clean slate of git history._

```bash
> git clone https://github.com/HarperDB/harperdb-custom-functions-template.git ~/hdb/custom_functions/dogs
```

1.  **create a project folder in your Custom Functions root directory** and **initialize**

    _This requires a local installation._

```bash
> mkdir ~/hdb/custom_functions/dogs
```

```bash
> npm init
```
