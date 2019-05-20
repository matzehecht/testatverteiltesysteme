'use strict';

var utils = require('../utils/writer.js');
var Blackboard = require('../service/BlackboardService');

module.exports.createBlackboard = function createBlackboard (req, res, next) {
  var name = req.swagger.params['name'].value;
  Blackboard.createBlackboard(name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteBlackboard = function deleteBlackboard (req, res, next) {
  var name = req.swagger.params['name'].value;
  Blackboard.deleteBlackboard(name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.listBlackboards = function listBlackboards (req, res, next) {
  Blackboard.listBlackboards()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.readBlackboard = function readBlackboard (req, res, next) {
  var name = req.swagger.params['name'].value;
  var format = req.swagger.params['format'].value;
  Blackboard.readBlackboard(name,format)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateBlackboard = function updateBlackboard (req, res, next) {
  var body = req.swagger.params['blackboard'].value;
  var name = req.swagger.params['name'].value;
  Blackboard.updateBlackboard(body,name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
