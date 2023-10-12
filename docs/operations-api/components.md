# Components

## Add Component

Creates a new component project in the component root directory using a predefined template.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - Must always be 'add_component'.
</li>
<li>
<b>project</b> <i> (required) </i> - The name of the project you wish to create.
</li>
</ul>

### Body
```json
{
    "operation": "add_component",
    "project": "my-component"
}
```

### Response: 200
```json
{
  "message": "Successfully added project: my-component"
}
```

## Deploy Component

Will deploy a component using either a base64-encoded string representation of a `.tar` file (the output from `package_component`) or a package value, 
which can be any valid NPM reference, such as a GitHub repo, an NPM package, 
a tarball, a local directory or a website.<br>

If deploying with the `payload` option, HarperDB will decrypt the base64-encoded string, reconstitute the .tar file of 
your project folder, and extract it to the component root project directory.<br>

If deploying with the `package` option, the package value will be written to `harperdb-config.yaml`. When restart
is run, npm install will be utilized to install the component in the `node_modules` directory located in the hdb root.

_Note: After deploying a component a restart may be required_

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - Must always be 'deploy_component'.
</li>
<li>
<b>project</b> <i> (required) </i> - The name of the project you wish to deploy.
</li>
<li>
<b>package</b> <i> (optional) </i> - This can be any valid GitHub or NPM reference.
</li>
<li>
<b>payload</b> <i> (optional) </i> - A base64-encoded string representation of the .tar file. Must be a string.
</li>
</ul>


### Body
```json
{
    "operation": "deploy_component",
    "project": "my-component",
    "payload": "A very large base64-encoded string representation of the .tar file"
}
```
```json
{
    "operation": "deploy_component",
    "project": "my-component",
    "package": "HarperDB/application-template"
}
```

### Response: 200
```json
{
  "message": "Successfully deployed: my-component"
}
```

## Package Component

Creates a temporary `.tar` file of the specified project folder, then reads it into a base64-encoded string and returns an object with the string and the payload.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - Must always be 'package_component'.
</li>
<li>
<b>project</b> <i> (required) </i> - The name of the project you wish to package.
</li>
<li>
<b>skip_node_modules</b> <i> (optional) </i> - If true, creates option for tar module that will exclude the project's node_modules directory. Must be a boolean.
</li>
</ul>

### Body
```json
{
  "operation": "package_component",
  "project": "my-component",
  "skip_node_modules": true
}
```

### Response: 200
```json
{
  "project": "my-component",
  "payload": "LgAAAAAAAAAAAAAAAAAAA...AAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
}
```

## Drop Component

Deletes a file from inside the component project or deletes the complete project.<br><br>
**If just `project` is provided it will delete all that projects local files and folders.**

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - Must always be 'drop_component'.
</li>
<li>
<b>project</b> <i> (required) </i> - The name of the project you wish to delete or to delete from if using the 'file' parameter.
</li>
<li>
<b>file</b> <i> (optional) </i> - The path relative to your project folder of the file you wish to delete.
</li>
</ul>

### Body
```json
{
  "operation": "drop_component",
  "project": "my-component",
  "file": "utils/myUtils.js"
}
```

### Response: 200
```json
{
  "message": "Successfully dropped: my-component/utils/myUtils.js"
}
```

## Get Components

Gets all local component files and folders and any component config from `harperdb-config.yaml`

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - Must always be 'get_components'.
</li>
</ul>

### Body
```json
{
  "operation": "get_components"
}
```

### Response: 200
```json
{
  "name": "components",
  "entries": [
    {
      "package": "HarperDB/application-template",
      "name": "deploy-test-gh"
    },
    {
      "package": "@fastify/compress",
      "name": "fast-compress"
    },
    {
      "name": "my-component",
      "entries": [
        {
          "name": "LICENSE",
          "mtime": "2023-08-22T16:00:40.286Z",
          "size": 1070
        },
        {
          "name": "README.md",
          "mtime": "2023-08-22T16:00:40.287Z",
          "size": 1207
        },
        {
          "name": "config.yaml",
          "mtime": "2023-08-22T16:00:40.287Z",
          "size": 1069
        },
        {
          "name": "package.json",
          "mtime": "2023-08-22T16:00:40.288Z",
          "size": 145
        },
        {
          "name": "resources.js",
          "mtime": "2023-08-22T16:00:40.289Z",
          "size": 583
        },
        {
          "name": "schema.graphql",
          "mtime": "2023-08-22T16:00:40.289Z",
          "size": 466
        },
        {
          "name": "utils",
          "entries": [
            {
              "name": "commonUtils.js",
              "mtime": "2023-08-22T16:00:40.289Z",
              "size": 583
            }
          ]
        }
      ]
    }
  ]
}
```

## Get Component File

Gets the contents of a file inside a component project.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - Must always be 'get_component_file'.
</li>
<li>
<b>project</b> <i> (required) </i> - The name of the project where the file is located.
</li>
<li>
<b>file</b> <i> (required) </i> - The path relative to your project folder of the file you wish to view.
</li>
<li>
<b>encoding</b> <i> (optional) </i> - The encoding that will be passed to the read file call. Defaults to 'utf8'.
</li>
</ul>

### Body
```json
{
  "operation": "get_component_file",
  "project": "my-component",
  "file": "resources.js"
}
```

### Response: 200
```json
{
  "message": "/**export class MyCustomResource extends tables.TableName {\n\t// we can define our own custom POST handler\n\tpost(content) {\n\t\t// do something with the incoming content;\n\t\treturn super.post(content);\n\t}\n\t// or custom GET handler\n\tget() {\n\t\t// we can modify this resource before returning\n\t\treturn super.get();\n\t}\n}\n */\n// we can also define a custom resource without a specific table\nexport class Greeting extends Resource {\n\t// a \"Hello, world!\" handler\n\tget() {\n\t\treturn { greeting: 'Hello, world!' };\n\t}\n}"
}
```

## Set Component File

Creates or updates a file inside a component project.

<i><b>Operation is restricted to super_user roles only</b></i>
<ul>
<li>
<b>operation</b> <i> (required) </i> - Must always be 'set_component_file'.
</li>
<li>
<b>project</b> <i> (required) </i> - The name of the project the file is located in.
</li>
<li>
<b>file</b> <i> (required) </i> - The path relative to your project folder of the file you wish to set.
</li>
<li>
<b>payload</b> <i> (required) </i> - What will be written to the file.
</li>
<li>
<b>encoding</b> <i> (optional) </i> - The encoding that will be passed to the write file call. Defaults to 'utf8'.
</li>
</ul>

### Body
```json
{
  "operation": "set_component_file",
  "project": "my-component",
  "file": "test.js",
  "payload": "console.log('hello world')"
}
```

### Response: 200
```json
{
  "message": "Successfully set component: test.js"
}
```
