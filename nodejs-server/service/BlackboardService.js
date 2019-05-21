'use strict';

var blackboards = [];
var maxBlackboardName = 32;
var maxBlackboards = 255;
var maxMessage = 4096;

blackboards.push({"name": "Wurscht", "message": "mit Senf", "timestamp": Date.now()});
blackboards.push({"name": "Jacke", "message": "ein relativ langer Text mit vielen Wörtern, damit viele Zeichen überschritten werden und man den Text am Ende mit Punkt Punkt Punkt abkürzen kann. Danke. Bitte.", "timestamp": Date.now()});

/**
 * create a new blackboard
 *
 * name String Name of the new blackboard
 * no response value expected for this operation
 **/
exports.createBlackboard = function(name) {
    return new Promise(function(resolve, reject) {
        var exists = false;
        if(name === "" || name.length > maxBlackboardName) {
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
            if(body.message.length > maxMessage) {
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

