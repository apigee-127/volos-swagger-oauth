'use strict';

var volos = require('volos-swagger');
var _ = require('lodash');
var path = require('path');

module.exports = function create(fittingDef, bagpipes) {

  var swaggerNodeRunner = bagpipes.config.swaggerNodeRunner;

  var appRoot = swaggerNodeRunner.config.swagger.appRoot;
  fittingDef.helpers = path.resolve(appRoot, fittingDef.helpers || 'api/helpers');

  var middleware = volos.auth(swaggerNodeRunner.swagger, fittingDef);

  // install security handlers (won't overwrite existing ones)
  if (middleware.swaggerSecurityHandlers) {
    _.defaults(swaggerNodeRunner.swaggerSecurityHandlers, middleware.swaggerSecurityHandlers);
  }

  return function volos_auth(context, cb) {
    middleware(context.request, context.response, cb);
  }
};
