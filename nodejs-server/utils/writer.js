// this function is used to handle the responses to the clients with
// the corresponding response code, the codemessage and the JSON payload if necessary

exports.writeJson = function(response, code, codemessage, payload) {
    if(typeof payload === 'object') {
        payload = JSON.stringify(payload, null, 2);
    }
    response.writeHead(code, codemessage, {'Content-Type': 'application/json'});
    response.end(payload);
}
