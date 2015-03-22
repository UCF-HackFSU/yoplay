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

var points = db.collection("points");
var curLocation = {lat:28.602140, lon: -81.198976};
points.find().sort({_id:-1}, function(err, doc) {
    // docs is now a sorted array
    if(doc[0] != undefined && doc[0] != null && doc[0].lat != undefined && doc[0].lat != null && doc[0].lon != undefined && doc[0].lon != null){
    	curLocation.lat = doc[0].lat;
    	curLocation.lon = doc[0].lon;
    }
});

var users = db.collection("users");


var curLat = curLocation.lat;
var curLon = curLocation.lon;
var epsilon = 0.0004000;
var elapsedClues = 1;
var lastUser = "";
var pointsArr = [];


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

		var tempPoint = {lat:data.lat,lon:data.lon};
		pointsArr.push(tempPoint);
		lastUser = data.username;
		elapsedClues++;
		//TODO:Add lat lon to Mongo
		points.save(tempPoint);

		// if(users.find({username: data.username}).count() > 0){
		// 	users.update({username:data.username}, {$inc:{clues:1}}, {multi:true}, function() {
  //   			// the update is complete
		// 	});
		// }else{
		// 	users.save({username:data.username,clues:1});
		// }
		users.update({username:data.username}, {'$inc':{'clues':1}}, {'upsert':true});

	 }

  });


  socket.on('request.locations', function(data){

  	points.find().sort({_id:1}, function(err, doc) {	
  		socket.emit('received.locations', doc);
  	});
  });

  socket.on('request.users', function(data){

  	users.find().sort({clues:1}, function(err, docs) {	
  		socket.emit('received.users', docs);
  	});

  });

});

points.find().toArray(function (err,items) {
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


				// request.post(
				//     'http://api.justyo.co/yo/',
				//     { form: { 'api_token': '50ebf33f-8bb6-4c76-a9ca-d525324055bc',
				//               'username': req.query.username,
				//               'link': link} },
				//     function (error, response, body) {
				//         if (!error && response.statusCode == 200) {
				//             console.log(body);
				//         }
				//     }
				// );

  			} else {
  				console.log("Try to get closer");

  				/*var link = 'http://yoplay.x10host.com/?location=' + curLat + ";" + curLon;
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
				);*/
  			}
  		}/*else{

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
		}*/

		users.find().sort({clues:1}, function(err, docs) {	
  			lastUser = docs.length;
  		});

		setTimeout(function(){
			var link = 'http://yoplay.x10host.com/?location=' + curLat + ";" + curLon + "&lastUser=" + lastUser + "&elapsedClues=" + elapsedClues;
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

		}, 5000);
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


