var http = new XMLHttpRequest();
		var url = "http://api.justyo.co/yo/";
		var apiToken = "50ebf33f-8bb6-4c76-a9ca-d525324055bc";
		var params = "api_token=" + apiToken + "&username=" + request.query.username;
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.setRequestHeader("Content-length", params.length);
		http.setRequestHeader("Connection", "close");

		http.onreadystatechange = function() {//Call a function when the state changes.
		    if(http.readyState == 4 && http.status == 200) {
		        alert(http.responseText);
		    }
		}
		http.send(params);

alert("hi");