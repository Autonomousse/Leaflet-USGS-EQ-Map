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

// // Initialize earthquake and tectonic plate layers
// var layers = {
//   earthquakes: new L.LayerGroup(),
//   tectonic: new L.LayerGroup()
// };

// // Create the map with layers, at the mapid ID in the HTML file
// var map = L.map("mapid", {
//   center: [39.8283, -98.5795], //center of the US
//   zoom: 5,
//   layers: [
//     layers.earthquakes,
//     layers.tectonic
//   ]
// });

// // Add the base light map tile layer to the map
// light.addTo(map);

// // Create the map objects to add to the layer control
// var baseMaps = {
//   "Light": light,
//   "Dark": dark,
//   "Outdoors": outdoor,
//   "Satellite": satellite
// };

// // Create the overlays object to add to the layer control
// var overlays = {
//   "Earthquakes": layers.earthquakes,
//   "Tectonic Plates": layers.tectonic
// }

// // Create a control for the layers and add the layers to it
// L.control.layers(baseMaps, overlays).addTo(map);

// The link to grab the geoJSON data from
var geoJSON = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

var eq_data;

// Create a promise and perform an API call for USGS past week M2.5+ earthquakes
d3.json(geoJSON).then(function (geoData) {

  // Once the data loads, send the features object to the featureIterate function
  featureIterate(geoData.features);
}).catch(function (error) {
  console.log(error);
});
  // Create arrays to hold the circle markers
  var eq_locations = [];

  function featureIterate(data) {

    //console.log(geoData.length)
    // Create a function that will iterate through the data and create circles based on the magnitude
    for (var x = 0; x < data.length; x++) {
      eq_locations.push(
        L.circle(data[x].geometry.coordinates.slice(0, 2).reverse(), {
          stroke: false,
          fillOpacity: 1,
          color: "black",
          fillColor: "black",
          radius: data[x].properties.mag*10000
        })
      );
    }
    // Create two separate layer groups: one for earthquakes and one for tectonic plates
    var eq = L.layerGroup(eq_locations);
    console.log(eq_locations)
    // Create the map with layers, at the mapid ID in the HTML file
    var map = L.map("mapid", {
      center: [39.8283, -98.5795], //center of the US
      zoom: 5,
      layers: [
        light, eq
      ]
    });

    // Add the base light map tile layer to the map
    //light.addTo(map);

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
  }


// }).catch(function (error) {
//   console.log(error);
// });