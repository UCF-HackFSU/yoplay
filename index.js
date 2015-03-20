//imports 
var express = require('express'); //express handles GET requests from Yoes
var request = require('request'); //requests calls the Yo API

//init express stuff
var app = express();

//init express stuff
app.set('port', (process.env.PORT || 5000));

//When we get a GET request
app.get('/', function(req, res, next) {
  	
  	console.log(req.query.username);
  	//Yo
  	//this if checks if they sent a username to us
  	if(req.query.username != undefined){

  		if(req.query.location != undefined){
  			console.log("we got a location! : " + req.query.location);

  			//send yo

  		}

		//sends the yo back with a link
		request.post(
		    'http://api.justyo.co/yo/',
		    { form: { 'api_token': '50ebf33f-8bb6-4c76-a9ca-d525324055bc',
		              'username': req.query.username,
		              'link': 'yoplay.x10host.com' } },
		    function (error, response, body) {
		        if (!error && response.statusCode == 200) {
		            console.log(body);
		        }
		    }
		);
	}
	//end Yo

	//goes to the next fuction
	next();

	}, 

	//this will display index.html found in the frontend folder
	function(req, res, next){
		app.use(express.static('frontend'));
		res.sendfile(__dirname + '/frontend/index.html');
});

//init express stuff
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});