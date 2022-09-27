# Configuration

HarperDB was set up to require very minimal configuration to work out of the box. There are, however, some best practices we encourage for anyone building an app with HarperDB.



## CORS

HarperDB allows for managing [cross-origin HTTP requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS). By default, HarperDB enables CORS for all domains if you need to disable CORS completely or set up whitelisted domains you can do the following:

1) Open the HarperDB harperdb.config file this can be found in /HDB_ROOT, the location you specified during install.

2) In harperdb.config there should be 2 entries under `operationsApi.network`: cors and corsWhitelist. 
   * `cors`
   
     1) To turn off, change to: `cors: false`
     
     2) To turn on, change to: `cors: true`
     
   * `corsWhitelist`
     
      1) The `corsWhitelist` will only be recognized by the system when `cors` is `true`
     
      2) To create a whitelist you set `corsWhitelist` to a comma-separated list of domains.
     
         i.e. `corsWhitelist` is `http://harperdb.io,http://products.harperdb.io`
     
      3) To clear out the whitelist and allow all domains: `corsWhitelist` is `[null]`
     
     
## SSL

HarperDB provides the option to use an HTTP or HTTPS interface. The default port for the server is 9925.



These default ports can be changed by updating the `operationsApi.network.port` value in `HDB_ROOT/harperdb.config`



By default, HTTPS is turned off and HTTP is turned on.



You can toggle HTTPS and HTTP in the settings file. By setting `operationsApi.network.https` to true/false. When `https` is set to `false`, the server will use HTTP.



HarperDB automatically generates a certificate and a privateKey file which live at `HDB_ROOT/keys/`.



You can replace these with your own certificate and key.



**If any of these settings are changed please make sure to run `harperdb stop && harperdb run` as they will not take effect until a restart.**