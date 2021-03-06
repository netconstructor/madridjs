var map, 
    layer,
    radius = 4000,
    radDeg = 0,
    maxZoom = 22,
    zoomLevel = 13,
    lng = 40.7248057566452,
    lat = -73.9967118782795;

function initialize() {
    map = new L.Map('map_canvas');

    var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
        cloudmadeAttrib = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade', 
        cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: maxZoom, attribution: cloudmadeAttrib});

    map.addLayer(cloudmade);
    updateRadDeg(radius);

    layer = new L.CartoDBLayer({
        map_canvas: 'map_canvas',
          map: map,
          user_name:'viz2',
          table_name: 'github_ruby_users',
          query: "SELECT cartodb_id,the_geom_webmercator FROM github_ruby_users WHERE ST_Intersects( the_geom, ST_Buffer( ST_SetSRID('POINT(" + lat + " " + lng + ")'::geometry , 4326), "+radDeg+"))",
          infowindow: false,
          auto_bound: false
    });

    function drawCircle(position){
        var center = new L.LatLng(position.coords.latitude, position.coords.longitude);
        var circle = new L.Circle(center, radius, { weight:2, color: '#f03', fillColor: '#f03', fillOpacity: 0.1 });
        map.addLayer(circle);
    }

    var success = function(position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;

        var center = new L.LatLng(position.coords.latitude, position.coords.longitude);

        map.setView(center, zoomLevel, true);
        drawCircle(position);
    }

    function error(msg) {
        console.log(msg);
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        error('location not supported');
    }

    function updateRadDeg(dist) {
        var deg = 180; 
        var brng = deg * Math.PI / 180; 
        dist = dist/6371000; 
        var lat1 = lat * Math.PI / 180; 
        var lon1 = lng * Math.PI / 180; 
        var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + 
                Math.cos(lat1) * Math.sin(dist) * Math.cos(brng)); 
        var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * 
                Math.cos(lat1), 
                Math.cos(dist) - Math.sin(lat1) * 
                Math.sin(lat2)); 
        if (isNaN(lat2) || isNaN(lon2)) return null; 
        radDeg = lat - (lat2 * 180 / Math.PI) ; 
    }

}
