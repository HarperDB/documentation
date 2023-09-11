# Using the Configuration File and Naming Conventions

The configuration elements in `harperdb-config.yaml` use camelcase: `operationsApi`.

To change a configuration value edit the `harperdb-config.yaml` file and save any changes. HarperDB must be restarted for changes to take effect.

Alternately, configuration can be changed via environment and/or command line variables or via the API. To access lower level elements, use underscores to append parent/child elements (when used this way elements are case insensitive):

    - Environment variables: `OPERATIONSAPI_NETWORK_PORT=9925`
    - Command line variables: `--OPERATIONSAPI_NETWORK_PORT 9925`
    - Calling `set_configuration` through the API: `operationsApi_network_port: 9925`

Take a closer look at each element of the `harperdb-config.yaml` file in the following sections.