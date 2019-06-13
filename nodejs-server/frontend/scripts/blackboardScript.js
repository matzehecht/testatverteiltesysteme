// define the API-Url
var apiUrl = "http://localhost:8080/api"

function createBlackboard(name) {
	// function for creating a blackboard
	// params:
	// name - the (unique) name of the blackboard

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
	}).fail(function(xhr, textStatus, e) {
		// callback if the request failed
		// reasons are: wrong parameter, the blackboard already exists, insufficient storage on the server
		// log the status on the console
		console.log("Create Blackboard failed.");
		if(xhr.status == 400) {
			// bad request
			console.log("Wrong parameter supplied. Statuscode " + xhr.status);
		} else if(xhr.status == 409) {
			//Conflict
			console.log("Blackboard already exists. Statuscode " + xhr.status);
		} else if(xhr.status == 507) {
			// Insufficient storage
			console.log("Maximum number of blackboards already reached. Statuscode " + xhr.status);
		} else {
			// status code not specified
			console.log("Unkown error. Statuscode " + xhr.status);
			console.log(textStatus);
			console.log(e);
		}
	});
}

function updateBlackboard(name, message, successHandler, errorHandler) {
	// function for update the blackboard (change the message)
	// params:
	// name - the identifier (name) of the blackboard
	// message - the new message which should be stored on the blackboard
	// successHandler - callback function to handle the successfull response
	// errorHandler - callback function to handle the failed response

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
		successHandler();
	}).fail(function(xhr, textStatus, e) {
		// callback if the request failed
		// reasons are: wrong parameter or the blackboard does not exist
		// log the status on the console
		if(xhr.status == 400) {
			// Bad request
			console.log("Wrong parameter supplied. Statuscode " + xhr.status);
		} else if(xhr.status == 404) {
			// Not found
			console.log("No exisiting blackboard name supplied. Statuscode " + xhr.status);
		} else {
			// status code not specified
			console.log("Unkown status Statuscode " + xhr.status);
		}
		errorHandler();
	});
}

function clearBlackboard(name, successHandler, errorHandler) {
	// function to clear the content (message) of an blackboard
	// params:
	// name - the name of the blackboard
	// successHandler - callback function to handle the successfull response
	// errorHandler - callback function to handle the failed response

	// this function links to function "updateBlackboard()" but with empty content
	// Thereby, an additional function is not needed and with updating with an empty message,
	// the content is cleared of the blackboard
	updateBlackboard(name, "", successHandler, errorHandler);
}

function readBlackboard(name, successHandler, errorHandler) {
	// function to read the content of a blackboard
	// params:
	// name - the id/name of the blackboard
	// boardID - the css-id of the board in html (needed to get access to this container)
	// successHandler - callback function to handle the successfull response with the data
	// errorHandler - callback function to handle the failed response

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
		successHandler(data);
	}).fail(function(xhr, textStatus, e) {
		// callback if the request failed
		// reasons are: wrong parameter or the blackboard does not exist
		// log the status on the console
		if(xhr.status == 400) {
			//Bad request
			console.log("Wrong parameters supplied. Statuscode " + xhr.status);
		} else if(xhr.status == 404) {
			// Not found
			console.log("No exisiting blackboard name supplied. Statuscode " + xhr.status);
		} else {
			// unknown error
			console.log("Unknown error. Statuscode " + xhr.status);
		}
		errorHandler();
	});
}

function getBlackboardStatus(name, successHandler, errorHandler) {
	// function to read the status of a blackboard
	// params:
	// name - the id/name of the blackboard
	// successHandler - callback function to handle the response with the data
	// errorHandler - callback function to handle the failed response

	$.ajax({
		// create the ajax request
		// set the API-Url with the query parameter
		url: apiUrl + '/blackboard/' + name + '?format=status',
		dataType: 'json'/*,
		type: 'GET',
		complete: function(e, xhr, settings) {
			console.log("Get Blackboard Status. Status: " + e.status);
		}*/
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
		successHandler(data);
	}).fail(function(xhr, textStatus, e) {
		// callback if the request failed
		// reasons are: wrong parameter or the blackboard does not exist
		// log the status on the console
		if(xhr.status == 400) {
			//Bad request
			console.log("Wrong parameters supplied. Statuscode " + xhr.status);
		} else if(xhr.status == 404) {
			// Not found
			console.log("No exisiting blackboard name supplied. Statuscode " + xhr.status);
		} else {
			// unknown error
			console.log("Unknown error. Statuscode " + xhr.status);
		}
		errorHandler();
	});
}

function getBlackboards(successHandler) {
	// function to get all blackboards (and its content)
	// params:
	// successHandler - callback function to handle the response with the data (blackboards)

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
			successHandler(data);
		} else {
			// unknown response code
			console.log("Get Blackboards was successful but with unspecified status code. Statuscode " + xhr.status);
			console.log(xhr.status);
		}
	}).fail(function(xhr, textStatus, e) {
		// callback if the request failed
		// reasons are e.g. server error
		// log the status on the console
		console.log("Get Blackboards failed. Statuscode " + xhr.status);
	});
}

function deleteBlackboard(name, successHandler) {
	// function to delete a blackboard
	// params:
	// name - the id/name of the blackboard which should be deleted
	// successHandler - callback function which is called if the removal was successful

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
			// call the handler to remove the board from the UI
			successHandler();
		} else {
			// unspecified status code
			console.log("Delete was successfull, but with unspecified response status code. Statuscode " + xhr.status);
			// call the handler to remove the board from the UI
			successHandler();
		}
	}).fail(function(xhr, textStatus, e) {
		// callback if the request failed
		// reasons are: blackboard does not exist
		// log the status on the console
		if(xhr.status == 404) {
			// Not found
			console.log("Delete failed. No exisiting blackboard name supplied. Statuscode " + xhr.status);
		} else {
			// unknown error
			console.log("Delete failed. Statuscode " + xhr.status);
		}
	});
}