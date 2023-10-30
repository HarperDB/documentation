# Operations

One way to manage applications and components is through [HarperDB Studio](../../../harperdb-studio/). It performs all the necessary operations automatically. To get started, navigate to your instance in HarperDB Studio and click the subnav link for “applications”. Once configuration is complete, you can manage and deploy applications in minutes.

HarperDB Studio manages your applications using nine HarperDB operations. You may view these operations within our [API Docs](../operations-api/). A brief overview of each of the operations is below:

*   **components\_status**

    Returns the state of the applications server. This includes whether it is enabled, upon which port it is listening, and where its root project directory is located on the host machine.
*   **get\_components**

    Returns an array of projects within the applications root project directory.
*   **get\_component\_file**

    Returns the content of the specified file as text. HarperDB Studio uses this call to render the file content in its built-in code editor.
*   **set\_component\_file**

    Updates the content of the specified file. HarperDB Studio uses this call to save any changes made through its built-in code editor.
*   **drop\_component\_file**

    Deletes the specified file.
*   **add\_component\_project**

    Creates a new project folder in the applications root project directory. It also inserts into the new directory the contents of our applications Project template, which is available publicly, here: https://github.com/HarperDB/harperdb-custom-functions-template.
*   **drop\_component\_project**

    Deletes the specified project folder and all of its contents.
*   **package\_component\_project**

    Creates a .tar file of the specified project folder, then reads it into a base64-encoded string and returns that string the user.
*   **deploy\_component\_project**

    Takes the output of package\_component\_project, decrypts the base64-encoded string, reconstitutes the .tar file of your project folder, and extracts it to the applications root project directory.
