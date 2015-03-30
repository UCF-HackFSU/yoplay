// Server will check if the user is close enough to the current clue's 
// lat/lon (stored on the server) before even rendering this page.
// Once a valid lat/lon for the next clue is generated here, we have to 
// save it to the database and display it to the use; THAT'S ALL THIS
// SCRIPT SHOULD DO

var orLat = lat = 28.601654;
var orLon = lon = -81.198745;
var MAX_DEG = 0.0136;

document.getElementById("stats").addEventListener("click", page);
function page() {
  window.location = 'http://yoplay.x10host.com/stats.html';
}

var streetViewService = new google.maps.StreetViewService();
var userloc = getQueryVariable("location").split(";");
var socket = io("http://104.236.75.161:8888");
orLat = parseFloat(userloc[0]);
orLon = parseFloat(userloc[1]);

lat = orLat;
lon = orLon;
var username;
var latitude;
var longitude;
var numClues;

var alertmsg = "";

socket.on("generate.location", function(data) {
  alertmsg = "New clue! ";
  username = data.username;
  latitude = data.lat;
  longitude = data.lon;
  nextLoc();
  // if(getRandomInt(0,1) == 1) {
  //   latitude += 0.01;
  // } else {
  //   latitude -= 0.01;
  // }

  // if(getRandomInt(0,1) == 1) {
  //   longitude += 0.01;
  // } else {
  //   longitude -= 0.01;
  // }
  // lat = 48.858593;
  // lon = 2.294473;
  initialize2(parseFloat(latitude), parseFloat(longitude));
});

// Initialize the map view and street view
function initialize() {
  var ul = getQueryVariable("location").split(";");

  orLat = parseFloat(ul[0]);
  orLon = parseFloat(ul[1]);
  latitude = orLat;
  longitude = orLon;

  var bounds = new google.maps.LatLngBounds();
  var point = new google.maps.LatLng(orLat, orLon);
  bounds.extend(point);

  var mapOptions = {
    center: point,
    position: point,
    zoom: 14
  };
  var map = new google.maps.Map(
      document.getElementById('map-canvas'), mapOptions);
  var panoramaOptions = {
    position: point,
    pov: {
      heading: 34,
      pitch: 10
    },
    streetNamesEnabled: false
  };

  var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);

  // Make sure theres a streetview associated with this latlon within 20m
  // or else we have to generate a new one
  streetViewService.getPanoramaByLocation(point, 50, function (streetViewPanoramaData, status) {
    if (status === google.maps.StreetViewStatus.OK) {
        // ok
        console.log("New image!");
        // Save lat/lon in the database
        latitude = streetViewPanoramaData.location.latLng.lat();
        longitude = streetViewPanoramaData.location.latLng.lng();

        // Make sure only pano is shown
        document.getElementById('pano').style.display = "inline";
        document.getElementById('map-canvas').style.display = "none";
    } else {
        // no street view available in this range, or some error occurred
        console.log("No street view available.....showing map instead");
        
        map = placeMarker(point, map, bounds);

        // Make sure only map is shown
        document.getElementById('pano').style.display = "none";
        document.getElementById('map-canvas').style.display = "inline";
    }
  });

  map.setStreetView(panorama);
  console.log("Set");
}

google.maps.event.addDomListener(window, 'load', initialize);

// Switch between street view and map view
function switchView() {
  var map = document.getElementById("map-canvas");
  var pan = document.getElementById("pano");

  if(map.style.display == 'none') { 
    map.style.display = 'block';
    pan.style.display = 'none';
  } else {
    pan.style.display = 'block';
    map.style.display = 'none';
  }
}

function nearest() {
  var nextLat, nextLon;
  
  if(getRandomInt(0,1) == 1) {
    nextLat = latitude + 0.01;
  } else {
    nextLat = latitude - 0.01;
  }
  
  if(getRandomInt(0,1) ==1) {
    nextLon = longitude + 0.01;
  } else {
    nextLon = longitude - 0.01;
  }
  
  console.log("Generated nearest clue: " + nextLat + "," + nextLon);
  // lat = nextLat;
  // lon = nextLon;
  latitude = nextLat;
  longitude = nextLon;

  //initialize2(parseFloat(nextLat), parseFloat(nextLon));
}

// Choose the next lat/lon point
function nextLoc() {
  // Need to make this value better / more random between a certain
  // walkable distance range
  var nextLat, nextLon;

  // Make a new random lat/lon
  // Could possibly use a better / more sophisticated algo here, but
  // this will do for now
  var rand = getRandomNum(0.00036, 0.0036);
  //var rand = getRandomNum(0.01, 0.1);
  if(getRandomInt(0,1) == 1) {
    nextLat = latitude + rand;
  } else {
    nextLat = latitude - rand;
  }
  
  if(getRandomInt(0,1) ==1) {
    nextLon = longitude + rand;
  } else {
    nextLon = longitude - rand;
  }

  console.log("Generated parsed clue: " + nextLat + "," + nextLon);

  // this clue is too far from original point
  /*while(dist(orLat, orLon, nextLat, nextLon) >= MAX_DEG) {
    console.log("Next clue: " + nextLat + "," + nextLon + ": too far...recalculating");
    if(nextLat > orLat) nextLat -= 0.0015;
    else nextLat += 0.0015;
    if(nextLon > orLon) nextLon -= 0.0015;
    else nextLon += 0.0015;
  }*/

  console.log("Next clue: " + nextLat + "," + nextLon);
  latitude = nextLat;
  longitude = nextLon;
  
  if(!validSV()) nearest();
}

function validSV() {
  var point = new google.maps.LatLng(lat, lon);

  // Make sure theres a streetview associated with this latlon within 20m
  // or else we have to generate a new one
  streetViewService.getPanoramaByLocation(point, 50, function (streetViewPanoramaData, status) {
    if (status === google.maps.StreetViewStatus.OK) {
        // ok
        console.log("New image!");
        return true;
        // Save lat/lon in the database
    } else {
        // no street view available in this range, or some error occurred
        console.log("No street view available.....finding nearest location");
        return false;
    }
  });
}

function getRandomNum(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dist(orLat, orLon, lat, lon) {
  var val = Math.sqrt((orLat-lat)*(orLat-lat) + (orLon-lon)*(orLon-lon));
  console.log("Distance from: (" + orLat + "," + orLon + ") and (" + lat + "," + lon + "): " + val);
  return val;
}

// Returns the value of the variable ID in a URL param
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function initialize2(newLat, newLon) {

  latitude = newLat;
  longitude = newLon;

  var bounds = new google.maps.LatLngBounds();
  var point = new google.maps.LatLng(orLat, orLon);
  bounds.extend(point);

  var mapOptions = {
    center: point,
    position: point,
    zoom: 14
  };

  var map = new google.maps.Map(
      document.getElementById('map-canvas'), mapOptions);
  var panoramaOptions = {
    position: point,
    pov: {
      heading: 34,
      pitch: 10
    },
    streetNamesEnabled: false
  };

  var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);

  // Make sure theres a streetview associated with this latlon within 20m
  // or else we have to generate a new one
  streetViewService.getPanoramaByLocation(point, 50, function (streetViewPanoramaData, status) {
    if (status === google.maps.StreetViewStatus.OK) {
        // ok
        console.log("New image!");
        if(alertmsg.length > 0) alert(alertmsg);
        alertmsg = "";
        // Save lat/lon in the database
        latitude = streetViewPanoramaData.location.latLng.lat();
        longitude = streetViewPanoramaData.location.latLng.lng();

        // Make sure only pano is shown
        document.getElementById('pano').style.display = "inline";
        document.getElementById('map-canvas').style.display = "none";
    } else {
        // no street view available in this range, or some error occurred
        console.log("No street view available.....showing map instead");

        map = placeMarker(point, map, bounds);
        
        // Make sure only map is shown
        document.getElementById('pano').style.display = "none";
        document.getElementById('map-canvas').style.display = "inline";
    }
  });

  map.setStreetView(panorama);

  socket.emit("update.location", {username:username, lat:latitude, lon:longitude});
  console.log("emitted: " + JSON.stringify({username:username, lat:latitude, lon:longitude}));
}

function goToStats () {
  //go to stats
  window.location="http://yoplay.x10host.com/stats.html";
}

function placeMarker(position, map, bounds) {
  var marker = new google.maps.Marker({
    position: position,
    map: map
  });
  
  map.fitBounds(bounds);
  //map.panToBounds(bounds);

  return map;
}

// Need to figure out what degree our epsilon should be when comparing
// user's current lat/lon to this clue's lat/lon to see if it's a match

// 0.01 miles ~ 50 ft     good distance to accept as being at the clue
// 0.04 km - 0.4 km       good range for a next clue
// 0.025 miles - 0.25 miles     equivalent to range in km
// 0.00036 deg - 0.0036 deg    equivalent to range in km
// 2 mi = 0.029 deg        max distance any clue can be from original pos
// 0.011 deg                within this range, point is too close to previous

// Formulas
// lat: 1 deg = 110.54 km
// lon: 1 deg = 111.320*cos(latitude) km