# Create a Project
One easy way to manage Custom Functions is through [HarperDB Studio](https://harperdb.io/docs/harperdb-studio/manage-functions/). You can read more about [managing Custom Functions through the HarperDB Studio here](https://harperdb.io/docs/harperdb-studio/manage-functions/).

To manually create a project, you have three options:



1. **use the add_custom_function_project operation**

   This operation creates a new project folder, and populates it with templates for the routes, helpers, and static subfolders.

```json
{
   "operation": "add_custom_function_project",
   "project": "dogs"
}
```


2. **clone our public gitHub project template**
   

```bash
> git clone https://github.com/HarperDB/harperdb-custom-functions-template.git ~/hdb/custom_functions/dogs
```


3. **create a project folder in your Custom Functions root directory**

```bash
> mkdir ~/hdb/custom_functions/dogs
```