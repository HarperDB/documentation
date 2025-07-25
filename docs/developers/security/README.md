# Security

Harper uses role-based, attribute-level security to ensure that users can only gain access to the data they’re supposed to be able to access. Our granular permissions allow for unparalleled flexibility and control, and can actually lower the total cost of ownership compared to other database solutions, since you no longer have to replicate subsets of your data to isolate use cases.

## Authentication Methods

- [JWT Authentication](jwt-auth.md) - JSON Web Token based authentication
- [Basic Authentication](basic-auth.md) - Username/password authentication
- [mTLS Authentication](mtls-auth.md) - Certificate-based mutual TLS authentication with automatic certificate revocation checking

## Security Configuration

- [Configuration](configuration.md) - Security-related configuration options
- [Users and Roles](users-and-roles.md) - Managing users and role-based permissions
- [Certificate Management](certificate-management.md) - Managing SSL/TLS certificates
