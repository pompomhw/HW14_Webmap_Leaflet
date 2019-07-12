// Store our API endpoint inside queryUrl
var url1 ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// var url3="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"
var url2="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(url1, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  function geojsonMarkerOptions (mag) {
    return{ 
    radius: mag*3,
    fillColor:chooseColor(mag), 
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8}
  }; 
  function chooseColor(mag) {
    var color = "";
    if (mag > 5) { color = "#cb0900";}
    else if (mag > 4) {color = "#fa9300";}
    else if (mag > 3) {color = "#ffee00";}
    else if (mag > 2) {color = "#deed00";}
    else if (mag > 1) {color = "#c5f400";}
    else { color = "#72fc00";}
    return color;
  }
  var eQuakes=L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      console.log(latlng);
        return L.circleMarker(latlng, geojsonMarkerOptions(feature.properties.mag))
                .bindPopup("<h3>" + feature.properties.place +"</h3><hr><p>" + new Date(feature.properties.time) 
                          + "</p><hr><p> Magnitude: "+ feature.properties.mag + "</p><hr><p>"+ latlng+"</p>");
    }
  });
  createMap(eQuakes);

function createMap(eQuakes) {
    var lightmap=L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
        });
    var satellite=L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
        }); 
    var outdoors=L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v11",
        accessToken: API_KEY
        });

    // add the tectonic plates onthe map
   
    d3.json(url2, function(data) {
    var faultLines=L.geoJSON(data, {style: {color: 'orange',  weight: 2, fillOpacity: 0.8}});

    var baseMaps = {"Satellite": satellite, "Light Maps":lightmap, "Outdoors":outdoors};
    var overlayMaps = {"Fault Lines":faultLines,"Earthquakes": eQuakes}; 
    var myMap = L.map("map", {center:[30.09, -59.71], zoom:3, layers: [satellite, eQuakes, faultLines] }); 
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);
    // });
      
    // legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5],
          labels = [];
      // loop through the intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + chooseColor(grades[i]+0.1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
              console.log(chooseColor(grades[i]+0.1));
        }
      return div;
    };
    // var myMap = L.map("map", {center:[30.09, -59.71], zoom:3});
    legend.addTo(myMap);  
    

  });// end of d3.json

}// end of creatMap
} //end of createFeatures 