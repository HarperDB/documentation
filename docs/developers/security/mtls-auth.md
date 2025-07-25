# mTLS Authentication

Harper supports mTLS (mutual TLS) authentication for incoming connections, providing certificate-based authentication for enhanced security. When enabled in the [HTTP config settings](../../deployments/configuration.md#http), the client certificate will be checked against the certificate authority specified with `tls.certificateAuthority`. If the certificate can be properly verified, the connection will authenticate users where the user's id/username is specified by the `CN` (common name) from the client certificate's `subject`, by default. The [HTTP config settings](../../deployments/configuration.md#http) allow you to determine if mTLS is required for all connections or optional.

## Certificate Verification

When mTLS is enabled, Harper automatically performs certificate revocation checking using OCSP (Online Certificate Status Protocol). OCSP provides real-time verification that certificates have not been revoked by the Certificate Authority, ensuring that compromised or invalidated certificates cannot be used for authentication.

### How It Works

When a client presents a certificate:

1. Harper validates the certificate against the configured Certificate Authority
2. If validation succeeds, Harper queries the CA's OCSP responder to check revocation status
3. The verification result is cached to minimize performance impact on subsequent connections
4. Based on the configuration, the connection is either allowed or rejected

### Key Features

- **Enabled by default** when mTLS is configured
- **Real-time verification** with the Certificate Authority's OCSP responder
- **Intelligent caching** of verification results (default: 1 hour)
- **Configurable timeout** for OCSP responses (default: 5 seconds)
- **Flexible failure handling** with fail-open or fail-closed modes
- **Unified across all protocols** - HTTP, MQTT, and replication connections

### Configuration

Certificate verification can be disabled or customized through the `certificateVerification` setting. See the [HTTP configuration](../../deployments/configuration.md#http) and [MQTT configuration](../../deployments/configuration.md#mqtt) sections for detailed options.

#### Configuration Examples

```yaml
# Simple configuration with defaults
http:
  securePort: 9926
  mtls: true  # Uses default certificate verification settings

# Or with custom certificate verification settings
http:
  securePort: 9926
  mtls:
    certificateVerification:
      timeout: 5000        # OCSP timeout in milliseconds (default: 5000)
      cacheTtl: 3600000    # Cache TTL in milliseconds (default: 1 hour)
      failureMode: fail-open  # or fail-closed (default: fail-open)

# To disable certificate verification (not recommended for production)
http:
  securePort: 9926
  mtls:
    certificateVerification: false
```
