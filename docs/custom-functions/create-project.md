# Create an in-place Project

To create a project using our web-based GUI, HarperDB Studio, checkout out how to manage Custom Functions [here](../harperdb-studio/manage-functions.md).

Otherwise, to create a project, you have the following options:

1.  **Use the add\_custom\_function\_project operation**

    This operation creates a new project folder, and populates it with templates for the routes, helpers, and static subfolders.

```json
{
   "operation": "add_custom_function_project",
   "project": "dogs"
}
```

2. **Clone our public gitHub project template**

    _This requires a local installation. Remove the .git directory for a clean slate of git history._

```bash
> git clone https://github.com/HarperDB/harperdb-custom-functions-template.git ~/hdb/custom_functions/dogs
```

3. **Create a project folder in your Custom Functions root directory** and **initialize**

    _This requires a local installation._

```bash
> mkdir ~/hdb/custom_functions/dogs
```

```bash
> npm init
```

# Using NPM and Git

Custom function projects can be structured and managed like normal Node.js projects. You can include external dependencies, include them in your route and helper files, and manage your revisions without changing your development tooling or pipeline.

* To initialize your project to use npm packages, use the terminal to execute `npm init` from the root of your project folder.

* To implement version control using git, use the terminal to execute `git init` from the root of your project folder.