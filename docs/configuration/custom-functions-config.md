# `customFunctions`

The `customFunctions` section configures HarperDB Custom Functions.

`enabled` - _Type_: boolean; _Default_: true

Enable the Custom Function server or not.

```yaml
customFunctions:
  enabled: true  
```

`customFunctions.network`

```yaml
customFunctions:
  network:
    cors: true
    corsAccessList:
      - null
    headersTimeout: 60000
    https: false
    keepAliveTimeout: 5000
    port: 9926
    timeout: 120000 
```

<div style="padding-left: 30px;">

`cors` - _Type_: boolean; _Default_: true

Enable Cross Origin Resource Sharing, which allows requests across a domain.

`corsAccessList` - _Type_: array; _Default_: null

An array of allowable domains with CORS

`headersTimeout` - _Type_: integer; _Default_: 60,000 milliseconds (1 minute)

Limit the amount of time the parser will wait to receive the complete HTTP headers with.

`https` - _Type_: boolean; _Default_: false

Enables HTTPS on the Custom Functions API. This requires a valid certificate and key. If `false`, Custom Functions will run using standard HTTP.

`keepAliveTimeout` - _Type_: integer; _Default_: 5,000 milliseconds (5 seconds)

Sets the number of milliseconds of inactivity the server needs to wait for additional incoming data after it has finished processing the last response.

`port` - _Type_: integer; _Default_: 9926

The port used to access the Custom Functions server.

`timeout` - _Type_: integer; _Default_: Defaults to 120,000 milliseconds (2 minutes)

The length of time in milliseconds after which a request will timeout.
</div>

`nodeEnv` - _Type_: string; _Default_: production

Allows you to specify the node environment in which application will run.

```yaml
customFunctions:
  nodeEnv: production
```

- `production` native node logging is kept to a minimum; more caching to optimize performance. This is the default value.
- `development` more native node logging; less caching.

`root` - _Type_: string; _Default_: &lt;ROOTPATH>/custom_functions

The path to the folder containing Custom Function files.

```yaml
customFunctions:
  root: ~/hdb/custom_functions
```

`tls`
Transport Layer Security

```yaml
customFunctions:
  tls:
    certificate: ~/hdb/keys/certificate.pem
    certificateAuthority: ~/hdb/keys/ca.pem
    privateKey: ~/hdb/keys/privateKey.pem
```

`certificate` - _Type_: string; _Default_: &lt;ROOTPATH>/keys/certificate.pem

Path to the certificate file.

`certificateAuthority` - _Type_: string; _Default_: &lt;ROOTPATH>/keys/ca.pem

Path to the certificate authority file.

`privateKey` - _Type_: string; _Default_: &lt;ROOTPATH>/keys/privateKey.pem

Path to the private key file.
