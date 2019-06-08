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

  // Serve static files for the web frontend
  app.use(express.static('frontend'));

  app.use(function(req, res, next) {
    // log the request IP address
    console.log(Date().toString() + ": " + req.method + "-Request method from IPv6 address '" + req.ip + "'");
    next();
  });

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

  // export the express app so that it can be used in test module
  module.exports = app;
});