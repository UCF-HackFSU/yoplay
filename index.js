// var express = require('express');
// var app = express();

// app.set('port', (process.env.PORT || 5000));
// app.use(express.static(__dirname + '/frontend'));

// app.get('/', function(request, response) {
  	
// 		console.log("hi");
//   	//Yo
//   	// if(request.query.username != null){
	  	
// 	  	console.log(request.query.username);

// 	  	console.log("hi");

// 	  	var http = new XMLHttpRequest();
// 		var url = "https://f7d0b78f-f308984b5cde.my.apitools.com/yo/";
// 		var apiToken = "50ebf33f-8bb6-4c76-a9ca-d525324055bc";
// 		var params = "api_token=" + apiToken + "&username=" + request.query.username;
// 		http.open("POST", url, true);

// 		//Send the proper header information along with the request
// 		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// 		http.setRequestHeader("Content-length", params.length);
// 		http.setRequestHeader("Connection", "close");

// 		http.onreadystatechange = function() {//Call a function when the state changes.
// 		    if(http.readyState == 4 && http.status == 200) {
// 		        alert(http.responseText);
// 		    }
// 		}
// 		http.send(params);
// 	// }

// 	response.sendfile('frontend/index.html');
// });

// app.listen(app.get('port'), function() {
//   console.log("Node app is running at localhost:" + app.get('port'));
// });
var http = require('http'),
    fs = require('fs');


fs.readFile('./frontend/index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHead(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8000);
});