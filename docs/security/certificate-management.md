# Certificate Management

This document is information on managing certificates for the Operations API and the Custom Functions API. For information on certificate managment for clustering see [clustering certificate management](../clustering/certificate-management.md).

## Development

An out of the box install of HarperDB does not have HTTPS enabled for the Operations API (See [configuration](../configuration.md) for relevant configuration file settings). This is great for local development. If you are developing using a remote server and your requests are traversing the internet, we recommend that you enable HTTPS.

To enable HTTPS, set the `clustering.network.https` and `customFunctions.network.https` to `true` and restart HarperDB.

By default HarperDB will generate certificates and place them at `HDB_ROOT/keys`. These certificates will not have a valid CN (Common Name) for your HarperDB node, so you will be able to use HTTPS but you will need to accept the invalid certificate due to this.

## Production

In a production environment, we recommend using your own Certificate Authority, or a public Certificate Authority such as LetsEncrypt to generate certs for your HarperDB cluster. This will let you generate certificates with CNs that match the DNS of your nodes.

We have a few recommended options for enabling HTTPS for HarperDB in a production setting.

### HarperDB HTTPS

This option is having HarperDB itself listen only for HTTPS requests. HarperDB will continue to listen on the ports that you specify in your configuration.

To enable HTTPs, set the `clustering.network.https` and `customFunctions.network.https` to `true` and restart HarperDB.

Once you generate new certificates, to make HarperDB start using them you can either replace the generated files with your own, or update the configuration to point to your new certificates, and then restart HarperDB.

### nginx

This option involves installing nginx and using it to manage certificates, terminate TLS, and proxy the traffic to HarperDB.

In this case you will leave HTTPS disabled within the HarperDB confiruation.

### Load Balancer

This option involves using an external load balancer such as an ELB in AWS or a LoadBalancer in Kubernetes and use it to manage certificates, terminate TLS, and proxy the traffic to your HarperDB node.

In this case you will leave HTTPS disabled within the HarperDB confiruation.

### Additional Considerations

* If your certificates expire you will need a way to issue new certificates to the nodes and then restart HarperDB.
    * If you are using a public CA such as LetsEncrypt, a tool like `certbot` can be used to renew certificates
* It is possible to use different certificates for the Operations API and the Custom Functions API. You may want to use an internal private CA to issue certs for the Operations API and a public CA for the Custom Functions API if you want to expose your Custom Functions endpoints to the broader internet.