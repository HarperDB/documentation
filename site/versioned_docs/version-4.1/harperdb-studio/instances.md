---
title: Instances
---

# Instances

The HarperDB Studio allows you to administer all of your HarperDB instances in one place. HarperDB currently offers the following instance types:

* **HarperDB Cloud Instance**
Managed installations of HarperDB, what we call HarperDB Cloud.
* **5G Wavelength Instance**
Managed installations of HarperDB running on the Verizon network through AWS Wavelength, what we call 5G Wavelength Instances. *Note, these instances are only accessible via the Verizon network.*
* **User-Installed Instance**
Any HarperDB installation that is managed by you. These include instances hosted within your cloud provider accounts (for example, from the AWS or Digital Ocean Marketplaces), privately hosted instances, or instances installed locally.

All interactions between the Studio and your instances take place directly from your browser. HarperDB stores metadata about your instances, which enables the Studio to display these instances when you log in. Beyond that, all traffic is routed from your browser to the HarperDB instances using the standard [HarperDB API](https://api.harperdb.io/).

## Organization Instance List
A summary view of all instances within an organization can be viewed by clicking on the appropriate organization from the [HarperDB Studio Organizations](https://studio.harperdb.io/organizations) page. Each instance gets their own card. HarperDB Cloud and user-installed instances are listed together.

## Create a New Instance

1) Navigate to the [HarperDB Studio Organizations](https://studio.harperdb.io/organizations) page.
2) Click the appropriate organization for the instance to be created under.
3) Click the **Create New HarperDB Cloud Instance + Register User-Installed Instance** card.
4) Select your desired Instance Type.
5) For a HarperDB Cloud Instance or a HarperDB 5G Wavelength Instance, click **Create HarperDB Cloud Instance**.

    1) Fill out Instance Info.
       1) Enter Instance Name

          *This will be used to build your instance URL. For example, with subdomain “demo” and instance name “c1” the instance URL would be: [https://c1-demo.harperdbcloud.com](https://c1-demo.harperdbcloud.com). The Instance URL will be previewed below.*

       2) Enter Instance Username

          *This is the username of the initial HarperDB instance super user.*

       3) Enter Instance Password

          *This is the password of the initial HarperDB instance super user.*

    2) Click **Instance Details** to move to the next page.
    3) Select Instance Specs

       1) Select Instance RAM

          *HarperDB Cloud Instances are billed based on Instance RAM, this will select the size of your provisioned instance. More on instance specs.*

       2) Select Storage Size

          *Each instance has a mounted storage volume where your HarperDB data will reside. Storage is provisioned based on space and IOPS. More on IOPS Impact on Performance.*

       3) Select Instance Region

          *The geographic area where your instance will be provisioned.*

    4) Click **Confirm Instance Details** to move to the next page.
    5) Review your Instance Details, if there is an error, use the back button to correct it.
    6) Review the [Privacy Policy](https://harperdb.io/legal/privacy-policy/) and [Terms of Service](https://harperdb.io/legal/harperdb-cloud-terms-of-service/), if you agree, click the **I agree** radio button to confirm.
    7) Click **Add Instance**.
    8) Your HarperDB Cloud instance will be provisioned in the background. Provisioning typically takes 5-15 minutes. You will receive an email notification when your instance is ready.

## Register User-Installed Instance

1) Navigate to the [HarperDB Studio Organizations](https://studio.harperdb.io/organizations) page.
2) Click the appropriate organization for the instance to be created under.
3) Click the **Create New HarperDB Cloud Instance + Register User-Installed Instance** card.
4) Select **Register User-Installed Instance**.
   1) Fill out Instance Info.

      1) Enter Instance Name

         *This is used for descriptive purposes only.*
      2) Enter Instance Username

         *The username of a HarperDB super user that is already configured in your HarperDB installation.*
      3) Enter Instance Password

         *The password of a HarperDB super user that is already configured in your HarperDB installation.*
      4) Enter Host

         *The host to access the HarperDB instance. For example, `harperdb.myhost.com` or `localhost`.*
      5) Enter Port

         *The port to access the HarperDB instance. HarperDB defaults `9925`.*
      6) Select SSL

         *If your instance is running over SSL, select the SSL checkbox. If not, you will need to enable mixed content in your browser to allow the HTTPS Studio to access the HTTP instance. If there are issues connecting to the instance, the Studio will display a red error message.*

   2) Click **Instance Details** to move to the next page.
   3) Select Instance Specs
      1) Select Instance RAM

         *HarperDB instances are billed based on Instance RAM. Selecting additional RAM will enable the ability for faster and more complex queries.*
   4) Click **Confirm Instance Details** to move to the next page.
   5) Review your Instance Details, if there is an error, use the back button to correct it.
   6) Review the [Privacy Policy](https://harperdb.io/legal/privacy-policy/) and [Terms of Service](https://harperdb.io/legal/harperdb-cloud-terms-of-service/), if you agree, click the **I agree** radio button to confirm.
   7) Click **Add Instance**.
   8) The HarperDB Studio will register your instance and restart it for the registration to take effect. Your instance will be immediately available after this is complete.

## Delete an Instance

Instance deletion has two different behaviors depending on the instance type.

* **HarperDB Cloud Instance**
This instance will be permanently deleted, including all data. This process is irreversible and cannot be undone.
* **User-Installed Instance**
The instance will be removed from the HarperDB Studio only. This does not uninstall HarperDB from your system and your data will remain intact.

An instance can be deleted as follows:

1) Navigate to the [HarperDB Studio Organizations](https://studio.harperdb.io/organizations) page.
2) Click the appropriate organization that the instance belongs to.
3) Identify the proper instance card and click the trash can icon.
4) Enter the instance name into the text box.

   *This is done for confirmation purposes to ensure you do not accidentally delete an instance.*
5) Click the **Do It** button.

## Upgrade an Instance

HarperDB instances can be resized on the [Instance Configuration](./instance-configuration) page.

## Instance Log In/Log Out

The Studio enables users to log in and out of different database users from the instance control panel. To log out of an instance:

1) Navigate to the [HarperDB Studio Organizations](https://studio.harperdb.io/organizations) page.
2) Click the appropriate organization that the instance belongs to.
3) Identify the proper instance card and click the lock icon.
4) You will immediately be logged out of the instance.

To log in to an instance:

1) Navigate to the [HarperDB Studio Organizations](https://studio.harperdb.io/organizations) page.
2) Click the appropriate organization that the instance belongs to. 
3) Identify the proper instance card, it will have an unlocked icon and a status reading PLEASE LOG IN, and click the center of the card. 
4) Enter the database username. 

   *The username of a HarperDB user that is already configured in your HarperDB instance.*
5) Enter the database password.
   
   *The password of a HarperDB user that is already configured in your HarperDB instance.*
6) Click **Log In**.