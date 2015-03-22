var geocoder = new google.maps.Geocoder();
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
directionsDisplay = new google.maps.DirectionsRenderer();

var socket = io("http://104.236.75.161:8888");
socket.emit("request.locations");

socket.on("received.locations", function(data) {
    var locations = [];

    // Read in data from server
    for(var i = 0; i < data.length; i++) {
        locations.push({lat:data[i].lat, lon:data[i].lon});
    }

    console.log("Finished: " + JSON.stringify(locations));

    var map;
    var mapOptions =
    {
        zoom: 15,
        center: new google.maps.LatLng(locations[0].lat, locations[0].lon),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    map = new google.maps.Map(document.getElementById('map'),                     mapOptions);

    for(var i = 0; i < locations.length; i++)
        {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i].lat, locations[i].lon),
                map: map,
                title: 'test',
            });
        }
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



// function initialize()
// {       
// var map;
// var mapOptions =
// {
//     zoom: 9,
//     center: new google.maps.LatLng(39.03454, -94.587315),
//     mapTypeId: google.maps.MapTypeId.ROADMAP,
// };

// map = new google.maps.Map(document.getElementById('map'),                     mapOptions);

// var business_locations = 
//     [
//         ['South Plaza',     '5105 Main St  Kansas City, MO 64112', '39.03454', '-94.587315'],
//         ['City Market',     '427 Main Street Kansas City, MO 64105',        39.108518, -94.582635],
//         ['Barry Road East', '221 Northeast Barry Road Kansas City, MO 64155', 39.246116, -94.57759],
//         ['Barry Road West', '7007 NW Barry Road Kansas City, MO 64153',     39.246116, -94.57759],
//         ['Shawnee',         '7198 Renner Road Shawnee, KS 66217',           38.999569, -94.779798],
//         ['Blue Springs',    '2201 NW State Route 7 Blue Springs, MO 64014', 39.04395, -94.271227],
//         ['Leawood',         '12920 State Line Road Leawood, KS 66209',      38.893127, -94.607991],
//         ['Lenexa',          '13400 College Boulevard Lenexa, KS 66210',     38.927529, -94.741263],
//         ['Olathe',          '15983 S Bradley Drive Olathe, KS 66062',       38.838983, -94.778771],
//         ['Prarie Village',  '6921 Tomahawk Rd Prairie Village, KS 66208',   39.003414, -94.631471],
//         ['Independence',    '2551 S State Route 291 Independence, MO 64057', 39.073201, -94.378762],
//         ['Lees Summit',     '632 NE State Route 291 Lees Summit, MO 64086', 38.923416, -94.360608],
//         ['Liberty',         '205 N 291 Highway Liberty, MO 64068',          39.246472, -94.443878]
//     ];

// for(var i = 0; i < business_locations.length; i++)
//     {
//         var marker = new google.maps.Marker({
//             position: new google.maps.LatLng(business_locations[i][2], business_locations[i][3]),
//             map: map,
//             title: 'test',
//         });
//     }
// };

// google.maps.event.addDomListener(window, 'load', initialize);



