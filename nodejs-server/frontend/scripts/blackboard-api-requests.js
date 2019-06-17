// define the API-Url
var apiUrl = "http://localhost:8080/api";
// define maximum length of a blackboard name
var maxBlackboardNameLength = 32;
// define maximum length of a blackboard message
var maxMessageLength = 4096;

// check the requirements of the blackboard name
// params
// string: name - the blackboard name
function checkBlackboardNameRequirements(name) {
	var isString = (typeof name === 'string' || name instanceof String) && name.length > 0 && name.length <= maxBlackboardNameLength;
	var badCharactersInString = name.includes("?") || name.includes("/");
	var onlySpacesInString = !name.replace(/\s/g, '').length;
	if(isString && !badCharactersInString && !onlySpacesInString) {
		return true;
	} else {
		return false;
	}
}

// check the requirements of the blackboard message
// params
// string: message - the message which should be send to the blackboard
function checkBlackboardMessageRequirements(message) {
	if ((typeof message === 'string' || message instanceof String) && message.length <= maxMessageLength) {
		return true;
	} else {
		return false;
	}
}

// function for creating a blackboard
// params
// string: name - the (unique) name of the blackboard
// successHandler(string: textStatus) - callback function to handle the successfull response
// errorHandler(string: textStatus) - callback function to handle the failed response
function createBlackboard(name, successHandler, errorHandler) {
	if(checkBlackboardNameRequirements(name)) {
		$.ajax({
			// create the ajax request
			// set the url for the request, the type and the dataType
			url: apiUrl + '/blackboard/' + name,
			type: 'PUT',
			dataType: 'text'
		}).done(function(data, textStatus, xhr) {
			// callback if the request was successfull
			// log the status on the console
			if(xhr.status == 201) {
				// blackboard created
				console.log("Blackboard created. Statuscode " + xhr.status);
			} else {
				// blackboard created successfully, but with unspecified response code
				console.log("Blackboard created successfully, but with unspecified response code. Statuscode " + xhr.status);
			}
			// call the callback function for a successfull response
			successHandler("Blackboard created");
		}).fail(function(xhr, textStatus, e) {
			// callback if the request failed
			// reasons are: wrong parameter, the blackboard already exists, insufficient storage on the server
			// log the status on the console
			console.log("Create Blackboard failed.");
			var errormessage = "";
			if(xhr.status == 400) {
				// bad request
				console.log("Create Blackboard failed. Wrong parameter supplied. Statuscode " + xhr.status);
				errormessage = "Wrong parameter supplied.";
			} else if(xhr.status == 409) {
				//Conflict
				console.log("Create Blackboard failed. Blackboard already exists. Statuscode " + xhr.status);
				errormessage = "Blackboard already exists.";
			} else if(xhr.status == 507) {
				// Insufficient storage
				console.log("Create Blackboard failed. Maximum number of blackboards already reached. Statuscode " + xhr.status);
				errormessage = "Maximum number of blackboards already reached.";
			} else {
				// status code not specified
				console.log("Create Blackboard failed. Unkown error. Statuscode " + xhr.status);
				console.log(textStatus);
				console.log(e);
				errormessage = "Unkown error.";
			}
			// call the callback function for a failed response
			errorHandler("Could not create Blackboard. " + errormessage);
		});
	} else {
        // Blackboard name does not match with the requirements
        errorHandler("This is not a valid Blackboard name. It is forbidden to use \"/\" and \"?\" or only  use spaces.");   	
    }
}

// function for update the blackboard (change the message)
// params
// string: name - the identifier (name) of the blackboard
// string: message - the new message which should be stored on the blackboard
// successHandler(string: textStatus) - callback function to handle the successfull response
// errorHandler(string: textStatus) - callback function to handle the failed response
function updateBlackboard(name, message, successHandler, errorHandler) {
	if(checkBlackboardNameRequirements(name) && checkBlackboardMessageRequirements(message)) {
		$.ajax({
			// create the ajax request
			// transmit the data in the "data"-object of the request and set the content type to json
			url: apiUrl + '/blackboard/' + name,
			data: JSON.stringify({ "message": message}),
			type: 'PATCH',
			contentType : 'application/json'
		}).done(function(data, textStatus, xhr) {
			// callback if the request was successfull
			// log the status on the console
			if(xhr.status == 200) {
				// blackboard updated
				console.log("Update Blackboard successful. Statuscode " + xhr.status);
			} else {
				// blackboard updated, but unspecified success response from the server
				console.log("Update Blackboard successful with unspecified status code. Statuscode " + xhr.status);
				// log, if data is transmitted
				console.log(data);
			}
			// call the callback function
			successHandler("Blackboard message updated");
		}).fail(function(xhr, textStatus, e) {
			// callback if the request failed
			// reasons are: wrong parameter or the blackboard does not exist
			// log the status on the console
			var errormessage = "";
			if(xhr.status == 400) {
				// Bad request
				console.log("Update Blackboard failed. Wrong parameter supplied. Statuscode " + xhr.status);
				var errormessage = "Wrong parameter supplied.";
			} else if(xhr.status == 404) {
				// Not found
				console.log("Update Blackboard failed. No exisiting blackboard name supplied. Statuscode " + xhr.status);
				var errormessage = "No exisiting blackboard name supplied.";
			} else {
				// status code not specified
				console.log("Update Blackboard failed. Unkown status. Statuscode " + xhr.status);
				var errormessage = "Unknown error.";
			}
			errorHandler("Could not update Blackboard. " + errormessage);
		});
	} else {
        // Blackboard name or message does not match with the requirements
        errorHandler("Can\'t update Blackboard. This is not a valid Blackboard name or message is to long.");  
	}
}

// function to clear the content (message) of an blackboard
// params
// string: name - the name of the blackboard
// successHandler(string: textStatus) - callback function to handle the successfull response
// errorHandler(string: textStatus) - callback function to handle the failed response
function clearBlackboard(name, successHandler, errorHandler) {
	// this function links to function "updateBlackboard()" but with empty content
	// Thereby, an additional function is not needed and with updating with an empty message,
	// the content is cleared of the blackboard
	updateBlackboard(name, "", successHandler, errorHandler);
}

// function to read the content of a blackboard
// params
// string: name - the id/name of the blackboard
// successHandler(object: data, string: textStatus) - callback function to handle the successfull response with the data
// errorHandler(string: textStatus) - callback function to handle the failed response
function readBlackboard(name, successHandler, errorHandler) {
	if(checkBlackboardNameRequirements(name)) {
		$.ajax({
			// create the ajax request
			url: apiUrl + '/blackboard/' + name,
			dataType: 'json',
			type: 'GET'
		}).done(function(data, textStatus, xhr) {
			// callback if the request was successfull
			// log the status on the console
			// in data is the response from the server
			if (xhr.status == 200) {
				// call was successfull and all is good
				console.log("Read Blackboard successfull. Statuscode " + xhr.status);
			} else {
				// Status code is not default/not the specified status code
				console.log("Read Blackboard was successfull, but with a weird status code. Statuscode " + xhr.status);
			}
			// transmit the response to the callback function
			successHandler(data, "Read Blackboard successfully.");
		}).fail(function(xhr, textStatus, e) {
			// callback if the request failed
			// reasons are: wrong parameter or the blackboard does not exist
			// log the status on the console
			var errormessage = "";
			if(xhr.status == 400) {
				//Bad request
				console.log("Read Blackboard failed. Wrong parameters supplied. Statuscode " + xhr.status);
				var errormessage = "Wrong parameters supplied.";
			} else if(xhr.status == 404) {
				// Not found
				console.log("Read Blackboard failed. No exisiting blackboard name supplied. Statuscode " + xhr.status);
				var errormessage = "No exisiting blackboard name supplied.";
			} else {
				// unknown error
				console.log("Read Blackboard failed. Unknown error. Statuscode " + xhr.status);
				var errormessage = "Unknown error.";
			}
			errorHandler("Could not read Blackboard. " + errormessage);
		});		
	} else {
        // Blackboard name does not match with the requirements
        errorHandler("Can\'t update Blackboard. This is not a valid Blackboard name.");  
	}
}

// function to read the status of a blackboard
// params
// string: name - the id/name of the blackboard
// successHandler(object: data, string: textStatus) - callback function to handle the response with the data
// errorHandler(string: textStatus) - callback function to handle the failed response
function getBlackboardStatus(name, successHandler, errorHandler) {
	if(checkBlackboardNameRequirements(name)) {
		$.ajax({
			// create the ajax request
			// set the API-Url with the query parameter
			url: apiUrl + '/blackboard/' + name + '?format=status',
			dataType: 'json'
		}).done(function(data, textStatus, xhr) {
			// callback if the request was successfull
			// log the statuscode on the console
			// in data is the response from the server
			if(xhr.status == 200) {
				// Successful
				console.log("Read Blackboard status successfull. Statuscode " + xhr.status);
			} else {
				// Status code is not default/not the specified status code
				console.log("Read Blackboard status was successfull, but with a weird status code. Statuscode " + xhr.status);
			}
			// transmit the response to the callback function
			successHandler(data, "Read Blackboard status successfully");
		}).fail(function(xhr, textStatus, e) {
			// callback if the request failed
			// reasons are: wrong parameter or the blackboard does not exist
			// log the status on the console
			var errormessage = "";
			if(xhr.status == 400) {
				//Bad request
				console.log("Read status failed. Wrong parameters supplied. Statuscode " + xhr.status);
				errormessage = "Wrong parameters supplied.";
			} else if(xhr.status == 404) {
				// Not found
				console.log("Read status failed. No exisiting blackboard name supplied. Statuscode " + xhr.status);
				errormessage = "No exisiting blackboard name supplied.";
			} else {
				// unknown error
				console.log("Read status failed. Unknown error. Statuscode " + xhr.status);
				errormessage = "Unknown error.";
			}
			errorHandler("Could not read Blackboard status. " + errormessage);
		});	
	} else {
        // Blackboard name does not match with the requirements
        errorHandler("Can\'t update Blackboard. This is not a valid Blackboard name.");
	}
}

// function to get all blackboards (and its content)
// params
// successHandler(object: data, string: textStatus) - callback function to handle the response with the data (blackboards)
// errorHandler(string: textStatus) - callback function to handle the failed response
function getBlackboards(successHandler, errorHandler) {
	$.ajax({
		// create the ajax request
		url: apiUrl + '/blackboard',
		dataType: 'json',
		type: 'GET'
	}).done(function(data, textStatus, xhr) {
		// callback if the request was successfull
		// log the statuscode on the console
		// in data is the response from the server
		if(xhr.status == 200) {
			// all good
			console.log("Get Blackboards was successful. Statuscode " + xhr.status);
		} else {
			// unknown response code
			console.log("Get Blackboards was successful but with unspecified status code. Statuscode " + xhr.status);
		}
		successHandler(data, "Get Blackboards successfully.");
	}).fail(function(xhr, textStatus, e) {
		// callback if the request failed
		// reasons are e.g. server error
		// log the status on the console
		console.log("Get Blackboards failed. Statuscode " + xhr.status);
		errorHandler("Get Blackboards failed.");
	});
}

// function to delete a blackboard
// params
// string: name - the id/name of the blackboard which should be deleted
// successHandler(string: textStatus) - callback function which is called if the removal was successful
// errorHandler(string: textStatus) - callback function to handle the failed response
function deleteBlackboard(name, successHandler, errorHandler) {
	if(checkBlackboardNameRequirements(name)) {
		$.ajax({
			// create the ajax request
			url: apiUrl + '/blackboard/' + name,
			dataType: 'json',
			type: 'DELETE'
		}).done(function(data, textStatus, xhr) {
			// callback if the request was successfull
			// log the statuscode on the console
			if(xhr.status == 204) {
				// perfect deleted
				console.log("Delete was successful. Statuscode " + xhr.status);
			} else {
				// unspecified status code
				console.log("Delete was successfull, but with unspecified response status code. Statuscode " + xhr.status);
			}
			// call the handler to remove the board from the UI
			successHandler("Delete Blackboard successfully.");
		}).fail(function(xhr, textStatus, e) {
			// callback if the request failed
			// reasons are: blackboard does not exist
			// log the status on the console
			var errormessage = "";
			if(xhr.status == 404) {
				// Not found
				console.log("Delete failed. No exisiting blackboard name supplied. Statuscode " + xhr.status);
				errormessage = "No exisiting blackboard name supplied.";
			} else {
				// unknown error
				console.log("Delete failed. Statuscode " + xhr.status);
				errormessage = "Unknown error.";
			}
			errorHandler("Delete Blackboard failed. " + errormessage);
		});		
	} else {
        // Blackboard name does not match with the requirements
        errorHandler("Can\'t delete Blackboard. This is not a valid Blackboard name."); 
	}
}