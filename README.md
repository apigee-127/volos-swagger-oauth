Volos-Swagger-OAuth
===================

This module allows you add and configure [Volos](https://github.com/apigee-127/volos) security without writing any code - just by declaring it in the Swagger in your Swagger-Node project. The following policies are currently supported by this module:

* API Key
* OAuth 2.0
* Basic Auth

More information on Volos here: https://github.com/apigee-127/volos

More information on applying OAuth policies here: https://github.com/apigee-127/a127-documentation/wiki/Policies#oauth


Installation
------------

1. Add this and the volos modules you plan use to your application dependencies. Example:

```
npm install --save volos-swagger-oauth
npm install --save volos-oauth-apigee
```

2. Add the volos_oauth fitting to your pipe (config/default.yaml). It should be run just before the swagger_security module:

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

3. Add a [Swagger 2.0 Spec](http://swagger.io/specification/) [security Definitions](http://swagger.io/specification/#securityDefinitionsObject) tag to your Swagger:

```yaml
securityDefinitions:
  MyApiKey:
    type: apiKey
    name: apiKey
    in: query
```

4. Add the x-volos-resources extension tag to your Swagger with your policy configuration. Note that the key string (MyApiKey) must match the name used in the securityDefinitions:

```yaml
  MyApiKey:
    provider: volos-oauth-apigee
    options:
      key: *apigeeProxyKey
      uri: *apigeeProxyUri
```

4. Add the Swagger 2.0 [security](http://swagger.io/specification/#securityRequirementObject) tag to any paths or operations on your Swagger you would like your security policy to apply to along with any configuration that is necessary:

```yaml
paths:
  /hello:
    x-swagger-router-controller: hello_world
    get:
      description: Returns 'Hello' to the caller
      operationId: hello
      parameters: []
      security:
        - MyOAuth: [ read ]
```
