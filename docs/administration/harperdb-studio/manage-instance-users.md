# Manage Instance Users

HarperDB users and roles can be managed directly through the HarperDB Studio. It is recommended to read through the [users & roles documentation](../../developers/security/users-and-roles.md) to gain a strong understanding of how they operate.


## Accessing the Users Page

### Harper Studio Cloud
Instance user configuration is handled through the **users** page of the HarperDB Studio, accessed with the following instructions:

1) Navigate to the [HarperDB Studio Organizations](https://studio.harperdb.io/organizations) page.

2) Click your desired organization.

3) Select your desired cluster.

4) Once you are inside your cluster(or instance), navigate to the "config" menu item in the sub-menu bar.

5) Click the **users** tab on the left sidebar.

### Harper Studio Local Instance
1) Navigate to your HarperDB Studio URL.

2) Log into your instance.

3) Once you have successfully logged into your instance, navigate to the "config" menu item in the sub-menu bar.

4) Click the **users** tab on the left sidebar.



## Add a User

HarperDB instance users can be added with the following instructions.

1) In the **Users** page, on the top right press the "+ Add" button:

Inside the modal, complete the following fields:

   * Username - Must be unique.

   * Password - Must be at least 8 characters long.

   * Confirm Password - Must match the password.

   * Role - Select a role from the dropdown menu.
   
      * Learn more about role management here: [Manage Instance Roles](manage-instance-roles.md).*
   
2) Click **Add User**.

Users will appear in the **users** table inside the **Users** page.

## Edit a User

1) In the **existing users** panel, click the row of the user you would like to edit.

You are able to perform the following actions:
   - Change a user’s password.
   - Change a user’s role.
   - Delete a user.

### Change a User's Password

To change a user’s password:

   1) In the **Change password** input, enter the new password.
   
   2) Confirm the password by re-entering it in the **Confirm password** input.

   3) Click **Save Changes**.

### Change a User's Role

To change a user’s role:

   1) In the **Role** dropdown, select the new role.

   2) Click **Save Changes**.


### Delete a User

To delete a user:

   1) In the **Delete User** section, type the username into the textbox.
   
      *This is done for confirmation purposes.*
   
   2) Click **Delete User**.
