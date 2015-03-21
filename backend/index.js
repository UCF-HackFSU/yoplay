//imports 
var express = require('express'); //express handles GET requests from Yoes
var request = require('request'); //requests calls the Yo API
var mongodb = require('mongojs'); //mongo swag

var uri = "yoplay",
    db = mongodb(uri);



//init express stuff
var app = express();

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

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


    var game = db.collection("game");

    game.find().toArray(function (err,items) {
    	console.log(items);
    });

// app.set('port', (process.env.PORT || 5000));

//When we get a GET request
// app.get('/', function(req, res, next) {
  	
//   	console.log(req.query.username);
//   	//Yo
//   	//this if checks if they sent a username to us
//   	if(req.query.username != undefined){

//   		var hasGame = false;
//   		// mongodb.MongoClient.connect(uri, function (err, db) {
// 		    /* adventure! */

// 		    var users = db.collection("users");

// 		    if(users.find({username:req.query.username}).count() != 0){
// 		    	hasGame = true;
// 		    }
		    
// 		// });

// 		console.log("Username: " + req.query.username + " has game: " + hasGame);


//   		if(req.query.location != undefined){
//   			console.log("we got a location! : " + req.query.location);

//   			var lat = req.query.location.split(";")[0];
//   			var lon = req.query.location.split(";")[1];

//   			//send yo
//   			socket.emit('generate.location', {username:req.query.username, lat:lat, lon:lon});

//   		}

//   		var link = 'http://yoplay.x10host.com/?location=' + req.query.location;
//   		console.log("link to use: " + link);
  		
// 		//sends the yo back with a link
// 		request.post(
// 		    'http://api.justyo.co/yo/',
// 		    { form: { 'api_token': '50ebf33f-8bb6-4c76-a9ca-d525324055bc',
// 		              'username': req.query.username,
// 		              'link': link} },
// 		    function (error, response, body) {
// 		        if (!error && response.statusCode == 200) {
// 		            console.log(body);
// 		        }
// 		    }
// 		);
// 	}
// 	//end Yo


// 	//goes to the next fuction
// 	next();

// 	}, 

// 	//this will display index.html found in the frontend folder
// 	function(req, res, next){
		
// });

// //init express stuff
// app.listen(8888, function() {
//   console.log("Node app is running at localhost:" + 8888);
// });


// io.on('connection', function (socket) {
// 	console.log("pls");
 

//   socket.on('update.location', function (data) {
//     console.log(data);
//   });
// });



