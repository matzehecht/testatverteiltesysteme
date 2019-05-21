$(document).ready(function(){
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

	function readBlackboard(name) {

	}

	function getBlackboardStatus(name) {
		
	}

	function getBlackboards(handler, errorHandler) {
		$.ajax({
			url: apiUrl + '/blackboard',
			data: {
				format: 'json'
			},
			error: errorHandler(),
			dataType: 'jsonp',
			success: handler(data),
			type: 'GET'
		});
	}

	function deleteBlackboard(name) {
		
	}
});
