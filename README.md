Volos-Swagger-OAuth
===================

This module allows you add and configure [Volos](https://github.com/apigee-127/volos) security without writing any code - just by declaring it in the Swagger in your Swagger-Node project. The following policies are currently supported by this module:

* API Key
* OAuth 2.0
* Basic Auth

More information on Volos here: https://github.com/apigee-127/volos

More information on applying OAuth policies here: https://github.com/apigee-127/a127-documentation/wiki/Policies#oauth

Example app here: https://github.com/apigee-127/swagger-node-examples/tree/master/volos-plugins

Installation
------------

1. Add this and the volos modules you plan use to your application dependencies. Example:

```
npm install --save volos-swagger-oauth
npm install --save volos-oauth-apigee
```

2. Add a `volos-swagger-oauth` fitting definition to your bagpipes definition (config/default.yaml). It *must* be declared before the `swagger_router` (defining at the top of the `bagpipes` section is safe):

```yaml
  bagpipes:

    volos-swagger-oauth:                # <= DEFINED HERE
      name: volos-swagger-oauth

    _router:
      name: swagger_router
```

3. Add the volos-swagger-oauth fitting to any pipe on which you need security to be included. It should be inserted above the swagger_security module:

```yaml
    swagger_controllers:
      - onError: json_error_handler
      - cors
      - volos-swagger-oauth               # <- RUN HERE
      - swagger_security
      - _swagger_validate
      - express_compatibility
      - _router
```

4. Add a [Swagger 2.0 Spec](http://swagger.io/specification/) [security Definitions](http://swagger.io/specification/#securityDefinitionsObject) tag to your Swagger. Something like this:

```yaml
securityDefinitions:
  OAuth2:
    type: oauth2
    flow: application
    tokenUrl: http://localhost:10010/accesstoken
    scopes:
      read: read access
```

4. Add a `x-volos-resources` extension tag to your Swagger with your policy configuration (see the [volos-swagger readme](https://github.com/apigee-127/volos/tree/master/swagger) for more details. This will configure the Volos OAuth provider. Note that the key ('OAuth2' in this example) must match the name used in the securityDefinitions:

```yaml
x-volos-resources:
  OAuth2:
    provider: volos-oauth-apigee
    options:
      tokenLifetime: 300000
      key: *apigeeProxyKey
      uri: *apigeeProxyUri
      validGrantTypes:
        - client_credentials
        - authorization_code
        - implicit_grant
        - password
      passwordCheck:
        helper: volos
        function: passwordCheck
      tokenPaths:  # These will be added to your paths section for you
        authorize: /authorize
        token: /accesstoken
        invalidate: /invalidate
        refresh: /refresh
```

4. Add the [Swagger 2.0 security](http://swagger.io/specification/#securityRequirementObject) tag to any paths or operations on your Swagger you would like your security policy to apply to along with any configuration that is necessary:

```yaml
paths:
  /hello:
    x-swagger-router-controller: hello_world
    get:
      description: Returns 'Hello' to the caller
      operationId: hello
      parameters: []
      security:
        - OAuth2: [ read ]
```
