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

### Option: External Reverse Proxy

Instead of enabling HTTPS for HarperDB, a number of different external services can be used as a reverse proxy for HarperDB. These services typically have integrated certificate management. Configure the service to listen for HTTPS requests and forward (over a private network) to HarperDB as HTTP requests.

Examples of these types of services include an AWS Application Load Balancer or a GCP external HTTP(S) load balancer.

### Additional Considerations

It is possible to use different certificates for the Operations API and the Custom Functions API. In scenarios where only your Custom Functions endpoints need to be exposed to the Internet and the Operations API is reserved for HarperDB administration, you may want to use a private CA to issue certificates for the Operations API and a public CA for the Custom Functions API certificates.