//imports 
var express = require('express'); //express handles GET requests from Yoes
var request = require('request'); //requests calls the Yo API
var mongodb = require('mongojs'); //mongo swag

var uri = "yoplay",
    db = mongodb(uri);

//init express stuff
var appE = express();

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8888);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


var curLat = 28.602140;
var curLon = -81.198976;
var epsilon = 0.0004000;


io.on('connection', function (socket) {
	console.log("pls");

  socket.on('update.location', function (data) {
    console.log("update location data: " + JSON.stringify(data));
    if(data.lat != undefined) curLat = data.lat;
    if(data.lon != undefined) curLon = data.lon;
    console.log("curLat: " + curLat + "curLon: " + curLon);

    if(data.lat != undefined && data.lon != undefined){
	    var link = 'http://yoplay.x10host.com/?location=' + curLat + ";" + curLon;
			console.log("link to use: " + link);


		request.post(
		    'http://api.justyo.co/yo/',
		    { form: { 'api_token': '50ebf33f-8bb6-4c76-a9ca-d525324055bc',
		              'username': 'isabellacmor',
		              'link': link} },
		    function (error, response, body) {
		        if (!error && response.statusCode == 200) {
		            console.log(body);
		        }
		    }
		);
	}

  });
});


var game = db.collection("game");

game.find().toArray(function (err,items) {
	console.log(items);
});

appE.set('port', (5001));

//When we get a GET request
appE.get('/', function(req, res, next) {
  	
  	console.log(req.query.username);
  	//Yo
  	//this if checks if they sent a username to us
  	if(req.query.username != undefined){

  		var hasGame = false;

		console.log("Username: " + req.query.username + " has game: " + hasGame);


  		if(req.query.location != undefined){
  			console.log("we got a location! : " + req.query.location);

  			var lat = parseFloat(req.query.location.split(";")[0]);
  			var lon = parseFloat(req.query.location.split(";")[1]);

  			console.log("dist: " + dist(lat, lon) + " <= " + epsilon);
  			if(dist(lat, lon) <= epsilon) {
  				io.sockets.emit('generate.location', {username:req.query.username, lat:lat, lon:lon});
  				console.log("Location match! Requested new location");
  				var link = 'http://yoplay.x10host.com/?location=' + curLat + ";" + curLon;
				console.log("link to use: " + link);


				request.post(
				    'http://api.justyo.co/yo/',
				    { form: { 'api_token': '50ebf33f-8bb6-4c76-a9ca-d525324055bc',
				              'username': req.query.username,
				              'link': link} },
				    function (error, response, body) {
				        if (!error && response.statusCode == 200) {
				            console.log(body);
				        }
				    }
				);

  			} else {
  				console.log("Try to get closer");

  				var link = 'http://yoplay.x10host.com/?location=' + curLat + ";" + curLon;
  				console.log("link to use: " + link);


  				request.post(
				    'http://api.justyo.co/yo/',
				    { form: { 'api_token': '50ebf33f-8bb6-4c76-a9ca-d525324055bc',
				              'username': req.query.username,
				              'link': link} },
				    function (error, response, body) {
				        if (!error && response.statusCode == 200) {
				            console.log(body);
				        }
				    }
				);
  			}
  		}else{

			var link = 'http://yoplay.x10host.com/?location=' + curLat + ";" + curLon;
			console.log("link to use: " + link);
			
			//sends the yo back with a link
			request.post(
			    'http://api.justyo.co/yo/',
			    { form: { 'api_token': '50ebf33f-8bb6-4c76-a9ca-d525324055bc',
			              'username': req.query.username,
			              'link': link} },
			    function (error, response, body) {
			        if (!error && response.statusCode == 200) {
			            console.log(body);
			        }
			    }
			);
		}
	}
	//end Yo


	//goes to the next fuction
	next();

	}, 

	//this will display index.html found in the frontend folder
	function(req, res, next){
		
});

appE.listen(appE.get('port'), function(){
	console.log("listening on " + appE.get('port'));
});


function dist(lat, lon) {
	return Math.sqrt((curLat - lat)*(curLat - lat) + ((curLon - lon)*(curLon - lon)));
}



