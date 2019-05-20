var ResponsePayload = function(code, codemessage, payload) {
  this.code = code;
  this.codemessage = codemessage;
  this.payload = payload;
}

exports.respondWithCode = function(code, codemessage, payload) {
  return new ResponsePayload(code, codemessage, payload);
}

var writeJson = exports.writeJson = function(response, arg1, arg2, arg3) {
  var code;
  var codemessage;
  var payload;

  if(arg1 && arg1 instanceof ResponsePayload) {
    writeJson(response, arg1.payload, arg1.codemessage, arg1.code);
    return;
  }

  code = arg3;
  codemessage = arg2;
  payload = arg1;

  if(!code) {
    // if no response code given, we default to 200
    code = 200;
  }
  if(typeof payload === 'object') {
    payload = JSON.stringify(payload, null, 2);
  }
  response.writeHead(code, codemessage, {'Content-Type': 'application/json'});
  response.end(payload);
}
