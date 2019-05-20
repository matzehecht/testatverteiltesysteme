'use strict';


/**
 * create a new blackboard
 *
 * name String Name of the new blackboard
 * no response value expected for this operation
 **/
exports.createBlackboard = function(name) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * delete a blackboard
 *
 * name String Name of the blackboard to be deleted
 * no response value expected for this operation
 **/
exports.deleteBlackboard = function(name) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * get all existing blackboards
 *
 * returns inline_response_200
 **/
exports.listBlackboards = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * read message from a blackboard
 *
 * name String Name of the blackboard to be read
 * format String if set to 'status', return blackboard status (optional)
 * no response value expected for this operation
 **/
exports.readBlackboard = function(name,format) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * update message from an exisiting blackboard
 *
 * body Body Message to be written to the blackboard
 * name String Name of the blackboard to be updated
 * returns Blackboard
 **/
exports.updateBlackboard = function(body,name) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

