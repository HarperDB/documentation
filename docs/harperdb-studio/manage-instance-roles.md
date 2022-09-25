# Manage Instance Roles

HarperDB users can be managed directly through the HarperDB Studio. It is recommended to read through the users & roles documentation to gain a strong understanding of how they operate.



Instance role configuration is handled through the roles page of the HarperDB Studio, accessed with the following instructions:

1) Navigate to the HarperDB Studio Organizations page.

2) Click the appropriate organization that the instance belongs to.

3) Select your desired instance.

4) Click **rules** in the instance control bar.

*Note, the **roles** page will only be available to super users.*



The *roles management* screen consists of the following panels:

* **super users**

    Displays all super user roles for this instance.
* **cluster users**

    Displays all cluster user roles for this instance.
* **standard roles**

    Displays all standard roles for this instance.
* **role permission editing**

    Once a role is selected for editing, permissions will be displayed here in JSON format.

*Note, when new tables are added that are not configured, the Studio will generate configuration values with permissions defaulting to `false`.*

## Role Management

#### Create a Role

1) Click the plus icon (Browse Add Button) at the top right of the appropriate role section.

2) Enter the role name.

3) Click the green check mark.

4) Configure the role permissions in the role permission editing panel.

    *Note, to have the Studio generate attribute permissions JSON, toggle **show all attributes** at the top right of the role permission editing panel.*

5) Click **Update Role Permissions**.

#### Modify a Role

1) Click the appropriate role from the appropriate role section.

2) Modify the role permissions in the role permission editing panel.

    *Note, to have the Studio generate attribute permissions JSON, toggle **show all attributes** at the top right of the role permission editing panel.*

3) Click **Update Role Permissions**.

#### Delete a Role

Deleting a role is permanent and irreversible. A role cannot be remove if users are associated with it.

1) Click the minus icon (Browse Remove Button) at the top right of the schemas section.

2) Identify the appropriate role to delete and click the red minus sign in the same row.

3) Click the red check mark to confirm deletion.