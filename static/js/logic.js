// Create a base light map tileLayer which will be the background of the map
// Initial map is the light map variant
var light = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

// Dark map variant
var dark = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
});

// Outdoors map variant
var outdoor = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

// Satellite map variant
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

// The link to grab the geoJSON data from USGS
var geoJSON = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";

// Create a promise and perform an API call for USGS past week M2.5+ earthquakes
d3.json(geoJSON).then(function (geoData) {

  // Once the data loads, send the features object to the featureIterate function
  featureIterate(geoData.features);

}).catch(function (error) {
  console.log(error);
});

// Create arrays to hold the circle markers
var eq_locations = [];

// Create arrays with color values and depths
var colorCodes = ["#e55343", "#e27243", "#df9144", "#ddae44", "#daca45", "#cad745", "#abd545", "#8ed246", "#72cf46", "#56cd46"]
var depths = [90, 80, 70, 60, 50, 40, 30, 20, 10]

function featureIterate(data) {

  // Create a function that will iterate through the data and create circles based on the magnitude
  // The color of the circle will be retrieved from the circleColor function
  // Bind some popups giving information about the earthquake
  for (var x = 0; x < data.length; x++) {
    eq_locations.push(
      L.circle(data[x].geometry.coordinates.slice(0, 2).reverse(), {
        stroke: true,
        weight: 0.5,
        fillOpacity: 0.75,
        fillColor: circleColor(data[x].geometry.coordinates.slice(2, 3)),
        color: "black",
        radius: data[x].properties.mag * 10000
      }).bindPopup("<h3> Location: <em>" + data[x].properties.place + "</em> <hr> Magnitude: <em>" + data[x].properties.mag + "</em> <hr> Date: <em>" + dateConversion(data[x].properties.time) + "</em> </h3>")
    );
  }

  // Create two separate layer groups: one for earthquakes and one for tectonic plates
  var eq = L.layerGroup(eq_locations);
  var tectonic = L.layerGroup();

  // Create the map with layers, at the mapid ID in the HTML file
  var map = L.map("mapid", {
    center: [39.8283, -98.5795], //center of the US
    zoom: 4,
    layers: [
      light, eq
    ]
  });

  // Create the map objects to add to the layer control
  var baseMaps = {
    "Light": light,
    "Dark": dark,
    "Outdoors": outdoor,
    "Satellite": satellite
  };

  // Create the overlays object to add to the layer control
  var overlayMaps = {
    "Earthquakes": eq
  }

  // Create a control for the layers and add the layers to it
  L.control.layers(baseMaps, overlayMaps).addTo(map);

  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {

    var div = L.DomUtil.create("div", "legend");
    return div;
  };

  var legendInfo = "<h3>Earthquake Depth (km)</h3>"

  div.innerHTML = legendInfo;

  labels = [];
  colorCodes.forEach(function(value) {
    labels.push("<li style=\"background-color" + value + "\></li>");
  });

  legend.addTo(map);

}

// Function that returns the color value for different depths
function circleColor(depth) {

  var color = "";

  if (depth > 90) {
    color = colorCodes[0];
  }
  else if (depth > 80) {
    color = colorCodes[1];
  }
  else if (depth > 70) {
    color = colorCodes[2];
  }
  else if (depth > 60) {
    color = colorCodes[3];
  }
  else if (depth > 50) {
    color = colorCodes[4];
  }
  else if (depth > 40) {
    color = colorCodes[5];
  }
  else if (depth > 30) {
    color = colorCodes[6];
  }
  else if (depth > 20) {
    color = colorCodes[7];
  }
  else if (depth > 10) {
    color = colorCodes[8];
  }
  else {
    color = colorCodes[9];
  }

  return color;
};

// Function that takes the Unix date value and returns a more human legible value
function dateConversion(unix) {
  var dateObject = new Date(unix)
  var converted = dateObject.toLocaleString();
  return converted;
}