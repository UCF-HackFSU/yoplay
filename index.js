var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/frontend'));

app.get('/', function(request, response) {
  	response.sendfile('frontend/index.html');

  	//Yo
  	if(request.query.username != {}){
	  	
	  	console.log(request.query.username);

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
	}
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
