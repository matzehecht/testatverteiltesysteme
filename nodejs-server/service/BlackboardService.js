/* 
This file is used to implement the logics of all service methods.
Each method definition starts with a short description of the function with the usage, parameters and responses.
Each method returns a new promise (promise object, which will be redeemed later; used for asynchronous programming).
A promise can be fulfilled (by calling "resolve()") or rejected (by calling "reject()").
*/

'use strict';

// declare the array to store all blackboards with the necessary metadata
var blackboards = [];
// define maximum length of a blackboard name
var maxBlackboardName = 32;
// define maximum count of blackboards
var maxBlackboards = 255;
// define maximum length of a blackboard message
var maxMessage = 4096;

// define inital blackboards, which will exist immediately after starting the server
blackboards.push({"name": "Blackboard 1", "message": "Erstes initiales Blackboard", "timestamp": Date.now()});
blackboards.push({"name": "Blackboard 2", "message": "Zweites initiales Blackboard", "timestamp": Date.now()});

exports.blackboards = blackboards;

/**
 * create a new blackboard
 *
 * name String Name of the new blackboard
 * no response value expected for this operation
 **/
exports.createBlackboard = function(name) {
    return new Promise(function(resolve, reject) {
        var exists = false;
        // Check, if the parametered blackboard name is too long, if the blackboard stack is already full and 
        // if the parametered blackboard name exists. Only store the new blackboard, if all checks were successful,
        // otherwise respond with an error.
        if(name === "" || name.toString().length > maxBlackboardName) {
            reject({"code": 400, "codemessage": "Bad request. Wrong parameter supplied"});
        }
        else {
            if(blackboards.length >= maxBlackboards) {
                reject({"code": 507, "codemessage": "Insufficient Storage. Maximum number of blackboards already reached"});
            }
            else {
                for(var i=0; i<blackboards.length; i++) {
                    if(blackboards[i].name === name) {
                        exists = true;
                        break;
                    }
                }
                if(exists) {
                    reject({"code": 409, "codemessage": "Conflict. Blackboard already exists"});
                }
                else {
                    blackboards.push({"name": name, "message": "", "timestamp": Date.now()});
                    resolve({"code": 201, "codemessage": "Blackboard created"});
                }
            }
        }
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
        // If the parametered blackboard name exists, delete the corresponding blackboard object from the array,
        // otherwise respond with an error.
        var exists = false;
        for(var i=0; i<blackboards.length; i++) {
            if(blackboards[i].name === name) {
                exists = true;
                break;
            }
        }
        if(!exists) {
            reject({"code": 404, "codemessage": "Not found. Not existing blackboard name supplied"});
        }
        else {
            for(var i=0; i<blackboards.length; i++) {
                if(blackboards[i].name === name) {
                    blackboards.splice(i,1);
                    resolve({"code": 204, "codemessage": "Deleted"});
                }
            }
        }
    });
}


/**
 * get all existing blackboards
 *
 * returns inline_response_200
 **/
exports.listBlackboards = function() {
    return new Promise(function(resolve, reject) {
        // Return the whole blackboard array with all objects and metadata.
        resolve({"code": 200, "codemessage": "Successful", "payload": {"blackboards": blackboards}});
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
        // Check, if the parameterd blackboard name exists and respond with an error, if not.
        var exists = false;
        for(var i=0; i<blackboards.length; i++) {
            if(blackboards[i].name === name) {
                exists = true;
                break;
            }
        }
        if(!exists) {
            reject({"code": 404, "codemessage": "Not found. Not existing blackboard name supplied"});
        }
        else {
            // If the query parameter 'format' is set to 'status', respond the information, if the blackboard
            // is empty. If no query paramters given, respond with the blackboard message. Otherwise repond with
            // an error.
            if(format == null || format === "status") {
                for(var i=0; i<blackboards.length; i++) {
                    if(blackboards[i].name === name) {
                        if(format === "status") {
                            var empty = blackboards[i].message === "";
                            resolve({"code": 200, "codemessage": "Successful", "payload": 
                                {"name": blackboards[i].name, "empty": empty, "timestamp": blackboards[i].timestamp}
                            });
                        }
                        else {
                            resolve({"code": 200, "codemessage": "Successful", "payload": blackboards[i]})
                        }
                    }
                }
            }
            else {
                reject({"code": 400, "codemessage": "Bad request. Wrong parameters supplied"});
            }
        }
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
        // Check, if the parametered blackboard name doesn't exist or the parameteredblackboard message is too long.
        // Only update the blackboard message, if both checks were successful, otherwise respond with an error.
        var exists = false;
        for(var i=0; i<blackboards.length; i++) {
            if(blackboards[i].name === name) {
                exists = true;
                break;
            }
        }
        if(!exists) {
            reject({"code": 404, "codemessage": "Not found. Not existing blackboard name supplied"});
        }
        else {
            if(body.message.toString().length > maxMessage) {
                reject({"code": 400, "codemessage": "Bad request. Wrong parameter supplied"});
            }
            else {
                for(var i=0; i<blackboards.length; i++) {
                    if(blackboards[i].name === name) {
                        blackboards[i].message = body.message;
                        blackboards[i].timestamp = Date.now();
                        resolve({"code": 200, "codemessage": "Successful", "payload": blackboards[i]});
                    }
                }
            }
        }
    });
}

