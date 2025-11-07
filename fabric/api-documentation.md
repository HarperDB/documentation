---
title: API Documentation
---

# API Documentation
Harper provides a self-generating API documentation page via [Swagger UI](https://github.com/swagger-api/swagger-ui) integration. This page allows developers to explore and test the various API endpoints available in your Harper instance/cluster.

## Accessing the API Documentation
To access the API documentation, navigate to the following URL in your web browser:

Example:
```bash
# Fabric Studio
https://fabric.harper.fast/#/<org>/<cluster-or-instance>/apis

# Fabric Localhost
http://localhost:9925/#/apis
```

## API Execution
In order to execute API calls directly from the Swagger UI:

1. Click an endpoint to expand it.
2. Enter the required information in the provided fields under the "Parameters" tab.
3. Scroll down and click the "Execute" button.
4. The server response from the API call will be displayed below, including HTTP status code, and response body.



## Authorize

To authorize API requests, you need to include a valid basic authentication header or bearer authentication token.

1. Click on the "Authorize" button in the Swagger Documentation UI.
2. Choose your preferred authentication method (Basic or Bearer) and enter your credentials or token.
3. Click the "Authorize" button to apply the authentication key to all subsequent requests.
4. Execute an API call to verify that the authorization was successful.
