'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');

var express = require('express');
var app = express();
var oasTools = require('oas-tools');
var jsyaml = require('js-yaml');
var serverPort = 8080;

// swaggerRouter configuration
var options = {
  controllers: path.join(__dirname, './controllers')
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);
oasTools.configure(options);

// Initialize the Swagger middleware
oasTools.initializeMiddleware(oasDoc, app, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

});
