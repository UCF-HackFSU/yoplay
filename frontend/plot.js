var geocoder = new google.maps.Geocoder();
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
directionsDisplay = new google.maps.DirectionsRenderer();

var locations = [];

var socket = io("http://104.236.75.161:8888");
socket.emit("request.locations");

socket.on("received.locations", function(data) {
    // this is a list of all the coords visited in order oldest to newest
    console.log("received locations: " + JSON.stringify(data));

    // Read in data from server
    for(var i = 0; i < data.length; i++) {
        locations.push({name:'unknown'/*codeLatLng(data[i].lat, data[i].lon)*/, lat:data[i].lat, lon:data[i].lon});
    }

    console.log("Finished: " + JSON.stringify(locations));

    // Set up initial map
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();
    var marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }

    // Make the endpoints
    var start, end;
    if(locations.length == 0){}
    else if(locations.length == 1) {
        start = new google.maps.LatLng(locations[0].lat, locations[0].lon);
        end = new google.maps.LatLng(locations[0].lat, locations[0].lon);
    }
    else if(locations.length >= 2) {
        console.log("here");
        start = new google.maps.LatLng(locations[0].lat, locations[0].lon);
        end = new google.maps.LatLng(locations[locations.length-1].lat, locations[locations.length-1].lon);
    }

    console.log("start: " + start + " end: " + end);
    directionsDisplay.setMap(map);

    //Make the waypoints
    var wps = [];
    if(locations.length >= 3) {
        for(var i = 1; i < locations.length-1; i++) {
            var pt = new google.maps.LatLng(locations[i].lat, locations[i].lon);
            wps.push({location: pt});
        }
    }
    console.log("wps: " + JSON.stringify(wps));

    // Show the map!
    var request = {
        origin: start,
        destination: end,
        //waypoints: wps,   // I think the number of waypoints is too high
        travelMode: google.maps.DirectionsTravelMode.WALKING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
});

// Convert lat/lon to address
function codeLatLng(gLat, gLon) {
  var lat = gLat;
  var lng = gLon;
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        return results[1];
      }
    } else {
      console.log('Geocoder failed due to: ' + status);
    }
  });

  return "Location unknown";
}