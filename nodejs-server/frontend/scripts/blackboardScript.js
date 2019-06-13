var apiUrl = "http://localhost:8080/api"

function createBlackboard(name) {
	$.ajax({
		url: apiUrl + '/blackboard/' + name,
		type: 'PUT',
		dataType: 'text'
	}).done(function(data, textStatus, xhr) {
		if(xhr.status == 201) {
			// blackboard created
			console.log("Blackboard created.");
		} else {
			// blackboard created successfully, but with unspecified response code
			console.log("Blackboard created successfully, but with unspecified response code.");
		}
	}).fail(function(xhr, textStatus, e) {
		console.log("Create Blackboard failed.");
		if(xhr.status == 400) {
			// bad request
			console.log("Wrong parameter supplied.");
		} else if(xhr.status == 409) {
			//Conflict
			console.log("Blackboard already exists.");
		} else if(xhr.status == 507) {
			// Insufficient storage
			console.log("Maximum number of blackboards already reached.");
		} else {
			// status code not specified
			console.log("Unkown error. Code: " + xhr.status);
			console.log(textStatus);
			console.log(e);
		}
	});
}

function updateBlackboard(name, message) {
	//ajax request
	$.ajax({
		url: apiUrl + '/blackboard/' + name,
		data: JSON.stringify({ "message": message}),
		type: 'PATCH',
		contentType : 'application/json'/*,
		// for incompatible browsers?
		xhr: function() {
		       return window.XMLHttpRequest == null || new window.XMLHttpRequest().addEventListener == null 
		           ? new window.ActiveXObject("Microsoft.XMLHTTP")
		           : $.ajaxSettings.xhr();
		    },*/
	}).done(function(data, textStatus, xhr) {
		if(xhr.status == 200) {
			console.log("Update Blackboard successful. Status: " + xhr.status);
		} else {
			// unspecified status code
			console.log("Update Blackboard successful with unspecified status code. Status: " + xhr.status);
			console.log(data);
		}
	}).fail(function(xhr, textStatus, e) {
		if(xhr.status == 400) {
			// Bad request
			console.log("Wrong parameter supplied.");
		} else if(xhr.status == 404) {
			// Not found
			console.log("No exisiting blackboard name supplied.");
		} else {
			console.log("Unkown status");
		}
	});
}

function clearBlackboard(name) {
	updateBlackboard(name, "");
}

function readBlackboard(name, boardId) {
	$.ajax({
		url: apiUrl + '/blackboard/' + name,
		dataType: 'json',
		type: 'GET'
	}).done(function(data, textStatus, xhr) {
		if (xhr.status == 200) {
			// call was successfull and all is good
			console.log("Read Blackboard successfull.");
			//change style of board in foreground by setting new css class
			var board = document.getElementById(boardId);
			//loop childnodes
			for (var i = 0; i < board.childNodes.length; i++) {
				//change text according to received message
				if(board.childNodes[i].className == "blackboardText"){
					board.childNodes[i].textContent = data.message;
				}
				//display buttons
				if (board.childNodes[i].className == "buttonContainer") {
					board.childNodes[i].style.display = 'inline-flex';
				}
				if (board.childNodes[i].className == "blackboardButton") {
					board.childNodes[i].style.display = 'inline-flex';
				}        
			}
		} else {
			// Status code is not default/not the specified status code
			console.log("Read Blackboard was successfull, but with a weird status code. Status: " + xhr.status);
		}
	}).fail(function(xhr, textStatus, e) {
		// call failed
		if(xhr.status == 400) {
			//Bad request
			console.log("Wrong parameters supplied.");
		} else if(xhr.status == 404) {
			// Not found
			console.log("No exisiting blackboard name supplied.");
		} else {
			// unknown error
			console.log("Unknown error");
		}
	});
}

function getBlackboardStatus(name, handler) {
	$.ajax({
		url: apiUrl + '/blackboard/' + name + '?format=status',
		dataType: 'json',
		type: 'GET',
		complete: function(e, xhr, settings) {
			console.log("Get Blackboard Status. Status: " + e.status);
		}
	}).done(function(data, textStatus, xhr) {
		if(xhr.status == 200) {
			// Successful
			console.log("Read Blackboard status successfull.");
			handler(data);
		}
	}).fail(function(xhr, textStatus, e) {
		if(xhr.status == 400) {
			//Bad request
			console.log("Wrong parameters supplied.");
		} else if(xhr.status == 404) {
			// Not found
			console.log("No exisiting blackboard name supplied.");
		} else {
			// unknown error
			console.log("Unknown error");
		}
	});
}

function getBlackboards(handler) {
	$.ajax({
		url: apiUrl + '/blackboard',
		dataType: 'json',
		type: 'GET'
	}).done(function(data, textStatus, xhr) {
		if(xhr.status == 200) {
			// all good
			console.log("Get Blackboards was successful.");
			handler(data);
		} else {
			// unknown response code
			console.log("Get Blackboards was successful but with unspecified status code.");
			console.log(xhr.status);
		}
	}).fail(function(xhr, textStatus, e) {
		// error
		console.log("Get Blackboards failed.");
	});
}

function deleteBlackboard(name) {
	$.ajax({
		url: apiUrl + '/blackboard/' + name,
		dataType: 'json',
		type: 'DELETE'
	}).done(function(data, textStatus, xhr) {
		//alert("Blackboard " + name + " gelöscht");
		if(xhr.status == 204) {
			// perfect deleted
			console.log("Delete was successful.");
		} else {
			// unspecified status code
			console.log("Delete was successfull, but with unspecified response status code.");
		}
	}).fail(function(xhr, textStatus, e) {
		if(xhr.status == 404) {
			// Not found
			console.log("Delete failed. No exisiting blackboard name supplied.");
		} else {
			// unknown error
			console.log("Delete failed.");
		}
	});
}