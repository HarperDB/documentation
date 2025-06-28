# mTLS Authentication

Harper supports mTLS (mutual TLS) authentication for incoming connections, providing certificate-based authentication for enhanced security. When enabled in the [HTTP config settings](../../deployments/configuration.md#http), the client certificate will be checked against the certificate authority specified with `tls.certificateAuthority`. If the certificate can be properly verified, the connection will authenticate users where the user's id/username is specified by the `CN` (common name) from the client certificate's `subject`, by default. The [HTTP config settings](../../deployments/configuration.md#http) allow you to determine if mTLS is required for all connections or optional.

## Certificate Verification

In addition to validating certificates against the CA, Harper automatically performs certificate revocation checking using OCSP (Online Certificate Status Protocol) when mTLS is enabled. This ensures that revoked certificates cannot be used for authentication, providing an additional layer of security.

Certificate verification features:
- **Enabled by default** when mTLS is configured
- **OCSP checking** to verify certificate revocation status
- **Result caching** to minimize performance impact
- **Configurable behavior** with fail-open (permissive) or fail-closed (strict) modes
- **Automatic integration** with HTTP, MQTT, and replication connections

For detailed certificate verification configuration options, see the [certificateVerification settings](../../deployments/configuration.md#http) in the HTTP configuration section.