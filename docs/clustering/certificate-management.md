# Certificate Management

## Development

Out of the box HarperDB generates certificates that are used when HarperDB nodes are clustered together to securely share data between nodes. These certificates are meant for testing and development purposes. Because these certificates do not have Common Names (CNs) that will match the Fully Qualified Domain Name (FQDN) of the HarperDB node, the following settings (see the full [configuration file](../configuration.md) docs for more details) are defaulted & recommended for ease of development:

```
clustering:
  tls:
    certificate: ~/hdb/keys/certificate.pem
    certificateAuthority: ~/hdb/keys/ca.pem
    privateKey: ~/hdb/keys/privateKey.pem
    insecure: true
    verify: true
```

The certificates that HarperDB generates are stored in your `<ROOTPATH>/keys/`.

`insecure` is set to `true` to accept the certificate CN mismatch due to development certificates.

`verify` is set to `true` to enable mutual TLS between the nodes.

## Production

In a production environment, we recommend using your own certificate authority (CA), or a public CA such as LetsEncrypt to generate certs for your HarperDB cluster. This will let you generate certificates with CNs that match the FQDN of your nodes.

Once you generate new certificates, to make HarperDB start using them you can either replace the generated files with your own, or update the configuration to point to your new certificates, and then restart HarperDB.

Since these new certificates can be issued with correct CNs, you should set `insecure` to `false` so that nodes will do full validation of the certificates of the other nodes.

### Certificate Requirements

* Certificates must have an `Extended Key Usage` that defines both `TLS Web Server Authentication` and `TLS Web Client Authentication` as these certificates will be used to accept connections from other HarperDB nodes and to make requests to other HarperDB nodes. Example:

```
X509v3 Key Usage: critical
    Digital Signature, Key Encipherment
X509v3 Extended Key Usage:
    TLS Web Server Authentication, TLS Web Client Authentication
```

* If you are using an intermediate CA to issue the certificates, the entire certificate chain (to the root CA) must be included in the `certificateAuthority` file.
* If your certificates expire you will need a way to issue new certificates to the nodes and then restart HarperDB. If you are using a public CA such as LetsEncrypt, a tool like `certbot` can be used to renew certificates.

### Certificate Troubleshooting
If you are having TLS issues with clustering, use the following steps to verify that your certificates are valid.

1. Make sure certificates can be parsed and that you can view the contents:
~~~
openssl x509 -in <certificate>.pem -noout -text`
~~~
2. Make sure the cert validates with the CA: `openssl verify -CAfile <certificateAuthority>.pem <certificate>.pem`
3. Makes sure the cert and private key are valid pair. Run the following and the outputs should match: `openssl rsa -modulus -noout -in <privateKey>.pem | openssl md5` and `openssl x509 -modulus -noout -in <certificate>.pem | openssl md5`
