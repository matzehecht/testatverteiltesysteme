    var apiUrl = "http://localhost:8080/api"

	function createBlackboard(name) {
		$.ajax({
			url: apiUrl + '/blackboard/' + name,
			type: 'PUT',
			data: "",
			success: function(data) {
			alert('Load was performed.');
			}
		});
	}

	function updateBlackboard(name, message) {
		//ajax request
		$.ajax({
			url: apiUrl + '/blackboard/' + name,
			data: JSON.stringify({ "message": message}),
			type: 'PATCH',
			contentType : 'application/json',
			// for incompatible browsers?
			xhr: function() {
		        return window.XMLHttpRequest == null || new window.XMLHttpRequest().addEventListener == null 
		            ? new window.ActiveXObject("Microsoft.XMLHTTP")
		            : $.ajaxSettings.xhr();
		    	},
		    success: function(data) {
					alert("Update was performed.")
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
			type: 'GET',
			success: function(data){
				//change style of board in foreground by setting new css class
				var board = document.getElementById(boardId);

				//loop childnodes
				for (var i = 0; i < board.childNodes.length; i++) {
					//change text according to received message
					if(board.childNodes[i].className == "blackboardText"){
						board.childNodes[i].textContent = data.message;
					}
					//display buttons
					if (board.childNodes[i].className == "blackboardButton") {
					  board.childNodes[i].style.display = 'inline-flex';
					}        
				}
			}
		});
	}

	function getBlackboardStatus(name, handler) {
		$.ajax({
			url: apiUrl + '/blackboard/' + name + '?format=status',
			dataType: 'json',
			success: handler,
			type: 'GET'
		});
	}

	function getBlackboards(handler, errorHandler = function(){}) {
		$.ajax({
			url: apiUrl + '/blackboard',
			error: errorHandler(),
			dataType: 'json',
			success: handler,
			type: 'GET'
		});
	}

	function deleteBlackboard(name) {
		$.ajax({
			url: apiUrl + '/blackboard/' + name,
			dataType: 'json',
			success: function() {
				alert("Blackboard " + name + " gelöscht");
			},
			type: 'DELETE'
		})
	}
