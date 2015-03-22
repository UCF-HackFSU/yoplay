var socket = io("http://104.236.75.161:8888");
socket.emit("request.users");
socket.emit("request.lastUser");
socket.emit("request.elapsedClues");


var userScore = [];
var list = document.getElementById("leaderList");

document.getElementById("back").addEventListener("click", page);
function page() {
	socket.emit("request.location");
}

socket.on("received.location", function(data) {
	var lat = data.lat;
	var lon = data.lon;
	window.location = 'http://yoplay.x10host.com/index.html?location='+lat+";"+lon;
});

socket.on("received.users", function(data) {
	for(var i = 0; i < data.length; i++) {
        userScore.push({username:data[i].username, clues:data[i].clues});
    }

    //userScore = [{username:'isabellacmor', clues:'50'}, {username:'thedoge', clues:'10'}, {username:'nobody', clues:'5'}];
	console.log("userScore: " + JSON.stringify(userScore));

	// Reset it to just say leaderboard
	list.innerHTML = "";

	for(var i = 0; i < userScore.length; i++) {
		var dataUser = document.createElement("span");
		dataUser.innerHTML = "<span>" + userScore[i].username + ":&nbsp;&nbsp;&nbsp;" + userScore[i].clues + "</span>";
		
		var entry = document.createElement('li');
		entry.appendChild(dataUser);
		list.appendChild(entry);
	}
});

socket.on("received.lastUser", function(data) {
	console.log(data);
	document.getElementById("lastUser").innerHTML = "Last clue found by: " + data;
});

socket.on("received.elapsedClues", function(data) {
	console.log(data);
	document.getElementById("numClues").innerHTML = "Clues found so far: " + data;
});


// userScore = [{username:'isabellacmor', clues:'50'}, {username:'thedoge', clues:'10'}, {username:'nobody', clues:'5'}];
// console.log("userScore: " + JSON.stringify(userScore));

// // Reset it to just say leaderboard
// list.innerHTML = "<li><span style='float: left; width: 200px; text-align: center;''>leaderboard</span></li>";

// for(var i = 0; i < userScore.length; i++) {
// 	var dataUser = document.createElement("span");
// 	dataUser.innerHTML = "<span style='float: left; width: 200px;'>" + userScore[i].username + "</span>";
// 	var dataClue = document.createElement("span");
// 	dataClue.innerHTML = "<span>" + userScore[i].clues + "</span>";
// 	var entry = document.createElement('li');
// 	entry.appendChild(dataUser);
// 	entry.appendChild(dataClue);
// 	list.appendChild(entry);
// }