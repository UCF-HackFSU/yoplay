// Server will check if the user is close enough to the current clue's 
// lat/lon (stored on the server) before even rendering this page.
// Once a valid lat/lon for the next clue is generated here, we have to 
// save it to the database and display it to the use; THAT'S ALL THIS
// SCRIPT SHOULD DO

var orLat = lat = 28.601654;
var orLon = lon = -81.198745;
var MAX_DEG = 0.0136;

document.getElementById("switchView").addEventListener("click", switchView);
document.getElementById("nextLoc").addEventListener("click", nextLoc);
var streetViewService = new google.maps.StreetViewService();
var userloc = getQueryVariable("location").split(";");
orLat = parseFloat(userloc[0]);
orLon = parseFloat(userloc[1]);

lat = orLat;
lon = orLon;

// Initialize the map view and street view
function initialize() {
  var point = new google.maps.LatLng(lat, lon);
  var mapOptions = {
    center: point,
    zoom: 14
  };
  var map = new google.maps.Map(
      document.getElementById('map-canvas'), mapOptions);
  var panoramaOptions = {
    position: point,
    pov: {
      heading: 34,
      pitch: 10
    }
  };
  var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);

  // Make sure theres a streetview associated with this latlon within 20m
  // or else we have to generate a new one
  streetViewService.getPanoramaByLocation(point, 50, function (streetViewPanoramaData, status) {
    if (status === google.maps.StreetViewStatus.OK) {
        // ok
        console.log("New image!");
        // Save lat/lon in the database
    } else {
        // no street view available in this range, or some error occurred
        console.log("No street view available.....finding nearest location");
        nearest();
    }
  });

  map.setStreetView(panorama);
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
    nextLat = lat + 0.001;
  } else {
    nextLat = lat - 0.001;
  }
  
  if(getRandomInt(0,1) ==1) {
    nextLon = lon + 0.001;
  } else {
    nextLon = lon - 0.001;
  }
  
  console.log("Generated nearest clue: " + nextLat + "," + nextLon);
  lat = nextLat;
  lon = nextLon;
  initialize();
  
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
    nextLat = lat + rand;
  } else {
    nextLat = lat - rand;
  }
  
  if(getRandomInt(0,1) ==1) {
    nextLon = lon + rand;
  } else {
    nextLon = lon - rand;
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
  lat = nextLat;
  lon = nextLon;
  initialize();
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