var express = require('express');
var app = express();
var request = require('request');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/frontend'));

app.get('/', function(request, response) {
  	
	console.log("hi");
  	//Yo
  	//var request = require('request');

	// request.post(
	//     'http://api.justyo.co/yo/',
	//     { form: { 'api_token': '50ebf33f-8bb6-4c76-a9ca-d525324055bc',
	//               'username': request.query.username,
	//               'link': 'http://google.com' } },
	//     function (error, response, body) {
	//         if (!error && response.statusCode == 200) {
	//             console.log(body);
	//         }
	//     }
	// );

	response.sendfile('frontend/index.html');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});



// var http = require('http');

// http.createServer(function (req, res) {
//   var html = buildHtml(req);


//   var https = new XMLHttpRequest();
// 		var url = "https://f7d0b78f-f308984b5cde.my.apitools.com/yo/";
// 		var apiToken = "50ebf33f-8bb6-4c76-a9ca-d525324055bc";
// 		var params = "api_token=" + apiToken + "&username=" + request.query.username;
// 		https.open("POST", url, true);

// 		//Send the proper header information along with the request
// 		https.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// 		https.setRequestHeader("Content-length", params.length);
// 		https.setRequestHeader("Connection", "close");

// 		http.onreadystatechange = function() {//Call a function when the state changes.
// 		    if(https.readyState == 4 && http.status == 200) {
// 		        alert(https.responseText);
// 		    }
// 		}
// 		https.send(params);

//   res.writeHead(200, {
//     'Content-Type': 'text/html',
//     'Content-Length': html.length,
//     'Expires': new Date().toUTCString()
//   });
//   res.end(html);
// }).listen(process.env.PORT || 8080);

// function buildHtml(req) {
//   var header = '';
//   var body = 'hello?';

//   // concatenate header string
//   // concatenate body string

//   return '<!DOCTYPE html>'
//        + '<html><header>' + header + '</header><body>' + body + '</body></html>';
// };