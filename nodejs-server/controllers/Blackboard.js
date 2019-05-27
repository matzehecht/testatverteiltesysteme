// this file is used as the route controller and to call the promises of the service implementations

'use strict';

// import module to handle and put through the API responses
var utils = require('../utils/writer.js');
// import module with the implementations of the service methods
var Blackboard = require('../service/BlackboardService');

/*
  For each of the necessary functions, log the request IP address onto the console, call the service
  implementation method with the request parameters and execute the API response on method completion.

  Because all function calls are constructed equally, the logic will be explained only on the first
  function "createBlackboard".
*/

// function to create a new empty blackboard
module.exports.createBlackboard = function createBlackboard (req, res, next) {
  // log the request IP address
  console.log(req.method + " - Request method from IPv6 address '" + req.ip + "'");
  // call the service method with given name in the request URL
  var name = req.swagger.params['name'].value;
  Blackboard.createBlackboard(name)
    /* on successful promise completion (by calling "resolve(...)"), execute the API response with the parametered 
      status code and status code message from the promise (possible over parameters in the resolve call) */
    .then(function (response) {
      utils.writeJson(res, response.code, response.codemessage);
    })
    /* by calling "reject(...)" on an error in the promise, this code path will be executed; also execute the API
      response with the parametered status code and status code message */
    .catch(function (response) {
      utils.writeJson(res, response.code, response.codemessage);
    });
};

// function to delete an existing blackboard
module.exports.deleteBlackboard = function deleteBlackboard (req, res, next) {
  console.log(req.method + " - Request method from IPv6 address '" + req.ip + "'");
  var name = req.swagger.params['name'].value;
  Blackboard.deleteBlackboard(name)
    .then(function (response) {
      utils.writeJson(res, response.code, response.codemessage);
    })
    .catch(function (response) {
      utils.writeJson(res, response.code, response.codemessage);
    });
};

// function to list all existing blackboards with the names, messages and timestampes
module.exports.listBlackboards = function listBlackboards (req, res, next) {
  console.log(req.method + " - Request method from IPv6 address '" + req.ip + "'");
  Blackboard.listBlackboards()
    .then(function (response) {
      utils.writeJson(res, response.code, response.codemessage, response.payload);
    })
    .catch(function (response) {
      utils.writeJson(res, response.code, response.codemessage);
    });
};

// function to read the message from one specific blackboard
module.exports.readBlackboard = function readBlackboard (req, res, next) {
  console.log(req.method + " - Request method from IPv6 address '" + req.ip + "'");
  var name = req.swagger.params['name'].value;
  var format = req.swagger.params['format'].value;
  Blackboard.readBlackboard(name,format)
    .then(function (response) {
      utils.writeJson(res, response.code, response.codemessage, response.payload);
    })
    .catch(function (response) {
      utils.writeJson(res, response.code, response.codemessage);
    });
};

// function to update the message from an existing blackboard
module.exports.updateBlackboard = function updateBlackboard (req, res, next) {
  console.log(req.method + " - Request method from IPv6 address '" + req.ip + "'");
  var body = req.swagger.params['blackboard'].value;
  var name = req.swagger.params['name'].value;
  Blackboard.updateBlackboard(body,name)
    .then(function (response) {
      utils.writeJson(res, response.code, response.codemessage, response.payload);
    })
    .catch(function (response) {
      utils.writeJson(res, response.code, response.codemessage);
    });
};